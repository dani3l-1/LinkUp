// Environment loading
// Priority: explicit LINKUP_ENV_FILE > .env
const envFile = process.env.LINKUP_ENV_FILE || '.env';
require('dotenv').config({ path: envFile });
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`LinkUp env: ${NODE_ENV} (loading ${envFile})`);

const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const nodemailer = require('nodemailer');
const webpush = require('web-push');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const { Pool } = require('pg');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 4000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const EMAIL_OUTBOX_PATH = path.join(DATA_DIR, 'email-outbox.json');
const SESSION_STORE_PATH = path.join(DATA_DIR, 'sessions.json');

// Database mode
// Production uses Supabase/Postgres when DATABASE_URL is set.
// Local testing uses .env.local through npm run start:test, with no DATABASE_URL.
const DATABASE_URL = process.env.DATABASE_URL || '';
const USE_POSTGRES = Boolean(DATABASE_URL);

const isLocalMachine = process.cwd().startsWith('/Users/');
const allowProductionDatabaseLocally = process.env.ALLOW_PRODUCTION_DATABASE_LOCALLY === 'true';
if (isLocalMachine && USE_POSTGRES && !process.env.LINKUP_ENV_FILE && !allowProductionDatabaseLocally) {
  console.error(
    'FATAL: This local startup would use DATABASE_URL.\n' +
    '  Run npm run start:test for local testing, or set ALLOW_PRODUCTION_DATABASE_LOCALLY=true if you intentionally need live data.'
  );
  process.exit(1);
}
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.error(`FATAL: SESSION_SECRET is not set. Add it to your ${envFile} file and restart.`);
  process.exit(1);
}
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_USER || 'LinkUp <no-reply@linkup.local>';
const LINKUP_COMMISSION_RATE = Number(process.env.LINKUP_COMMISSION_RATE || 0.15);
const ADMIN_PAYOUT_SECRET = process.env.ADMIN_PAYOUT_SECRET || '';
const RIDE_SERVICES_PAUSED = process.env.RIDE_SERVICES_PAUSED !== 'false';
// Email verification can be bypassed in local test mode via .env.local.
const BYPASS_EMAIL_VERIFICATION = NODE_ENV !== 'production' && process.env.BYPASS_EMAIL_VERIFICATION === 'true';
const PAYMENT_PROVIDER = String(process.env.PAYMENT_PROVIDER || 'stripe').trim().toLowerCase();
const PAYOUT_PROVIDER = String(process.env.PAYOUT_PROVIDER || PAYMENT_PROVIDER).trim().toLowerCase();
// Stripe: use test keys locally and live keys only in production.
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || `mailto:${process.env.SMTP_USER || 'no-reply@linkup.local'}`;
const DB_SCHEMA_VERSION = 2;
// Stripe client — null when key is absent (payment endpoints return 503 gracefully)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-02-25.clover' })
  : null;
if (!stripe) {
  console.warn(`WARNING: STRIPE_SECRET_KEY not set. Payment features are disabled (env: ${NODE_ENV}).`);
}
const REQUIRED_TERMS_VERSION = process.env.REQUIRED_TERMS_VERSION || 'v2026.05.8';
const REQUIRED_PRIVACY_VERSION = process.env.REQUIRED_PRIVACY_VERSION || 'v2026.05.8';
const TRACKING_VIEWER_TTL_MS = 1000 * 60 * 60 * 8;
const PUSH_NOTIFICATIONS_ENABLED = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
if (PUSH_NOTIFICATIONS_ENABLED) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}
// SSL: auto-enabled for remote hosts (Supabase requires it).
// Override with DATABASE_SSL=true/false in your .env file.
function shouldUsePostgresSsl(databaseUrl) {
  if (process.env.DATABASE_SSL === 'true') return true;
  if (process.env.DATABASE_SSL === 'false') return false;
  return !/(localhost|127\.0\.0\.1)/i.test(databaseUrl);
}
const pgPool = USE_POSTGRES ? new Pool({
  connectionString: DATABASE_URL,
  // Supabase uses a managed TLS cert; rejectUnauthorized:false allows it.
  ssl: shouldUsePostgresSsl(DATABASE_URL) ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
}) : null;
fs.mkdirSync(DATA_DIR, { recursive: true });

// Supabase/Postgres production connection checks.
// Uses DATABASE_URL from .env or your production host environment.
// Supabase requires SSL; rejectUnauthorized:false allows self-signed certs on the
// managed host. Set DATABASE_SSL=false to override (e.g. pgBouncer in test mode).
if (NODE_ENV === 'production') {
  const missingProductionVars = [
    ['DATABASE_URL (Supabase)', DATABASE_URL],
    ['APP_BASE_URL', APP_BASE_URL && !APP_BASE_URL.includes('localhost')],
    ['GOOGLE_MAPS_API_KEY', GOOGLE_MAPS_API_KEY],
    ['STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY],
    ['STRIPE_PUBLISHABLE_KEY', STRIPE_PUBLISHABLE_KEY],
    ['STRIPE_WEBHOOK_SECRET', process.env.STRIPE_WEBHOOK_SECRET],
    ['SMTP_HOST/SMTP_USER/SMTP_PASS', process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS],
  ].filter(([, ok]) => !ok).map(([name]) => name);
  if (missingProductionVars.length) {
    console.error('FATAL: Missing production config variables: ' + missingProductionVars.join(', '));
    process.exit(1);
  }
}
const CAR_SEATS = [
  { id: 'front_passenger', label: 'Front passenger' },
  { id: 'back_left', label: 'Back left' },
  { id: 'back_middle', label: 'Back middle' },
  { id: 'back_right', label: 'Back right' },
  { id: 'third_left', label: 'Third row left' },
  { id: 'third_right', label: 'Third row right' },
];
const VEHICLE_SEAT_LAYOUTS = {
  2: ['front_passenger'],
  4: ['front_passenger', 'back_left', 'back_right'],
  5: ['front_passenger', 'back_left', 'back_middle', 'back_right'],
  6: ['front_passenger', 'back_left', 'back_right', 'third_left', 'third_right'],
  7: ['front_passenger', 'back_left', 'back_middle', 'back_right', 'third_left', 'third_right'],
};
const SUPPORTED_UNIVERSITY_DOMAINS = {
  'berkeley.edu': 'University of California, Berkeley',
  'ucla.edu': 'University of California, Los Angeles',
  'uci.edu': 'University of California, Irvine',
  'ivc.edu': 'Irvine Valley College',
  'saddleback.edu': 'Saddleback College',
  'uwaterloo.ca': 'Waterloo University',
};

function normalizeOrigin(value) {
  try {
    return new URL(String(value || '').trim()).origin;
  } catch (_) {
    return '';
  }
}

function getConfiguredOrigins() {
  const origins = new Set();
  normalizeOrigin(APP_BASE_URL) && origins.add(normalizeOrigin(APP_BASE_URL));
  String(process.env.CORS_ORIGIN || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean)
    .forEach((origin) => origins.add(origin));
  if (NODE_ENV !== 'production') {
    origins.add(`http://localhost:${PORT}`);
    origins.add(`http://127.0.0.1:${PORT}`);
  }
  return origins;
}

const ALLOWED_REQUEST_ORIGINS = getConfiguredOrigins();

function isAllowedRequestOrigin(origin) {
  if (!origin) return true;
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) return false;
  if (ALLOWED_REQUEST_ORIGINS.has(normalizedOrigin)) return true;
  return NODE_ENV !== 'production' && /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/.test(normalizedOrigin);
}

function corsOriginDelegate(origin, callback) {
  if (!origin || isAllowedRequestOrigin(origin)) return callback(null, true);
  return callback(null, false);
}

function rejectCrossSiteWrites(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin');
  if (!origin || isAllowedRequestOrigin(origin)) return next();
  return res.status(403).json({ error: 'Request origin is not allowed' });
}

function noStoreApiResponses(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  next();
}

const UNIVERSITY_DIRECTORY = {
  'berkeley.edu': { name: 'University of California, Berkeley', city: 'Berkeley', state: 'CA' },
  'ucla.edu': { name: 'University of California, Los Angeles', city: 'Los Angeles', state: 'CA' },
  'uci.edu': { name: 'University of California, Irvine', city: 'Irvine', state: 'CA' },
  'ivc.edu': { name: 'Irvine Valley College', city: 'Irvine', state: 'CA' },
  'saddleback.edu': { name: 'Saddleback College', city: 'Mission Viejo', state: 'CA' },
  'uwaterloo.ca': { name: 'Waterloo University', city: 'Waterloo', state: 'ON' },
  'ucsd.edu': { name: 'University of California, San Diego', city: 'La Jolla', state: 'CA' },
  'ucdavis.edu': { name: 'University of California, Davis', city: 'Davis', state: 'CA' },
  'ucsb.edu': { name: 'University of California, Santa Barbara', city: 'Santa Barbara', state: 'CA' },
  'ucsc.edu': { name: 'University of California, Santa Cruz', city: 'Santa Cruz', state: 'CA' },
  'ucr.edu': { name: 'University of California, Riverside', city: 'Riverside', state: 'CA' },
  'ucmerced.edu': { name: 'University of California, Merced', city: 'Merced', state: 'CA' },
  'usc.edu': { name: 'University of Southern California', city: 'Los Angeles', state: 'CA' },
  'stanford.edu': { name: 'Stanford University', city: 'Stanford', state: 'CA' },
  'caltech.edu': { name: 'California Institute of Technology', city: 'Pasadena', state: 'CA' },
  'harvard.edu': { name: 'Harvard University', city: 'Cambridge', state: 'MA' },
  'mit.edu': { name: 'Massachusetts Institute of Technology', city: 'Cambridge', state: 'MA' },
  'yale.edu': { name: 'Yale University', city: 'New Haven', state: 'CT' },
  'princeton.edu': { name: 'Princeton University', city: 'Princeton', state: 'NJ' },
  'columbia.edu': { name: 'Columbia University', city: 'New York', state: 'NY' },
  'upenn.edu': { name: 'University of Pennsylvania', city: 'Philadelphia', state: 'PA' },
  'brown.edu': { name: 'Brown University', city: 'Providence', state: 'RI' },
  'dartmouth.edu': { name: 'Dartmouth College', city: 'Hanover', state: 'NH' },
  'cornell.edu': { name: 'Cornell University', city: 'Ithaca', state: 'NY' },
  'nyu.edu': { name: 'New York University', city: 'New York', state: 'NY' },
  'bu.edu': { name: 'Boston University', city: 'Boston', state: 'MA' },
  'northeastern.edu': { name: 'Northeastern University', city: 'Boston', state: 'MA' },
  'umich.edu': { name: 'University of Michigan', city: 'Ann Arbor', state: 'MI' },
  'uchicago.edu': { name: 'University of Chicago', city: 'Chicago', state: 'IL' },
  'northwestern.edu': { name: 'Northwestern University', city: 'Evanston', state: 'IL' },
  'duke.edu': { name: 'Duke University', city: 'Durham', state: 'NC' },
  'unc.edu': { name: 'University of North Carolina at Chapel Hill', city: 'Chapel Hill', state: 'NC' },
  'gatech.edu': { name: 'Georgia Institute of Technology', city: 'Atlanta', state: 'GA' },
  'utexas.edu': { name: 'The University of Texas at Austin', city: 'Austin', state: 'TX' },
  'tamu.edu': { name: 'Texas A&M University', city: 'College Station', state: 'TX' },
  'wisc.edu': { name: 'University of Wisconsin-Madison', city: 'Madison', state: 'WI' },
  'washington.edu': { name: 'University of Washington', city: 'Seattle', state: 'WA' },
  'uoregon.edu': { name: 'University of Oregon', city: 'Eugene', state: 'OR' },
  'asu.edu': { name: 'Arizona State University', city: 'Tempe', state: 'AZ' },
  'arizona.edu': { name: 'University of Arizona', city: 'Tucson', state: 'AZ' },
  'colorado.edu': { name: 'University of Colorado Boulder', city: 'Boulder', state: 'CO' },
  'virginia.edu': { name: 'University of Virginia', city: 'Charlottesville', state: 'VA' },
  'ufl.edu': { name: 'University of Florida', city: 'Gainesville', state: 'FL' },
  'fsu.edu': { name: 'Florida State University', city: 'Tallahassee', state: 'FL' },
};

function titleCaseSchoolPart(value) {
  return String(value || '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getUniversityInfoFromDomain(domain) {
  const normalizedDomain = String(domain || '').toLowerCase();
  if (UNIVERSITY_DIRECTORY[normalizedDomain]) return UNIVERSITY_DIRECTORY[normalizedDomain];

  const schoolPart = normalizedDomain
    .replace(/\.edu(\.\w+)?$/, '')
    .replace(/\.ac\.uk$/, '')
    .replace(/\.edu\.au$/, '')
    .split('.')
    .filter(Boolean)
    .pop();

  const derivedName = titleCaseSchoolPart(schoolPart) || normalizedDomain || 'Unknown University';
  const hasInstitutionWord = /\b(university|college|institute|school)\b/i.test(derivedName);

  return {
    name: hasInstitutionWord ? derivedName : derivedName + ' University',
    city: '',
    state: '',
  };
}

function getUniversityNameFromEmail(email) {
  return getUniversityInfoFromDomain(getEmailDomain(email)).name;
}

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), payment=(self), geolocation=(self)');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com; connect-src 'self' https://maps.googleapis.com https://api.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com; frame-ancestors 'none';"
  );
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  }
  next();
}

function makeRateLimiter({ windowMs, max, message }) {
  const hits = new Map();
  // Periodically evict expired entries to prevent unbounded memory growth
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const key = (req.ip || req.socket.remoteAddress || 'unknown') + ':' + req.baseUrl + req.path;
    const current = hits.get(key) || { count: 0, resetAt: now + windowMs };
    if (current.resetAt <= now) {
      current.count = 0;
      current.resetAt = now + windowMs;
    }
    current.count += 1;
    hits.set(key, current);
    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - current.count)));
    res.setHeader('RateLimit-Reset', String(Math.ceil(current.resetAt / 1000)));
    if (current.count > max) {
      return res.status(429).json({ error: message || 'Too many requests. Please wait and try again.' });
    }
    next();
  };
}

const authRateLimit = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 60, message: 'Too many authentication attempts. Please wait and try again.' });
const sensitiveWriteRateLimit = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 40, message: 'Too many sensitive updates. Please wait and try again.' });
const trackingRateLimit = makeRateLimiter({ windowMs: 60 * 1000, max: 120, message: 'Too many tracking requests. Please slow down.' });
const adminRateLimit = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many admin requests. Please wait and try again.' });

class JsonSessionStore extends session.Store {
  constructor(filePath) {
    super();
    this.filePath = filePath;
  }

  readSessions() {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  writeSessions(sessions) {
    const tmpPath = this.filePath + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(sessions, null, 2));
    fs.renameSync(tmpPath, this.filePath);
  }

  isExpired(sess) {
    const expires = sess?.cookie?.expires;
    return Boolean(expires && new Date(expires).getTime() <= Date.now());
  }

  get(sid, callback) {
    try {
      const sessions = this.readSessions();
      const sess = sessions[sid];
      if (!sess || this.isExpired(sess)) {
        delete sessions[sid];
        this.writeSessions(sessions);
        return callback(null, null);
      }
      callback(null, sess);
    } catch (err) {
      callback(err);
    }
  }

  set(sid, sess, callback = () => {}) {
    try {
      const sessions = this.readSessions();
      sessions[sid] = sess;
      this.writeSessions(sessions);
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  destroy(sid, callback = () => {}) {
    try {
      const sessions = this.readSessions();
      delete sessions[sid];
      this.writeSessions(sessions);
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  touch(sid, sess, callback = () => {}) {
    this.set(sid, sess, callback);
  }
}

class PostgresSessionStore extends session.Store {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  get(sid, callback) {
    this.pool.query('SELECT sess FROM linkup_sessions WHERE sid = $1 AND expires > NOW()', [sid])
      .then((result) => callback(null, result.rows[0]?.sess || null))
      .catch((err) => callback(err));
  }

  set(sid, sess, callback = () => {}) {
    const expires = sess?.cookie?.expires ? new Date(sess.cookie.expires) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    this.pool.query(
      `INSERT INTO linkup_sessions (sid, sess, expires)
       VALUES ($1, $2, $3)
       ON CONFLICT (sid) DO UPDATE SET sess = EXCLUDED.sess, expires = EXCLUDED.expires`,
      [sid, sess, expires]
    ).then(() => callback(null)).catch((err) => callback(err));
  }

  destroy(sid, callback = () => {}) {
    this.pool.query('DELETE FROM linkup_sessions WHERE sid = $1', [sid])
      .then(() => callback(null))
      .catch((err) => callback(err));
  }

  touch(sid, sess, callback = () => {}) {
    this.set(sid, sess, callback);
  }
}

app.use(securityHeaders);
app.use(cors({
  origin: corsOriginDelegate,
  credentials: true,
}));
app.use('/api', noStoreApiResponses);
async function handleStripeWebhookRequest(req, res) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ error: 'Stripe webhook is not configured' });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook signature error:', err.message);
    return res.status(400).send('Webhook signature verification failed');
  }
  try {
    const db = loadDb();
    if (event.type === 'payment_intent.succeeded') {
      finalizePaidCheckoutByPaymentIntent(db, event.data.object);
    } else if (event.type === 'account.updated') {
      updateStripeConnectedAccountStatus(db, event.data.object);
    }
    saveDb(db);
    res.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook handling error:', err);
    res.status(500).json({ error: 'Webhook handling failed' });
  }
}
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhookRequest);
app.post('/api/payments/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhookRequest);
app.use(express.json({ limit: '1mb' }));
app.use('/api', rejectCrossSiteWrites);
app.use('/api/auth', authRateLimit);
app.use('/api/profile/payment-method', sensitiveWriteRateLimit);
app.use('/api/profile/payout', sensitiveWriteRateLimit);
app.use('/api/cart/create-checkout-session', sensitiveWriteRateLimit);
app.use('/api/cart/checkout', sensitiveWriteRateLimit);
app.use('/api/cart/checkout/complete', sensitiveWriteRateLimit);
app.use('/api/track', trackingRateLimit);
const sessionMiddleware = session({
  name: 'linkup.sid',
  store: USE_POSTGRES ? new PostgresSessionStore(pgPool) : new JsonSessionStore(SESSION_STORE_PATH),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
});
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  maxAge: NODE_ENV === 'production' ? '1h' : 0,
}));

const io = new Server(httpServer, {
  cors: {
    origin: corsOriginDelegate,
    credentials: true,
  },
});
io.engine.use(sessionMiddleware);

function getSocketUserId(socket) {
  return socket.request.session?.userId || '';
}

function emitSocketAck(callback, payload) {
  if (typeof callback === 'function') callback(payload);
}

function authorizeSocketRide(socket, rideId) {
  const db = loadDb();
  const userId = getSocketUserId(socket);
  const sender = (db.users || []).find((user) => user.id === userId);
  const ride = (db.rides || []).find((entry) => entry.id === String(rideId || ''));
  if (!sender) return { error: 'Sign in again to use live chat' };
  if (!ride) return { error: 'Ride not found' };
  if (!canUserAccessRideChat(ride, sender.id)) return { error: 'Only the driver and confirmed riders can use this chat' };
  if (isRideChatDisabled(ride)) return { error: 'This chat is disabled because the ride ended more than a day ago' };
  return { db, sender, ride };
}

io.use((socket, next) => {
  if (!getSocketUserId(socket)) return next(new Error('Not authenticated'));
  return next();
});

io.on('connection', (socket) => {
  socket.on('chat:join', (payload = {}, callback) => {
    if (RIDE_SERVICES_PAUSED) return emitSocketAck(callback, { ok: false, error: 'LinkUp ride services are temporarily paused.' });
    const result = authorizeSocketRide(socket, payload.rideId);
    if (result.error) return emitSocketAck(callback, { ok: false, error: result.error });
    socket.join('ride:' + result.ride.id);
    socket.data.activeRideId = result.ride.id;
    return emitSocketAck(callback, { ok: true, rideId: result.ride.id });
  });

  socket.on('chat:leave', (payload = {}) => {
    const rideId = String(payload.rideId || socket.data.activeRideId || '');
    if (rideId) socket.leave('ride:' + rideId);
    if (socket.data.activeRideId === rideId) socket.data.activeRideId = '';
  });

  socket.on('chat:typing', (payload = {}) => {
    if (RIDE_SERVICES_PAUSED) return;
    const result = authorizeSocketRide(socket, payload.rideId);
    if (result.error) return;
    socket.to('ride:' + result.ride.id).emit('chat:typing', {
      rideId: result.ride.id,
      userId: result.sender.id,
      userName: result.sender.firstName || 'Someone',
    });
  });

  socket.on('chat:stopTyping', (payload = {}) => {
    if (RIDE_SERVICES_PAUSED) return;
    const result = authorizeSocketRide(socket, payload.rideId);
    if (result.error) return;
    socket.to('ride:' + result.ride.id).emit('chat:stopTyping', {
      rideId: result.ride.id,
      userId: result.sender.id,
    });
  });

  socket.on('chat:message', (payload = {}, callback) => {
    if (RIDE_SERVICES_PAUSED) return emitSocketAck(callback, { ok: false, error: 'LinkUp ride services are temporarily paused.' });
    const result = authorizeSocketRide(socket, payload.rideId);
    if (result.error) return emitSocketAck(callback, { ok: false, error: result.error });
    const textValidation = validateChatText(payload.text);
    if (textValidation.error) return emitSocketAck(callback, { ok: false, error: textValidation.error });

    const message = appendRideChatMessage(result.db, result.ride, result.sender, textValidation.text);
    saveDb(result.db);
    io.to('ride:' + result.ride.id).emit('chat:message', { rideId: result.ride.id, message });
    notifyRideChatParticipants(result.db, result.ride, result.sender, message);
    return emitSocketAck(callback, { ok: true, message });
  });
});

app.get('/api/stripe/config', requireAuth, (req, res) => {
  const config = getPaymentProviderConfig();
  if (config.provider !== 'stripe') {
    return res.status(501).json({ error: getProviderDisplayName(config.provider) + ' browser payments are not implemented yet.' });
  }
  if (!config.publishableKey) {
    return res.status(500).json({ error: 'Stripe publishable key is not configured. Add STRIPE_PUBLISHABLE_KEY to continue.' });
  }
  res.json(config);
});

app.get('/api/payments/config', requireAuth, (req, res) => {
  const config = getPaymentProviderConfig();
  if (config.provider === 'stripe' && !config.publishableKey) {
    return res.status(500).json({ error: 'Stripe publishable key is not configured. Add STRIPE_PUBLISHABLE_KEY to continue.' });
  }
  res.json(config);
});

app.get('/api/push/config', requireAuth, (req, res) => {
  res.json({ enabled: PUSH_NOTIFICATIONS_ENABLED, publicKey: VAPID_PUBLIC_KEY });
});

app.post('/api/push/subscribe', requireAuth, requireServiceAccess, (req, res) => {
  if (!PUSH_NOTIFICATIONS_ENABLED) {
    return res.status(503).json({ error: 'Push notifications are not configured' });
  }
  const endpoint = String(req.body.endpoint || '').trim();
  const p256dh = String(req.body.keys?.p256dh || '').trim();
  const auth = String(req.body.keys?.auth || '').trim();
  if (!endpoint || !p256dh || !auth) {
    return res.status(400).json({ error: 'Invalid push subscription' });
  }
  const db = loadDb();
  const user = (db.users || []).find((entry) => entry.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.pushSubscriptions = normalizePushSubscriptions(user.pushSubscriptions);
  const existing = user.pushSubscriptions.find((subscription) => subscription.endpoint === endpoint);
  const now = new Date().toISOString();
  if (existing) {
    existing.keys = { p256dh, auth };
    existing.userAgent = String(req.headers['user-agent'] || '').slice(0, 300);
    existing.updatedAt = now;
  } else {
    user.pushSubscriptions.push({
      endpoint,
      keys: { p256dh, auth },
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
      createdAt: now,
      updatedAt: now,
    });
  }
  user.updatedAt = now;
  saveDb(db);
  res.json({ message: 'Notifications enabled' });
});

app.post('/api/push/unsubscribe', requireAuth, (req, res) => {
  const endpoint = String(req.body.endpoint || '').trim();
  if (!endpoint) return res.json({ message: 'Notifications disabled' });
  const db = loadDb();
  const user = (db.users || []).find((entry) => entry.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.pushSubscriptions = normalizePushSubscriptions(user.pushSubscriptions)
    .filter((subscription) => subscription.endpoint !== endpoint);
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json({ message: 'Notifications disabled' });
});

function getEmptyDb() {
  return {
    schemaVersion: DB_SCHEMA_VERSION,
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    rides: [],
    rideRequests: [],
    users: [],
    carts: {},
    checkoutSessions: [],
    payments: [],
    walletTransactions: [],
    trackingTrips: [],
    rideMessages: {},
    userReports: [],
    userBlocks: [],
    passwordResetTokens: [],
  };
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asPlainObject(value) {
  return isPlainObject(value) ? value : {};
}

function uniqueById(items) {
  const seen = new Set();
  return asArray(items).filter((item) => {
    if (!isPlainObject(item)) return false;
    if (!item.id) return true;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function normalizeCartMap(carts) {
  return Object.entries(asPlainObject(carts)).reduce((normalized, [userId, entries]) => {
    normalized[userId] = asArray(entries)
      .map((entry) => {
        if (typeof entry === 'string') return { rideId: entry, seatId: '', actualPickup: '', actualDropoff: '', termsAcceptedAt: '' };
        if (!isPlainObject(entry)) return null;
        return {
          rideId: String(entry.rideId || ''),
          seatId: String(entry.seatId || ''),
          actualPickup: String(entry.actualPickup || '').slice(0, 180),
          actualDropoff: String(entry.actualDropoff || '').slice(0, 180),
          termsAcceptedAt: String(entry.termsAcceptedAt || ''),
        };
      })
      .filter((entry) => entry?.rideId);
    return normalized;
  }, {});
}

function normalizeRideMessages(messagesByRide) {
  return Object.entries(asPlainObject(messagesByRide)).reduce((normalized, [rideId, messages]) => {
    normalized[rideId] = asArray(messages).filter(isPlainObject);
    return normalized;
  }, {});
}

function normalizePushSubscriptions(subscriptions) {
  return asArray(subscriptions)
    .filter(isPlainObject)
    .map((subscription) => ({
      endpoint: String(subscription.endpoint || '').slice(0, 1000),
      keys: {
        p256dh: String(subscription.keys?.p256dh || '').slice(0, 300),
        auth: String(subscription.keys?.auth || '').slice(0, 300),
      },
      userAgent: String(subscription.userAgent || '').slice(0, 300),
      createdAt: String(subscription.createdAt || ''),
      updatedAt: String(subscription.updatedAt || ''),
    }))
    .filter((subscription) => subscription.endpoint && subscription.keys.p256dh && subscription.keys.auth);
}

function normalizeCheckoutSessions(sessions) {
  return uniqueById(sessions).map((session) => ({
    ...session,
    cartEntries: asArray(session.cartEntries)
      .map((entry) => isPlainObject(entry) ? {
        rideId: String(entry.rideId || ''),
        seatId: String(entry.seatId || ''),
        actualPickup: String(entry.actualPickup || '').slice(0, 180),
        actualDropoff: String(entry.actualDropoff || '').slice(0, 180),
        termsAcceptedAt: String(entry.termsAcceptedAt || ''),
      } : null)
      .filter((entry) => entry?.rideId),
  }));
}

function normalizeDbShape(db) {
  const base = getEmptyDb();
  const normalized = { ...base, ...(db && typeof db === 'object' ? db : {}) };
  normalized.schemaVersion = DB_SCHEMA_VERSION;
  normalized.meta = {
    ...base.meta,
    ...asPlainObject(normalized.meta),
    updatedAt: new Date().toISOString(),
  };
  normalized.rides = uniqueById(normalized.rides);
  normalized.rideRequests = uniqueById(normalized.rideRequests);
  normalized.users = uniqueById(normalized.users);
  normalized.users = normalized.users.map((user) => ({
    ...user,
    pushSubscriptions: normalizePushSubscriptions(user.pushSubscriptions),
  }));
  normalized.carts = normalizeCartMap(normalized.carts);
  normalized.checkoutSessions = normalizeCheckoutSessions(normalized.checkoutSessions);
  normalized.payments = uniqueById(normalized.payments);
  normalized.walletTransactions = uniqueById(normalized.walletTransactions).filter(isPlainObject);
  normalized.trackingTrips = uniqueById(normalized.trackingTrips).map((trip) => {
    const createdAtMs = new Date(trip.createdAt || 0).getTime();
    const fallbackExpiresAt = Number.isFinite(createdAtMs) && createdAtMs > 0
      ? createdAtMs + TRACKING_VIEWER_TTL_MS
      : Date.now() + TRACKING_VIEWER_TTL_MS;
    const viewerAccessExpiresAt = Number(trip.viewerAccessExpiresAt);
    return {
      ...trip,
      viewerAccessExpiresAt: Number.isFinite(viewerAccessExpiresAt) && viewerAccessExpiresAt > 0
        ? viewerAccessExpiresAt
        : fallbackExpiresAt,
      locations: asArray(trip.locations).filter(isPlainObject),
    };
  });
  normalized.rideMessages = normalizeRideMessages(normalized.rideMessages);
  normalized.userReports = uniqueById(normalized.userReports);
  normalized.userBlocks = asArray(normalized.userBlocks).filter(isPlainObject);
  normalized.passwordResetTokens = asArray(normalized.passwordResetTokens).filter(isPlainObject);
  return normalized;
}

let dbCache = null;
let dbWritePromise = Promise.resolve();

function readFileDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return normalizeDbShape(JSON.parse(raw));
  } catch (error) {
    return getEmptyDb();
  }
}

function loadDb() {
  if (USE_POSTGRES) {
    return normalizeDbShape(dbCache || getEmptyDb());
  }
  return readFileDb();
}

function queuePostgresDbSave(db) {
  const snapshot = JSON.parse(JSON.stringify(db));
  dbWritePromise = dbWritePromise
    .then(() => pgPool.query(
      `INSERT INTO linkup_state (state_key, data, updated_at)
       VALUES ('main', $1, NOW())
       ON CONFLICT (state_key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [snapshot]
    ))
    .catch((err) => {
      console.error('PostgreSQL saveDb error:', err);
    });
}

function saveDb(db) {
  const normalized = normalizeDbShape(db);
  normalized.meta.updatedAt = new Date().toISOString();
  if (USE_POSTGRES) {
    dbCache = normalized;
    queuePostgresDbSave(normalized);
    return;
  }

  const tmpPath = DB_PATH + '.tmp';
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(normalized, null, 2));
    fs.renameSync(tmpPath, DB_PATH);
  } catch (err) {
    console.error('saveDb error:', err);
    try { fs.unlinkSync(tmpPath); } catch (_) {}
    throw err;
  }
}

async function initPostgresStorage() {
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS linkup_state (
      state_key TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS linkup_sessions (
      sid TEXT PRIMARY KEY,
      sess JSONB NOT NULL,
      expires TIMESTAMPTZ NOT NULL
    )
  `);
  await pgPool.query('CREATE INDEX IF NOT EXISTS linkup_sessions_expires_idx ON linkup_sessions (expires)');
  await pgPool.query('DELETE FROM linkup_sessions WHERE expires <= NOW()');

  const result = await pgPool.query('SELECT data FROM linkup_state WHERE state_key = $1', ['main']);
  if (result.rows[0]?.data) {
    dbCache = normalizeDbShape(result.rows[0].data);
  } else {
    dbCache = readFileDb();
    await pgPool.query(
      `INSERT INTO linkup_state (state_key, data, updated_at)
       VALUES ('main', $1, NOW())
       ON CONFLICT (state_key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [dbCache]
    );
  }
  console.log('LinkUp PostgreSQL storage connected.');
}

async function migrateDbOnStartup() {
  try {
    if (USE_POSTGRES) {
      await initPostgresStorage();
      saveDb(loadDb());
      await dbWritePromise;
    } else {
      saveDb(loadDb());
    }
  } catch (err) {
    console.error('Database migration failed:', err);
    process.exit(1);
  }
}

function expireUnclaimedRideRequests(db) {
  let changed = false;
  const now = Date.now();
  (db.rideRequests || []).forEach((request) => {
    const isOpen = (request.status || 'open') === 'open';
    const hasDriverClaim = (request.driverOffers || []).length > 0;
    const requestStart = getTripStartMs(request);
    if (isOpen && !hasDriverClaim && requestStart > 0 && requestStart < now) {
      request.status = 'expired';
      request.expiredAt = new Date().toISOString();
      changed = true;
    }
  });
  if (changed) saveDb(db);
  return db;
}

function normalizeUserAccess(db) {
  let changed = false;
  (db.users || []).forEach((user) => {
    if (!user.universityDomain) {
      user.universityDomain = getEmailDomain(user.email);
      changed = true;
    }
    const supportedUniversity = SUPPORTED_UNIVERSITY_DOMAINS[user.universityDomain];
    if (supportedUniversity && user.serviceApproved !== true) {
      user.serviceApproved = true;
      user.waitlistedAt = null;
      changed = true;
    } else if (user.serviceApproved === undefined) {
      user.serviceApproved = false;
      if (!user.waitlistedAt) user.waitlistedAt = new Date().toISOString();
      changed = true;
    }
    const displayUniversity = supportedUniversity || getUniversityInfoFromDomain(user.universityDomain).name;
    if (!user.university || user.university === user.universityDomain || user.university.endsWith('.edu')) {
      user.university = displayUniversity;
      changed = true;
    }
  });
  if (changed) saveDb(db);
  return db;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeGender(gender) {
  const value = String(gender || '').trim().toLowerCase();
  const allowed = ['female', 'male', 'nonbinary', 'prefer-not-to-say'];
  return allowed.includes(value) ? value : '';
}

function normalizeThemePreference(themePreference) {
  const value = String(themePreference || '').trim().toLowerCase();
  return ['dark', 'light'].includes(value) ? value : 'dark';
}

function canMatchSameGender(riderGender, driverGender) {
  if (!riderGender || !driverGender) return false;
  if (riderGender === 'prefer-not-to-say' || driverGender === 'prefer-not-to-say') return false;
  return riderGender === driverGender;
}

function isSameSchoolUser(user, schoolName = '') {
  return Boolean(user && schoolName && user.university === schoolName);
}

function calculateDistanceMiles(originLat, originLng, destinationLat, destinationLng) {
  const startLat = Number(originLat);
  const startLng = Number(originLng);
  const endLat = Number(destinationLat);
  const endLng = Number(destinationLng);
  if (![startLat, startLng, endLat, endLng].every(Number.isFinite)) return 0;

  const earthRadiusMiles = 3958.8;
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const latDelta = toRadians(endLat - startLat);
  const lngDelta = toRadians(endLng - startLng);
  const a = Math.sin(latDelta / 2) ** 2
    + Math.cos(toRadians(startLat)) * Math.cos(toRadians(endLat)) * Math.sin(lngDelta / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(earthRadiusMiles * c * 10) / 10;
}

function sanitizeDurationMinutes(value) {
  const minutes = Math.round(Number(value));
  return Number.isFinite(minutes) && minutes >= 5 && minutes <= 720 ? minutes : 90;
}

function sanitizeDistanceMiles(value, fallbackMiles = 0) {
  const miles = Number(value);
  if (Number.isFinite(miles) && miles > 0 && miles <= 3000) return Math.round(miles * 10) / 10;
  return Math.round(Number(fallbackMiles || 0) * 10) / 10;
}

function parseTripCoordinate(value, min, max) {
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
}

function parseLatitude(value) {
  return parseTripCoordinate(value, -90, 90);
}

function parseLongitude(value) {
  return parseTripCoordinate(value, -180, 180);
}

function hasBlankCoordinate(value) {
  return value === null || value === undefined || value === '';
}

function parseOptionalLatitude(value) {
  return hasBlankCoordinate(value) ? null : parseLatitude(value);
}

function parseOptionalLongitude(value) {
  return hasBlankCoordinate(value) ? null : parseLongitude(value);
}

function parseRadiusMiles(value) {
  if (value === null || value === undefined || value === '') return 0;
  const miles = Number(value);
  return Number.isFinite(miles) && miles >= 0 && miles <= 100 ? Math.round(miles * 10) / 10 : null;
}

function isValidTripDateTime(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || ''))) return false;
  if (!/^\d{2}:\d{2}$/.test(String(time || ''))) return false;
  const timestamp = new Date(String(date) + 'T' + String(time)).getTime();
  return Number.isFinite(timestamp);
}

function getTripStartMs(trip) {
  const start = new Date(String(trip.date || '') + 'T' + String(trip.time || '00:00')).getTime();
  return Number.isFinite(start) ? start : 0;
}

function buildTripInterval(date, time, durationMinutes) {
  const start = new Date(String(date || '') + 'T' + String(time || '00:00')).getTime();
  return Number.isFinite(start)
    ? { start, end: start + sanitizeDurationMinutes(durationMinutes) * 60 * 1000 }
    : null;
}

function getTripInterval(trip) {
  return buildTripInterval(trip.date, trip.time, trip.estimatedDurationMinutes) || { start: 0, end: 0 };
}

function getTripIntervals(trip) {
  const intervals = [buildTripInterval(trip.date, trip.time, trip.estimatedDurationMinutes)].filter(Boolean);
  if (trip.returnRide?.date && trip.returnRide?.time) {
    intervals.push(buildTripInterval(trip.returnRide.date, trip.returnRide.time, trip.estimatedDurationMinutes));
  }
  return intervals;
}

function hasTripEnded(trip) {
  const intervals = getTripIntervals(trip);
  return intervals.length > 0 && intervals.every((interval) => interval.end < Date.now());
}

function intervalsOverlap(a, b) {
  return a.start < b.end && b.start < a.end;
}

function describeTripTime(trip) {
  return (trip.origin || 'Ride') + ' to ' + (trip.destination || 'destination') + ' at ' + (trip.date || '') + ' ' + (trip.time || '');
}

function getUserScheduledTrips(db, userId, excludeRideId = '', excludeRequestId = '') {
  const rideTrips = (db.rides || [])
    .filter((ride) => ride.id !== excludeRideId)
    .filter((ride) => ride.driverId === userId || (ride.passengers || []).some((passenger) => passenger.studentId === userId));
  const requestTrips = (db.rideRequests || [])
    .filter((request) => request.id !== excludeRequestId)
    .filter((request) => request.riderId === userId && (request.status || 'open') === 'open');
  return [...rideTrips, ...requestTrips];
}

function findUserScheduleConflict(db, userId, candidateTrip, options = {}) {
  const candidateIntervals = getTripIntervals(candidateTrip);
  if (!candidateIntervals.length) return null;
  const now = Date.now();
  return getUserScheduledTrips(db, userId, options.excludeRideId || '', options.excludeRequestId || '')
    .find((trip) => {
      const intervals = getTripIntervals(trip).filter((interval) => interval.end > now);
      return candidateIntervals.some((candidateInterval) => intervals.some((interval) => intervalsOverlap(candidateInterval, interval)));
    }) || null;
}

function findInternalRideConflict(rides) {
  for (let index = 0; index < rides.length; index += 1) {
    for (let nextIndex = index + 1; nextIndex < rides.length; nextIndex += 1) {
      const firstIntervals = getTripIntervals(rides[index]);
      const secondIntervals = getTripIntervals(rides[nextIndex]);
      if (firstIntervals.some((first) => secondIntervals.some((second) => intervalsOverlap(first, second)))) {
        return [rides[index], rides[nextIndex]];
      }
    }
  }
  return null;
}

function getRideMiles(ride) {
  const oneWayMiles = Number.isFinite(Number(ride.distanceMiles))
    ? Number(ride.distanceMiles)
    : calculateDistanceMiles(ride.originLat, ride.originLng, ride.destinationLat, ride.destinationLng);
  return Math.round(oneWayMiles * (ride.returnRide ? 2 : 1) * 10) / 10;
}

function getRideMilesSaved(ride) {
  const passengerCount = Array.isArray(ride.passengers) ? ride.passengers.length : 0;
  if (!passengerCount) return 0;
  return Math.round(getRideMiles(ride) * passengerCount * 10) / 10;
}

function hasConfirmedRidePassenger(ride) {
  return Array.isArray(ride.passengers) && ride.passengers.length > 0;
}

function getDriverRatingSummary(db, driverId) {
  const ratings = (db?.rides || [])
    .filter((ride) => ride.driverId === driverId)
    .flatMap((ride) => (ride.passengers || [])
      .map((passenger) => Number(passenger.driverRating))
      .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5));
  if (!ratings.length) return { average: null, count: 0 };
  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return { average: Math.round(average * 10) / 10, count: ratings.length };
}

function withRideMiles(ride, db = null) {
  const distanceMiles = Number.isFinite(Number(ride.distanceMiles))
    ? Number(ride.distanceMiles)
    : calculateDistanceMiles(ride.originLat, ride.originLng, ride.destinationLat, ride.destinationLng);
  const driverRating = getDriverRatingSummary(db, ride.driverId);
  return {
    ...ride,
    distanceMiles,
    totalDistanceMiles: getRideMiles({ ...ride, distanceMiles }),
    vehicleSeatCount: ride.seatingChartUnavailable ? 0 : inferVehicleSeatCount(ride),
    seatMap: getRideSeatMap(ride),
    seatsAvailable: getAvailableOpenSeatIds(ride).length,
    driverRatingAverage: driverRating.average,
    driverRatingCount: driverRating.count,
  };
}

function canUserSeeLicensePlate(ride, userId) {
  return ride.driverId === userId || (ride.passengers || []).some((passenger) => passenger.studentId === userId);
}

function canUserAccessRideChat(ride, userId) {
  return ride && (ride.driverId === userId || (ride.passengers || []).some((passenger) => passenger.studentId === userId));
}

function getMaskedLastName(lastName = '') {
  const trimmed = String(lastName || '').trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() + '.' : '';
}

function getMaskedUserNameParts(user) {
  const fallbackName = user?.email ? user.email.split('@')[0] : 'User';
  return {
    firstName: user?.firstName || fallbackName,
    lastName: getMaskedLastName(user?.lastName),
  };
}

function canUserSeeDriverFullName(ride, userId) {
  return canUserAccessRideChat(ride, userId);
}

function getRideChatDisabledAt(ride) {
  const interval = getTripInterval(ride);
  if (!interval.end) return null;
  return new Date(interval.end + 24 * 60 * 60 * 1000).toISOString();
}

function isRideChatDisabled(ride) {
  const disabledAt = getRideChatDisabledAt(ride);
  return Boolean(disabledAt && Date.now() >= new Date(disabledAt).getTime());
}

function validateChatText(value) {
  const text = String(value || '').trim();
  if (!text) return { error: 'Message cannot be empty' };
  if (text.length > 500) return { error: 'Message must be 500 characters or fewer' };
  return { text };
}

function appendRideChatMessage(db, ride, sender, text) {
  db.rideMessages = db.rideMessages || {};
  db.rideMessages[ride.id] = db.rideMessages[ride.id] || [];
  const message = {
    id: uuidv4(),
    rideId: ride.id,
    senderId: sender.id,
    senderFirstName: sender.firstName,
    senderLastName: sender.lastName,
    senderRole: ride.driverId === sender.id ? 'Driver' : 'Rider',
    text,
    createdAt: new Date().toISOString(),
  };
  db.rideMessages[ride.id].push(message);
  return message;
}

function rideForUser(ride, userId, db = null) {
  const publicRide = withRideMiles(ride, db);
  publicRide.passengers = (publicRide.passengers || []).map((passenger) => {
    const canSeeRiderStops = publicRide.driverId === userId || passenger.studentId === userId;
    if (canSeeRiderStops) return passenger;
    const { actualPickup, actualDropoff, ...safePassenger } = passenger;
    return safePassenger;
  });
  if (!canUserSeeDriverFullName(ride, userId)) {
    publicRide.driverLastName = getMaskedLastName(ride.driverLastName);
  }
  if (!canUserSeeLicensePlate(ride, userId)) {
    delete publicRide.licensePlate;
  }
  return publicRide;
}

function getUserDisplayName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'User';
}

function canReportUserForRide(ride, reporterId, reportedUserId) {
  if (!ride || !reporterId || !reportedUserId || reporterId === reportedUserId) return false;
  const passengerIds = new Set((ride.passengers || []).map((passenger) => passenger.studentId).filter(Boolean));
  const reporterIsParticipant = ride.driverId === reporterId || passengerIds.has(reporterId);
  if (ride.driverId === reportedUserId) return true;
  if (passengerIds.has(reportedUserId)) return reporterIsParticipant;
  return false;
}

function isUserBlocked(db, blockerId, blockedId) {
  return (db.userBlocks || []).some((block) => block.blockerId === blockerId && block.blockedUserId === blockedId);
}

function areUsersBlocked(db, firstUserId, secondUserId) {
  if (!firstUserId || !secondUserId || firstUserId === secondUserId) return false;
  return isUserBlocked(db, firstUserId, secondUserId) || isUserBlocked(db, secondUserId, firstUserId);
}

function isRideVisibleToUser(db, ride, userId) {
  if (!ride || !userId) return false;
  if (ride.driverId === userId) return true;
  const viewer = (db.users || []).find((user) => user.id === userId);
  if (ride.sameSchoolOnly && !isSameSchoolUser(viewer, ride.university)) return false;
  return !areUsersBlocked(db, userId, ride.driverId);
}

function isRideBrowseVisibleToUser(db, ride, userId) {
  if (!ride || !userId) return false;
  if (ride.driverId === userId) return false;
  if (hasTripStartPassed(ride)) return false;
  if (!isRideVisibleToUser(db, ride, userId)) return false;
  return getAvailableOpenSeatIds(ride).length > 0;
}

function isRideRequestVisibleToUser(db, request, userId) {
  if (!request || !userId) return false;
  if (request.riderId === userId) return true;
  const viewer = (db.users || []).find((user) => user.id === userId);
  if (request.sameSchoolDriverOnly && !isSameSchoolUser(viewer, request.university)) return false;
  return !areUsersBlocked(db, userId, request.riderId);
}

function canUserSeeProfileFullName(db, profileUserId, viewerId) {
  if (!profileUserId || !viewerId) return false;
  if (profileUserId === viewerId) return true;
  return (db.rides || []).some((ride) => ride.driverId === profileUserId
    && (ride.passengers || []).some((passenger) => passenger.studentId === viewerId));
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function timingSafeEqualText(left, right) {
  const leftBuffer = Buffer.from(String(left || ''));
  const rightBuffer = Buffer.from(String(right || ''));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function hasLuhnCheckDigit(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum > 0 && sum % 10 === 0;
}

function containsProhibitedFinancialData(value) {
  const text = String(value || '');
  if (!text.trim()) return false;
  const normalized = text.toLowerCase();
  if (/\b(?:routing|account|acct|iban|swift|sort\s*code|ssn|social\s*security|cvv|cvc|card\s*(?:number|no\.?|#)?)\b/.test(normalized)) {
    return true;
  }
  return text.match(/\b(?:\d[ -]?){13,19}\b/g)?.some(hasLuhnCheckDigit) || false;
}

function getRideChatParticipantIds(ride) {
  return [...new Set([
    ride.driverId,
    ...(ride.passengers || []).map((passenger) => passenger.studentId),
  ].filter(Boolean))];
}

function getChatNotificationTitle(ride) {
  return 'New LinkUp chat message';
}

function getChatNotificationBody(ride, sender, text) {
  const route = [ride.origin, ride.destination].filter(Boolean).join(' to ');
  const senderName = sender.firstName || 'A rider';
  const preview = String(text || '').slice(0, 120);
  return route ? `${senderName} on ${route}: ${preview}` : `${senderName}: ${preview}`;
}

function sendPushNotification(user, payload) {
  if (!PUSH_NOTIFICATIONS_ENABLED || !user?.pushSubscriptions?.length) return;
  const body = JSON.stringify(payload);
  user.pushSubscriptions.forEach((subscription) => {
    webpush.sendNotification(subscription, body).catch((err) => {
      if (![404, 410].includes(Number(err.statusCode))) {
        console.error('Push notification failed:', err.message);
      }
    });
  });
}

function notifyRideChatParticipants(db, ride, sender, message) {
  if (!PUSH_NOTIFICATIONS_ENABLED) return;
  const recipientIds = getRideChatParticipantIds(ride).filter((userId) => userId !== sender.id);
  const payload = {
    title: getChatNotificationTitle(ride),
    body: getChatNotificationBody(ride, sender, message.text),
    url: '/#chat',
    tag: 'ride-chat-' + ride.id,
    data: { rideId: ride.id, type: 'ride-chat' },
  };
  (db.users || [])
    .filter((user) => recipientIds.includes(user.id))
    .forEach((user) => sendPushNotification(user, payload));
}

function generateVerificationCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

function setEmailVerificationCode(user) {
  const code = generateVerificationCode();
  user.emailVerified = false;
  user.emailVerificationCodeHash = hashToken(code);
  user.emailVerificationCodeExpiresAt = Date.now() + 1000 * 60 * 10;
  return code;
}

function sendVerificationCode(user, code) {
  const firstName = user.firstName || 'there';
  const textBody = [
    `Hi ${firstName},`,
    '',
    'Welcome to LinkUp. Use this code to verify your university email:',
    '',
    code,
    '',
    'This code expires in 10 minutes. If you did not create a LinkUp account, you can ignore this email.',
    '',
    '- LinkUp',
  ].join('\n');
  const htmlBody = `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#071719;font-family:Inter,Arial,sans-serif;color:#102326;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#071719;padding:32px 14px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #d7fbfb;">
                <tr>
                  <td style="background:#082023;padding:28px 32px;text-align:center;">
                    <div style="font-size:30px;line-height:1;font-weight:900;letter-spacing:-0.5px;color:#ffffff;">LinkUp</div>
                    <div style="margin-top:8px;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#61e0e0;">Student ride sharing</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:34px 32px 28px;">
                    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#102326;">Verify your email</h1>
                    <p style="margin:0 0 22px;font-size:16px;line-height:1.6;color:#54636a;">Hi ${escapeHtml(firstName)}, welcome to LinkUp. Enter this code in the app to finish creating your account.</p>
                    <div style="margin:0 auto 22px;padding:22px 18px;border-radius:16px;background:#eafafa;border:1px solid #b7eeee;text-align:center;">
                      <div style="font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#37777d;">Verification code</div>
                      <div style="margin-top:8px;font-size:42px;line-height:1;font-weight:900;letter-spacing:10px;color:#102326;">${code}</div>
                    </div>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#6b747a;">This code expires in 10 minutes. If you did not create a LinkUp account, you can safely ignore this email.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 32px 28px;border-top:1px solid #edf4f4;">
                    <p style="margin:0;font-size:12px;line-height:1.6;color:#7b878c;">LinkUp helps college students coordinate rides with campus-focused safety tools, profiles, and trip details.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
  sendAuthEmail(
    user.email,
    'Your LinkUp verification code',
    textBody,
    htmlBody
  );
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatEmailCurrency(cents) {
  return '$' + (Math.max(0, Number(cents || 0)) / 100).toFixed(2);
}

function formatEmailDateTime(ride) {
  const date = String(ride?.date || '').trim();
  const time = String(ride?.time || '').trim();
  const parsed = new Date(date + 'T' + (time || '00:00'));
  if (!Number.isFinite(parsed.getTime())) return [date, time].filter(Boolean).join(' ');
  return parsed.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getEmailSeatLabel(ride, seatId) {
  if (ride?.seatingChartUnavailable) return 'General shared spot';
  return CAR_SEATS.find((seat) => seat.id === seatId)?.label || seatId || 'Selected seat';
}

function buildReservationEmailRideDetails(db, reservation) {
  return reservation.ridesToReserve.map(({ ride, seatId, actualPickup, actualDropoff }) => {
    const driver = (db.users || []).find((user) => user.id === ride.driverId);
    const driverLastInitial = driver?.lastName ? driver.lastName.charAt(0) + '.' : '';
    return {
      route: (ride.origin || 'Pickup') + ' to ' + (ride.destination || 'Destination'),
      when: formatEmailDateTime(ride),
      driverName: driver ? [driver.firstName, driverLastInitial].filter(Boolean).join(' ') : (ride.driverName || 'Your driver'),
      seat: getEmailSeatLabel(ride, seatId),
      pickup: actualPickup || ride.origin || 'Pickup location',
      dropoff: actualDropoff || ride.destination || 'Drop-off location',
      price: formatEmailCurrency(ride.priceCents),
    };
  });
}

function sendReservationConfirmationEmail(db, student, reservation, checkoutSession) {
  const rideDetails = buildReservationEmailRideDetails(db, reservation);
  if (!student?.email || !rideDetails.length) return;

  const firstName = student.firstName || 'there';
  const totalCents = Number(checkoutSession.stripeAmountTotal || checkoutSession.expectedAmountCents || 0);
  const tripWord = rideDetails.length === 1 ? 'trip' : 'trips';
  const textRideDetails = rideDetails.map((detail, index) => [
    `${index + 1}. ${detail.route}`,
    `When: ${detail.when}`,
    `Driver: ${detail.driverName}`,
    `Seat: ${detail.seat}`,
    `Pickup: ${detail.pickup}`,
    `Drop-off: ${detail.dropoff}`,
    `Price: ${detail.price}`,
  ].join('\n')).join('\n\n');
  const textBody = [
    `Hi ${firstName},`,
    '',
    `Thanks for reserving your LinkUp ${tripWord}. Your seat is confirmed.`,
    '',
    textRideDetails,
    '',
    `Total paid: ${formatEmailCurrency(totalCents)}`,
    '',
    'You can view your ride details, chat with your driver, and manage trip safety tools in LinkUp.',
    '',
    '- LinkUp',
  ].join('\n');

  const htmlRows = rideDetails.map((detail) => `
    <tr>
      <td style="padding:18px 0;border-top:1px solid #edf4f4;">
        <h2 style="margin:0 0 10px;font-size:20px;line-height:1.3;color:#102326;">${escapeHtml(detail.route)}</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          ${[
            ['When', detail.when],
            ['Driver', detail.driverName],
            ['Seat', detail.seat],
            ['Pickup', detail.pickup],
            ['Drop-off', detail.dropoff],
            ['Price', detail.price],
          ].map(([label, value]) => `
            <tr>
              <td style="width:96px;padding:5px 0;font-size:13px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#37777d;">${escapeHtml(label)}</td>
              <td style="padding:5px 0;font-size:15px;line-height:1.5;color:#33474d;">${escapeHtml(value)}</td>
            </tr>
          `).join('')}
        </table>
      </td>
    </tr>
  `).join('');

  const htmlBody = `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#071719;font-family:Inter,Arial,sans-serif;color:#102326;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#071719;padding:32px 14px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #d7fbfb;">
                <tr>
                  <td style="background:#082023;padding:28px 32px;text-align:center;">
                    <div style="font-size:30px;line-height:1;font-weight:900;letter-spacing:-0.5px;color:#ffffff;">LinkUp</div>
                    <div style="margin-top:8px;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#61e0e0;">Seat reserved</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:34px 32px 24px;">
                    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#102326;">Thanks for riding with LinkUp</h1>
                    <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#54636a;">Hi ${escapeHtml(firstName)}, your ${escapeHtml(tripWord)} ${rideDetails.length === 1 ? 'is' : 'are'} confirmed. Here are your reservation details.</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${htmlRows}</table>
                    <div style="margin-top:20px;padding:18px;border-radius:16px;background:#eafafa;border:1px solid #b7eeee;">
                      <div style="font-size:13px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#37777d;">Total paid</div>
                      <div style="margin-top:6px;font-size:26px;font-weight:900;color:#102326;">${escapeHtml(formatEmailCurrency(totalCents))}</div>
                    </div>
                    <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#6b747a;">Open LinkUp to view trip details, chat with your driver, and use safety tools before your ride.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  sendAuthEmail(
    student.email,
    'Your LinkUp seat is reserved',
    textBody,
    htmlBody
  );
}

function writeEmailToOutbox(to, subject, body, reason = 'SMTP not configured', htmlBody = '') {
  const email = {
    id: uuidv4(),
    to,
    subject,
    body,
    html: htmlBody || undefined,
    reason,
    createdAt: new Date().toISOString(),
  };

  let outbox = [];
  try {
    outbox = JSON.parse(fs.readFileSync(EMAIL_OUTBOX_PATH, 'utf8'));
  } catch (error) {
    outbox = [];
  }

  outbox.push(email);
  fs.writeFileSync(EMAIL_OUTBOX_PATH, JSON.stringify(outbox, null, 2));
  console.log('Auth email saved to local outbox:', email);
}

function getMailTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendAuthEmail(to, subject, body, htmlBody = '') {
  const transporter = getMailTransporter();
  if (!transporter) {
    writeEmailToOutbox(to, subject, body, 'SMTP not configured', htmlBody);
    return;
  }

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      text: body,
      ...(htmlBody ? { html: htmlBody } : {}),
    });
    console.log('Auth email sent:', { to, subject });
  } catch (error) {
    writeEmailToOutbox(to, subject, body, error.message, htmlBody);
    console.error('SMTP send failed; saved email to local outbox:', error.message);
  }
}

function isUniversityEmail(email) {
  const domain = String(email || '').split('@')[1] || '';
  return Boolean(domain) && (domain.endsWith('.edu') || domain.endsWith('.ac.uk') || domain.endsWith('.edu.au'));
}

function getEmailDomain(email) {
  return String(email || '').split('@')[1] || '';
}

function extractUniversityFromEmail(email) {
  const domain = getEmailDomain(email);
  return SUPPORTED_UNIVERSITY_DOMAINS[domain];
}

function getDisplayUniversityFromEmail(email) {
  const domain = getEmailDomain(email);
  return getUniversityInfoFromDomain(domain).name;
}

function getUserUniversityDisplay(user) {
  const domain = user.universityDomain || getEmailDomain(user.email);
  if (!user.university || user.university === domain || String(user.university).endsWith('.edu')) {
    return getUniversityInfoFromDomain(domain).name;
  }
  return user.university;
}

function userNeedsPolicyConsent(user) {
  return user.termsVersion !== REQUIRED_TERMS_VERSION || user.privacyVersion !== REQUIRED_PRIVACY_VERSION;
}

function getMissingRequiredSettings(user) {
  const missing = [];
  if (!String(user.firstName || '').trim()) missing.push({ key: 'firstName', label: 'First name', profileTab: 'info' });
  if (!String(user.lastName || '').trim()) missing.push({ key: 'lastName', label: 'Last name', profileTab: 'info' });
  if (!String(user.birthday || '').trim()) missing.push({ key: 'birthday', label: 'Birthday', profileTab: 'info' });
  if (!normalizeGender(user.gender)) missing.push({ key: 'gender', label: 'Gender', profileTab: 'info' });
  return missing;
}

function validateProfilePictureDataUrl(value) {
  if (value === undefined) return { valid: true, dataUrl: undefined };
  const dataUrl = String(value || '').trim();
  if (!dataUrl) return { valid: true, dataUrl: '' };
  const match = dataUrl.match(/^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    return { valid: false, error: 'Profile picture must be a PNG, JPG, or WebP image' };
  }
  const byteLength = Buffer.byteLength(match[2], 'base64');
  if (byteLength > 512 * 1024) {
    return { valid: false, error: 'Profile picture must be 512 KB or smaller' };
  }
  const buffer = Buffer.from(match[2], 'base64');
  const mimeType = match[1].toLowerCase();
  const isPng = mimeType === 'image/png'
    && buffer.length >= 8
    && buffer[0] === 0x89
    && buffer[1] === 0x50
    && buffer[2] === 0x4e
    && buffer[3] === 0x47
    && buffer[4] === 0x0d
    && buffer[5] === 0x0a
    && buffer[6] === 0x1a
    && buffer[7] === 0x0a;
  const isJpeg = (mimeType === 'image/jpeg' || mimeType === 'image/jpg')
    && buffer.length >= 3
    && buffer[0] === 0xff
    && buffer[1] === 0xd8
    && buffer[2] === 0xff;
  const isWebp = mimeType === 'image/webp'
    && buffer.length >= 12
    && buffer.toString('ascii', 0, 4) === 'RIFF'
    && buffer.toString('ascii', 8, 12) === 'WEBP';
  if (!isPng && !isJpeg && !isWebp) {
    return { valid: false, error: 'Profile picture data does not match a supported image type' };
  }
  return { valid: true, dataUrl };
}

function userNeedsRequiredSettings(user) {
  return getMissingRequiredSettings(user).length > 0;
}

function publicUser(user, db = null) {
  const fallbackName = user.name || user.email.split('@')[0];
  const missingRequiredSettings = getMissingRequiredSettings(user);
  return {
    id: user.id,
    firstName: user.firstName || fallbackName,
    middleName: user.middleName || '',
    lastName: user.lastName || '',
    birthday: user.birthday || '',
    gender: user.gender || '',
    profilePictureDataUrl: user.profilePictureDataUrl || '',
    classYear: user.classYear || '',
    major: user.major || '',
    themePreference: normalizeThemePreference(user.themePreference),
    email: user.email,
    university: getUserUniversityDisplay(user),
    universityDomain: user.universityDomain || getEmailDomain(user.email),
    serviceApproved: user.serviceApproved === true,
    waitlisted: user.serviceApproved !== true,
    emailVerified: user.emailVerified !== false,
    nameLastChangedAt: user.nameLastChangedAt || null,
    defaultPaymentMethod: user.defaultPaymentMethod || null,
    payoutInfo: user.payoutInfo || null,
    paymentProvider: getPaymentProviderName(),
    paymentProviderLabel: getProviderDisplayName(getPaymentProviderName()),
    payoutProvider: getPayoutProviderName(),
    payoutProviderLabel: getProviderDisplayName(getPayoutProviderName()),
    termsVersion: user.termsVersion || '',
    privacyVersion: user.privacyVersion || '',
    requiredTermsVersion: REQUIRED_TERMS_VERSION,
    requiredPrivacyVersion: REQUIRED_PRIVACY_VERSION,
    requiresPolicyConsent: userNeedsPolicyConsent(user),
    missingRequiredSettings,
    requiresRequiredSettings: missingRequiredSettings.length > 0,
    rideServicesPaused: RIDE_SERVICES_PAUSED,
    wallet: db ? buildDriverWalletSummary(db, user.id) : null,
  };
}

async function ensureStripeCustomer(db, user) {
  if (!stripe) throw new Error('Stripe is not configured');
  const existingCustomerId = getStripeCustomerId(user);
  if (existingCustomerId) return existingCustomerId;
  const customer = await stripe.customers.create({
    email: user.email,
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || user.email,
    metadata: { linkupUserId: user.id },
  });
  setStripeCustomerId(user, customer.id);
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  return customer.id;
}

function summarizeStripePaymentMethod(paymentMethod, customerId) {
  const card = paymentMethod?.card || {};
  return {
    provider: 'stripe',
    stripeCustomerId: customerId || '',
    stripePaymentMethodId: paymentMethod?.id || '',
    brand: card.brand || 'card',
    last4: card.last4 || '',
    expiry: card.exp_month && card.exp_year ? String(card.exp_month).padStart(2, '0') + '/' + String(card.exp_year).slice(-2) : '',
    billingName: paymentMethod?.billing_details?.name || '',
    billingZip: paymentMethod?.billing_details?.address?.postal_code || '',
    updatedAt: new Date().toISOString(),
  };
}

function summarizeStripeAccount(account) {
  return {
    accountId: account.id,
    detailsSubmitted: account.details_submitted === true,
    payoutsEnabled: account.payouts_enabled === true,
    chargesEnabled: account.charges_enabled === true,
    requirementsDue: Array.isArray(account.requirements?.currently_due) ? account.requirements.currently_due : [],
    updatedAt: new Date().toISOString(),
  };
}

function getPaymentProviderName() {
  return PAYMENT_PROVIDER || 'stripe';
}

function getPayoutProviderName() {
  return PAYOUT_PROVIDER || getPaymentProviderName();
}

function getProviderDisplayName(providerName) {
  if (providerName === 'stripe') return 'Stripe';
  return providerName ? providerName.charAt(0).toUpperCase() + providerName.slice(1) : 'Payment provider';
}

function getPaymentProviderConfig() {
  const provider = getPaymentProviderName();
  return {
    provider,
    providerLabel: getProviderDisplayName(provider),
    publishableKey: provider === 'stripe' ? STRIPE_PUBLISHABLE_KEY : '',
    client: provider === 'stripe' ? 'stripe-js' : '',
  };
}

function requireStripeBackedProvider(providerName, res, purpose = 'payment') {
  if (providerName !== 'stripe') {
    res.status(501).json({ error: getProviderDisplayName(providerName) + ' is not implemented for ' + purpose + ' yet.' });
    return false;
  }
  if (!stripe) {
    res.status(500).json({ error: 'Stripe is not configured on this server. Add STRIPE_SECRET_KEY and restart with updated environment variables.' });
    return false;
  }
  return true;
}

function getPublicStripeErrorMessage(err, fallback) {
  const message = String(err?.raw?.message || err?.message || '').trim();
  if (!message) return fallback;
  return message
    .replace(/sk_(test|live)_[A-Za-z0-9]+/g, 'sk_$1_[hidden]')
    .replace(/rk_(test|live)_[A-Za-z0-9]+/g, 'rk_$1_[hidden]');
}

function ensureProviderProfile(user) {
  user.paymentProviders = user.paymentProviders && typeof user.paymentProviders === 'object' ? user.paymentProviders : {};
  user.payoutProviders = user.payoutProviders && typeof user.payoutProviders === 'object' ? user.payoutProviders : {};
  return user;
}

function getStripeCustomerId(user) {
  return user.paymentProviders?.stripe?.customerId || user.stripeCustomerId || '';
}

function setStripeCustomerId(user, customerId) {
  ensureProviderProfile(user);
  user.stripeCustomerId = customerId;
  user.paymentProviders.stripe = {
    ...(user.paymentProviders.stripe || {}),
    customerId,
    updatedAt: new Date().toISOString(),
  };
}

function getStripeConnectedAccountId(user) {
  return user.payoutProviders?.stripe?.accountId || user.stripeConnectedAccountId || user.payoutInfo?.stripe?.accountId || '';
}

function setStripeConnectedAccount(user, account) {
  const summary = summarizeStripeAccount(account);
  ensureProviderProfile(user);
  user.stripeConnectedAccountId = account.id;
  user.payoutProviders.stripe = summary;
  user.payoutInfo = {
    ...(user.payoutInfo && typeof user.payoutInfo === 'object' ? user.payoutInfo : {}),
    method: user.payoutInfo?.method || 'stripe',
    stripe: summary,
    updatedAt: new Date().toISOString(),
  };
  user.updatedAt = new Date().toISOString();
  return summary;
}

function getCurrentWeekRange(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const daysSinceMonday = (day + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
}

function getDriverPaymentRideIds(payment) {
  const ids = [];
  if (Array.isArray(payment.seats)) {
    payment.seats.forEach((seat) => {
      if (seat?.rideId) ids.push(seat.rideId);
    });
  }
  if (!ids.length && Array.isArray(payment.rideIds)) {
    payment.rideIds.forEach((rideId) => {
      if (rideId) ids.push(rideId);
    });
  }
  return ids;
}

function addWalletAmounts(target, grossCents) {
  const gross = Math.max(0, Number(grossCents || 0));
  const commission = Math.round(gross * LINKUP_COMMISSION_RATE);
  const net = Math.max(0, gross - commission);
  target.grossCents += gross;
  target.commissionCents += commission;
  target.netCents += net;
  return { gross, commission, net };
}

function addWalletLedgerAmounts(target, transaction) {
  const gross = Math.max(0, Number(transaction.grossCents || 0));
  const commission = Math.max(0, Number(transaction.commissionCents || 0));
  const net = Math.max(0, Number(transaction.amountCents || 0));
  target.grossCents += gross;
  target.commissionCents += commission;
  target.netCents += net;
  target.paidSeatCount += 1;
}

function isDriverWalletCredit(transaction) {
  return transaction?.type === 'driver_earning_credit' && transaction.status !== 'void';
}

function isWalletDebit(transaction) {
  return ['wallet_checkout_debit', 'weekly_payout_debit'].includes(transaction?.type)
    && !['void', 'failed'].includes(transaction.status);
}

function isWalletCreditAvailable(db, transaction, now = new Date()) {
  if (!isDriverWalletCredit(transaction)) return false;
  const ride = (db.rides || []).find((entry) => entry.id === transaction.rideId);
  if (ride) return hasTripEnded(ride);
  const availableAtMs = new Date(transaction.availableAt || transaction.createdAt || 0).getTime();
  return Number.isFinite(availableAtMs) && availableAtMs <= now.getTime();
}

function getWalletAvailableCents(db, userId) {
  const transactions = asArray(db.walletTransactions);
  const credits = transactions
    .filter((transaction) => transaction.userId === userId && isWalletCreditAvailable(db, transaction))
    .reduce((sum, transaction) => sum + Math.max(0, Number(transaction.amountCents || 0)), 0);
  const debits = transactions
    .filter((transaction) => transaction.userId === userId && isWalletDebit(transaction))
    .reduce((sum, transaction) => sum + Math.max(0, Number(transaction.amountCents || 0)), 0);
  return Math.max(0, credits - debits);
}

function getCheckoutWalletCreditCents(db, userId, expectedAmountCents) {
  const expected = Math.max(0, Number(expectedAmountCents || 0));
  const available = getWalletAvailableCents(db, userId);
  if (!expected || !available) return 0;
  if (available >= expected) return expected;
  const remainingAfterWallet = expected - available;
  if (remainingAfterWallet > 0 && remainingAfterWallet < 50) {
    return Math.max(0, expected - 50);
  }
  return Math.min(available, expected);
}

function addWalletCheckoutDebit(db, student, checkoutSession) {
  const amountCents = Math.max(0, Number(checkoutSession.walletCreditCents || 0));
  if (!amountCents || !student) return;
  db.walletTransactions = db.walletTransactions || [];
  const sourceCheckoutSessionId = checkoutSession.id || checkoutSession.providerPaymentId || checkoutSession.stripePaymentIntentId;
  const exists = db.walletTransactions.some((transaction) => transaction.type === 'wallet_checkout_debit'
    && transaction.userId === student.id
    && transaction.sourceCheckoutSessionId === sourceCheckoutSessionId);
  if (exists) return;
  db.walletTransactions.push({
    id: uuidv4(),
    userId: student.id,
    type: 'wallet_checkout_debit',
    amountCents,
    currency: checkoutSession.stripeCurrency || 'usd',
    sourceCheckoutSessionId,
    sourcePaymentId: checkoutSession.providerPaymentId || checkoutSession.stripePaymentIntentId || '',
    note: 'Applied LinkUp wallet credit to checkout',
    status: 'posted',
    createdAt: checkoutSession.completedAt || new Date().toISOString(),
  });
}

function addDriverWalletCreditsForReservation(db, checkoutSession, reservation, paymentRecord) {
  db.walletTransactions = db.walletTransactions || [];
  const sourcePaymentId = paymentRecord?.id || checkoutSession.providerPaymentId || checkoutSession.id;
  reservation.ridesToReserve.forEach(({ ride }) => {
    if (!ride?.driverId) return;
    const grossCents = Math.max(0, Number(ride.priceCents || 0));
    if (!grossCents) return;
    const commissionCents = Math.round(grossCents * LINKUP_COMMISSION_RATE);
    const amountCents = Math.max(0, grossCents - commissionCents);
    const exists = db.walletTransactions.some((transaction) => transaction.type === 'driver_earning_credit'
      && transaction.userId === ride.driverId
      && transaction.rideId === ride.id
      && transaction.sourcePaymentId === sourcePaymentId);
    if (exists) return;
    db.walletTransactions.push({
      id: uuidv4(),
      userId: ride.driverId,
      type: 'driver_earning_credit',
      amountCents,
      grossCents,
      commissionCents,
      commissionRate: LINKUP_COMMISSION_RATE,
      currency: checkoutSession.stripeCurrency || 'usd',
      rideId: ride.id,
      riderId: checkoutSession.studentId || paymentRecord?.studentId || '',
      sourceCheckoutSessionId: checkoutSession.id || '',
      sourcePaymentId,
      availableAt: new Date(getTripInterval(ride).end).toISOString(),
      status: 'earned',
      createdAt: checkoutSession.completedAt || new Date().toISOString(),
    });
  });
}

async function createWeeklyStripePayouts(db, userIds = []) {
  if (!stripe) throw new Error('Stripe is not configured');
  const provider = getPayoutProviderName();
  if (provider !== 'stripe') throw new Error(getProviderDisplayName(provider) + ' payouts are not implemented yet.');
  const allowedUserIds = new Set(asArray(userIds).map((userId) => String(userId || '').trim()).filter(Boolean));
  const users = asArray(db.users).filter((user) => !allowedUserIds.size || allowedUserIds.has(user.id));
  const runId = uuidv4();
  const startedAt = new Date().toISOString();
  const payouts = [];
  db.walletTransactions = db.walletTransactions || [];
  for (const user of users) {
    const amountCents = getWalletAvailableCents(db, user.id);
    if (!amountCents) continue;
    const accountId = getStripeConnectedAccountId(user);
    if (!accountId) {
      payouts.push({ userId: user.id, email: user.email, amountCents, status: 'skipped', error: 'Driver has not connected Stripe payouts.' });
      continue;
    }
    const payoutId = uuidv4();
    const transaction = {
      id: payoutId,
      userId: user.id,
      type: 'weekly_payout_debit',
      amountCents,
      currency: 'usd',
      provider: 'stripe',
      destinationAccountId: accountId,
      payoutRunId: runId,
      status: 'processing',
      note: 'Weekly driver payout',
      createdAt: startedAt,
    };
    db.walletTransactions.push(transaction);
    saveDb(db);

    try {
      const account = await stripe.accounts.retrieve(accountId);
      setStripeConnectedAccount(user, account);
      if (account.payouts_enabled !== true) {
        transaction.status = 'failed';
        transaction.failureReason = 'Stripe payout account is not ready for payouts.';
        transaction.failedAt = new Date().toISOString();
        payouts.push({ id: payoutId, userId: user.id, email: user.email, amountCents, status: 'failed', error: transaction.failureReason });
        saveDb(db);
        continue;
      }

      const transfer = await stripe.transfers.create({
        amount: amountCents,
        currency: 'usd',
        destination: accountId,
        description: 'LinkUp weekly driver payout',
        metadata: {
          linkupPayoutId: payoutId,
          linkupPayoutRunId: runId,
          linkupUserId: user.id,
          purpose: 'weekly_driver_payout',
        },
      }, {
        idempotencyKey: `linkup-weekly-payout-${payoutId}`,
      });

      transaction.status = 'posted';
      transaction.providerTransferId = transfer.id;
      transaction.postedAt = new Date().toISOString();
      payouts.push({ id: payoutId, userId: user.id, email: user.email, amountCents, status: 'posted', stripeTransferId: transfer.id });
      saveDb(db);
    } catch (err) {
      transaction.status = 'failed';
      transaction.failureReason = err.message || 'Stripe transfer failed.';
      transaction.failedAt = new Date().toISOString();
      payouts.push({ id: payoutId, userId: user.id, email: user.email, amountCents, status: 'failed', error: transaction.failureReason });
      saveDb(db);
    }
  }
  return payouts;
}

function buildDriverWalletSummary(db, driverId) {
  const now = new Date();
  const weekRange = getCurrentWeekRange(now);
  const ridesById = new Map((db.rides || []).map((ride) => [ride.id, ride]));
  const transactions = asArray(db.walletTransactions).filter((transaction) => transaction.userId === driverId);
  const ledgerCredits = transactions.filter(isDriverWalletCredit);
  const ledgerDebits = transactions.filter(isWalletDebit);
  const summary = {
    payoutCadence: 'weekly',
    commissionRate: LINKUP_COMMISSION_RATE,
    weekStart: weekRange.start.toISOString(),
    weekEnd: weekRange.end.toISOString(),
    availableCents: getWalletAvailableCents(db, driverId),
    payoutScheduledCents: getWalletAvailableCents(db, driverId),
    spentFromWalletCents: ledgerDebits
      .filter((transaction) => transaction.type === 'wallet_checkout_debit')
      .reduce((sum, transaction) => sum + Math.max(0, Number(transaction.amountCents || 0)), 0),
    paidOutCents: ledgerDebits
      .filter((transaction) => transaction.type === 'weekly_payout_debit')
      .reduce((sum, transaction) => sum + Math.max(0, Number(transaction.amountCents || 0)), 0),
    thisWeek: { grossCents: 0, commissionCents: 0, netCents: 0, paidSeatCount: 0 },
    readyForPayout: { grossCents: 0, commissionCents: 0, netCents: 0, paidSeatCount: 0 },
    pendingRideCompletion: { grossCents: 0, commissionCents: 0, netCents: 0, paidSeatCount: 0 },
    allTime: { grossCents: 0, commissionCents: 0, netCents: 0, paidSeatCount: 0 },
  };

  if (ledgerCredits.length) {
    ledgerCredits.forEach((transaction) => {
      const createdAtMs = new Date(transaction.createdAt || 0).getTime();
      const createdThisWeek = Number.isFinite(createdAtMs)
        && createdAtMs >= weekRange.start.getTime()
        && createdAtMs < weekRange.end.getTime();
      addWalletLedgerAmounts(summary.allTime, transaction);
      if (createdThisWeek) addWalletLedgerAmounts(summary.thisWeek, transaction);
      const payoutBucket = isWalletCreditAvailable(db, transaction, now)
        ? summary.readyForPayout
        : summary.pendingRideCompletion;
      addWalletLedgerAmounts(payoutBucket, transaction);
    });
    return summary;
  }

  (db.payments || [])
    .filter((payment) => payment.status === 'paid')
    .forEach((payment) => {
      const paidAtMs = new Date(payment.createdAt || 0).getTime();
      const paidThisWeek = Number.isFinite(paidAtMs)
        && paidAtMs >= weekRange.start.getTime()
        && paidAtMs < weekRange.end.getTime();
      getDriverPaymentRideIds(payment).forEach((rideId) => {
        const ride = ridesById.get(rideId);
        if (!ride || ride.driverId !== driverId) return;
        const grossCents = Number(ride.priceCents || 0);
        if (!grossCents) return;
        addWalletAmounts(summary.allTime, grossCents);
        summary.allTime.paidSeatCount += 1;
        if (paidThisWeek) {
          addWalletAmounts(summary.thisWeek, grossCents);
          summary.thisWeek.paidSeatCount += 1;
        }
        if (paidThisWeek) {
          const payoutBucket = hasTripEnded(ride) ? summary.readyForPayout : summary.pendingRideCompletion;
          addWalletAmounts(payoutBucket, grossCents);
          payoutBucket.paidSeatCount += 1;
        }
      });
    });

  return summary;
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function validatePassword(password) {
  const hasMinimumLength = String(password || '').length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasMinimumLength) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!hasUppercase) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!hasLowercase) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!hasNumber) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  if (!hasSpecialChar) {
    return { valid: false, error: 'Password must contain at least one special character (!@#$%^&*...)' };
  }
  
  return { valid: true };
}

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

function requireServiceAccess(req, res, next) {
  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.serviceApproved !== true) {
    return res.status(403).json({ error: 'LinkUp has not launched at your university yet. Your account is on the waitlist, and we will notify you when access opens.' });
  }
  if (userNeedsPolicyConsent(user)) {
    return res.status(403).json({
      error: 'Please review and agree to the latest Terms and Conditions and Privacy Notice in your profile before using LinkUp services.',
      code: 'POLICY_CONSENT_REQUIRED',
      requiredTermsVersion: REQUIRED_TERMS_VERSION,
      requiredPrivacyVersion: REQUIRED_PRIVACY_VERSION,
    });
  }
  const missingRequiredSettings = getMissingRequiredSettings(user);
  if (missingRequiredSettings.length) {
    return res.status(403).json({
      error: 'Please complete your required profile settings before using LinkUp ride services: ' + missingRequiredSettings.map((setting) => setting.label).join(', ') + '.',
      code: 'REQUIRED_SETTINGS_INCOMPLETE',
      missingRequiredSettings,
    });
  }
  next();
}

function requireRideServicesOpen(req, res, next) {
  if (RIDE_SERVICES_PAUSED) {
    return res.status(503).json({
      error: 'LinkUp ride services are temporarily paused while we finish payment and payout setup. Your account and profile are still available.',
      code: 'RIDE_SERVICES_PAUSED',
    });
  }
  next();
}

app.use(['/api/rides', '/api/ride-requests', '/api/cart', '/api/reports', '/api/trips/track'], requireRideServicesOpen);

function normalizeVehicleSeatCount(value) {
  const seatCount = Number(value);
  return VEHICLE_SEAT_LAYOUTS[seatCount] ? seatCount : 5;
}

function inferVehicleSeatCount(ride) {
  if (ride.vehicleSeatCount) return normalizeVehicleSeatCount(ride.vehicleSeatCount);
  const ids = new Set([...(ride.availableSeatIds || []), ...(ride.passengers || []).map((passenger) => passenger.seatId).filter(Boolean)]);
  if (ids.has('third_left') || ids.has('third_right')) return ids.has('back_middle') ? 7 : 6;
  if (ids.has('back_middle')) return 5;
  if (ids.has('back_left') || ids.has('back_right')) return 4;
  return 2;
}

function getVehicleSeatIds(vehicleSeatCount) {
  return VEHICLE_SEAT_LAYOUTS[normalizeVehicleSeatCount(vehicleSeatCount)];
}

function normalizeSeatIds(seatIds, vehicleSeatCount = 7) {
  const validSeatIds = new Set(getVehicleSeatIds(vehicleSeatCount));
  return [...new Set((Array.isArray(seatIds) ? seatIds : [])
    .map((seatId) => String(seatId || '').trim())
    .filter((seatId) => validSeatIds.has(seatId)))];
}

function getRideReservedSeatIds(ride) {
  return new Set((ride.passengers || []).map((passenger) => passenger.seatId).filter(Boolean));
}

function getRideSeatMap(ride) {
  if (ride.seatingChartUnavailable) return [];
  const vehicleSeatCount = inferVehicleSeatCount(ride);
  const layoutSeatIds = getVehicleSeatIds(vehicleSeatCount);
  const fallbackSeats = layoutSeatIds.slice(0, Number(ride.seatsAvailable || 0));
  const availableSeatIds = normalizeSeatIds(ride.availableSeatIds?.length ? ride.availableSeatIds : fallbackSeats, vehicleSeatCount);
  const reservedSeatIds = getRideReservedSeatIds(ride);
  return CAR_SEATS
    .filter((seat) => layoutSeatIds.includes(seat.id))
    .map((seat) => ({
      ...seat,
      available: availableSeatIds.includes(seat.id),
      reserved: reservedSeatIds.has(seat.id),
    }));
}

function getAvailableOpenSeatIds(ride) {
  if (ride?.seatingChartUnavailable) {
    const totalSeats = Number(ride.sharedSeatCapacity || ride.seatsAvailable || 0);
    const takenSeats = (ride.passengers || []).length;
    return Array.from({ length: Math.max(0, totalSeats - takenSeats) }, (_, index) => 'shared_spot_' + (index + 1));
  }
  return getRideSeatMap(ride).filter((seat) => seat.available && !seat.reserved).map((seat) => seat.id);
}

function sanitizeRiderStop(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 180);
}

function rideAllowsCustomPickup(ride) {
  return ride?.rideProviderType === 'personal_car' && Number(ride?.pickupRadiusMiles || 0) > 0;
}

function rideAllowsCustomDropoff(ride) {
  return ride?.rideProviderType === 'personal_car' && Number(ride?.dropoffRadiusMiles || 0) > 0;
}

function validateRiderStopsForRide(ride, actualPickup = '', actualDropoff = '') {
  if (rideAllowsCustomPickup(ride) && !sanitizeRiderStop(actualPickup)) {
    return 'Enter your actual pickup spot for this ride';
  }
  if (rideAllowsCustomDropoff(ride) && !sanitizeRiderStop(actualDropoff)) {
    return 'Enter your actual drop-off spot for this ride';
  }
  return '';
}

function normalizeCartEntries(db, userId) {
  db.carts = db.carts || {};
  const rawCart = db.carts[userId] || [];
  const entries = rawCart.map((entry) => {
    if (typeof entry === 'string') return { rideId: entry, seatId: '', actualPickup: '', actualDropoff: '', termsAcceptedAt: '' };
    return {
      rideId: entry.rideId,
      seatId: entry.seatId || '',
      actualPickup: sanitizeRiderStop(entry.actualPickup),
      actualDropoff: sanitizeRiderStop(entry.actualDropoff),
      termsAcceptedAt: entry.termsAcceptedAt || '',
    };
  }).filter((entry) => entry.rideId);
  db.carts[userId] = entries;
  return entries;
}

function hasTripStartPassed(trip) {
  if (!trip) return false;
  const start = getTripStartMs(trip);
  return Boolean(start && start <= Date.now());
}

function cleanCartEntries(db, userId) {
  const cartEntries = normalizeCartEntries(db, userId);
  const cleanedEntries = cartEntries.filter((entry) => {
    const ride = db.rides.find((item) => item.id === entry.rideId);
    return ride && !hasTripStartPassed(ride) && isRideVisibleToUser(db, ride, userId);
  });
  db.carts[userId] = cleanedEntries;
  return cleanedEntries;
}

function cleanCartEntriesWithMeta(db, userId) {
  const cartEntries = normalizeCartEntries(db, userId);
  let expiredRideCount = 0;
  const cleanedEntries = cartEntries.filter((entry) => {
    const ride = db.rides.find((item) => item.id === entry.rideId);
    if (ride && hasTripStartPassed(ride)) expiredRideCount += 1;
    return ride && !hasTripStartPassed(ride) && isRideVisibleToUser(db, ride, userId);
  });
  db.carts[userId] = cleanedEntries;
  return { entries: cleanedEntries, expiredRideCount };
}

function getCartRideIds(db, userId) {
  return cleanCartEntries(db, userId).map((entry) => entry.rideId);
}

function getTrackingTrips(db) {
  db.trackingTrips = db.trackingTrips || [];
  return db.trackingTrips;
}

function isTrackingTripExpired(trip) {
  return Boolean(trip?.viewerAccessExpiresAt && Number(trip.viewerAccessExpiresAt) <= Date.now());
}

function expireTrackingTrip(trip) {
  if (!trip || trip.status !== 'active') return false;
  if (!isTrackingTripExpired(trip)) return false;
  trip.status = 'expired';
  trip.stoppedAt = trip.stoppedAt || new Date().toISOString();
  trip.updatedAt = trip.stoppedAt;
  return true;
}

function publicTrackingTrip(trip) {
  return {
    id: trip.id,
    ownerFirstName: trip.ownerFirstName,
    trustedEmail: trip.trustedEmail,
    viewerAccessExpiresAt: trip.viewerAccessExpiresAt || null,
    status: trip.status,
    rideId: trip.rideId || '',
    rideRoute: trip.rideRoute || null,
    lastLocation: trip.lastLocation || null,
    locations: (trip.locations || []).slice(-20),
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
    stoppedAt: trip.stoppedAt || null,
  };
}

function getTrackingRideRoute(ride) {
  if (!ride) return null;
  const originLat = Number(ride.originLat);
  const originLng = Number(ride.originLng);
  const destinationLat = Number(ride.destinationLat);
  const destinationLng = Number(ride.destinationLng);
  if (![originLat, originLng, destinationLat, destinationLng].every(Number.isFinite)) return null;
  return {
    origin: ride.origin || 'Pick-up',
    destination: ride.destination || 'Drop-off',
    originLat,
    originLng,
    destinationLat,
    destinationLng,
    date: ride.date || '',
    time: ride.time || '',
  };
}

function isRideTrackableForUser(ride, userId) {
  return ride.driverId === userId || (ride.passengers || []).some((passenger) => passenger.studentId === userId);
}

function findTrackableRideForUser(db, userId) {
  const now = Date.now();
  return (db.rides || [])
    .filter((ride) => isRideTrackableForUser(ride, userId))
    .map((ride) => ({ ride, interval: getTripInterval(ride) }))
    .filter((entry) => entry.interval.end >= now - 30 * 60 * 1000)
    .sort((a, b) => {
      const aActive = a.interval.start <= now && a.interval.end >= now;
      const bActive = b.interval.start <= now && b.interval.end >= now;
      if (aActive !== bActive) return aActive ? -1 : 1;
      return Math.abs(a.interval.start - now) - Math.abs(b.interval.start - now);
    })[0]?.ride || null;
}

function refreshTrackingTripRoute(db, trip) {
  if (!trip || trip.rideRoute) return false;
  const ride = trip.rideId
    ? (db.rides || []).find((entry) => entry.id === trip.rideId && isRideTrackableForUser(entry, trip.ownerId))
    : findTrackableRideForUser(db, trip.ownerId);
  const route = getTrackingRideRoute(ride);
  if (!route) return false;
  trip.rideId = ride.id;
  trip.rideRoute = route;
  return true;
}

function canStudentReserveRide(student, ride, seatId = '', db = null) {
  if (!ride) {
    return 'Ride not found';
  }
  if (hasTripStartPassed(ride)) {
    return 'This ride has already departed';
  }
  if (ride.driverId === student.id) {
    return 'You cannot reserve your own ride';
  }
  if (db && areUsersBlocked(db, student.id, ride.driverId)) {
    return 'You cannot reserve rides from a blocked user';
  }
  if (ride.sameGenderOnly && !canMatchSameGender(student.gender, ride.driverGender)) {
    return 'This ride is limited to same-gender riders';
  }
  if (ride.sameSchoolOnly && !isSameSchoolUser(student, ride.university)) {
    return 'This ride is limited to riders from the driver\'s school';
  }
  if ((ride.passengers || []).some((p) => p.studentId === student.id)) {
    return 'You have already joined this ride';
  }
  if (db) {
    const conflict = findUserScheduleConflict(db, student.id, ride, { excludeRideId: ride.id });
    if (conflict) return 'This ride overlaps with another ride you are already driving, riding, or requesting: ' + describeTripTime(conflict);
  }
  const openSeatIds = getAvailableOpenSeatIds(ride);
  if (!openSeatIds.length) {
    return 'No seats available';
  }
  if (ride.seatingChartUnavailable) {
    return null;
  }
  if (!seatId) {
    return 'Please select a seat';
  }
  if (!openSeatIds.includes(seatId)) {
    return 'That seat is no longer available';
  }
  return null;
}

// Sign up endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { firstName, middleName, lastName, birthday, email, password } = req.body;
  const gender = normalizeGender(req.body.gender);
  if (!firstName || !lastName || !birthday || !gender || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (req.body.termsAccepted !== true || req.body.privacyAccepted !== true) {
    return res.status(400).json({ error: 'You must agree to the Terms and Conditions and Privacy Notice before creating an account' });
  }

  const normalizedEmail = normalizeEmail(email);
  if (!isUniversityEmail(normalizedEmail)) {
    return res.status(400).json({ error: 'Please use a valid university email address' });
  }
  const universityDomain = getEmailDomain(normalizedEmail);
  const supportedUniversity = extractUniversityFromEmail(normalizedEmail);
  const serviceApproved = Boolean(supportedUniversity);
  const university = supportedUniversity || getUniversityInfoFromDomain(universityDomain).name;

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.error });
  }

  const db = normalizeUserAccess(loadDb());
  const existingUser = db.users.find((u) => u.email === normalizedEmail);
  if (existingUser) {
    return res.status(400).json({ error: 'This email is already associated with an account' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    firstName,
    middleName: middleName || '',
    lastName,
    birthday,
    gender,
    email: normalizedEmail,
    university,
    universityDomain,
    serviceApproved,
    waitlistedAt: serviceApproved ? null : new Date().toISOString(),
    passwordHash: hashedPassword,
    emailVerified: false,
    themePreference: 'dark',
    termsAcceptedAt: new Date().toISOString(),
    privacyAcceptedAt: new Date().toISOString(),
    termsVersion: REQUIRED_TERMS_VERSION,
    privacyVersion: REQUIRED_PRIVACY_VERSION,
    policyAcceptedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (BYPASS_EMAIL_VERIFICATION) {
    user.emailVerified = true;
    db.users.push(user);
    saveDb(db);
    req.session.userId = user.id;
    return res.json({
      message: 'Account created and verified for local testing.',
      email: user.email,
      requiresVerification: false,
      user: publicUser(user, db),
    });
  }

  const verificationCode = setEmailVerificationCode(user);
  db.users.push(user);
  saveDb(db);
  sendVerificationCode(user, verificationCode);

  res.json({
    message: 'Account created. We sent a 6-digit verification code to your email.',
    email: user.email,
    requiresVerification: true,
  });
});

app.post('/api/auth/verify-email', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and verification code are required' });
  }

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.email === normalizeEmail(email));
  if (!user) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }
  if (user.emailVerified === true) {
    req.session.userId = user.id;
    return res.json(publicUser(user, db));
  }
  if (BYPASS_EMAIL_VERIFICATION && String(code).trim() === '000000') {
    user.emailVerified = true;
    delete user.emailVerificationCodeHash;
    delete user.emailVerificationCodeExpiresAt;
    saveDb(db);
    req.session.userId = user.id;
    return res.json(publicUser(user, db));
  }
  if (!user.emailVerificationCodeHash || user.emailVerificationCodeExpiresAt <= Date.now()) {
    return res.status(400).json({ error: 'Verification code expired. Request a new code.' });
  }
  if (hashToken(String(code).trim()) !== user.emailVerificationCodeHash) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  user.emailVerified = true;
  delete user.emailVerificationCodeHash;
  delete user.emailVerificationCodeExpiresAt;
  saveDb(db);

  req.session.userId = user.id;
  res.json(publicUser(user, db));
});

app.post('/api/auth/resend-verification', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.email === normalizeEmail(email));
  if (!user) {
    return res.json({ message: 'If an unverified account exists for that email, we sent a new code.' });
  }
  if (user.emailVerified === true) {
    return res.json({ message: 'This email is already verified. Please sign in.' });
  }

  const verificationCode = setEmailVerificationCode(user);
  saveDb(db);
  sendVerificationCode(user, verificationCode);
  res.json({ message: 'We sent a new 6-digit verification code to your email.' });
});
// Sign in endpoint
app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.email === normalizeEmail(email));
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.emailVerified === false) {
    return res.status(403).json({ error: 'Please verify your email before signing in' });
  }

  req.session.userId = user.id;
  res.json(publicUser(user, db));
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const db = loadDb();
  const normalizedEmail = normalizeEmail(email);
  const user = db.users.find((u) => u.email === normalizedEmail);
  let previewResetUrl;

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    const resetUrl = `${APP_BASE_URL}/?resetToken=${token}`;
    const expiresAt = Date.now() + 1000 * 60 * 60;

    db.passwordResetTokens = (db.passwordResetTokens || []).filter(
      (entry) => entry.userId !== user.id && entry.expiresAt > Date.now()
    );
    db.passwordResetTokens.push({
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt,
      createdAt: new Date().toISOString(),
    });
    saveDb(db);

    sendAuthEmail(
      user.email,
      'Reset your LinkUp password',
      `Hi ${user.firstName},\n\nUse this link to reset your LinkUp password. It expires in 1 hour:\n${resetUrl}\n\n- LinkUp`
    );

    if (NODE_ENV !== 'production') {
      previewResetUrl = resetUrl;
    }
  }

  res.json({
    message: 'If an account exists for that email, we sent password reset instructions.',
    previewResetUrl,
  });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Reset token and new password are required' });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.error });
  }

  const db = loadDb();
  const tokenHash = hashToken(token);
  const resetTokens = db.passwordResetTokens || [];
  const resetEntry = resetTokens.find((entry) => entry.tokenHash === tokenHash);

  if (!resetEntry || resetEntry.expiresAt <= Date.now()) {
    return res.status(400).json({ error: 'Reset link is invalid or expired' });
  }

  const user = db.users.find((u) => u.id === resetEntry.userId);
  if (!user) {
    return res.status(400).json({ error: 'Reset link is invalid or expired' });
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  db.passwordResetTokens = resetTokens.filter((entry) => entry.tokenHash !== tokenHash);
  saveDb(db);

  res.json({ message: 'Password reset successful. You can sign in now.' });
});
// Get current user
app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(publicUser(user, db));
});

app.put('/api/profile', requireAuth, (req, res) => {
  const firstName = String(req.body.firstName || '').trim();
  const middleName = String(req.body.middleName || '').trim();
  const lastName = String(req.body.lastName || '').trim();
  const classYear = String(req.body.classYear || '').trim();
  const major = String(req.body.major || '').trim();
  const profilePictureValidation = validateProfilePictureDataUrl(req.body.profilePictureDataUrl);
  if (!profilePictureValidation.valid) {
    return res.status(400).json({ error: profilePictureValidation.error });
  }

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }
  if (classYear && (!/^\d{4}$/.test(classYear) || Number(classYear) < 1900 || Number(classYear) > 2100)) {
    return res.status(400).json({ error: 'Class year must be a valid 4-digit year' });
  }
  if (major.length > 80) {
    return res.status(400).json({ error: 'Major must be 80 characters or fewer' });
  }

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const requestedBirthday = req.body.birthday === undefined ? user.birthday || '' : String(req.body.birthday || '').trim();
  const requestedGender = req.body.gender === undefined ? user.gender || '' : normalizeGender(req.body.gender);
  const requestedEmail = req.body.email === undefined ? user.email : normalizeEmail(req.body.email);

  if (requestedEmail !== user.email) {
    return res.status(400).json({ error: 'Birthday, gender, and university email cannot be changed in profile settings' });
  }
  if (user.birthday && requestedBirthday !== user.birthday) {
    return res.status(400).json({ error: 'Birthday cannot be changed in profile settings' });
  }
  if (user.gender && requestedGender !== user.gender) {
    return res.status(400).json({ error: 'Gender cannot be changed in profile settings' });
  }
  if (!requestedBirthday) {
    return res.status(400).json({ error: 'Birthday is required' });
  }
  if (!requestedGender) {
    return res.status(400).json({ error: 'Gender is required' });
  }

  const nameChanged = firstName !== (user.firstName || '') || middleName !== (user.middleName || '') || lastName !== (user.lastName || '');
  if (nameChanged && user.nameLastChangedAt) {
    const nextAllowedAt = addMonths(new Date(user.nameLastChangedAt), 6);
    if (Date.now() < nextAllowedAt.getTime()) {
      return res.status(400).json({ error: 'You can change your name again on ' + nextAllowedAt.toLocaleDateString('en-US') });
    }
  }

  if (nameChanged) {
    user.firstName = firstName;
    user.middleName = middleName;
    user.lastName = lastName;
    user.nameLastChangedAt = new Date().toISOString();
  }
  if (!user.birthday) user.birthday = requestedBirthday;
  if (!user.gender) user.gender = requestedGender;
  if (profilePictureValidation.dataUrl !== undefined) {
    user.profilePictureDataUrl = profilePictureValidation.dataUrl;
  }
  user.classYear = classYear;
  user.major = major;
  user.themePreference = normalizeThemePreference(req.body.themePreference ?? user.themePreference);
  user.updatedAt = new Date().toISOString();

  (db.rides || []).forEach((ride) => {
    if (ride.driverId === user.id) {
      ride.driverFirstName = user.firstName;
      ride.driverLastName = user.lastName;
    }
    (ride.passengers || []).forEach((passenger) => {
      if (passenger.studentId === user.id) {
        passenger.studentFirstName = user.firstName;
        passenger.studentLastName = user.lastName;
      }
    });
  });

  (db.rideRequests || []).forEach((request) => {
    if (request.riderId === user.id) {
      request.riderFirstName = user.firstName;
      request.riderLastName = user.lastName;
    }
    (request.driverOffers || []).forEach((offer) => {
      if (offer.driverId === user.id) {
        offer.driverFirstName = user.firstName;
        offer.driverLastName = user.lastName;
      }
    });
  });

  (db.trackingTrips || []).forEach((trip) => {
    if (trip.ownerId === user.id) {
      trip.ownerFirstName = user.firstName;
    }
  });

  saveDb(db);
  res.json(publicUser(user, db));
});

app.put('/api/profile/preferences', requireAuth, (req, res) => {
  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  user.themePreference = normalizeThemePreference(req.body.themePreference);
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json(publicUser(user, db));
});

app.put('/api/profile/policies', requireAuth, (req, res) => {
  if (req.body.termsAccepted !== true || req.body.privacyAccepted !== true) {
    return res.status(400).json({ error: 'You must agree to the latest Terms and Conditions and Privacy Notice' });
  }

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const now = new Date().toISOString();
  user.termsAcceptedAt = now;
  user.privacyAcceptedAt = now;
  user.policyAcceptedAt = now;
  user.termsVersion = REQUIRED_TERMS_VERSION;
  user.privacyVersion = REQUIRED_PRIVACY_VERSION;
  user.updatedAt = now;

  saveDb(db);
  res.json(publicUser(user, db));
});

app.post('/api/profile/payment-method/setup-session', requireAuth, async (req, res) => {
  const provider = getPaymentProviderName();
  if (!requireStripeBackedProvider(provider, res, 'payment method setup')) return;
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  try {
    const customerId = await ensureStripeCustomer(db, user);
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: { linkupUserId: user.id, purpose: 'default_payment_method', paymentProvider: provider },
    });
    res.json({ provider, clientSecret: setupIntent.client_secret, setupIntentId: setupIntent.id });
  } catch (err) {
    console.error('Stripe payment method setup error:', err);
    res.status(502).json({ error: 'Unable to start Stripe payment setup. Please try again.' });
  }
});

app.post('/api/profile/payment-method/complete-setup', requireAuth, async (req, res) => {
  const provider = getPaymentProviderName();
  if (!requireStripeBackedProvider(provider, res, 'payment method verification')) return;
  const setupIntentId = String(req.body.setupIntentId || req.body.sessionId || '').trim();
  if (!setupIntentId) {
    return res.status(400).json({ error: 'Stripe setup intent is required' });
  }
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  try {
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId, { expand: ['payment_method'] });
    const customerId = typeof setupIntent.customer === 'string' ? setupIntent.customer : setupIntent.customer?.id || '';
    if (setupIntent.status !== 'succeeded' || customerId !== getStripeCustomerId(user)) {
      return res.status(400).json({ error: 'Stripe payment setup did not match this account.' });
    }
    const paymentMethod = setupIntent.payment_method;
    if (!paymentMethod || typeof paymentMethod === 'string' || paymentMethod.type !== 'card') {
      return res.status(400).json({ error: 'Only card payment methods can be saved right now.' });
    }
    await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethod.id } });
    user.defaultPaymentMethod = {
      ...summarizeStripePaymentMethod(paymentMethod, customerId),
      provider,
      providerLabel: getProviderDisplayName(provider),
    };
    user.updatedAt = new Date().toISOString();
    saveDb(db);
    res.json(publicUser(user, db));
  } catch (err) {
    console.error('Stripe payment setup verification error:', err);
    res.status(502).json({ error: 'Unable to verify the saved payment method. Please try again.' });
  }
});

app.put('/api/profile/payout', requireAuth, requireServiceAccess, (req, res) => {
  const method = String(req.body.method || '').trim();
  const allowedMethods = new Set(['zelle', 'venmo', 'paypal', 'stripe', 'check', 'other']);
  const legalName = String(req.body.legalName || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const phone = String(req.body.phone || '').trim();
  const handle = String(req.body.handle || '').trim();
  const address = String(req.body.address || '').trim();
  const notes = String(req.body.notes || '').trim();
  const payoutFreeText = [legalName, email, handle, address, notes].join(' ');

  if (!legalName) {
    return res.status(400).json({ error: 'Legal payout name is required' });
  }
  if (!allowedMethods.has(method)) {
    return res.status(400).json({ error: 'Choose a valid payout method' });
  }
  if (!email && !phone && !handle && !address) {
    return res.status(400).json({ error: 'Add at least one payout contact: email, phone, handle, or mailing address' });
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Enter a valid payout email' });
  }
  if (containsProhibitedFinancialData(payoutFreeText)) {
    return res.status(400).json({ error: 'Do not enter bank account, routing, card, CVV, SSN, IBAN, or similar financial account numbers in payout fields. Use Stripe payouts for bank details.' });
  }
  if (!req.body.confirmed) {
    return res.status(400).json({ error: 'Confirm that the payout information is accurate' });
  }

  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.payoutInfo = {
    ...(user.payoutInfo && typeof user.payoutInfo === 'object' ? user.payoutInfo : {}),
    legalName: legalName.slice(0, 120),
    method,
    email: email.slice(0, 160),
    phone: phone.slice(0, 40),
    handle: handle.slice(0, 80),
    address: address.slice(0, 220),
    notes: notes.slice(0, 300),
    commissionRate: LINKUP_COMMISSION_RATE,
    confirmedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  user.updatedAt = new Date().toISOString();

  saveDb(db);
  res.json(publicUser(user, db));
});

async function startPayoutOnboarding(req, res) {
  const provider = getPayoutProviderName();
  if (!requireStripeBackedProvider(provider, res, 'payout onboarding')) return;
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  try {
    let accountId = getStripeConnectedAccountId(user);
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: user.email,
        business_type: 'individual',
        business_profile: {
          name: 'LinkUp driver payouts',
          product_description: 'Peer-to-peer student ride cost-sharing payouts',
        },
        capabilities: {
          transfers: { requested: true },
        },
        metadata: { linkupUserId: user.id },
      });
      accountId = account.id;
      setStripeConnectedAccount(user, account);
      saveDb(db);
    }
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: APP_BASE_URL + '/?connect=payout&status=refresh',
      return_url: APP_BASE_URL + '/?connect=payout&status=return',
      type: 'account_onboarding',
    });
    if (req.method === 'GET') {
      return res.redirect(303, accountLink.url);
    }
    res.json({ provider, url: accountLink.url });
  } catch (err) {
    console.error('Stripe Connect onboarding error:', err);
    const message = getPublicStripeErrorMessage(err, 'Unable to start Stripe payout onboarding. Please try again.');
    if (req.method === 'GET') {
      return res.status(502).send(`<!doctype html><html><head><title>Stripe onboarding error</title><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body style="font-family:Arial,sans-serif;padding:32px;line-height:1.5;"><h1>Unable to open Stripe onboarding</h1><p>${escapeHtml(message)}</p><p>You can close this tab and return to LinkUp.</p></body></html>`);
    }
    res.status(502).json({ error: message });
  }
}

async function refreshPayoutStatus(req, res) {
  const provider = getPayoutProviderName();
  if (!requireStripeBackedProvider(provider, res, 'payout status')) return;
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const accountId = getStripeConnectedAccountId(user);
  if (!accountId) {
    return res.status(400).json({ error: 'Stripe payouts have not been connected yet.' });
  }
  try {
    const account = await stripe.accounts.retrieve(accountId);
    setStripeConnectedAccount(user, account);
    saveDb(db);
    res.json(publicUser(user, db));
  } catch (err) {
    console.error('Stripe Connect status error:', err);
    res.status(502).json({ error: 'Unable to check Stripe payout status. Please try again.' });
  }
}

app.post('/api/profile/payout/onboarding', requireAuth, requireServiceAccess, startPayoutOnboarding);
app.post('/api/profile/payout/status', requireAuth, requireServiceAccess, refreshPayoutStatus);
app.post('/api/profile/payout/stripe-onboarding', requireAuth, requireServiceAccess, startPayoutOnboarding);
app.post('/api/profile/payout/stripe-status', requireAuth, requireServiceAccess, refreshPayoutStatus);
app.get('/api/profile/payout/onboarding/start', requireAuth, requireServiceAccess, (req, res) => {
  res.status(405).send(`<!doctype html><html><head><title>Stripe onboarding unavailable</title><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body style="font-family:Arial,sans-serif;padding:32px;line-height:1.5;"><h1>Stripe onboarding is unavailable</h1><p>Please return to LinkUp and start Stripe payouts from your profile.</p></body></html>`);
});

// Sign out endpoint
app.post('/api/auth/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to sign out' });
    }
    res.json({ message: 'Signed out' });
  });
});

app.get('/api/leaderboard/schools', requireAuth, (req, res) => {
  const db = normalizeUserAccess(loadDb());
  const schoolCounts = new Map();

  (db.users || []).forEach((user) => {
    const domain = user.universityDomain || getEmailDomain(user.email);
    const schoolInfo = getUniversityInfoFromDomain(domain);
    const school = schoolInfo.name || user.university || 'Unknown University';
    const key = domain || school;

    if (!schoolCounts.has(key)) {
      schoolCounts.set(key, {
        school,
        domain,
        city: schoolInfo?.city || '',
        state: schoolInfo?.state || '',
        location: [schoolInfo.city, schoolInfo.state].filter(Boolean).join(', '),
        userCount: 0,
        serviceApproved: user.serviceApproved === true,
      });
    }

    const entry = schoolCounts.get(key);
    entry.userCount += 1;
    entry.serviceApproved = entry.serviceApproved || user.serviceApproved === true;
  });

  const schools = Array.from(schoolCounts.values()).sort((a, b) => {
    if (b.userCount !== a.userCount) return b.userCount - a.userCount;
    return a.school.localeCompare(b.school);
  });

  const milesBySchool = new Map();
  (db.rides || []).forEach((ride) => {
    if (!hasTripEnded(ride)) return;
    if (!hasConfirmedRidePassenger(ride)) return;
    const rideMiles = getRideMiles(ride);
    if (!rideMiles) return;

    const driver = (db.users || []).find((user) => user.id === ride.driverId);
    const domain = driver?.universityDomain || getEmailDomain(driver?.email) || '';
    const schoolInfo = getUniversityInfoFromDomain(domain);
    const school = schoolInfo.name || ride.university || driver?.university || 'Unknown University';
    const key = domain || school;

    if (!milesBySchool.has(key)) {
      milesBySchool.set(key, {
        school,
        domain,
        city: schoolInfo?.city || '',
        state: schoolInfo?.state || '',
        location: [schoolInfo.city, schoolInfo.state].filter(Boolean).join(', '),
        miles: 0,
        tripCount: 0,
        serviceApproved: ride.university ? Object.values(SUPPORTED_UNIVERSITY_DOMAINS).includes(ride.university) : false,
      });
    }

    const entry = milesBySchool.get(key);
    entry.miles += rideMiles;
    entry.tripCount += 1;
  });

  const mileageSchools = Array.from(milesBySchool.values())
    .map((entry) => ({ ...entry, miles: Math.round(entry.miles * 10) / 10 }))
    .sort((a, b) => {
      if (b.miles !== a.miles) return b.miles - a.miles;
      return a.school.localeCompare(b.school);
    });
  const totalMilesSaved = Math.round((db.rides || [])
    .filter(hasTripEnded)
    .filter(hasConfirmedRidePassenger)
    .reduce((sum, ride) => sum + getRideMilesSaved(ride), 0) * 10) / 10;

  res.json({ schools, mileageSchools, totalUsers: (db.users || []).length, totalMilesSaved });
});

// Get Google Maps API key — requires authentication to prevent key harvesting
app.get('/api/config/google-maps-key', (req, res) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return res.status(503).json({ error: 'Google Maps API key is not configured' });
  }
  res.json({ apiKey: GOOGLE_MAPS_API_KEY });
});

app.post('/api/trips/track/start', requireAuth, requireServiceAccess, (req, res) => {
  const trustedEmail = normalizeEmail(req.body.trustedEmail);

  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (trustedEmail && trustedEmail === user.email) {
    return res.status(400).json({ error: "Enter someone else's email for trip tracking or leave it blank and copy the link" });
  }

  const trackingRide = findTrackableRideForUser(db, user.id);
  const trackingRoute = getTrackingRideRoute(trackingRide);
  const viewerToken = crypto.randomBytes(32).toString('hex');
  const viewerUrl = APP_BASE_URL + '/?trackToken=' + viewerToken;
  const trips = getTrackingTrips(db);
  const trip = {
    id: uuidv4(),
    ownerId: user.id,
    ownerFirstName: user.firstName || 'Rider',
    rideId: trackingRide?.id || '',
    rideRoute: trackingRoute,
    trustedEmail,
    viewerTokenHash: hashToken(viewerToken),
    viewerUrl,
    viewerAccessExpiresAt: Date.now() + TRACKING_VIEWER_TTL_MS,
    status: 'active',
    locations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  trips.push(trip);
  saveDb(db);
  if (trustedEmail) {
    sendAuthEmail(
      trustedEmail,
      user.firstName + ' invited you to track their LinkUp trip',
      'Hi,\n\n' + (user.firstName || 'A LinkUp rider') + ' wants to share their live LinkUp trip location with you for safety. Open this secure link to view this trip only while sharing is active:\n' + viewerUrl + '\n\nThis link expires when the trip ends or after 8 hours.\n\n- LinkUp'
    );
  }

  res.json({
    id: trip.id,
    trustedEmail: trip.trustedEmail,
    status: trip.status,
    rideRoute: trip.rideRoute || null,
    viewerUrl,
    message: trustedEmail
      ? 'Secure tracking invite sent. You can also copy this trip link and share it yourself.'
      : 'Secure tracking link created. Copy it and send it to anyone you trust.',
  });
});

app.put('/api/trips/track/:tripId/trusted-email', requireAuth, requireServiceAccess, (req, res) => {
  const { tripId } = req.params;
  const trustedEmail = normalizeEmail(req.body.trustedEmail);

  if (!trustedEmail) {
    return res.status(400).json({ error: 'Enter a trusted email to send an invite' });
  }

  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (trustedEmail === user.email) {
    return res.status(400).json({ error: "Enter someone else's email for trip tracking" });
  }

  const trip = getTrackingTrips(db).find((entry) => entry.id === tripId && entry.ownerId === req.session.userId);
  if (!trip || trip.status !== 'active') {
    return res.status(404).json({ error: 'Active tracking trip not found' });
  }
  if (expireTrackingTrip(trip)) {
    saveDb(db);
    return res.status(410).json({ error: 'This tracking link has expired. Restart sharing to send a new invite.' });
  }

  trip.trustedEmail = trustedEmail;
  trip.updatedAt = new Date().toISOString();
  saveDb(db);

  if (!trip.viewerUrl) {
    return res.status(400).json({ error: 'This tracking trip was started before invite updates were supported. Copy the tracking link and send it manually, or restart sharing.' });
  }
  sendAuthEmail(
    trustedEmail,
    user.firstName + ' invited you to track their LinkUp trip',
    'Hi,\n\n' + (user.firstName || 'A LinkUp rider') + ' wants to share their live LinkUp trip location with you for safety. Open this secure link to view this trip only while sharing is active:\n' + trip.viewerUrl + '\n\nThis link expires when the trip ends or after 8 hours.\n\n- LinkUp'
  );

  res.json({
    trustedEmail: trip.trustedEmail,
    message: 'Tracking invite sent to ' + trustedEmail + '.',
  });
});

app.post('/api/trips/track/:tripId/location', requireAuth, requireServiceAccess, (req, res) => {
  const { tripId } = req.params;
  const { lat, lng, accuracy, speed, heading } = req.body;
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return res.status(400).json({ error: 'Valid latitude and longitude are required' });
  }

  const db = loadDb();
  const trip = getTrackingTrips(db).find((entry) => entry.id === tripId && entry.ownerId === req.session.userId);
  if (!trip) {
    return res.status(404).json({ error: 'Tracking trip not found' });
  }
  if (trip.status !== 'active') {
    return res.status(400).json({ error: 'Location sharing is not active' });
  }
  if (expireTrackingTrip(trip)) {
    saveDb(db);
    return res.status(410).json({ error: 'This tracking link has expired. Restart sharing to continue.' });
  }

  const location = {
    lat: latitude,
    lng: longitude,
    accuracy: Number.isFinite(Number(accuracy)) ? Number(accuracy) : null,
    speed: Number.isFinite(Number(speed)) ? Number(speed) : null,
    heading: Number.isFinite(Number(heading)) ? Number(heading) : null,
    recordedAt: new Date().toISOString(),
  };

  trip.locations = (trip.locations || []).slice(-99);
  trip.locations.push(location);
  trip.lastLocation = location;
  refreshTrackingTripRoute(db, trip);
  trip.updatedAt = location.recordedAt;
  saveDb(db);

  res.json({ message: 'Location updated', trip: publicTrackingTrip(trip) });
});

app.post('/api/trips/track/:tripId/stop', requireAuth, requireServiceAccess, (req, res) => {
  const db = loadDb();
  const trip = getTrackingTrips(db).find((entry) => entry.id === req.params.tripId && entry.ownerId === req.session.userId);
  if (!trip) {
    return res.status(404).json({ error: 'Tracking trip not found' });
  }

  trip.status = 'stopped';
  trip.stoppedAt = new Date().toISOString();
  trip.updatedAt = trip.stoppedAt;
  saveDb(db);
  res.json({ message: 'Location sharing stopped', trip: publicTrackingTrip(trip) });
});

app.get('/api/track/:viewerToken', (req, res) => {
  const db = loadDb();
  const tokenHash = hashToken(req.params.viewerToken);
  const trip = getTrackingTrips(db).find((entry) => entry.viewerTokenHash === tokenHash);
  if (!trip) {
    return res.status(404).json({ error: 'Tracking link not found' });
  }
  if (trip.status !== 'active') {
    return res.status(410).json({ error: 'This tracking link is no longer active' });
  }
  if (expireTrackingTrip(trip)) {
    saveDb(db);
    return res.status(410).json({ error: 'This tracking link has expired' });
  }

  const routeWasAdded = refreshTrackingTripRoute(db, trip);
  if (routeWasAdded) {
    trip.updatedAt = new Date().toISOString();
    saveDb(db);
  }
  res.json(publicTrackingTrip(trip));
});


app.get('/api/ride-requests', requireAuth, requireServiceAccess, (req, res) => {
  const db = expireUnclaimedRideRequests(loadDb());
  res.json((db.rideRequests || []).filter((request) => isRideRequestVisibleToUser(db, request, req.session.userId)));
});

app.post('/api/ride-requests', requireAuth, requireServiceAccess, (req, res) => {
  const { origin, destination, originLat, originLng, destinationLat, destinationLng, pickupRadiusMiles, dropoffRadiusMiles, date, time, riderCount, willingToPay, shareRideWithOthers, sameGenderDriverOnly, sameSchoolDriverOnly, estimatedDurationMinutes, distanceMiles, notes } = req.body;
  if (!origin || !destination || !date || !time || !riderCount || willingToPay === undefined) {
    return res.status(400).json({ error: 'Missing trip request information' });
  }

  if (!isValidTripDateTime(date, time)) {
    return res.status(400).json({ error: 'Enter a valid request date and time' });
  }

  const willingToPayCents = Math.round(Number(willingToPay) * 100);
  if (!Number.isInteger(willingToPayCents) || willingToPayCents < 50) {
    return res.status(400).json({ error: 'Offer amount must be at least $0.50' });
  }
  const riderCountNumber = Number(riderCount);
  if (!Number.isInteger(riderCountNumber) || riderCountNumber < 1 || riderCountNumber > 7) {
    return res.status(400).json({ error: 'Rider count must be between 1 and 7' });
  }
  const parsedOriginLat = parseOptionalLatitude(originLat);
  const parsedOriginLng = parseOptionalLongitude(originLng);
  const parsedDestinationLat = parseOptionalLatitude(destinationLat);
  const parsedDestinationLng = parseOptionalLongitude(destinationLng);
  const parsedPickupRadiusMiles = parseRadiusMiles(pickupRadiusMiles);
  const parsedDropoffRadiusMiles = parseRadiusMiles(dropoffRadiusMiles);
  if (parsedPickupRadiusMiles === null || parsedDropoffRadiusMiles === null) {
    return res.status(400).json({ error: 'Radius must be between 0 and 100 miles' });
  }
  if ((!hasBlankCoordinate(originLat) && parsedOriginLat === null)
    || (!hasBlankCoordinate(originLng) && parsedOriginLng === null)
    || (!hasBlankCoordinate(destinationLat) && parsedDestinationLat === null)
    || (!hasBlankCoordinate(destinationLng) && parsedDestinationLng === null)) {
    return res.status(400).json({ error: 'Enter valid pickup and drop-off coordinates' });
  }
  const fallbackDistanceMiles = calculateDistanceMiles(parsedOriginLat, parsedOriginLng, parsedDestinationLat, parsedDestinationLng);
  const parsedDistanceMiles = sanitizeDistanceMiles(distanceMiles, fallbackDistanceMiles);

  const db = loadDb();
  db.rideRequests = db.rideRequests || [];
  const rider = db.users.find((u) => u.id === req.session.userId);
  if (!rider) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (sameGenderDriverOnly && !canMatchSameGender(rider.gender, rider.gender)) {
    return res.status(400).json({ error: 'Choose a gender on your account before requesting same gender drivers only' });
  }

  const request = {
    id: uuidv4(),
    riderId: rider.id,
    riderFirstName: rider.firstName,
    riderLastName: rider.lastName,
    riderGender: rider.gender || '',
    riderEmail: rider.email,
    university: rider.university,
    origin,
    destination,
    originLat: parsedOriginLat,
    originLng: parsedOriginLng,
    destinationLat: parsedDestinationLat,
    destinationLng: parsedDestinationLng,
    pickupRadiusMiles: parsedPickupRadiusMiles,
    dropoffRadiusMiles: parsedDropoffRadiusMiles,
    distanceMiles: parsedDistanceMiles,
    date,
    time,
    riderCount: riderCountNumber,
    willingToPayCents,
    estimatedDurationMinutes: sanitizeDurationMinutes(estimatedDurationMinutes),
    shareRideWithOthers: Boolean(shareRideWithOthers),
    sameGenderDriverOnly: Boolean(sameGenderDriverOnly),
    sameSchoolDriverOnly: Boolean(sameSchoolDriverOnly),
    notes: notes || '',
    driverOffers: [],
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  const conflict = findUserScheduleConflict(db, rider.id, request);
  if (conflict) {
    return res.status(400).json({ error: 'This request overlaps with another ride you are already driving, riding, or requesting: ' + describeTripTime(conflict) });
  }

  db.rideRequests.push(request);
  saveDb(db);
  res.json(request);
});

app.post('/api/ride-requests/:requestId/offer', requireAuth, requireServiceAccess, (req, res) => {
  const db = expireUnclaimedRideRequests(loadDb());
  const driver = db.users.find((u) => u.id === req.session.userId);
  if (!driver) {
    return res.status(404).json({ error: 'User not found' });
  }

  const request = (db.rideRequests || []).find((entry) => entry.id === req.params.requestId);
  if (!request) {
    return res.status(404).json({ error: 'Trip request not found' });
  }
  if ((request.status || 'open') !== 'open') {
    return res.status(400).json({ error: 'This ride request is no longer open' });
  }
  if (request.riderId === driver.id) {
    return res.status(400).json({ error: 'You cannot offer to drive your own request' });
  }
  if (areUsersBlocked(db, driver.id, request.riderId)) {
    return res.status(403).json({ error: 'You cannot offer to drive a request from a blocked user' });
  }
  if (request.sameGenderDriverOnly && !canMatchSameGender(request.riderGender, driver.gender)) {
    return res.status(400).json({ error: 'This rider requested same-gender drivers only' });
  }
  if (request.sameSchoolDriverOnly && !isSameSchoolUser(driver, request.university)) {
    return res.status(400).json({ error: 'This rider requested same-school drivers only' });
  }
  if (request.driverOffers.some((offer) => offer.driverId === driver.id)) {
    return res.status(400).json({ error: 'You already offered to drive this request' });
  }

  request.driverOffers.push({
    driverId: driver.id,
    driverFirstName: driver.firstName,
    driverLastName: driver.lastName,
    driverGender: driver.gender || '',
    email: driver.email,
    createdAt: new Date().toISOString(),
  });
  saveDb(db);
  res.json(request);
});

app.post('/api/ride-requests/:requestId/post-shared-ride', requireAuth, requireServiceAccess, (req, res) => {
  const { requestId } = req.params;
  const additionalSharedSeats = Number(req.body.seatsAvailable);
  const priceCents = Math.round(Number(req.body.price) * 100);
  if (!Number.isInteger(additionalSharedSeats) || additionalSharedSeats < 1 || additionalSharedSeats > 7) {
    return res.status(400).json({ error: 'Choose between 1 and 7 additional shared seats' });
  }
  if (!Number.isInteger(priceCents) || priceCents < 50) {
    return res.status(400).json({ error: 'Ride price must be at least $0.50' });
  }

  const db = loadDb();
  db.rides = db.rides || [];
  const driver = db.users.find((u) => u.id === req.session.userId);
  if (!driver) {
    return res.status(404).json({ error: 'User not found' });
  }

  const request = (db.rideRequests || []).find((entry) => entry.id === requestId);
  if (!request) {
    return res.status(404).json({ error: 'Trip request not found' });
  }
  if (!request.shareRideWithOthers) {
    return res.status(400).json({ error: 'This rider did not agree to share this ride with others' });
  }
  if (areUsersBlocked(db, driver.id, request.riderId)) {
    return res.status(403).json({ error: 'You cannot post a shared ride for a blocked user' });
  }
  if (request.sameSchoolDriverOnly && !isSameSchoolUser(driver, request.university)) {
    return res.status(400).json({ error: 'This rider requested same-school drivers only' });
  }
  if (!request.driverOffers.some((offer) => offer.driverId === driver.id)) {
    return res.status(400).json({ error: 'Offer to drive this request before posting it as a shared ride' });
  }
  if (db.rides.some((ride) => ride.sourceRequestId === request.id && ride.driverId === driver.id)) {
    return res.status(400).json({ error: 'You already posted this request as a shared ride' });
  }

  const ride = {
    id: uuidv4(),
    sourceRequestId: request.id,
    sharedRequestRide: true,
    seatingChartUnavailable: true,
    driverId: driver.id,
    driverFirstName: driver.firstName,
    driverLastName: driver.lastName,
    driverGender: driver.gender || '',
    sameGenderOnly: false,
    sameSchoolOnly: Boolean(request.sameSchoolDriverOnly),
    university: driver.university,
    origin: request.origin,
    destination: request.destination,
    originLat: request.originLat ?? null,
    originLng: request.originLng ?? null,
    destinationLat: request.destinationLat ?? null,
    destinationLng: request.destinationLng ?? null,
    pickupRadiusMiles: request.pickupRadiusMiles || 0,
    dropoffRadiusMiles: request.dropoffRadiusMiles || 0,
    distanceMiles: sanitizeDistanceMiles(request.distanceMiles, calculateDistanceMiles(request.originLat, request.originLng, request.destinationLat, request.destinationLng)),
    date: request.date,
    time: request.time,
    estimatedDurationMinutes: sanitizeDurationMinutes(request.estimatedDurationMinutes),
    returnRide: null,
    vehicleSeatCount: 0,
    availableSeatIds: [],
    sharedSeatCapacity: additionalSharedSeats + 1,
    seatsAvailable: additionalSharedSeats + 1,
    priceCents,
    notes: 'Shared ride from rider request. Seating chart unavailable. ' + (request.notes || ''),
    passengers: [{
      studentId: request.riderId,
      studentFirstName: request.riderFirstName,
      studentLastName: request.riderLastName,
      studentGender: request.riderGender || '',
      email: request.riderEmail,
      seatId: '',
    }],
    createdAt: new Date().toISOString(),
  };

  const conflict = findUserScheduleConflict(db, driver.id, ride);
  if (conflict) {
    return res.status(400).json({ error: 'This ride overlaps with another ride you are already driving, riding, or requesting: ' + describeTripTime(conflict) });
  }

  db.rides.push(ride);
  saveDb(db);
  res.json(rideForUser(ride, req.session.userId, db));
});

app.get('/api/rides', requireAuth, requireServiceAccess, (req, res) => {
  const db = loadDb();
  res.json((db.rides || [])
    .filter((ride) => isRideBrowseVisibleToUser(db, ride, req.session.userId))
    .map((ride) => rideForUser(ride, req.session.userId, db)));
});

app.post('/api/rides', requireAuth, requireServiceAccess, (req, res) => {
  const { origin, destination, originLat, originLng, destinationLat, destinationLng, pickupRadiusMiles, dropoffRadiusMiles, date, time, hasReturnRide, returnDate, returnTime, sameGenderOnly, sameSchoolOnly, seatsAvailable, price, carMaker, carModel, carColor, licensePlate, termsAccepted, estimatedDurationMinutes, distanceMiles, notes } = req.body;
  const rideProviderType = ['personal_car', 'rideshare_service'].includes(req.body.rideProviderType) ? req.body.rideProviderType : '';
  const isRideshareService = rideProviderType === 'rideshare_service';
  const rideshareService = String(req.body.rideshareService || '').trim();
  const rideshareSeatCount = Number(req.body.rideshareSeatCount);
  const vehicleSeatCount = normalizeVehicleSeatCount(req.body.vehicleSeatCount);
  const availableSeatIds = normalizeSeatIds(req.body.availableSeatIds, vehicleSeatCount);
  if (!origin || !destination || !date || !time || !rideProviderType || price === undefined || originLat === undefined || originLng === undefined || destinationLat === undefined || destinationLng === undefined) {
    return res.status(400).json({ error: 'Missing ride information' });
  }
  if (!isRideshareService && (!carMaker || !carModel || !carColor || !licensePlate)) {
    return res.status(400).json({ error: 'Personal car rides require vehicle information' });
  }
  if (!isRideshareService && !availableSeatIds.length) {
    return res.status(400).json({ error: 'Select at least one available passenger seat' });
  }
  if (isRideshareService && !rideshareService) {
    return res.status(400).json({ error: 'Choose the rideshare service for this ride' });
  }
  if (isRideshareService && (!Number.isInteger(rideshareSeatCount) || rideshareSeatCount < 1 || rideshareSeatCount > 7)) {
    return res.status(400).json({ error: 'Rideshare service rides must have 1 to 7 available rider spots' });
  }
  if (termsAccepted !== true) {
    return res.status(400).json({ error: 'You must agree to the driver terms and conditions before listing a ride' });
  }

  if (!isValidTripDateTime(date, time)) {
    return res.status(400).json({ error: 'Enter a valid ride date and time' });
  }
  const parsedOriginLat = parseLatitude(originLat);
  const parsedOriginLng = parseLongitude(originLng);
  const parsedDestinationLat = parseLatitude(destinationLat);
  const parsedDestinationLng = parseLongitude(destinationLng);
  const parsedPickupRadiusMiles = parseRadiusMiles(pickupRadiusMiles);
  const parsedDropoffRadiusMiles = parseRadiusMiles(dropoffRadiusMiles);
  if (parsedPickupRadiusMiles === null || parsedDropoffRadiusMiles === null) {
    return res.status(400).json({ error: 'Radius must be between 0 and 100 miles' });
  }
  if ([parsedOriginLat, parsedOriginLng, parsedDestinationLat, parsedDestinationLng].some((value) => value === null)) {
    return res.status(400).json({ error: 'Enter valid pickup and drop-off coordinates' });
  }
  const fallbackDistanceMiles = calculateDistanceMiles(parsedOriginLat, parsedOriginLng, parsedDestinationLat, parsedDestinationLng);
  const parsedDistanceMiles = sanitizeDistanceMiles(distanceMiles, fallbackDistanceMiles);

  const priceCents = Math.round(Number(price) * 100);
  if (!Number.isInteger(priceCents) || priceCents < 50) {
    return res.status(400).json({ error: 'Ride price must be at least $0.50' });
  }
  if (hasReturnRide && (!returnDate || !returnTime)) {
    return res.status(400).json({ error: 'Return date and time are required for a return ride' });
  }
  if (hasReturnRide && !isValidTripDateTime(returnDate, returnTime)) {
    return res.status(400).json({ error: 'Enter a valid return date and time' });
  }

  const db = loadDb();
  const driver = db.users.find((u) => u.id === req.session.userId);
  if (!driver) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (sameGenderOnly && !canMatchSameGender(driver.gender, driver.gender)) {
    return res.status(400).json({ error: 'Choose a gender on your account before offering same gender only rides' });
  }

  const ride = {
    id: uuidv4(),
    driverId: driver.id,
    driverFirstName: driver.firstName,
    driverLastName: driver.lastName,
    driverGender: driver.gender || '',
    sameGenderOnly: Boolean(sameGenderOnly),
    sameSchoolOnly: Boolean(sameSchoolOnly),
    university: driver.university,
    origin,
    destination,
    originLat: parsedOriginLat,
    originLng: parsedOriginLng,
    destinationLat: parsedDestinationLat,
    destinationLng: parsedDestinationLng,
    pickupRadiusMiles: parsedPickupRadiusMiles,
    dropoffRadiusMiles: parsedDropoffRadiusMiles,
    distanceMiles: parsedDistanceMiles,
    date,
    time,
    estimatedDurationMinutes: sanitizeDurationMinutes(estimatedDurationMinutes),
    returnRide: hasReturnRide ? { date: returnDate, time: returnTime } : null,
    rideProviderType,
    rideshareService: isRideshareService ? rideshareService : '',
    seatingChartUnavailable: isRideshareService,
    sharedSeatCapacity: isRideshareService ? rideshareSeatCount : null,
    vehicleSeatCount: isRideshareService ? 0 : vehicleSeatCount,
    availableSeatIds: isRideshareService ? [] : availableSeatIds,
    seatsAvailable: isRideshareService ? rideshareSeatCount : availableSeatIds.length,
    priceCents,
    carMaker: isRideshareService ? '' : String(carMaker).trim(),
    carModel: isRideshareService ? '' : String(carModel).trim(),
    carColor: isRideshareService ? '' : String(carColor).trim(),
    licensePlate: isRideshareService ? '' : String(licensePlate).trim().toUpperCase(),
    termsAcceptedAt: new Date().toISOString(),
    notes: notes || '',
    passengers: [],
    createdAt: new Date().toISOString(),
  };

  const conflict = findUserScheduleConflict(db, driver.id, ride);
  if (conflict) {
    return res.status(400).json({ error: 'This ride overlaps with another ride you are already driving, riding, or requesting: ' + describeTripTime(conflict) });
  }

  db.rides.push(ride);
  saveDb(db);
  res.json(rideForUser(ride, req.session.userId, db));
});

app.post('/api/rides/:rideId/join', requireAuth, requireServiceAccess, (req, res) => {
  const { rideId } = req.params;
  const seatId = String(req.body.seatId || '').trim();
  const actualPickup = sanitizeRiderStop(req.body.actualPickup);
  const actualDropoff = sanitizeRiderStop(req.body.actualDropoff);
  if (req.body.termsAccepted !== true) {
    return res.status(400).json({ error: 'You must agree to the Terms and Conditions before joining this ride' });
  }

  const db = loadDb();
  const student = db.users.find((u) => u.id === req.session.userId);
  if (!student) {
    return res.status(404).json({ error: 'User not found' });
  }

  const ride = db.rides.find((r) => r.id === rideId);
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }

  const reserveError = canStudentReserveRide(student, ride, seatId, db);
  if (reserveError) {
    return res.status(400).json({ error: reserveError });
  }
  const stopError = validateRiderStopsForRide(ride, actualPickup, actualDropoff);
  if (stopError) {
    return res.status(400).json({ error: stopError });
  }

  ride.passengers.push({
    studentId: student.id,
    studentFirstName: student.firstName,
    studentLastName: student.lastName,
    studentGender: student.gender || '',
    email: student.email,
    seatId,
    actualPickup,
    actualDropoff,
  });
  ride.seatsAvailable = getAvailableOpenSeatIds(ride).length;
  saveDb(db);
  res.json(rideForUser(ride, req.session.userId, db));
});

app.get('/api/rides/:rideId/messages', requireAuth, requireServiceAccess, (req, res) => {
  const db = loadDb();
  const ride = (db.rides || []).find((entry) => entry.id === req.params.rideId);
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  if (!canUserAccessRideChat(ride, req.session.userId)) {
    return res.status(403).json({ error: 'Only the driver and confirmed riders can view this chat' });
  }
  db.rideMessages = db.rideMessages || {};
  res.json({
    messages: db.rideMessages[ride.id] || [],
    chatDisabled: isRideChatDisabled(ride),
    chatDisabledAt: getRideChatDisabledAt(ride),
  });
});

app.post('/api/rides/:rideId/rating', requireAuth, requireServiceAccess, (req, res) => {
  const rating = Number(req.body.rating);
  const comment = String(req.body.comment || '').trim().slice(0, 300);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Choose a rating from 1 to 5 stars' });
  }

  const db = loadDb();
  const ride = (db.rides || []).find((entry) => entry.id === req.params.rideId);
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  const passenger = (ride.passengers || []).find((entry) => entry.studentId === req.session.userId);
  if (!passenger) {
    return res.status(403).json({ error: 'Only riders who reserved this ride can rate the driver' });
  }
  if (Date.now() <= getTripInterval(ride).end) {
    return res.status(400).json({ error: 'You can rate the driver after the ride ends' });
  }

  passenger.driverRating = rating;
  passenger.driverRatingComment = comment;
  passenger.driverRatedAt = new Date().toISOString();
  saveDb(db);
  res.json({
    message: 'Driver rating saved',
    ride: {
      ...rideForUser(ride, req.session.userId, db),
      selectedSeatId: passenger.seatId || '',
      driverRatingByCurrentUser: passenger.driverRating,
      driverRatingCommentByCurrentUser: passenger.driverRatingComment || '',
    },
  });
});

app.post('/api/rides/:rideId/messages', requireAuth, requireServiceAccess, (req, res) => {
  const textValidation = validateChatText(req.body.text);
  if (textValidation.error) return res.status(400).json({ error: textValidation.error });

  const db = loadDb();
  const sender = (db.users || []).find((user) => user.id === req.session.userId);
  const ride = (db.rides || []).find((entry) => entry.id === req.params.rideId);
  if (!sender) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  if (!canUserAccessRideChat(ride, sender.id)) {
    return res.status(403).json({ error: 'Only the driver and confirmed riders can post in this chat' });
  }
  if (isRideChatDisabled(ride)) {
    return res.status(403).json({ error: 'This chat is disabled because the ride ended more than a day ago' });
  }

  const message = appendRideChatMessage(db, ride, sender, textValidation.text);
  saveDb(db);
  io.to('ride:' + ride.id).emit('chat:message', { rideId: ride.id, message });
  notifyRideChatParticipants(db, ride, sender, message);
  res.json({ message, messages: db.rideMessages[ride.id] });
});

app.post('/api/reports', requireAuth, requireServiceAccess, (req, res) => {
  const reportedUserId = String(req.body.reportedUserId || '').trim();
  const rideId = String(req.body.rideId || '').trim();
  const reason = String(req.body.reason || '').trim().slice(0, 80);
  const details = String(req.body.details || '').trim().slice(0, 1000);

  if (!reportedUserId) {
    return res.status(400).json({ error: 'Choose a user to report' });
  }
  if (!rideId) {
    return res.status(400).json({ error: 'Choose a ride context before reporting a user' });
  }
  if (!reason) {
    return res.status(400).json({ error: 'Add a short reason for the report' });
  }

  const db = loadDb();
  const reporter = (db.users || []).find((user) => user.id === req.session.userId);
  const reportedUser = (db.users || []).find((user) => user.id === reportedUserId);
  const ride = (db.rides || []).find((entry) => entry.id === rideId);

  if (!reporter) {
    return res.status(404).json({ error: 'Reporter not found' });
  }
  if (!reportedUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (reporter.id === reportedUser.id) {
    return res.status(400).json({ error: 'You cannot report yourself' });
  }
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  if (!canReportUserForRide(ride, reporter.id, reportedUser.id)) {
    return res.status(403).json({ error: 'You can only report users connected to this ride' });
  }

  db.userReports = db.userReports || [];
  const report = {
    id: uuidv4(),
    reporterId: reporter.id,
    reporterName: getUserDisplayName(reporter),
    reporterEmail: reporter.email || '',
    reportedUserId: reportedUser.id,
    reportedUserName: getUserDisplayName(reportedUser),
    reportedUserEmail: reportedUser.email || '',
    rideId: ride.id,
    rideOrigin: ride.origin,
    rideDestination: ride.destination,
    rideDate: ride.date,
    rideTime: ride.time,
    reason,
    details,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  db.userReports.push(report);
  saveDb(db);
  res.status(201).json({ message: 'Report submitted. LinkUp will review it.', reportId: report.id });
});

app.get('/api/cart', requireAuth, requireServiceAccess, (req, res) => {
  const db = loadDb();
  const { entries: cartEntries, expiredRideCount } = cleanCartEntriesWithMeta(db, req.session.userId);
  const cartRides = cartEntries
    .map((entry) => {
      const ride = db.rides.find((item) => item.id === entry.rideId);
      return ride ? {
        ...rideForUser(ride, req.session.userId, db),
        selectedSeatId: entry.seatId,
        actualPickup: entry.actualPickup || '',
        actualDropoff: entry.actualDropoff || '',
        cartTermsAccepted: Boolean(entry.termsAcceptedAt),
      } : null;
    })
    .filter(Boolean);

  saveDb(db);
  res.json({ rides: cartRides, expiredRideCount });
});

function reserveCartRides(db, student, cartEntries) {
  if (!cartEntries.length) {
    return { error: 'Your cart is empty' };
  }

  const ridesToReserve = [];
  for (const entry of cartEntries) {
    if (!entry.termsAcceptedAt) {
      return { error: 'Please agree to the Terms and Conditions again before checkout' };
    }
    const ride = db.rides.find((r) => r.id === entry.rideId);
    if (hasTripStartPassed(ride)) {
      return { error: 'This ride has already started and was removed from your cart' };
    }
    const reserveError = canStudentReserveRide(student, ride, entry.seatId, db);
    if (reserveError) {
      const rideLabel = ride ? ride.origin + ' to ' + ride.destination : entry.rideId;
      return { error: reserveError + ': ' + rideLabel };
    }
    const stopError = validateRiderStopsForRide(ride, entry.actualPickup, entry.actualDropoff);
    if (stopError) {
      const rideLabel = ride ? ride.origin + ' to ' + ride.destination : entry.rideId;
      return { error: stopError + ': ' + rideLabel };
    }
    ridesToReserve.push({ ride, seatId: entry.seatId, actualPickup: sanitizeRiderStop(entry.actualPickup), actualDropoff: sanitizeRiderStop(entry.actualDropoff) });
  }

  const internalConflict = findInternalRideConflict(ridesToReserve.map(({ ride }) => ride));
  if (internalConflict) {
    return { error: 'Two rides in your cart overlap: ' + describeTripTime(internalConflict[0]) + ' and ' + describeTripTime(internalConflict[1]) };
  }

  ridesToReserve.forEach(({ ride, seatId, actualPickup, actualDropoff }) => {
    ride.passengers.push({
      studentId: student.id,
      studentFirstName: student.firstName,
      studentLastName: student.lastName,
      studentGender: student.gender || '',
      email: student.email,
      seatId,
      actualPickup,
      actualDropoff,
    });
    ride.seatsAvailable = getAvailableOpenSeatIds(ride).length;
  });

  return { ridesToReserve };
}

function getSelectedCartEntries(cartEntries, selectedRideIds = null) {
  if (!Array.isArray(selectedRideIds)) return cartEntries;
  const selectedSet = new Set(selectedRideIds.map((rideId) => String(rideId || '').trim()).filter(Boolean));
  if (!selectedSet.size) return [];
  return cartEntries.filter((entry) => selectedSet.has(entry.rideId));
}

function finalizePaidCheckoutSession(db, student, checkoutSession) {
  if (!student) return { error: 'User not found' };
  if (!checkoutSession) return { error: 'Checkout session not found' };
  if (checkoutSession.status === 'paid') return { message: 'Payment already completed.', alreadyPaid: true };

  const cartEntries = checkoutSession.cartEntries || cleanCartEntries(db, student.id);
  const reservation = reserveCartRides(db, student, cartEntries);
  if (reservation.error) {
    checkoutSession.status = 'failed';
    checkoutSession.failureReason = reservation.error;
    return { error: reservation.error };
  }

  checkoutSession.status = 'paid';
  checkoutSession.completedAt = new Date().toISOString();
  db.payments = db.payments || [];
  const provider = checkoutSession.provider || (checkoutSession.stripePaymentIntentId || checkoutSession.stripeSessionId ? 'stripe' : 'local');
  const providerPaymentId = checkoutSession.providerPaymentId || checkoutSession.stripePaymentIntentId || checkoutSession.stripeSessionId || checkoutSession.id;
  let paymentRecord = db.payments.find((payment) => payment.providerPaymentId
    ? payment.provider === provider && payment.providerPaymentId === providerPaymentId
    : payment.stripePaymentIntentId && payment.stripePaymentIntentId === checkoutSession.stripePaymentIntentId);
  if (!paymentRecord) {
    paymentRecord = {
      id: uuidv4(),
      studentId: student.id,
      rideIds: reservation.ridesToReserve.map(({ ride }) => ride.id),
      seats: reservation.ridesToReserve.map(({ ride, seatId, actualPickup, actualDropoff }) => ({ rideId: ride.id, seatId, actualPickup, actualDropoff })),
      provider,
      providerPaymentId,
      providerSessionId: checkoutSession.providerSessionId || checkoutSession.stripeSessionId || '',
      stripeSessionId: checkoutSession.stripeSessionId || '',
      stripePaymentIntentId: checkoutSession.stripePaymentIntentId || '',
      amountCents: checkoutSession.expectedAmountCents || checkoutSession.stripeAmountTotal || null,
      stripeAmountCents: checkoutSession.stripeAmountTotal || checkoutSession.amountDueCents || 0,
      walletCreditCents: checkoutSession.walletCreditCents || 0,
      currency: checkoutSession.stripeCurrency || 'usd',
      status: 'paid',
      createdAt: checkoutSession.completedAt,
    };
    db.payments.push(paymentRecord);
  }
  addWalletCheckoutDebit(db, student, checkoutSession);
  addDriverWalletCreditsForReservation(db, checkoutSession, reservation, paymentRecord);
  const reservedRideIds = new Set(reservation.ridesToReserve.map(({ ride }) => ride.id));
  db.carts[student.id] = cleanCartEntries(db, student.id).filter((entry) => !reservedRideIds.has(entry.rideId));
  sendReservationConfirmationEmail(db, student, reservation, checkoutSession);
  return { message: 'Payment complete. Your selected seats are booked.', rides: reservation.ridesToReserve.map(({ ride }) => rideForUser(ride, student.id, db)) };
}

function finalizePaidCheckoutByPaymentIntent(db, paymentIntent) {
  const paymentIntentId = typeof paymentIntent === 'string' ? paymentIntent : paymentIntent?.id;
  const checkoutSession = (db.checkoutSessions || []).find((session) => session.providerPaymentId === paymentIntentId || session.stripePaymentIntentId === paymentIntentId);
  if (!checkoutSession) return { error: 'Checkout session not found' };
  checkoutSession.provider = checkoutSession.provider || 'stripe';
  checkoutSession.providerPaymentId = checkoutSession.providerPaymentId || paymentIntentId;
  if (paymentIntent && typeof paymentIntent === 'object') {
    const expectedStripeAmountCents = checkoutSession.amountDueCents || checkoutSession.expectedAmountCents;
    if (expectedStripeAmountCents && paymentIntent.amount !== expectedStripeAmountCents) {
      checkoutSession.status = 'failed';
      checkoutSession.failureReason = 'Stripe amount mismatch';
      return { error: 'Stripe payment amount did not match this checkout.' };
    }
    checkoutSession.stripeAmountTotal = paymentIntent.amount || 0;
    checkoutSession.stripeCurrency = paymentIntent.currency || 'usd';
  } else {
    checkoutSession.stripeAmountTotal = checkoutSession.stripeAmountTotal || checkoutSession.expectedAmountCents || 0;
    checkoutSession.stripeCurrency = checkoutSession.stripeCurrency || 'usd';
  }
  const student = (db.users || []).find((user) => user.id === checkoutSession.studentId);
  return finalizePaidCheckoutSession(db, student, checkoutSession);
}

function updateStripeConnectedAccountStatus(db, account) {
  const user = (db.users || []).find((entry) => entry.stripeConnectedAccountId === account.id
    || entry.payoutInfo?.stripe?.accountId === account.id
    || entry.payoutProviders?.stripe?.accountId === account.id);
  if (!user) return false;
  setStripeConnectedAccount(user, account);
  return true;
}

function getCheckoutLineItems(rides) {
  return rides.map((ride) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'LinkUp ride: ' + (ride.origin || 'Pickup') + ' to ' + (ride.destination || 'Destination'),
        description: describeTripTime(ride).slice(0, 1000),
      },
      unit_amount: Math.max(50, Number(ride.priceCents || 0)),
    },
    quantity: 1,
  }));
}

app.post('/api/cart/checkout', requireAuth, requireServiceAccess, (req, res) => {
  res.status(410).json({ error: 'Direct card checkout has been retired. Use Stripe Checkout.' });
});

app.post('/api/cart/create-checkout-session', requireAuth, requireServiceAccess, async (req, res) => {
  const provider = getPaymentProviderName();
  if (!requireStripeBackedProvider(provider, res, 'checkout')) return;

  const db = loadDb();
  const student = db.users.find((u) => u.id === req.session.userId);
  if (!student) {
    return res.status(404).json({ error: 'User not found' });
  }

  const cartEntries = getSelectedCartEntries(cleanCartEntries(db, student.id), req.body.rideIds);
  if (!cartEntries.length) {
    return res.status(400).json({ error: 'Select at least one ride before checkout' });
  }

  const checkoutRides = [];
  for (const entry of cartEntries) {
    if (!entry.termsAcceptedAt) return res.status(400).json({ error: 'Please agree to the Terms and Conditions again before checkout' });
    const ride = db.rides.find((r) => r.id === entry.rideId);
    const reserveError = canStudentReserveRide(student, ride, entry.seatId, db);
    if (reserveError) return res.status(400).json({ error: reserveError });
    checkoutRides.push(ride);
  }
  const internalConflict = findInternalRideConflict(checkoutRides);
  if (internalConflict) {
    return res.status(400).json({ error: 'Two rides in your cart overlap: ' + describeTripTime(internalConflict[0]) + ' and ' + describeTripTime(internalConflict[1]) });
  }

  try {
    const expectedAmountCents = checkoutRides.reduce((sum, ride) => sum + Number(ride.priceCents || 0), 0);
    const walletCreditCents = getCheckoutWalletCreditCents(db, student.id, expectedAmountCents);
    const amountDueCents = Math.max(0, expectedAmountCents - walletCreditCents);
    if (amountDueCents === 0) {
      const walletSessionId = 'wallet_' + uuidv4();
      db.checkoutSessions = db.checkoutSessions || [];
      db.checkoutSessions.push({
        id: walletSessionId,
        provider: 'wallet',
        providerPaymentId: walletSessionId,
        studentId: student.id,
        cartEntries: cartEntries.map((entry) => ({ ...entry })),
        expectedAmountCents,
        walletCreditCents,
        amountDueCents,
        stripeAmountTotal: 0,
        stripeCurrency: 'usd',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      saveDb(db);
      return res.json({
        provider: 'wallet',
        walletOnly: true,
        paymentIntentId: walletSessionId,
        walletCreditCents,
        amountDueCents,
      });
    }
    const customerId = await ensureStripeCustomer(db, student);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountDueCents,
      currency: 'usd',
      customer: customerId,
      payment_method_types: ['card'],
      receipt_email: student.email,
      metadata: {
        linkupStudentId: student.id,
        linkupRideIds: checkoutRides.map((ride) => ride.id).join(','),
        paymentProvider: provider,
        walletCreditCents: String(walletCreditCents),
      },
    });

    db.checkoutSessions = db.checkoutSessions || [];
    db.checkoutSessions.push({
      id: paymentIntent.id,
      provider,
      providerPaymentId: paymentIntent.id,
      stripePaymentIntentId: paymentIntent.id,
      studentId: student.id,
      cartEntries: cartEntries.map((entry) => ({ ...entry })),
      expectedAmountCents,
      walletCreditCents,
      amountDueCents,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    saveDb(db);

    res.json({ provider, clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id, walletCreditCents, amountDueCents });
  } catch (err) {
    console.error('Stripe checkout session error:', err);
    res.status(502).json({ error: 'Unable to start Stripe Checkout. Please try again.' });
  }
});

app.post('/api/cart/checkout/complete', requireAuth, requireServiceAccess, async (req, res) => {
  const sessionId = String(req.body.sessionId || req.body.paymentIntentId || '').trim();
  const db = loadDb();
  const student = db.users.find((u) => u.id === req.session.userId);
  if (!student) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.checkoutSessions = db.checkoutSessions || [];
  const checkoutSession = db.checkoutSessions.find((session) => session.studentId === student.id
    && (session.id === sessionId || session.providerPaymentId === sessionId || session.providerSessionId === sessionId || session.stripeSessionId === sessionId || session.stripePaymentIntentId === sessionId));
  if (!checkoutSession) {
    return res.status(404).json({ error: 'Checkout session not found' });
  }
  if (checkoutSession.status === 'paid') {
    return res.json({ message: 'Payment already completed.' });
  }

  const provider = checkoutSession.provider || (checkoutSession.stripePaymentIntentId || checkoutSession.stripeSessionId ? 'stripe' : getPaymentProviderName());
  if (provider !== 'wallet' && !requireStripeBackedProvider(provider, res, 'payment verification')) return;

  if (provider === 'wallet') {
    const walletCreditCents = Math.max(0, Number(checkoutSession.walletCreditCents || 0));
    if (!walletCreditCents || walletCreditCents !== Number(checkoutSession.expectedAmountCents || 0)) {
      checkoutSession.status = 'failed';
      checkoutSession.failureReason = 'Wallet amount mismatch';
      saveDb(db);
      return res.status(400).json({ error: 'Wallet credit did not match this checkout.' });
    }
    if (getWalletAvailableCents(db, student.id) < walletCreditCents) {
      checkoutSession.status = 'failed';
      checkoutSession.failureReason = 'Insufficient wallet balance';
      saveDb(db);
      return res.status(400).json({ error: 'Your wallet balance is no longer enough for this checkout.' });
    }
    checkoutSession.stripeAmountTotal = 0;
    checkoutSession.stripeCurrency = 'usd';
  } else if (checkoutSession.stripePaymentIntentId && !checkoutSession.stripeSessionId) {
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(checkoutSession.stripePaymentIntentId);
    } catch (err) {
      console.error('Stripe payment verification error:', err);
      return res.status(502).json({ error: 'Unable to verify Stripe payment. Please try again.' });
    }
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Stripe payment is not complete yet.' });
    }
    const expectedStripeAmountCents = checkoutSession.amountDueCents || checkoutSession.expectedAmountCents;
    if (expectedStripeAmountCents && paymentIntent.amount !== expectedStripeAmountCents) {
      checkoutSession.status = 'failed';
      checkoutSession.failureReason = 'Stripe amount mismatch';
      saveDb(db);
      return res.status(400).json({ error: 'Stripe payment amount did not match this checkout.' });
    }
    checkoutSession.stripeAmountTotal = paymentIntent.amount || 0;
    checkoutSession.stripeCurrency = paymentIntent.currency || 'usd';
  } else if (checkoutSession.stripeSessionId) {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured. Payment cannot be verified.' });
    }
    let stripeSession;
    try {
      stripeSession = await stripe.checkout.sessions.retrieve(checkoutSession.stripeSessionId);
    } catch (err) {
      console.error('Stripe checkout verification error:', err);
      return res.status(502).json({ error: 'Unable to verify Stripe payment. Please try again.' });
    }
    if (stripeSession.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Stripe payment is not complete yet.' });
    }
    const expectedStripeAmountCents = checkoutSession.amountDueCents || checkoutSession.expectedAmountCents;
    if (expectedStripeAmountCents && stripeSession.amount_total !== expectedStripeAmountCents) {
      checkoutSession.status = 'failed';
      checkoutSession.failureReason = 'Stripe amount mismatch';
      saveDb(db);
      return res.status(400).json({ error: 'Stripe payment amount did not match this checkout.' });
    }
    checkoutSession.stripePaymentIntentId = typeof stripeSession.payment_intent === 'string'
      ? stripeSession.payment_intent
      : stripeSession.payment_intent?.id || '';
    checkoutSession.stripeAmountTotal = stripeSession.amount_total || 0;
    checkoutSession.stripeCurrency = stripeSession.currency || 'usd';
  }

  const finalized = finalizePaidCheckoutSession(db, student, checkoutSession);
  saveDb(db);
  if (finalized.error) {
    return res.status(400).json({ error: finalized.error });
  }
  res.json({ message: finalized.message, rides: finalized.rides || [] });
});

app.post('/api/cart/:rideId', requireAuth, requireServiceAccess, (req, res) => {
  const { rideId } = req.params;
  const seatId = String(req.body.seatId || '').trim();
  const actualPickup = sanitizeRiderStop(req.body.actualPickup);
  const actualDropoff = sanitizeRiderStop(req.body.actualDropoff);
  if (req.body.termsAccepted !== true) {
    return res.status(400).json({ error: 'You must agree to the Terms and Conditions before adding this ride' });
  }
  const db = loadDb();
  const student = db.users.find((u) => u.id === req.session.userId);
  if (!student) {
    return res.status(404).json({ error: 'User not found' });
  }

  const ride = db.rides.find((r) => r.id === rideId);
  if (hasTripStartPassed(ride)) {
    return res.status(400).json({ error: 'This ride has already started and can no longer be added to your cart' });
  }
  const reserveError = canStudentReserveRide(student, ride, seatId, db);
  if (reserveError) {
    return res.status(400).json({ error: reserveError });
  }
  const stopError = validateRiderStopsForRide(ride, actualPickup, actualDropoff);
  if (stopError) {
    return res.status(400).json({ error: stopError });
  }

  const cartEntries = cleanCartEntries(db, student.id);
  const existingCartRide = cartEntries
    .filter((entry) => entry.rideId !== ride.id)
    .map((entry) => db.rides.find((cartRide) => cartRide.id === entry.rideId))
    .filter(Boolean)
    .find((cartRide) => getTripIntervals(cartRide).some((first) => getTripIntervals(ride).some((second) => intervalsOverlap(first, second))));
  if (existingCartRide) {
    return res.status(400).json({ error: 'This ride overlaps with another ride already in your cart: ' + describeTripTime(existingCartRide) });
  }
  const existingEntry = cartEntries.find((entry) => entry.rideId === ride.id);
  if (existingEntry) {
    existingEntry.seatId = seatId;
    existingEntry.actualPickup = actualPickup;
    existingEntry.actualDropoff = actualDropoff;
    existingEntry.termsAcceptedAt = new Date().toISOString();
  } else {
    cartEntries.push({ rideId: ride.id, seatId, actualPickup, actualDropoff, termsAcceptedAt: new Date().toISOString() });
  }
  saveDb(db);

  res.json({ message: 'Seat added to cart', rides: cartEntries });
});

app.delete('/api/cart/:rideId', requireAuth, requireServiceAccess, (req, res) => {
  const { rideId } = req.params;
  const db = loadDb();
  const cartEntries = cleanCartEntries(db, req.session.userId);
  db.carts[req.session.userId] = cartEntries.filter((entry) => entry.rideId !== rideId);
  saveDb(db);

  res.json({ message: 'Ride removed from cart' });
});

app.post('/api/users/:userId/block', requireAuth, requireServiceAccess, (req, res) => {
  const blockedUserId = String(req.params.userId || '').trim();
  const db = loadDb();
  const blocker = (db.users || []).find((user) => user.id === req.session.userId);
  const blockedUser = (db.users || []).find((user) => user.id === blockedUserId);
  if (!blocker) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (!blockedUser) {
    return res.status(404).json({ error: 'User to block not found' });
  }
  if (blocker.id === blockedUser.id) {
    return res.status(400).json({ error: 'You cannot block yourself' });
  }

  db.userBlocks = db.userBlocks || [];
  if (!isUserBlocked(db, blocker.id, blockedUser.id)) {
    db.userBlocks.push({
      id: uuidv4(),
      blockerId: blocker.id,
      blockedUserId: blockedUser.id,
      createdAt: new Date().toISOString(),
    });
    db.carts = db.carts || {};
    db.carts[blocker.id] = normalizeCartEntries(db, blocker.id).filter((entry) => {
      const ride = (db.rides || []).find((item) => item.id === entry.rideId);
      return !ride || ride.driverId !== blockedUser.id;
    });
    saveDb(db);
  }

  res.json({ message: getUserDisplayName(blockedUser) + ' is blocked.', blocked: true });
});

app.delete('/api/users/:userId/block', requireAuth, requireServiceAccess, (req, res) => {
  const blockedUserId = String(req.params.userId || '').trim();
  const db = loadDb();
  db.userBlocks = (db.userBlocks || []).filter((block) => !(block.blockerId === req.session.userId && block.blockedUserId === blockedUserId));
  saveDb(db);
  res.json({ message: 'User unblocked.', blocked: false });
});

app.get('/api/users/:userId/profile', requireAuth, requireServiceAccess, (req, res) => {
  const db = expireUnclaimedRideRequests(loadDb());
  const user = (db.users || []).find((entry) => entry.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const rides = Array.isArray(db.rides) ? db.rides : [];
  const rideRequests = Array.isArray(db.rideRequests) ? db.rideRequests : [];
  const createdRides = rides.filter((ride) => ride.driverId === user.id);
  const joinedRides = rides.filter((ride) => (ride.passengers || []).some((passenger) => passenger.studentId === user.id));
  const ratings = createdRides
    .flatMap((ride) => ride.passengers || [])
    .map((passenger) => Number(passenger.driverRating))
    .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5);
  const ratingAverage = ratings.length
    ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
    : null;
  const completedDrivenRides = createdRides.filter((ride) => Date.now() > getTripInterval(ride).end).length;
  const openRideRequests = rideRequests.filter((request) => request.riderId === user.id && request.status === 'open').length;
  const canSeeFullName = canUserSeeProfileFullName(db, user.id, req.session.userId);
  const maskedNameParts = getMaskedUserNameParts(user);
  const firstName = user.firstName || maskedNameParts.firstName;
  const lastName = canSeeFullName ? (user.lastName || '') : maskedNameParts.lastName;

  res.json({
    id: user.id,
    name: [firstName, lastName].filter(Boolean).join(' ') || 'User',
    firstName,
    lastName,
    profilePictureDataUrl: user.profilePictureDataUrl || '',
    classYear: user.classYear || '',
    major: user.major || '',
    fullNameVisible: canSeeFullName,
    university: getUserUniversityDisplay(user),
    universityDomain: user.universityDomain || getEmailDomain(user.email),
    memberSince: user.createdAt || null,
    serviceApproved: user.serviceApproved === true,
    isCurrentUser: user.id === req.session.userId,
    isBlockedByCurrentUser: isUserBlocked(db, req.session.userId, user.id),
    hasBlockedCurrentUser: isUserBlocked(db, user.id, req.session.userId),
    stats: {
      ridesOffered: createdRides.length,
      ridesDrivenCompleted: completedDrivenRides,
      ridesJoined: joinedRides.length,
      openRideRequests,
      driverRatingAverage: ratingAverage,
      driverRatingCount: ratings.length,
    },
  });
});

app.get('/api/profile', requireAuth, requireServiceAccess, (req, res) => {
  const db = expireUnclaimedRideRequests(loadDb());
  const studentId = req.session.userId;

  const rides = Array.isArray(db.rides) ? db.rides : [];
  const rideRequests = Array.isArray(db.rideRequests) ? db.rideRequests : [];
  const createdRides = rides.filter((ride) => ride.driverId === studentId);
  const joinedRides = rides.filter((ride) => (ride.passengers || []).some((p) => p.studentId === studentId));
  const riderRequests = rideRequests.filter((request) => request.riderId === studentId);
  const driverOffers = rideRequests.filter((request) => (request.driverOffers || []).some((offer) => offer.driverId === studentId));

  res.json({
    createdRides: createdRides.map((ride) => withRideMiles(ride, db)),
    joinedRides: joinedRides.map((ride) => {
      const passenger = (ride.passengers || []).find((p) => p.studentId === studentId);
      return {
        ...withRideMiles(ride, db),
        selectedSeatId: passenger?.seatId || '',
        actualPickup: passenger?.actualPickup || '',
        actualDropoff: passenger?.actualDropoff || '',
        driverRatingByCurrentUser: passenger?.driverRating || null,
        driverRatingCommentByCurrentUser: passenger?.driverRatingComment || '',
      };
    }),
    riderRequests,
    driverOffers,
    wallet: buildDriverWalletSummary(db, studentId),
  });
});

app.post('/api/admin/wallets/weekly-payouts', adminRateLimit, async (req, res) => {
  if (!ADMIN_PAYOUT_SECRET || !timingSafeEqualText(req.get('x-admin-secret'), ADMIN_PAYOUT_SECRET)) {
    return res.status(403).json({ error: 'Admin payout access is not configured.' });
  }
  if (!requireStripeBackedProvider(getPayoutProviderName(), res, 'weekly payouts')) return;
  const db = loadDb();
  try {
    const payouts = await createWeeklyStripePayouts(db, req.body?.userIds);
    saveDb(db);
    const posted = payouts.filter((payout) => payout.status === 'posted');
    const failed = payouts.filter((payout) => payout.status === 'failed');
    const skipped = payouts.filter((payout) => payout.status === 'skipped');
    res.json({
      message: posted.length
        ? 'Weekly Stripe payouts sent and posted wallet balances reset.'
        : 'No Stripe payouts were sent.',
      postedCount: posted.length,
      failedCount: failed.length,
      skippedCount: skipped.length,
      payouts,
    });
  } catch (err) {
    console.error('Weekly Stripe payout error:', err);
    res.status(502).json({ error: err.message || 'Unable to run weekly Stripe payouts.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let server;

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down LinkUp...`);
  try {
    await dbWritePromise;
    if (pgPool) await pgPool.end();
  } catch (err) {
    console.error('Shutdown error:', err);
  } finally {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

migrateDbOnStartup().then(() => {
  server = httpServer.listen(PORT, () => {
    console.log(`LinkUp server listening on http://localhost:${PORT}`);
  });
  server.on('error', (err) => {
    console.error('Server startup error:', err);
    process.exit(1);
  });
});
