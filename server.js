// Environment loading
// Priority: explicit LINKUP_ENV_FILE > .env
const envFile = process.env.LINKUP_ENV_FILE || '.env';
require('dotenv').config({ path: envFile });
const NODE_ENV = process.env.NODE_ENV || 'development';

const logger = require('./lib/logger');
logger.info(`LinkUp env: ${NODE_ENV} (loading ${envFile})`);

const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const nodemailer = require('nodemailer');
const webpush = require('web-push');
const apn = require('@parse/node-apn');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
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
const HOST = process.env.HOST || '';
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const EMAIL_OUTBOX_PATH = path.join(DATA_DIR, 'email-outbox.json');
const SESSION_STORE_PATH = path.join(DATA_DIR, 'sessions.json');

// Database mode
// Production uses Supabase/Postgres when DATABASE_URL is set.
// Local testing uses .env.local through npm run start:test, with no DATABASE_URL.
const DATABASE_URL = process.env.DATABASE_URL || '';
const USE_POSTGRES = Boolean(DATABASE_URL);
const DATA_ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY || '';

if (NODE_ENV === 'production' && DATA_ENCRYPTION_KEY.length < 32) {
  console.error('FATAL: DATA_ENCRYPTION_KEY must be at least 32 characters in production.');
  process.exit(1);
}

const dataEncryptionKey = DATA_ENCRYPTION_KEY
  ? crypto.createHash('sha256').update(DATA_ENCRYPTION_KEY, 'utf8').digest()
  : null;

function encryptSensitiveValue(value) {
  const plaintext = String(value || '');
  if (!plaintext) return '';
  if (!dataEncryptionKey) return plaintext;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', dataEncryptionKey, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString('base64')}:${tag.toString('base64')}:${ciphertext.toString('base64')}`;
}

function decryptSensitiveValue(value) {
  const stored = String(value || '');
  if (!stored.startsWith('enc:v1:')) return stored;
  if (!dataEncryptionKey) throw new Error('DATA_ENCRYPTION_KEY is required to decrypt protected user data');
  const parts = stored.split(':');
  if (parts.length !== 5) throw new Error('Protected user data has an invalid format');
  const decipher = crypto.createDecipheriv('aes-256-gcm', dataEncryptionKey, Buffer.from(parts[2], 'base64'));
  decipher.setAuthTag(Buffer.from(parts[3], 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(parts[4], 'base64')), decipher.final()]).toString('utf8');
}

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
const SUPPORT_EMAIL = 'ridewlinkup@gmail.com';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_USER || 'LinkUp <no-reply@linkup.local>';
const LINKUP_COMMISSION_RATE = Number(process.env.LINKUP_COMMISSION_RATE || 0.15);
const SAFETY_RECORDING_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const SAFETY_RECORDING_MAX_BASE64_CHARS = 8 * 1024 * 1024;
// Stripe charges 2.9% + $0.30 per successful card transaction (US).
// This fee is deducted from driver earnings so LinkUp's 15% is a hard profit.
const STRIPE_FEE_RATE = 0.029;
const STRIPE_FEE_FIXED_CENTS = 30;
const ADMIN_PAYOUT_SECRET = process.env.ADMIN_PAYOUT_SECRET || '';
const ADMIN_EMAILS = new Set(String(process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => normalizeEmail(email))
  .filter(Boolean));
const RIDE_SERVICES_PAUSED = process.env.RIDE_SERVICES_PAUSED !== 'false';
const LINKUP_BITES_ENABLED = process.env.LINKUP_BITES_ENABLED === 'true';
const LINKUP_SOCIAL_ENABLED = process.env.LINKUP_SOCIAL_ENABLED === 'true';
const WAITLIST_MODE = process.env.WAITLIST_MODE === 'true';
const WEEKLY_RECAP_EMAILS_ENABLED = process.env.WEEKLY_RECAP_EMAILS_ENABLED !== 'false';
const WEEKLY_RECAP_CHECK_INTERVAL_MS = 60 * 1000;
// Email verification can be bypassed in local test mode via .env.local.
const BYPASS_EMAIL_VERIFICATION = NODE_ENV !== 'production' && process.env.BYPASS_EMAIL_VERIFICATION === 'true';
const LOCAL_TEST_BYPASS_WAITLIST = NODE_ENV !== 'production' && process.env.LOCAL_TEST_BYPASS_WAITLIST === 'true';
const PAYMENT_PROVIDER = String(process.env.PAYMENT_PROVIDER || 'stripe').trim().toLowerCase();
const PAYOUT_PROVIDER = String(process.env.PAYOUT_PROVIDER || PAYMENT_PROVIDER).trim().toLowerCase();
// Stripe: use test keys locally and live keys only in production.
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || `mailto:${process.env.SMTP_USER || 'no-reply@linkup.local'}`;
const DB_SCHEMA_VERSION = 2;
const APP_VERSION = process.env.RENDER_GIT_COMMIT
  || process.env.COMMIT_SHA
  || process.env.SOURCE_VERSION
  || process.env.HEROKU_SLUG_COMMIT
  || process.env.npm_package_version
  || 'local';
// Stripe client — null when key is absent (payment endpoints return 503 gracefully)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-02-25.clover' })
  : null;
if (!stripe) {
  console.warn(`WARNING: STRIPE_SECRET_KEY not set. Payment features are disabled (env: ${NODE_ENV}).`);
}
const REQUIRED_TERMS_VERSION = process.env.REQUIRED_TERMS_VERSION || (() => {
  try {
    const tc = fs.readFileSync(path.join(__dirname, 'public', 'terms-and-conditions.md'), 'utf8');
    const dateMatch = tc.match(/\*\*Last Updated:\*\*\s+(\w+)\s+(\d+),\s+(\d{4})/);
    if (dateMatch) {
      const months = { January:1,February:2,March:3,April:4,May:5,June:6,July:7,August:8,September:9,October:10,November:11,December:12 };
      const m = String(months[dateMatch[1]]).padStart(2,'0');
      const d = String(dateMatch[2]).padStart(2,'0');
      const base = `v${dateMatch[3]}.${m}.${d}`;
      const revMatch = tc.match(/\*\*Revision:\*\*\s+(\d+)/);
      const rev = revMatch ? parseInt(revMatch[1], 10) : 0;
      return rev > 0 ? `${base}.${rev}` : base;
    }
  } catch {}
  return 'v2026.06.03';
})();
const REQUIRED_PRIVACY_VERSION = process.env.REQUIRED_PRIVACY_VERSION || 'v2026.06.2';
const TRACKING_VIEWER_TTL_MS = 1000 * 60 * 60 * 8;

const STRIKE_CATEGORIES = {
  1: [
    { id: 'rude_behavior',       label: 'Rude or disrespectful behavior' },
    { id: 'no_show',             label: 'No-show (rider or driver did not appear)' },
    { id: 'late_cancellation',   label: 'Late cancellation without notice' },
    { id: 'inaccurate_info',     label: 'Inaccurate ride information posted' },
    { id: 'minor_policy',        label: 'Minor terms of service violation' },
  ],
  2: [
    { id: 'harassment',          label: 'Harassment or threatening behavior' },
    { id: 'property_damage',     label: 'Property damage' },
    { id: 'discrimination',      label: 'Discrimination or hate speech' },
    { id: 'repeated_violations', label: 'Repeated minor violations' },
    { id: 'serious_policy',      label: 'Serious terms of service violation' },
  ],
  3: [
    { id: 'assault',             label: 'Physical assault' },
    { id: 'sexual_harassment',   label: 'Sexual harassment or assault' },
    { id: 'illegal_activity',    label: 'Illegal activity during a ride' },
    { id: 'fraud',               label: 'Fraud or intentional deception' },
    { id: 'severe_policy',       label: 'Severe terms of service violation' },
  ],
};
const STRIKE_BAN_THRESHOLD = 3;
const PUSH_NOTIFICATIONS_ENABLED = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
if (PUSH_NOTIFICATIONS_ENABLED) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// APNs (iOS native push notifications)
// Set APNS_KEY_ID, APNS_TEAM_ID, APNS_BUNDLE_ID, and either
// APNS_KEY (raw .p8 content) or APNS_KEY_PATH (path to .p8 file).
const APNS_KEY_ID = process.env.APNS_KEY_ID || '';
const APNS_TEAM_ID = process.env.APNS_TEAM_ID || '';
const APNS_BUNDLE_ID = process.env.APNS_BUNDLE_ID || 'com.linkuprides.LinkUp';
const APNS_KEY_PATH = process.env.APNS_KEY_PATH || '';
const APNS_KEY = process.env.APNS_KEY || '';
const APNS_ENABLED = Boolean(APNS_KEY_ID && APNS_TEAM_ID && (APNS_KEY || APNS_KEY_PATH));
let apnProvider = null;
if (APNS_ENABLED) {
  try {
    apnProvider = new apn.Provider({
      token: {
        key: APNS_KEY_PATH || Buffer.from(APNS_KEY.replace(/\\n/g, '\n')),
        keyId: APNS_KEY_ID,
        teamId: APNS_TEAM_ID,
      },
      production: NODE_ENV === 'production',
    });
    console.log(`APNs enabled (${NODE_ENV === 'production' ? 'production' : 'sandbox'}, bundle: ${APNS_BUNDLE_ID})`);
  } catch (err) {
    console.error('APNs provider init failed:', err.message);
  }
} else {
  console.warn('APNs not configured. Set APNS_KEY_ID, APNS_TEAM_ID, and APNS_KEY (or APNS_KEY_PATH) to enable iOS push.');
}
// SSL: auto-enabled for remote hosts (Supabase requires it).
// Override with DATABASE_SSL=true/false in your .env file.
function shouldUsePostgresSsl(databaseUrl) {
  if (process.env.DATABASE_SSL === 'true') return true;
  if (process.env.DATABASE_SSL === 'false') return false;
  return !/(localhost|127\.0\.0\.1)/i.test(databaseUrl);
}
const DATABASE_POOL_MAX = Math.max(1, Math.min(20, Number.parseInt(process.env.DATABASE_POOL_MAX || '5', 10) || 5));
const APP_INSTANCE_COUNT = Math.max(1, Number.parseInt(
  process.env.APP_INSTANCE_COUNT || process.env.WEB_CONCURRENCY || process.env.PM2_INSTANCES || '1',
  10
) || 1);

// Multiple instances are safe ONLY when Redis is configured: it shares the rate
// limiter, the Socket.IO adapter, AND cross-instance cache invalidation (a write
// on one instance publishes an invalidation the others use to reload that row).
// Money idempotency is enforced by a DB unique index, independent of caches. On
// Postgres storage each instance also needs its own connection budget, so total
// pool usage (APP_INSTANCE_COUNT × DATABASE_POOL_MAX) must fit the database.
// Without Redis, refuse the cluster — process-local caches would desync.
if (NODE_ENV === 'production' && APP_INSTANCE_COUNT !== 1 && !process.env.REDIS_URL) {
  console.error('FATAL: APP_INSTANCE_COUNT > 1 requires REDIS_URL. Redis provides the shared rate limiter, Socket.IO adapter, and cross-instance cache invalidation that keep multiple instances coherent. Set REDIS_URL or run a single instance. See docs/operations/scalability.md.');
  process.exit(1);
}
if (NODE_ENV === 'production' && APP_INSTANCE_COUNT * DATABASE_POOL_MAX > 90) {
  console.error(`FATAL: APP_INSTANCE_COUNT (${APP_INSTANCE_COUNT}) × DATABASE_POOL_MAX (${DATABASE_POOL_MAX}) = ${APP_INSTANCE_COUNT * DATABASE_POOL_MAX} exceeds a safe Postgres connection budget (90). Lower DATABASE_POOL_MAX or run fewer instances. See docs/operations/scalability.md.`);
  process.exit(1);
}

// ── Redis (optional) — shared state for horizontal scale ──────────────────
// When REDIS_URL is set, rate limits and Socket.IO fan-out run through Redis so
// they work across app instances. Without it (or if Redis is unreachable), both
// fall back to in-memory single-instance behavior — Redis being down never takes
// the app down.
const REDIS_URL = process.env.REDIS_URL || '';
let redisClient = null;          // rate-limiter client: fail fast so a Redis hiccup degrades to in-memory
let socketPubClient = null;      // Socket.IO adapter pub/sub pair: queue until connected
let socketSubClient = null;
let invalidationSub = null;      // dedicated subscriber for cross-instance cache invalidation
let redisReady = false;
if (REDIS_URL) {
  const IORedis = require('ioredis');
  redisClient = new IORedis(REDIS_URL, { maxRetriesPerRequest: 2, enableOfflineQueue: false });
  redisClient.on('ready', () => { redisReady = true; console.log('Redis connected — shared rate limits + Socket.IO fan-out enabled.'); });
  redisClient.on('error', (err) => { redisReady = false; console.error('Redis error (falling back to in-memory):', err.message); });
  redisClient.on('end', () => { redisReady = false; });
  socketPubClient = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });
  socketSubClient = socketPubClient.duplicate();
  socketPubClient.on('error', (err) => console.error('Redis pub error:', err.message));
  socketSubClient.on('error', (err) => console.error('Redis sub error:', err.message));
  invalidationSub = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });
  invalidationSub.on('error', (err) => console.error('Redis invalidation-sub error:', err.message));
}

// ── Cross-instance cache invalidation ────────────────────────────────────
// Each app instance caches data in memory. When REDIS_URL is set, every write
// publishes a small {kind, key} message; the OTHER instances reload that one
// record (or the blob) from Postgres so their caches stay coherent. Without
// Redis this is inert (single instance). Money correctness does NOT depend on
// this — duplicate credits are already blocked by the DB unique index; this is
// only about read freshness across instances.
const INSTANCE_ID = crypto.randomUUID();
const INVALIDATION_CHANNEL = 'linkup:invalidate';
const reloadHandlers = new Map(); // kind -> async (key) => reload one record from DB

function registerReload(kind, fn) { reloadHandlers.set(kind, fn); }

function publishInvalidation(kind, key) {
  if (!redisClient || !USE_POSTGRES) return;
  // Fire-and-forget; a publish failure only costs a moment of staleness elsewhere.
  redisClient.publish(INVALIDATION_CHANNEL, JSON.stringify({ from: INSTANCE_ID, kind, key: String(key) }))
    .catch(() => {});
}

async function startInvalidationSubscriber() {
  if (!invalidationSub || !USE_POSTGRES) return;
  invalidationSub.on('message', (channel, raw) => {
    if (channel !== INVALIDATION_CHANNEL) return;
    let msg;
    try { msg = JSON.parse(raw); } catch (_) { return; }
    if (!msg || msg.from === INSTANCE_ID) return; // ignore our own writes
    const handler = reloadHandlers.get(msg.kind);
    if (handler) Promise.resolve(handler(msg.key)).catch((err) => console.error(`invalidation reload (${msg.kind}) error:`, err.message));
  });
  await invalidationSub.subscribe(INVALIDATION_CHANNEL);
  console.log('Cross-instance cache invalidation subscriber active.');
}

const pgPool = USE_POSTGRES ? new Pool({
  connectionString: DATABASE_URL,
  ssl: shouldUsePostgresSsl(DATABASE_URL) ? {
    rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false',
    ...(process.env.DATABASE_SSL_CA ? { ca: process.env.DATABASE_SSL_CA.replace(/\\n/g, '\n') } : {}),
  } : false,
  max: DATABASE_POOL_MAX,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
}) : null;
fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
try { fs.chmodSync(DATA_DIR, 0o700); } catch (_) {}

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

function isMobileApiRequest(req) {
  // Native iOS/Android apps using Bearer tokens don't have a meaningful HTTP origin.
  // React Native sends no origin; some platforms send the literal string "null".
  const origin = req.get('origin');
  const hasBearer = (req.get('authorization') || '').startsWith('Bearer ');
  return hasBearer && (!origin || origin === 'null');
}

function corsOriginDelegate(origin, callback) {
  // No origin = same-origin browser request, server-to-server, or native mobile app.
  if (!origin || origin === 'null') return callback(null, true);
  if (isAllowedRequestOrigin(origin)) return callback(null, true);
  return callback(null, false);
}

function rejectCrossSiteWrites(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  // Native mobile apps using Bearer tokens bypass the origin check — the token IS the auth.
  if (isMobileApiRequest(req)) return next();
  const origin = req.get('origin');
  if (!origin || origin === 'null' || isAllowedRequestOrigin(origin)) return next();
  // Fallback: allow if origin matches this server's own host (handles misconfigured APP_BASE_URL)
  const host = req.get('host');
  const proto = (req.secure || req.get('x-forwarded-proto') === 'https') ? 'https' : 'http';
  if (host && origin === `${proto}://${host}`) return next();
  return res.status(403).json({ error: 'Request origin is not allowed' });
}

function noStoreApiResponses(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  next();
}

const UNIVERSITY_DIRECTORY = {
  // ── Already-supported schools ──────────────────────────────────────────────
  'berkeley.edu': { name: 'University of California, Berkeley', city: 'Berkeley', state: 'CA' },
  'ucla.edu': { name: 'University of California, Los Angeles', city: 'Los Angeles', state: 'CA' },
  'uci.edu': { name: 'University of California, Irvine', city: 'Irvine', state: 'CA' },
  'ivc.edu': { name: 'Irvine Valley College', city: 'Irvine', state: 'CA' },
  'saddleback.edu': { name: 'Saddleback College', city: 'Mission Viejo', state: 'CA' },
  'uwaterloo.ca': { name: 'University of Waterloo', city: 'Waterloo', state: 'ON' },
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
  // ── Alabama ────────────────────────────────────────────────────────────────
  'auburn.edu': { name: 'Auburn University', city: 'Auburn', state: 'AL' },
  'aamu.edu': { name: 'Alabama A&M University', city: 'Normal', state: 'AL' },
  'ua.edu': { name: 'University of Alabama', city: 'Tuscaloosa', state: 'AL' },
  'uab.edu': { name: 'University of Alabama at Birmingham', city: 'Birmingham', state: 'AL' },
  'southalabama.edu': { name: 'University of South Alabama', city: 'Mobile', state: 'AL' },
  'jsu.edu': { name: 'Jacksonville State University', city: 'Jacksonville', state: 'AL' },
  // ── Alaska ─────────────────────────────────────────────────────────────────
  'uaf.edu': { name: 'University of Alaska Fairbanks', city: 'Fairbanks', state: 'AK' },
  'uaa.edu': { name: 'University of Alaska Anchorage', city: 'Anchorage', state: 'AK' },
  // ── Arizona ────────────────────────────────────────────────────────────────
  'nau.edu': { name: 'Northern Arizona University', city: 'Flagstaff', state: 'AZ' },
  'gcu.edu': { name: 'Grand Canyon University', city: 'Phoenix', state: 'AZ' },
  // ── Arkansas ───────────────────────────────────────────────────────────────
  'uark.edu': { name: 'University of Arkansas', city: 'Fayetteville', state: 'AR' },
  'astate.edu': { name: 'Arkansas State University', city: 'Jonesboro', state: 'AR' },
  'atu.edu': { name: 'Arkansas Tech University', city: 'Russellville', state: 'AR' },
  // ── California ─────────────────────────────────────────────────────────────
  'calpoly.edu': { name: 'California Polytechnic State University, San Luis Obispo', city: 'San Luis Obispo', state: 'CA' },
  'cpp.edu': { name: 'California State Polytechnic University, Pomona', city: 'Pomona', state: 'CA' },
  'csub.edu': { name: 'California State University, Bakersfield', city: 'Bakersfield', state: 'CA' },
  'csuchico.edu': { name: 'California State University, Chico', city: 'Chico', state: 'CA' },
  'csudh.edu': { name: 'California State University, Dominguez Hills', city: 'Carson', state: 'CA' },
  'csufresno.edu': { name: 'California State University, Fresno', city: 'Fresno', state: 'CA' },
  'fullerton.edu': { name: 'California State University, Fullerton', city: 'Fullerton', state: 'CA' },
  'csulb.edu': { name: 'California State University, Long Beach', city: 'Long Beach', state: 'CA' },
  'calstatela.edu': { name: 'California State University, Los Angeles', city: 'Los Angeles', state: 'CA' },
  'csumb.edu': { name: 'California State University, Monterey Bay', city: 'Seaside', state: 'CA' },
  'csun.edu': { name: 'California State University, Northridge', city: 'Northridge', state: 'CA' },
  'csus.edu': { name: 'California State University, Sacramento', city: 'Sacramento', state: 'CA' },
  'csusb.edu': { name: 'California State University, San Bernardino', city: 'San Bernardino', state: 'CA' },
  'csusm.edu': { name: 'California State University, San Marcos', city: 'San Marcos', state: 'CA' },
  'csustan.edu': { name: 'California State University, Stanislaus', city: 'Turlock', state: 'CA' },
  'csuci.edu': { name: 'California State University Channel Islands', city: 'Camarillo', state: 'CA' },
  'sfsu.edu': { name: 'San Francisco State University', city: 'San Francisco', state: 'CA' },
  'sjsu.edu': { name: 'San Jose State University', city: 'San Jose', state: 'CA' },
  'sdsu.edu': { name: 'San Diego State University', city: 'San Diego', state: 'CA' },
  'chapman.edu': { name: 'Chapman University', city: 'Orange', state: 'CA' },
  'lmu.edu': { name: 'Loyola Marymount University', city: 'Los Angeles', state: 'CA' },
  'pepperdine.edu': { name: 'Pepperdine University', city: 'Malibu', state: 'CA' },
  'hmc.edu': { name: 'Harvey Mudd College', city: 'Claremont', state: 'CA' },
  'claremontmckenna.edu': { name: 'Claremont McKenna College', city: 'Claremont', state: 'CA' },
  'pomona.edu': { name: 'Pomona College', city: 'Claremont', state: 'CA' },
  'pitzer.edu': { name: 'Pitzer College', city: 'Claremont', state: 'CA' },
  'scrippscollege.edu': { name: 'Scripps College', city: 'Claremont', state: 'CA' },
  'cgu.edu': { name: 'Claremont Graduate University', city: 'Claremont', state: 'CA' },
  'usfca.edu': { name: 'University of San Francisco', city: 'San Francisco', state: 'CA' },
  'sandiego.edu': { name: 'University of San Diego', city: 'San Diego', state: 'CA' },
  'santaclara.edu': { name: 'Santa Clara University', city: 'Santa Clara', state: 'CA' },
  'calbaptist.edu': { name: 'California Baptist University', city: 'Riverside', state: 'CA' },
  'biola.edu': { name: 'Biola University', city: 'La Mirada', state: 'CA' },
  'apu.edu': { name: 'Azusa Pacific University', city: 'Azusa', state: 'CA' },
  'callutheran.edu': { name: 'California Lutheran University', city: 'Thousand Oaks', state: 'CA' },
  'laverne.edu': { name: 'University of La Verne', city: 'La Verne', state: 'CA' },
  // ── Colorado ───────────────────────────────────────────────────────────────
  'colostate.edu': { name: 'Colorado State University', city: 'Fort Collins', state: 'CO' },
  'mines.edu': { name: 'Colorado School of Mines', city: 'Golden', state: 'CO' },
  'coloradocollege.edu': { name: 'Colorado College', city: 'Colorado Springs', state: 'CO' },
  'du.edu': { name: 'University of Denver', city: 'Denver', state: 'CO' },
  'uccs.edu': { name: 'University of Colorado Colorado Springs', city: 'Colorado Springs', state: 'CO' },
  'ucdenver.edu': { name: 'University of Colorado Denver', city: 'Denver', state: 'CO' },
  // ── Connecticut ────────────────────────────────────────────────────────────
  'uconn.edu': { name: 'University of Connecticut', city: 'Storrs', state: 'CT' },
  'wesleyan.edu': { name: 'Wesleyan University', city: 'Middletown', state: 'CT' },
  'trincoll.edu': { name: 'Trinity College', city: 'Hartford', state: 'CT' },
  'quinnipiac.edu': { name: 'Quinnipiac University', city: 'Hamden', state: 'CT' },
  'fairfield.edu': { name: 'Fairfield University', city: 'Fairfield', state: 'CT' },
  'ccsu.edu': { name: 'Central Connecticut State University', city: 'New Britain', state: 'CT' },
  // ── Washington D.C. ────────────────────────────────────────────────────────
  'georgetown.edu': { name: 'Georgetown University', city: 'Washington', state: 'DC' },
  'gwu.edu': { name: 'George Washington University', city: 'Washington', state: 'DC' },
  'american.edu': { name: 'American University', city: 'Washington', state: 'DC' },
  'howard.edu': { name: 'Howard University', city: 'Washington', state: 'DC' },
  'cua.edu': { name: 'Catholic University of America', city: 'Washington', state: 'DC' },
  'gallaudet.edu': { name: 'Gallaudet University', city: 'Washington', state: 'DC' },
  // ── Delaware ───────────────────────────────────────────────────────────────
  'udel.edu': { name: 'University of Delaware', city: 'Newark', state: 'DE' },
  'desu.edu': { name: 'Delaware State University', city: 'Dover', state: 'DE' },
  // ── Florida ────────────────────────────────────────────────────────────────
  'ucf.edu': { name: 'University of Central Florida', city: 'Orlando', state: 'FL' },
  'usf.edu': { name: 'University of South Florida', city: 'Tampa', state: 'FL' },
  'fau.edu': { name: 'Florida Atlantic University', city: 'Boca Raton', state: 'FL' },
  'fiu.edu': { name: 'Florida International University', city: 'Miami', state: 'FL' },
  'miami.edu': { name: 'University of Miami', city: 'Coral Gables', state: 'FL' },
  'famu.edu': { name: 'Florida Agricultural and Mechanical University', city: 'Tallahassee', state: 'FL' },
  'fit.edu': { name: 'Florida Institute of Technology', city: 'Melbourne', state: 'FL' },
  'stetson.edu': { name: 'Stetson University', city: 'DeLand', state: 'FL' },
  'rollins.edu': { name: 'Rollins College', city: 'Winter Park', state: 'FL' },
  'lynn.edu': { name: 'Lynn University', city: 'Boca Raton', state: 'FL' },
  'fgcu.edu': { name: 'Florida Gulf Coast University', city: 'Fort Myers', state: 'FL' },
  'nova.edu': { name: 'Nova Southeastern University', city: 'Fort Lauderdale', state: 'FL' },
  // ── Georgia ────────────────────────────────────────────────────────────────
  'uga.edu': { name: 'University of Georgia', city: 'Athens', state: 'GA' },
  'emory.edu': { name: 'Emory University', city: 'Atlanta', state: 'GA' },
  'gsu.edu': { name: 'Georgia State University', city: 'Atlanta', state: 'GA' },
  'gcsu.edu': { name: 'Georgia College and State University', city: 'Milledgeville', state: 'GA' },
  'kennesaw.edu': { name: 'Kennesaw State University', city: 'Kennesaw', state: 'GA' },
  'mercer.edu': { name: 'Mercer University', city: 'Macon', state: 'GA' },
  'augusta.edu': { name: 'Augusta University', city: 'Augusta', state: 'GA' },
  'morehouse.edu': { name: 'Morehouse College', city: 'Atlanta', state: 'GA' },
  'spelman.edu': { name: 'Spelman College', city: 'Atlanta', state: 'GA' },
  // ── Hawaii ─────────────────────────────────────────────────────────────────
  'hawaii.edu': { name: 'University of Hawaii at Manoa', city: 'Honolulu', state: 'HI' },
  'hpu.edu': { name: 'Hawaii Pacific University', city: 'Honolulu', state: 'HI' },
  // ── Idaho ──────────────────────────────────────────────────────────────────
  'uidaho.edu': { name: 'University of Idaho', city: 'Moscow', state: 'ID' },
  'boisestate.edu': { name: 'Boise State University', city: 'Boise', state: 'ID' },
  'isu.edu': { name: 'Idaho State University', city: 'Pocatello', state: 'ID' },
  // ── Illinois ───────────────────────────────────────────────────────────────
  'illinois.edu': { name: 'University of Illinois Urbana-Champaign', city: 'Champaign', state: 'IL' },
  'uic.edu': { name: 'University of Illinois Chicago', city: 'Chicago', state: 'IL' },
  'depaul.edu': { name: 'DePaul University', city: 'Chicago', state: 'IL' },
  'luc.edu': { name: 'Loyola University Chicago', city: 'Chicago', state: 'IL' },
  'illinoisstate.edu': { name: 'Illinois State University', city: 'Normal', state: 'IL' },
  'niu.edu': { name: 'Northern Illinois University', city: 'DeKalb', state: 'IL' },
  'siuc.edu': { name: 'Southern Illinois University Carbondale', city: 'Carbondale', state: 'IL' },
  'bradley.edu': { name: 'Bradley University', city: 'Peoria', state: 'IL' },
  'iit.edu': { name: 'Illinois Institute of Technology', city: 'Chicago', state: 'IL' },
  'wheaton.edu': { name: 'Wheaton College', city: 'Wheaton', state: 'IL' },
  // ── Indiana ────────────────────────────────────────────────────────────────
  'indiana.edu': { name: 'Indiana University Bloomington', city: 'Bloomington', state: 'IN' },
  'purdue.edu': { name: 'Purdue University', city: 'West Lafayette', state: 'IN' },
  'nd.edu': { name: 'University of Notre Dame', city: 'Notre Dame', state: 'IN' },
  'bsu.edu': { name: 'Ball State University', city: 'Muncie', state: 'IN' },
  'butler.edu': { name: 'Butler University', city: 'Indianapolis', state: 'IN' },
  'valpo.edu': { name: 'Valparaiso University', city: 'Valparaiso', state: 'IN' },
  'iupui.edu': { name: 'Indiana University-Purdue University Indianapolis', city: 'Indianapolis', state: 'IN' },
  // ── Iowa ───────────────────────────────────────────────────────────────────
  'uiowa.edu': { name: 'University of Iowa', city: 'Iowa City', state: 'IA' },
  'iastate.edu': { name: 'Iowa State University', city: 'Ames', state: 'IA' },
  'uni.edu': { name: 'University of Northern Iowa', city: 'Cedar Falls', state: 'IA' },
  'drake.edu': { name: 'Drake University', city: 'Des Moines', state: 'IA' },
  'grinnell.edu': { name: 'Grinnell College', city: 'Grinnell', state: 'IA' },
  'coe.edu': { name: 'Coe College', city: 'Cedar Rapids', state: 'IA' },
  // ── Kansas ─────────────────────────────────────────────────────────────────
  'ku.edu': { name: 'University of Kansas', city: 'Lawrence', state: 'KS' },
  'k-state.edu': { name: 'Kansas State University', city: 'Manhattan', state: 'KS' },
  'wichita.edu': { name: 'Wichita State University', city: 'Wichita', state: 'KS' },
  'emporia.edu': { name: 'Emporia State University', city: 'Emporia', state: 'KS' },
  // ── Kentucky ───────────────────────────────────────────────────────────────
  'uky.edu': { name: 'University of Kentucky', city: 'Lexington', state: 'KY' },
  'louisville.edu': { name: 'University of Louisville', city: 'Louisville', state: 'KY' },
  'wku.edu': { name: 'Western Kentucky University', city: 'Bowling Green', state: 'KY' },
  'eku.edu': { name: 'Eastern Kentucky University', city: 'Richmond', state: 'KY' },
  'nku.edu': { name: 'Northern Kentucky University', city: 'Highland Heights', state: 'KY' },
  'murraystate.edu': { name: 'Murray State University', city: 'Murray', state: 'KY' },
  'moreheadstate.edu': { name: 'Morehead State University', city: 'Morehead', state: 'KY' },
  // ── Louisiana ──────────────────────────────────────────────────────────────
  'lsu.edu': { name: 'Louisiana State University', city: 'Baton Rouge', state: 'LA' },
  'tulane.edu': { name: 'Tulane University', city: 'New Orleans', state: 'LA' },
  'loyno.edu': { name: 'Loyola University New Orleans', city: 'New Orleans', state: 'LA' },
  'latech.edu': { name: 'Louisiana Tech University', city: 'Ruston', state: 'LA' },
  'ulm.edu': { name: 'University of Louisiana Monroe', city: 'Monroe', state: 'LA' },
  'louisiana.edu': { name: 'University of Louisiana at Lafayette', city: 'Lafayette', state: 'LA' },
  'subr.edu': { name: 'Southern University and A&M College', city: 'Baton Rouge', state: 'LA' },
  'selu.edu': { name: 'Southeastern Louisiana University', city: 'Hammond', state: 'LA' },
  // ── Maine ──────────────────────────────────────────────────────────────────
  'maine.edu': { name: 'University of Maine', city: 'Orono', state: 'ME' },
  'bowdoin.edu': { name: 'Bowdoin College', city: 'Brunswick', state: 'ME' },
  'bates.edu': { name: 'Bates College', city: 'Lewiston', state: 'ME' },
  'colby.edu': { name: 'Colby College', city: 'Waterville', state: 'ME' },
  // ── Maryland ───────────────────────────────────────────────────────────────
  'umd.edu': { name: 'University of Maryland', city: 'College Park', state: 'MD' },
  'jhu.edu': { name: 'Johns Hopkins University', city: 'Baltimore', state: 'MD' },
  'towson.edu': { name: 'Towson University', city: 'Towson', state: 'MD' },
  'umbc.edu': { name: 'University of Maryland Baltimore County', city: 'Baltimore', state: 'MD' },
  'frostburg.edu': { name: 'Frostburg State University', city: 'Frostburg', state: 'MD' },
  'loyola.edu': { name: 'Loyola University Maryland', city: 'Baltimore', state: 'MD' },
  'salisbury.edu': { name: 'Salisbury University', city: 'Salisbury', state: 'MD' },
  // ── Massachusetts ──────────────────────────────────────────────────────────
  'bc.edu': { name: 'Boston College', city: 'Chestnut Hill', state: 'MA' },
  'brandeis.edu': { name: 'Brandeis University', city: 'Waltham', state: 'MA' },
  'tufts.edu': { name: 'Tufts University', city: 'Medford', state: 'MA' },
  'wpi.edu': { name: 'Worcester Polytechnic Institute', city: 'Worcester', state: 'MA' },
  'clarku.edu': { name: 'Clark University', city: 'Worcester', state: 'MA' },
  'wellesley.edu': { name: 'Wellesley College', city: 'Wellesley', state: 'MA' },
  'williams.edu': { name: 'Williams College', city: 'Williamstown', state: 'MA' },
  'smith.edu': { name: 'Smith College', city: 'Northampton', state: 'MA' },
  'amherst.edu': { name: 'Amherst College', city: 'Amherst', state: 'MA' },
  'umass.edu': { name: 'University of Massachusetts Amherst', city: 'Amherst', state: 'MA' },
  'umb.edu': { name: 'University of Massachusetts Boston', city: 'Boston', state: 'MA' },
  'holycross.edu': { name: 'College of the Holy Cross', city: 'Worcester', state: 'MA' },
  'bentley.edu': { name: 'Bentley University', city: 'Waltham', state: 'MA' },
  'babson.edu': { name: 'Babson College', city: 'Wellesley', state: 'MA' },
  'simmons.edu': { name: 'Simmons University', city: 'Boston', state: 'MA' },
  'emerson.edu': { name: 'Emerson College', city: 'Boston', state: 'MA' },
  'suffolk.edu': { name: 'Suffolk University', city: 'Boston', state: 'MA' },
  'mtholyoke.edu': { name: 'Mount Holyoke College', city: 'South Hadley', state: 'MA' },
  'hampshire.edu': { name: 'Hampshire College', city: 'Amherst', state: 'MA' },
  'berklee.edu': { name: 'Berklee College of Music', city: 'Boston', state: 'MA' },
  // ── Michigan ───────────────────────────────────────────────────────────────
  'msu.edu': { name: 'Michigan State University', city: 'East Lansing', state: 'MI' },
  'wayne.edu': { name: 'Wayne State University', city: 'Detroit', state: 'MI' },
  'wmich.edu': { name: 'Western Michigan University', city: 'Kalamazoo', state: 'MI' },
  'cmich.edu': { name: 'Central Michigan University', city: 'Mount Pleasant', state: 'MI' },
  'emich.edu': { name: 'Eastern Michigan University', city: 'Ypsilanti', state: 'MI' },
  'oakland.edu': { name: 'Oakland University', city: 'Rochester', state: 'MI' },
  'ferris.edu': { name: 'Ferris State University', city: 'Big Rapids', state: 'MI' },
  'gvsu.edu': { name: 'Grand Valley State University', city: 'Allendale', state: 'MI' },
  'hope.edu': { name: 'Hope College', city: 'Holland', state: 'MI' },
  'calvin.edu': { name: 'Calvin University', city: 'Grand Rapids', state: 'MI' },
  'albion.edu': { name: 'Albion College', city: 'Albion', state: 'MI' },
  // ── Minnesota ──────────────────────────────────────────────────────────────
  'umn.edu': { name: 'University of Minnesota Twin Cities', city: 'Minneapolis', state: 'MN' },
  'mnsu.edu': { name: 'Minnesota State University Mankato', city: 'Mankato', state: 'MN' },
  'carleton.edu': { name: 'Carleton College', city: 'Northfield', state: 'MN' },
  'macalester.edu': { name: 'Macalester College', city: 'St. Paul', state: 'MN' },
  'stolaf.edu': { name: 'St. Olaf College', city: 'Northfield', state: 'MN' },
  'augsburg.edu': { name: 'Augsburg University', city: 'Minneapolis', state: 'MN' },
  'stthomas.edu': { name: 'University of St. Thomas', city: 'St. Paul', state: 'MN' },
  'gustavus.edu': { name: 'Gustavus Adolphus College', city: 'St. Peter', state: 'MN' },
  'bemidjistate.edu': { name: 'Bemidji State University', city: 'Bemidji', state: 'MN' },
  'hamline.edu': { name: 'Hamline University', city: 'St. Paul', state: 'MN' },
  // ── Mississippi ────────────────────────────────────────────────────────────
  'olemiss.edu': { name: 'University of Mississippi', city: 'Oxford', state: 'MS' },
  'msstate.edu': { name: 'Mississippi State University', city: 'Starkville', state: 'MS' },
  'jsums.edu': { name: 'Jackson State University', city: 'Jackson', state: 'MS' },
  'usm.edu': { name: 'University of Southern Mississippi', city: 'Hattiesburg', state: 'MS' },
  // ── Missouri ───────────────────────────────────────────────────────────────
  'missouri.edu': { name: 'University of Missouri', city: 'Columbia', state: 'MO' },
  'mst.edu': { name: 'Missouri University of Science and Technology', city: 'Rolla', state: 'MO' },
  'wustl.edu': { name: 'Washington University in St. Louis', city: 'St. Louis', state: 'MO' },
  'slu.edu': { name: 'Saint Louis University', city: 'St. Louis', state: 'MO' },
  'truman.edu': { name: 'Truman State University', city: 'Kirksville', state: 'MO' },
  'umkc.edu': { name: 'University of Missouri-Kansas City', city: 'Kansas City', state: 'MO' },
  'drury.edu': { name: 'Drury University', city: 'Springfield', state: 'MO' },
  // ── Montana ────────────────────────────────────────────────────────────────
  'umt.edu': { name: 'University of Montana', city: 'Missoula', state: 'MT' },
  'montana.edu': { name: 'Montana State University', city: 'Bozeman', state: 'MT' },
  // ── Nebraska ───────────────────────────────────────────────────────────────
  'unl.edu': { name: 'University of Nebraska-Lincoln', city: 'Lincoln', state: 'NE' },
  'unomaha.edu': { name: 'University of Nebraska at Omaha', city: 'Omaha', state: 'NE' },
  'creighton.edu': { name: 'Creighton University', city: 'Omaha', state: 'NE' },
  // ── Nevada ─────────────────────────────────────────────────────────────────
  'unlv.edu': { name: 'University of Nevada, Las Vegas', city: 'Las Vegas', state: 'NV' },
  'unr.edu': { name: 'University of Nevada, Reno', city: 'Reno', state: 'NV' },
  // ── New Hampshire ──────────────────────────────────────────────────────────
  'unh.edu': { name: 'University of New Hampshire', city: 'Durham', state: 'NH' },
  'plymouth.edu': { name: 'Plymouth State University', city: 'Plymouth', state: 'NH' },
  // ── New Jersey ─────────────────────────────────────────────────────────────
  'rutgers.edu': { name: 'Rutgers University', city: 'New Brunswick', state: 'NJ' },
  'rowan.edu': { name: 'Rowan University', city: 'Glassboro', state: 'NJ' },
  'shu.edu': { name: 'Seton Hall University', city: 'South Orange', state: 'NJ' },
  'rider.edu': { name: 'Rider University', city: 'Lawrenceville', state: 'NJ' },
  'montclair.edu': { name: 'Montclair State University', city: 'Montclair', state: 'NJ' },
  'njit.edu': { name: 'New Jersey Institute of Technology', city: 'Newark', state: 'NJ' },
  'kean.edu': { name: 'Kean University', city: 'Union', state: 'NJ' },
  'drew.edu': { name: 'Drew University', city: 'Madison', state: 'NJ' },
  'tcnj.edu': { name: 'The College of New Jersey', city: 'Ewing', state: 'NJ' },
  'monmouth.edu': { name: 'Monmouth University', city: 'West Long Branch', state: 'NJ' },
  'fdu.edu': { name: 'Fairleigh Dickinson University', city: 'Teaneck', state: 'NJ' },
  // ── New Mexico ─────────────────────────────────────────────────────────────
  'unm.edu': { name: 'University of New Mexico', city: 'Albuquerque', state: 'NM' },
  'nmsu.edu': { name: 'New Mexico State University', city: 'Las Cruces', state: 'NM' },
  'nmt.edu': { name: 'New Mexico Institute of Mining and Technology', city: 'Socorro', state: 'NM' },
  // ── New York ───────────────────────────────────────────────────────────────
  'buffalo.edu': { name: 'University at Buffalo (SUNY)', city: 'Buffalo', state: 'NY' },
  'stonybrook.edu': { name: 'Stony Brook University (SUNY)', city: 'Stony Brook', state: 'NY' },
  'albany.edu': { name: 'University at Albany (SUNY)', city: 'Albany', state: 'NY' },
  'binghamton.edu': { name: 'Binghamton University (SUNY)', city: 'Binghamton', state: 'NY' },
  'rpi.edu': { name: 'Rensselaer Polytechnic Institute', city: 'Troy', state: 'NY' },
  'syr.edu': { name: 'Syracuse University', city: 'Syracuse', state: 'NY' },
  'fordham.edu': { name: 'Fordham University', city: 'Bronx', state: 'NY' },
  'rit.edu': { name: 'Rochester Institute of Technology', city: 'Rochester', state: 'NY' },
  'rochester.edu': { name: 'University of Rochester', city: 'Rochester', state: 'NY' },
  'stjohns.edu': { name: "St. John's University", city: 'Queens', state: 'NY' },
  'marist.edu': { name: 'Marist College', city: 'Poughkeepsie', state: 'NY' },
  'vassar.edu': { name: 'Vassar College', city: 'Poughkeepsie', state: 'NY' },
  'hamilton.edu': { name: 'Hamilton College', city: 'Clinton', state: 'NY' },
  'colgate.edu': { name: 'Colgate University', city: 'Hamilton', state: 'NY' },
  'skidmore.edu': { name: 'Skidmore College', city: 'Saratoga Springs', state: 'NY' },
  'ithaca.edu': { name: 'Ithaca College', city: 'Ithaca', state: 'NY' },
  'hofstra.edu': { name: 'Hofstra University', city: 'Hempstead', state: 'NY' },
  'pace.edu': { name: 'Pace University', city: 'New York', state: 'NY' },
  'adelphi.edu': { name: 'Adelphi University', city: 'Garden City', state: 'NY' },
  'clarkson.edu': { name: 'Clarkson University', city: 'Potsdam', state: 'NY' },
  'newschool.edu': { name: 'The New School', city: 'New York', state: 'NY' },
  'baruch.cuny.edu': { name: 'Baruch College (CUNY)', city: 'New York', state: 'NY' },
  'hunter.cuny.edu': { name: 'Hunter College (CUNY)', city: 'New York', state: 'NY' },
  'brooklyn.cuny.edu': { name: 'Brooklyn College (CUNY)', city: 'Brooklyn', state: 'NY' },
  // ── North Carolina ─────────────────────────────────────────────────────────
  'ncsu.edu': { name: 'North Carolina State University', city: 'Raleigh', state: 'NC' },
  'wfu.edu': { name: 'Wake Forest University', city: 'Winston-Salem', state: 'NC' },
  'davidson.edu': { name: 'Davidson College', city: 'Davidson', state: 'NC' },
  'elon.edu': { name: 'Elon University', city: 'Elon', state: 'NC' },
  'appstate.edu': { name: 'Appalachian State University', city: 'Boone', state: 'NC' },
  'uncc.edu': { name: 'University of North Carolina at Charlotte', city: 'Charlotte', state: 'NC' },
  'ecu.edu': { name: 'East Carolina University', city: 'Greenville', state: 'NC' },
  'campbell.edu': { name: 'Campbell University', city: 'Buies Creek', state: 'NC' },
  'uncg.edu': { name: 'University of North Carolina at Greensboro', city: 'Greensboro', state: 'NC' },
  'highpoint.edu': { name: 'High Point University', city: 'High Point', state: 'NC' },
  'nccu.edu': { name: 'North Carolina Central University', city: 'Durham', state: 'NC' },
  'uncw.edu': { name: 'University of North Carolina Wilmington', city: 'Wilmington', state: 'NC' },
  // ── North Dakota ───────────────────────────────────────────────────────────
  'und.edu': { name: 'University of North Dakota', city: 'Grand Forks', state: 'ND' },
  'ndsu.edu': { name: 'North Dakota State University', city: 'Fargo', state: 'ND' },
  // ── Ohio ───────────────────────────────────────────────────────────────────
  'osu.edu': { name: 'Ohio State University', city: 'Columbus', state: 'OH' },
  'case.edu': { name: 'Case Western Reserve University', city: 'Cleveland', state: 'OH' },
  'ohio.edu': { name: 'Ohio University', city: 'Athens', state: 'OH' },
  'miamioh.edu': { name: 'Miami University', city: 'Oxford', state: 'OH' },
  'kent.edu': { name: 'Kent State University', city: 'Kent', state: 'OH' },
  'wright.edu': { name: 'Wright State University', city: 'Dayton', state: 'OH' },
  'utoledo.edu': { name: 'University of Toledo', city: 'Toledo', state: 'OH' },
  'bgsu.edu': { name: 'Bowling Green State University', city: 'Bowling Green', state: 'OH' },
  'xavier.edu': { name: 'Xavier University', city: 'Cincinnati', state: 'OH' },
  'denison.edu': { name: 'Denison University', city: 'Granville', state: 'OH' },
  'kenyon.edu': { name: 'Kenyon College', city: 'Gambier', state: 'OH' },
  'oberlin.edu': { name: 'Oberlin College', city: 'Oberlin', state: 'OH' },
  'ysu.edu': { name: 'Youngstown State University', city: 'Youngstown', state: 'OH' },
  'csuohio.edu': { name: 'Cleveland State University', city: 'Cleveland', state: 'OH' },
  'udayton.edu': { name: 'University of Dayton', city: 'Dayton', state: 'OH' },
  // ── Oklahoma ───────────────────────────────────────────────────────────────
  'ou.edu': { name: 'University of Oklahoma', city: 'Norman', state: 'OK' },
  'okstate.edu': { name: 'Oklahoma State University', city: 'Stillwater', state: 'OK' },
  'utulsa.edu': { name: 'University of Tulsa', city: 'Tulsa', state: 'OK' },
  'uco.edu': { name: 'University of Central Oklahoma', city: 'Edmond', state: 'OK' },
  // ── Oregon ─────────────────────────────────────────────────────────────────
  'oregonstate.edu': { name: 'Oregon State University', city: 'Corvallis', state: 'OR' },
  'pdx.edu': { name: 'Portland State University', city: 'Portland', state: 'OR' },
  'willamette.edu': { name: 'Willamette University', city: 'Salem', state: 'OR' },
  'reed.edu': { name: 'Reed College', city: 'Portland', state: 'OR' },
  'linfield.edu': { name: 'Linfield University', city: 'McMinnville', state: 'OR' },
  'sou.edu': { name: 'Southern Oregon University', city: 'Ashland', state: 'OR' },
  // ── Pennsylvania ───────────────────────────────────────────────────────────
  'psu.edu': { name: 'Pennsylvania State University', city: 'University Park', state: 'PA' },
  'pitt.edu': { name: 'University of Pittsburgh', city: 'Pittsburgh', state: 'PA' },
  'temple.edu': { name: 'Temple University', city: 'Philadelphia', state: 'PA' },
  'drexel.edu': { name: 'Drexel University', city: 'Philadelphia', state: 'PA' },
  'lehigh.edu': { name: 'Lehigh University', city: 'Bethlehem', state: 'PA' },
  'villanova.edu': { name: 'Villanova University', city: 'Villanova', state: 'PA' },
  'lafayette.edu': { name: 'Lafayette College', city: 'Easton', state: 'PA' },
  'swarthmore.edu': { name: 'Swarthmore College', city: 'Swarthmore', state: 'PA' },
  'haverford.edu': { name: 'Haverford College', city: 'Haverford', state: 'PA' },
  'dickinson.edu': { name: 'Dickinson College', city: 'Carlisle', state: 'PA' },
  'duq.edu': { name: 'Duquesne University', city: 'Pittsburgh', state: 'PA' },
  'cmu.edu': { name: 'Carnegie Mellon University', city: 'Pittsburgh', state: 'PA' },
  'muhlenberg.edu': { name: 'Muhlenberg College', city: 'Allentown', state: 'PA' },
  'gettysburg.edu': { name: 'Gettysburg College', city: 'Gettysburg', state: 'PA' },
  'bucknell.edu': { name: 'Bucknell University', city: 'Lewisburg', state: 'PA' },
  'iup.edu': { name: 'Indiana University of Pennsylvania', city: 'Indiana', state: 'PA' },
  'wcupa.edu': { name: 'West Chester University of Pennsylvania', city: 'West Chester', state: 'PA' },
  'millersville.edu': { name: 'Millersville University', city: 'Millersville', state: 'PA' },
  // ── Rhode Island ───────────────────────────────────────────────────────────
  'uri.edu': { name: 'University of Rhode Island', city: 'Kingston', state: 'RI' },
  'bryant.edu': { name: 'Bryant University', city: 'Smithfield', state: 'RI' },
  'providence.edu': { name: 'Providence College', city: 'Providence', state: 'RI' },
  'rwu.edu': { name: 'Roger Williams University', city: 'Bristol', state: 'RI' },
  // ── South Carolina ─────────────────────────────────────────────────────────
  'sc.edu': { name: 'University of South Carolina', city: 'Columbia', state: 'SC' },
  'clemson.edu': { name: 'Clemson University', city: 'Clemson', state: 'SC' },
  'cofc.edu': { name: 'College of Charleston', city: 'Charleston', state: 'SC' },
  'coastal.edu': { name: 'Coastal Carolina University', city: 'Conway', state: 'SC' },
  'citadel.edu': { name: 'The Citadel', city: 'Charleston', state: 'SC' },
  'wofford.edu': { name: 'Wofford College', city: 'Spartanburg', state: 'SC' },
  'furman.edu': { name: 'Furman University', city: 'Greenville', state: 'SC' },
  // ── South Dakota ───────────────────────────────────────────────────────────
  'usd.edu': { name: 'University of South Dakota', city: 'Vermillion', state: 'SD' },
  'sdstate.edu': { name: 'South Dakota State University', city: 'Brookings', state: 'SD' },
  'sdsmt.edu': { name: 'South Dakota School of Mines and Technology', city: 'Rapid City', state: 'SD' },
  // ── Tennessee ──────────────────────────────────────────────────────────────
  'utk.edu': { name: 'University of Tennessee, Knoxville', city: 'Knoxville', state: 'TN' },
  'vanderbilt.edu': { name: 'Vanderbilt University', city: 'Nashville', state: 'TN' },
  'belmont.edu': { name: 'Belmont University', city: 'Nashville', state: 'TN' },
  'lipscomb.edu': { name: 'Lipscomb University', city: 'Nashville', state: 'TN' },
  'tntech.edu': { name: 'Tennessee Technological University', city: 'Cookeville', state: 'TN' },
  'mtsu.edu': { name: 'Middle Tennessee State University', city: 'Murfreesboro', state: 'TN' },
  'rhodes.edu': { name: 'Rhodes College', city: 'Memphis', state: 'TN' },
  'memphis.edu': { name: 'University of Memphis', city: 'Memphis', state: 'TN' },
  // ── Texas ──────────────────────────────────────────────────────────────────
  'utdallas.edu': { name: 'University of Texas at Dallas', city: 'Richardson', state: 'TX' },
  'ttu.edu': { name: 'Texas Tech University', city: 'Lubbock', state: 'TX' },
  'uh.edu': { name: 'University of Houston', city: 'Houston', state: 'TX' },
  'tcu.edu': { name: 'Texas Christian University', city: 'Fort Worth', state: 'TX' },
  'smu.edu': { name: 'Southern Methodist University', city: 'Dallas', state: 'TX' },
  'rice.edu': { name: 'Rice University', city: 'Houston', state: 'TX' },
  'baylor.edu': { name: 'Baylor University', city: 'Waco', state: 'TX' },
  'unt.edu': { name: 'University of North Texas', city: 'Denton', state: 'TX' },
  'utsa.edu': { name: 'University of Texas at San Antonio', city: 'San Antonio', state: 'TX' },
  'uta.edu': { name: 'University of Texas at Arlington', city: 'Arlington', state: 'TX' },
  'shsu.edu': { name: 'Sam Houston State University', city: 'Huntsville', state: 'TX' },
  'sfasu.edu': { name: 'Stephen F. Austin State University', city: 'Nacogdoches', state: 'TX' },
  'twu.edu': { name: "Texas Woman's University", city: 'Denton', state: 'TX' },
  'txstate.edu': { name: 'Texas State University', city: 'San Marcos', state: 'TX' },
  'uhd.edu': { name: 'University of Houston-Downtown', city: 'Houston', state: 'TX' },
  'utrgv.edu': { name: 'University of Texas Rio Grande Valley', city: 'Edinburg', state: 'TX' },
  'pvamu.edu': { name: 'Prairie View A&M University', city: 'Prairie View', state: 'TX' },
  'acu.edu': { name: 'Abilene Christian University', city: 'Abilene', state: 'TX' },
  // ── Utah ───────────────────────────────────────────────────────────────────
  'utah.edu': { name: 'University of Utah', city: 'Salt Lake City', state: 'UT' },
  'usu.edu': { name: 'Utah State University', city: 'Logan', state: 'UT' },
  'byu.edu': { name: 'Brigham Young University', city: 'Provo', state: 'UT' },
  'weber.edu': { name: 'Weber State University', city: 'Ogden', state: 'UT' },
  'uvu.edu': { name: 'Utah Valley University', city: 'Orem', state: 'UT' },
  'suu.edu': { name: 'Southern Utah University', city: 'Cedar City', state: 'UT' },
  // ── Vermont ────────────────────────────────────────────────────────────────
  'uvm.edu': { name: 'University of Vermont', city: 'Burlington', state: 'VT' },
  'middlebury.edu': { name: 'Middlebury College', city: 'Middlebury', state: 'VT' },
  // ── Virginia ───────────────────────────────────────────────────────────────
  'vt.edu': { name: 'Virginia Tech', city: 'Blacksburg', state: 'VA' },
  'gmu.edu': { name: 'George Mason University', city: 'Fairfax', state: 'VA' },
  'jmu.edu': { name: 'James Madison University', city: 'Harrisonburg', state: 'VA' },
  'odu.edu': { name: 'Old Dominion University', city: 'Norfolk', state: 'VA' },
  'wm.edu': { name: 'College of William & Mary', city: 'Williamsburg', state: 'VA' },
  'radford.edu': { name: 'Radford University', city: 'Radford', state: 'VA' },
  'liberty.edu': { name: 'Liberty University', city: 'Lynchburg', state: 'VA' },
  'vcu.edu': { name: 'Virginia Commonwealth University', city: 'Richmond', state: 'VA' },
  'urich.edu': { name: 'University of Richmond', city: 'Richmond', state: 'VA' },
  'longwood.edu': { name: 'Longwood University', city: 'Farmville', state: 'VA' },
  // ── Washington ─────────────────────────────────────────────────────────────
  'wsu.edu': { name: 'Washington State University', city: 'Pullman', state: 'WA' },
  'wwu.edu': { name: 'Western Washington University', city: 'Bellingham', state: 'WA' },
  'ewu.edu': { name: 'Eastern Washington University', city: 'Cheney', state: 'WA' },
  'spu.edu': { name: 'Seattle Pacific University', city: 'Seattle', state: 'WA' },
  'seattleu.edu': { name: 'Seattle University', city: 'Seattle', state: 'WA' },
  'gonzaga.edu': { name: 'Gonzaga University', city: 'Spokane', state: 'WA' },
  'whitman.edu': { name: 'Whitman College', city: 'Walla Walla', state: 'WA' },
  'plu.edu': { name: 'Pacific Lutheran University', city: 'Tacoma', state: 'WA' },
  'cwu.edu': { name: 'Central Washington University', city: 'Ellensburg', state: 'WA' },
  'ups.edu': { name: 'University of Puget Sound', city: 'Tacoma', state: 'WA' },
  'evergreen.edu': { name: 'Evergreen State College', city: 'Olympia', state: 'WA' },
  // ── West Virginia ──────────────────────────────────────────────────────────
  'wvu.edu': { name: 'West Virginia University', city: 'Morgantown', state: 'WV' },
  'marshall.edu': { name: 'Marshall University', city: 'Huntington', state: 'WV' },
  // ── Wisconsin ──────────────────────────────────────────────────────────────
  'marquette.edu': { name: 'Marquette University', city: 'Milwaukee', state: 'WI' },
  'uwm.edu': { name: 'University of Wisconsin-Milwaukee', city: 'Milwaukee', state: 'WI' },
  'uwlax.edu': { name: 'University of Wisconsin-La Crosse', city: 'La Crosse', state: 'WI' },
  'uwsp.edu': { name: 'University of Wisconsin-Stevens Point', city: 'Stevens Point', state: 'WI' },
  'uwec.edu': { name: 'University of Wisconsin-Eau Claire', city: 'Eau Claire', state: 'WI' },
  'uwgb.edu': { name: 'University of Wisconsin-Green Bay', city: 'Green Bay', state: 'WI' },
  'beloit.edu': { name: 'Beloit College', city: 'Beloit', state: 'WI' },
  'lawrence.edu': { name: 'Lawrence University', city: 'Appleton', state: 'WI' },
  // ── Wyoming ────────────────────────────────────────────────────────────────
  'uwyo.edu': { name: 'University of Wyoming', city: 'Laramie', state: 'WY' },
  // ── Canada ─────────────────────────────────────────────────────────────────
  'utoronto.ca': { name: 'University of Toronto', city: 'Toronto', state: 'ON' },
  'mcgill.ca': { name: 'McGill University', city: 'Montreal', state: 'QC' },
  'ubc.ca': { name: 'University of British Columbia', city: 'Vancouver', state: 'BC' },
  'queensu.ca': { name: "Queen's University", city: 'Kingston', state: 'ON' },
  'mcmaster.ca': { name: 'McMaster University', city: 'Hamilton', state: 'ON' },
  'uwo.ca': { name: 'Western University', city: 'London', state: 'ON' },
  'uottawa.ca': { name: 'University of Ottawa', city: 'Ottawa', state: 'ON' },
  'dal.ca': { name: 'Dalhousie University', city: 'Halifax', state: 'NS' },
  'sfu.ca': { name: 'Simon Fraser University', city: 'Burnaby', state: 'BC' },
  'uvic.ca': { name: 'University of Victoria', city: 'Victoria', state: 'BC' },
  'ualberta.ca': { name: 'University of Alberta', city: 'Edmonton', state: 'AB' },
  'ucalgary.ca': { name: 'University of Calgary', city: 'Calgary', state: 'AB' },
  'umanitoba.ca': { name: 'University of Manitoba', city: 'Winnipeg', state: 'MB' },
  'usask.ca': { name: 'University of Saskatchewan', city: 'Saskatoon', state: 'SK' },
  'yorku.ca': { name: 'York University', city: 'Toronto', state: 'ON' },
  'concordia.ca': { name: 'Concordia University', city: 'Montreal', state: 'QC' },
  'torontomu.ca': { name: 'Toronto Metropolitan University', city: 'Toronto', state: 'ON' },
  'uoguelph.ca': { name: 'University of Guelph', city: 'Guelph', state: 'ON' },
  'carleton.ca': { name: 'Carleton University', city: 'Ottawa', state: 'ON' },
  'ontariotechu.ca': { name: 'Ontario Tech University', city: 'Oshawa', state: 'ON' },
  'uregina.ca': { name: 'University of Regina', city: 'Regina', state: 'SK' },
  'mun.ca': { name: 'Memorial University of Newfoundland', city: "St. John's", state: 'NL' },
  'unb.ca': { name: 'University of New Brunswick', city: 'Fredericton', state: 'NB' },
  'stfx.ca': { name: 'St. Francis Xavier University', city: 'Antigonish', state: 'NS' },
  'acadiau.ca': { name: 'Acadia University', city: 'Wolfville', state: 'NS' },
  'tru.ca': { name: 'Thompson Rivers University', city: 'Kamloops', state: 'BC' },
  'unbc.ca': { name: 'University of Northern British Columbia', city: 'Prince George', state: 'BC' },
  'uleth.ca': { name: 'University of Lethbridge', city: 'Lethbridge', state: 'AB' },
  'laurentian.ca': { name: 'Laurentian University', city: 'Sudbury', state: 'ON' },
  // ── Additional US & Canadian institutions ─────────────────────────────────
  'athabascau.ca': { name: 'Athabasca University', city: '', state: 'AB' },
  'augustana.ab.ca': { name: 'Augustana University College', city: '', state: 'AB' },
  'bowvalleycollege.ca': { name: 'Bow Valley College', city: '', state: 'AB' },
  'concordia.ab.ca': { name: 'Concordia University College of Alberta', city: '', state: 'AB' },
  'cal.devry.ca': { name: 'DeVry Institute of Technology', city: '', state: 'AB' },
  'kingsu.ab.ca': { name: 'King\'s University College', city: '', state: 'AB' },
  'lethbridgecollege.ca': { name: 'Lethbridge College', city: '', state: 'AB' },
  'macewan.ca': { name: 'MacEwan University', city: '', state: 'AB' },
  'mtroyal.ca': { name: 'Mount Royal University', city: '', state: 'AB' },
  'nait.ca': { name: 'Northern Alberta Institute of Technology', city: '', state: 'AB' },
  'sait.ca': { name: 'Southern Alberta Institute of Technology', city: '', state: 'AB' },
  'maricopa.edu': { name: 'Maricopa Community Colleges', city: '', state: 'AZ' },
  'bcit.ca': { name: 'British Columbia Institute of Technology', city: '', state: 'BC' },
  'bcou.ca': { name: 'British Columbia Open University', city: '', state: 'BC' },
  'camosun.bc.ca': { name: 'Camosun College', city: '', state: 'BC' },
  'capcollege.bc.ca': { name: 'Capilano College', city: '', state: 'BC' },
  'cnc.bc.ca': { name: 'College of New Caledonia', city: '', state: 'BC' },
  'cotr.bc.ca': { name: 'College of the Rockies', city: '', state: 'BC' },
  'columbiacollege.ca': { name: 'Columbia College', city: '', state: 'BC' },
  'douglas.bc.ca': { name: 'Douglas College', city: '', state: 'BC' },
  'eciad.bc.ca': { name: 'Emily Carr Institute of Art + Design', city: '', state: 'BC' },
  'kwantlen.bc.ca': { name: 'Kwantleen University College', city: '', state: 'BC' },
  'kpu.ca': { name: 'Kwantlen Polytechnic University', city: '', state: 'BC' },
  'langara.bc.ca': { name: 'Langara College', city: '', state: 'BC' },
  'mala.bc.ca': { name: 'Malaspina University College', city: '', state: 'BC' },
  'nvit.bc.ca': { name: 'Nicola Valley Institute of Technology', city: '', state: 'BC' },
  'nic.bc.ca': { name: 'North Island College', city: '', state: 'BC' },
  'nlc.bc.ca': { name: 'Northern Lights College', city: '', state: 'BC' },
  'okanagan.bc.ca': { name: 'Okanagan University College', city: '', state: 'BC' },
  'picollege.ca': { name: 'Pacific International College', city: '', state: 'BC' },
  'questu.ca': { name: 'Quest University', city: '', state: 'BC' },
  'royalroads.ca': { name: 'Royal Roads University', city: '', state: 'BC' },
  'sauder.ubc.ca': { name: 'Sauder School of Business', city: '', state: 'BC' },
  'selkirk.bc.ca': { name: 'Selkirk College', city: '', state: 'BC' },
  'twu.ca': { name: 'Trinity Western University', city: '', state: 'BC' },
  'universitycanadawest.ca': { name: 'University Canada West', city: '', state: 'BC' },
  'cariboo.bc.ca': { name: 'University College of the Cariboo', city: '', state: 'BC' },
  'ufv.ca': { name: 'University of the Fraser Valley', city: '', state: 'BC' },
  'vcc.ca': { name: 'Vancouver Community College', city: '', state: 'BC' },
  'academyart.edu': { name: 'Academy of Art University', city: '', state: 'CA' },
  'minerva.edu': { name: 'Minerva University', city: '', state: 'CA' },
  'valleycollege.edu': { name: 'San Bernardino Valley College', city: '', state: 'CA' },
  'sdcity.edu': { name: 'San Diego City College', city: '', state: 'CA' },
  'sdmesa.edu': { name: 'San Diego Mesa College', city: '', state: 'CA' },
  'sdmiramar.edu': { name: 'San Diego Miramar College', city: '', state: 'CA' },
  'denvercollegeofnursing.edu': { name: 'Denver College of Nursing', city: '', state: 'CO' },
  'floridapoly.edu': { name: 'Florida Polytechnic University', city: '', state: 'FL' },
  'gulfcoast.edu': { name: 'Gulf Coast State College', city: '', state: 'FL' },
  'southflorida.edu': { name: 'South Florida State College', city: '', state: 'FL' },
  'abac.edu': { name: 'Abraham Baldwin Agricultural College', city: '', state: 'GA' },
  'allencollege.edu': { name: 'Allen College', city: '', state: 'IA' },
  'dom.edu': { name: 'Dominican University', city: '', state: 'IL' },
  'uiuc.edu': { name: 'University of Illinois Urbana-Champaign', city: '', state: 'IL' },
  'ksu.edu': { name: 'Kansas State University', city: '', state: 'KS' },
  'lsus.edu': { name: 'Louisiana State University - Shreveport', city: '', state: 'LA' },
  'stonehill.edu': { name: 'Stonehill College', city: '', state: 'MA' },
  'brandonu.ca': { name: 'Brandon University', city: '', state: 'MB' },
  'cmu.ca': { name: 'Canadian Mennonite University', city: '', state: 'MB' },
  'ustboniface.mb.ca': { name: 'University College of Saint-Boniface', city: '', state: 'MB' },
  'uwinnipeg.ca': { name: 'University of Winnipeg', city: '', state: 'MB' },
  'boothcollege.ca': { name: 'William and Catherine Booth College', city: '', state: 'MB' },
  'unity.edu': { name: 'Unity Environmental College', city: '', state: 'ME' },
  'nmc.edu': { name: 'Northwestern Michigan College', city: '', state: 'MI' },
  'northwood.edu': { name: 'Northwood University', city: '', state: 'MI' },
  'olivetcollege.edu': { name: 'The University of Olivet', city: '', state: 'MI' },
  'westminster-mo.edu': { name: 'Westminster College of Fulton', city: '', state: 'MO' },
  'mta.ca': { name: 'Mount Allison University', city: '', state: 'NB' },
  'umoncton.ca': { name: 'University of Moncton', city: '', state: 'NB' },
  'cuslm.ca': { name: 'University of Moncton, Edmundston', city: '', state: 'NB' },
  'cus.ca': { name: 'University of Moncton, Shippagan', city: '', state: 'NB' },
  'unbsj.ca': { name: 'University of New Brunswick, Saint John', city: '', state: 'NB' },
  'lr.edu': { name: 'Lenoir-Rhyne University', city: '', state: 'NC' },
  'umo.edu': { name: 'University of Mount Olive', city: '', state: 'NC' },
  'ucs.mun.ca': { name: 'Memorial University of Newfoundland', city: '', state: 'NL' },
  'msvu.ca': { name: 'Mount Saint Vincent University', city: '', state: 'NS' },
  'nsac.ns.ca': { name: 'Nova Scotia Agricultural College', city: '', state: 'NS' },
  'nscad.ns.ca': { name: 'Nova Scotia College of Art and Design', city: '', state: 'NS' },
  'uccb.ns.ca': { name: 'University College of Cape Breton', city: '', state: 'NS' },
  'ukings.ns.ca': { name: 'University of King\'s College', city: '', state: 'NS' },
  'sfc.edu': { name: 'St. Francis College', city: '', state: 'NY' },
  'suny.oneonta.edu': { name: 'State University of New York at Oneonta', city: '', state: 'NY' },
  'oneonta.edu': { name: 'State University of New York College at Oneonta', city: '', state: 'NY' },
  'sunybroome.edu': { name: 'SUNY Broome Community College', city: '', state: 'NY' },
  'capital.edu': { name: 'Capital University', city: '', state: 'OH' },
  'defiance.edu': { name: 'Defiance College', city: '', state: 'OH' },
  'assumptionu.ca': { name: 'Assumption University', city: '', state: 'ON' },
  'brocku.ca': { name: 'Brock University', city: '', state: 'ON' },
  'mycambrian.ca': { name: 'Cambrian College', city: '', state: 'ON' },
  'ccbc.ca': { name: 'Canadian College of Business & Computers', city: '', state: 'ON' },
  'centennialcollege.ca': { name: 'Centennial College', city: '', state: 'ON' },
  'borealc.on.ca': { name: 'Collège Boréal', city: '', state: 'ON' },
  'conestogac.on.ca': { name: 'Conestoga College', city: '', state: 'ON' },
  'dcmail.ca': { name: 'Durham College', city: '', state: 'ON' },
  'fanshawec.ca': { name: 'Fanshawe College', city: '', state: 'ON' },
  'gbrownc.on.ca': { name: 'George Brown College', city: '', state: 'ON' },
  'georgiancollege.ca': { name: 'Georgian College', city: '', state: 'ON' },
  'humber.ca': { name: 'Humber College', city: '', state: 'ON' },
  'huronuc.on.ca': { name: 'Huron University College', city: '', state: 'ON' },
  'lakeheadu.ca': { name: 'Lakehead University', city: '', state: 'ON' },
  'lambtoncollege.ca': { name: 'Lambton College', city: '', state: 'ON' },
  'mohawkcollege.ca': { name: 'Mohawk College', city: '', state: 'ON' },
  'niagaracollege.ca': { name: 'Niagara College Canada', city: '', state: 'ON' },
  'nipissingu.ca': { name: 'Nipissing University', city: '', state: 'ON' },
  'ocad.ca': { name: 'Ontario College of Art and Design', city: '', state: 'ON' },
  'redeemer.ca': { name: 'Redeemer College', city: '', state: 'ON' },
  'rmc.ca': { name: 'Royal Military College of Canada', city: '', state: 'ON' },
  'ryerson.ca': { name: 'Ryerson Polytechnic University', city: '', state: 'ON' },
  'senecacollege.ca': { name: 'Seneca College', city: '', state: 'ON' },
  'sheridancollege.ca': { name: 'Sheridan College', city: '', state: 'ON' },
  'trentu.ca': { name: 'Trent University', city: '', state: 'ON' },
  'uoit.ca': { name: 'University of Ontario Institute of Technology', city: '', state: 'ON' },
  'utm.utoronto.ca': { name: 'University of Toronto, Mississauga', city: '', state: 'ON' },
  'scar.utoronto.ca': { name: 'University of Toronto, Scarborough', city: '', state: 'ON' },
  'trinity.utoronto.ca': { name: 'University of Trinity College', city: '', state: 'ON' },
  'uwindsor.ca': { name: 'University of Windsor', city: '', state: 'ON' },
  'vicu.utoronto.ca': { name: 'Victoria University Toronto, University of Toronto', city: '', state: 'ON' },
  'wlu.ca': { name: 'Wilfrid Laurier University', city: '', state: 'ON' },
  'alvernia.edu': { name: 'Alvernia University', city: '', state: 'PA' },
  'bloomu.edu': { name: 'Bloomsburg University of Pennsylvania', city: '', state: 'PA' },
  'cup.edu': { name: 'California University of Pennsylvania', city: '', state: 'PA' },
  'clarion.edu': { name: 'Clarion University of Pennsylvania', city: '', state: 'PA' },
  'esu.edu': { name: 'East Stroudsburg State University of Pennsylvania', city: '', state: 'PA' },
  'edinboro.edu': { name: 'Edinboro University of Pennsylvania', city: '', state: 'PA' },
  'gmercyu.edu': { name: 'Gwynedd Mercy University', city: '', state: 'PA' },
  'kutztown.edu': { name: 'Kutztown University of Pennsylvania', city: '', state: 'PA' },
  'mansfield.edu': { name: 'Mansfield University of Pennsylvania', city: '', state: 'PA' },
  'mercyhurst.edu': { name: 'Mercyhurst University', city: '', state: 'PA' },
  'pct.edu': { name: 'Pennsylvania College of Technology', city: '', state: 'PA' },
  'pennhighlands.edu': { name: 'Pennsylvania Highlands Community College', city: '', state: 'PA' },
  'pit.edu': { name: 'Pennsylvania Institute of Technology', city: '', state: 'PA' },
  'sl.psu.edu': { name: 'Pennsylvania State University - Schuylkill Campus', city: '', state: 'PA' },
  'pittstate.edu': { name: 'Pittsburg State University', city: '', state: 'PA' },
  'pti.edu': { name: 'Pittsburgh Technical Institute', city: '', state: 'PA' },
  'pointpark.edu': { name: 'Point Park University', city: '', state: 'PA' },
  'ship.edu': { name: 'Shippensburg University of Pennsylvania', city: '', state: 'PA' },
  'sru.edu': { name: 'Slippery Rock University of Pennsylvania', city: '', state: 'PA' },
  'upb.pitt.edu': { name: 'University of Pittsburgh at Bradford', city: '', state: 'PA' },
  'upj.pitt.edu': { name: 'University of Pittsburgh at Johnstown', city: '', state: 'PA' },
  'upmc.edu': { name: 'University of Pittsburgh Medical Center', city: '', state: 'PA' },
  'upt.pitt.edu': { name: 'University of Pittsburgh-Titusville', city: '', state: 'PA' },
  'westminster.edu': { name: 'Westminster College of New Wilmington', city: '', state: 'PA' },
  'ycp.edu': { name: 'York College of Pennsylvania', city: '', state: 'PA' },
  'upei.ca': { name: 'University of Prince Edward Island', city: '', state: 'PE' },
  'ubishops.ca': { name: 'Bishop\'s University', city: '', state: 'QC' },
  'cstj.qc.ca': { name: 'Cégep de Saint-Jérôme', city: '', state: 'QC' },
  'bdeb.qc.ca': { name: 'College of Bois-de-Boulogne', city: '', state: 'QC' },
  'collegeuniversel.ca': { name: 'Collège Universel Gatineau', city: '', state: 'QC' },
  'dawsoncollege.qc.ca': { name: 'Dawson College', city: '', state: 'QC' },
  'etsmtl.ca': { name: 'École de technologie supérieure, Université du Québec', city: '', state: 'QC' },
  'hec.ca': { name: 'École des Hautes Études Commerciales', city: '', state: 'QC' },
  'enap.uquebec.ca': { name: 'École nationale d\'administration publique, Université du Québec', city: '', state: 'QC' },
  'polymtl.ca': { name: 'École Polytechnique de Montréal, Université de Montréal', city: '', state: 'QC' },
  'iaf.inrs.ca': { name: 'Institut Armand-Frappier, Université du Québec', city: '', state: 'QC' },
  'inrs.uquebec.ca': { name: 'Institut National de la Recherche Scientifique, Université du Québec', city: '', state: 'QC' },
  'teluq.uquebec.ca': { name: 'Télé-université, Université du Québec', city: '', state: 'QC' },
  'umontreal.ca': { name: 'Université de Montréal', city: '', state: 'QC' },
  'usherb.ca': { name: 'Université de Sherbrooke', city: '', state: 'QC' },
  'uqac.ca': { name: 'Université du Québec à Chicoutimi', city: '', state: 'QC' },
  'uqam.ca': { name: 'Université du Québec à Montréal', city: '', state: 'QC' },
  'uqar.uquebec.ca': { name: 'Université du Québec à Rimouski', city: '', state: 'QC' },
  'uqtr.uquebec.ca': { name: 'Université du Québec à Trois-Rivières', city: '', state: 'QC' },
  'uqat.uquebec.ca': { name: 'Université du Québec en Abitibi-Témiscamingue', city: '', state: 'QC' },
  'uqo.ca': { name: 'Université du Québec en Outaouais', city: '', state: 'QC' },
  'ulaval.ca': { name: 'Université Laval', city: '', state: 'QC' },
  'uquebec.ca': { name: 'University of Québec', city: '', state: 'QC' },
  'vaniercollege.qc.ca': { name: 'Vanier College', city: '', state: 'QC' },
  'andersonuniversity.edu': { name: 'Anderson University', city: '', state: 'SC' },
  'firstnationsuniversity.ca': { name: 'First Nations University of Canada', city: '', state: 'SK' },
  'dallascollege.edu': { name: 'Dallas College', city: '', state: 'TX' },
  'schreiner.edu': { name: 'Schreiner University', city: '', state: 'TX' },
  'stmarytx.edu': { name: 'St. Mary\'s University', city: '', state: 'TX' },
  'untdallas.edu': { name: 'University of North Texas at Dallas', city: '', state: 'TX' },
  'svu.edu': { name: 'Southern Virginia University', city: '', state: 'VA' },
  'bellevuecollege.edu': { name: 'Bellevue College', city: '', state: 'WA' },
  'spokane.edu': { name: 'Spokane Colleges', city: '', state: 'WA' },
  'wallawalla.edu': { name: 'Walla Walla University', city: '', state: 'WA' },
  'yukoncollege.yk.ca': { name: 'Yukon College', city: '', state: 'YT' },
  'ancollege.edu': { name: 'Aaniiih Nakoda College', city: '', state: '' },
  'stonybrookmedicine.edu': { name: 'Academic medical center at State University of New York at Stony Brook', city: '', state: '' },
  'www.sunyacc.edu': { name: 'Adirondack Community College', city: '', state: '' },
  'adrian.edu': { name: 'Adrian College', city: '', state: '' },
  'agnesscott.edu': { name: 'Agnes Scott College', city: '', state: '' },
  'atc.edu': { name: 'Aiken Technical College', city: '', state: '' },
  'aims.edu': { name: 'Aims Community College', city: '', state: '' },
  'afit.edu': { name: 'Air Force Institute of Technology', city: '', state: '' },
  'ascc.edu': { name: 'Alabama Southern Community College', city: '', state: '' },
  'alasu.edu': { name: 'Alabama State University', city: '', state: '' },
  'alamancecc.edu': { name: 'Alamance Community College', city: '', state: '' },
  'aloma.edu': { name: 'Alamo Colleges', city: '', state: '' },
  'alamo.edu': { name: 'Alamo Colleges District', city: '', state: '' },
  'alaskapacific.edu': { name: 'Alaska Pacific University', city: '', state: '' },
  'asurams.edu': { name: 'Albany State University', city: '', state: '' },
  'albanytech.edu': { name: 'Albany Technical College', city: '', state: '' },
  'acofi.edu': { name: 'Albertson College of Idaho', city: '', state: '' },
  'alcorn.edu': { name: 'Alcorn State University', city: '', state: '' },
  'alextech.edu': { name: 'Alexandria Technical & Community College', city: '', state: '' },
  'alfred.edu': { name: 'Alfred University', city: '', state: '' },
  'hancockcollege.edu': { name: 'Allan Hancock College', city: '', state: '' },
  'allegany.edu': { name: 'Allegany College of Maryland', city: '', state: '' },
  'alleg.edu': { name: 'Allegheny College', city: '', state: '' },
  'allencc.edu': { name: 'Allen County Community College', city: '', state: '' },
  'allenuniversity.edu': { name: 'Allen University', city: '', state: '' },
  'allencol.edu': { name: 'Allentown College of Saint Francis de Sales', city: '', state: '' },
  'alliant.edu': { name: 'Alliant International University', city: '', state: '' },
  'alma.edu': { name: 'Alma College', city: '', state: '' },
  'alpenacc.edu': { name: 'Alpena Community College', city: '', state: '' },
  'alverno.edu': { name: 'Alverno College', city: '', state: '' },
  'alvincollege.edu': { name: 'Alvin Community College', city: '', state: '' },
  'actx.edu': { name: 'Amarillo College', city: '', state: '' },
  'ambassador.edu': { name: 'Ambassador University', city: '', state: '' },
  'aada.edu': { name: 'American Academy of Dramatic Arts-New York', city: '', state: '' },
  'abcnash.edu': { name: 'American Baptist College', city: '', state: '' },
  'amercoastuniv.edu': { name: 'American Coastline University', city: '', state: '' },
  'aic.edu': { name: 'American International College', city: '', state: '' },
  'apus.edu': { name: 'American Public University System', city: '', state: '' },
  'arc.losrios.edu': { name: 'American River College', city: '', state: '' },
  'ancilla.edu': { name: 'Ancilla College', city: '', state: '' },
  'andrewcollege.edu': { name: 'Andrew College', city: '', state: '' },
  'andrews.edu': { name: 'Andrews University', city: '', state: '' },
  'angelina.edu': { name: 'Angelina College', city: '', state: '' },
  'angelo.edu': { name: 'Angelo State University', city: '', state: '' },
  'aacc.edu': { name: 'Anne Arundel Community College', city: '', state: '' },
  'anokatech.edu': { name: 'Anoka Technical College', city: '', state: '' },
  'anokaramsey.edu': { name: 'Anoka-Ramsey Community College', city: '', state: '' },
  'avc.edu': { name: 'Antelope Valley College', city: '', state: '' },
  'antiochne.edu': { name: 'Antioch New England', city: '', state: '' },
  'antioch.edu': { name: 'Antioch University', city: '', state: '' },
  'antiochla.edu': { name: 'Antioch University - Los Angeles', city: '', state: '' },
  'seattleantioch.edu': { name: 'Antioch University - Seattle', city: '', state: '' },
  'aquinas.edu': { name: 'Aquinas College', city: '', state: '' },
  'arapahoe.edu': { name: 'Arapahoe Community College', city: '', state: '' },
  'arcadia.edu': { name: 'Arcadia College', city: '', state: '' },
  'azwestern.edu': { name: 'Arizona Western College', city: '', state: '' },
  'uapb.edu': { name: 'Arkansas at Pine Bluff, University of', city: '', state: '' },
  'arkansasbaptist.edu': { name: 'Arkansas Baptist College', city: '', state: '' },
  'anc.edu': { name: 'Arkansas Northeastern College', city: '', state: '' },
  'asub.edu': { name: 'Arkansas State University-Beebe', city: '', state: '' },
  'asumh.edu': { name: 'Arkansas State University-Mountain Home', city: '', state: '' },
  'asun.edu': { name: 'Arkansas State University-Newport', city: '', state: '' },
  'armstrong.edu': { name: 'Armstrong State College', city: '', state: '' },
  'asa.edu': { name: 'ASA College', city: '', state: '' },
  'abtech.edu': { name: 'Asheville-Buncombe Technical Community College', city: '', state: '' },
  'ashford.edu': { name: 'Ashford University', city: '', state: '' },
  'ashland.kctcs.edu': { name: 'Ashland Community and Technical College', city: '', state: '' },
  'ashland.edu': { name: 'Ashland University', city: '', state: '' },
  'asnuntuck.edu': { name: 'Asnuntuck Community College', city: '', state: '' },
  'aspen.edu': { name: 'Aspen University', city: '', state: '' },
  'assumption.edu': { name: 'Assumption College', city: '', state: '' },
  'athens.edu': { name: 'Athens State University', city: '', state: '' },
  'athenstech.edu': { name: 'Athens Technical College', city: '', state: '' },
  'atlantatech.edu': { name: 'Atlanta Technical College', city: '', state: '' },
  'atlantic.edu': { name: 'Atlantic Cape Community College', city: '', state: '' },
  'aum.edu': { name: 'Auburn University at Montgomery', city: '', state: '' },
  'augustatech.edu': { name: 'Augusta Technical College', city: '', state: '' },
  'augustana.edu': { name: 'Augustana College (IL)', city: '', state: '' },
  'augie.edu': { name: 'Augustana College (SD)', city: '', state: '' },
  'aurora.edu': { name: 'Aurora University', city: '', state: '' },
  'austincollege.edu': { name: 'Austin College', city: '', state: '' },
  'austincc.edu': { name: 'Austin Community College', city: '', state: '' },
  'apsu.edu': { name: 'Austin Peay State University', city: '', state: '' },
  'averett.edu': { name: 'Averett College', city: '', state: '' },
  'avila.edu': { name: 'Avila College', city: '', state: '' },
  'bainbridge.edu': { name: 'Bainbridge State College', city: '', state: '' },
  'baker.edu': { name: 'Baker College', city: '', state: '' },
  'bakeru.edu': { name: 'Baker University', city: '', state: '' },
  'bakersfieldcollege.edu': { name: 'Bakersfield College', city: '', state: '' },
  'bw.edu': { name: 'Baldwin Wallace University', city: '', state: '' },
  'bccc.edu': { name: 'Baltimore City Community College', city: '', state: '' },
  'bbc.edu': { name: 'Baptist Bible College', city: '', state: '' },
  'b-sc.edu': { name: 'Barber-Scotia College', city: '', state: '' },
  'bard.edu': { name: 'Bard College', city: '', state: '' },
  'barnard.edu': { name: 'Barnard College', city: '', state: '' },
  'barry.edu': { name: 'Barry University', city: '', state: '' },
  'barstow.edu': { name: 'Barstow Community College', city: '', state: '' },
  'bartonccc.edu': { name: 'Barton County Community College', city: '', state: '' },
  'bastyr.edu': { name: 'Bastyr University', city: '', state: '' },
  'bates.ctc.edu': { name: 'Bates Technical College', city: '', state: '' },
  'mybrcc.edu': { name: 'Baton Rouge Community College', city: '', state: '' },
  'bau.edu': { name: 'Bay Atlantic University', city: '', state: '' },
  'baycollege.edu': { name: 'Bay de Noc Community College', city: '', state: '' },
  'bmcc.edu': { name: 'Bay Mills Community College', city: '', state: '' },
  'baypath.edu': { name: 'Bay Path University', city: '', state: '' },
  'bcm.edu': { name: 'Baylor College of Medicine', city: '', state: '' },
  'beaufortccc.edu': { name: 'Beaufort County Community College', city: '', state: '' },
  'belhaven.edu': { name: 'Belhaven University', city: '', state: '' },
  'bellevue.edu': { name: 'Bellevue University', city: '', state: '' },
  'btc.ctc.edu': { name: 'Bellingham Technical College', city: '', state: '' },
  'belmontcollege.edu': { name: 'Belmont College', city: '', state: '' },
  'benedict.edu': { name: 'Benedict College', city: '', state: '' },
  'benedictine.edu': { name: 'Benedictine College', city: '', state: '' },
  'bennet.edu': { name: 'Bennett College', city: '', state: '' },
  'bennington.edu': { name: 'Bennington College', city: '', state: '' },
  'berea.edu': { name: 'Berea College', city: '', state: '' },
  'bergen.edu': { name: 'Bergen Community College', city: '', state: '' },
  'berkeleycitycollege.edu': { name: 'Berkeley City College', city: '', state: '' },
  'berkeleycollege.edu': { name: 'Berkeley College', city: '', state: '' },
  'berkshirecc.edu': { name: 'Berkshire Community College', city: '', state: '' },
  'berry.edu': { name: 'Berry College', city: '', state: '' },
  'bethanywv.edu': { name: 'Bethany College', city: '', state: '' },
  'bethelks.edu': { name: 'Bethel College (KS)', city: '', state: '' },
  'bethel.edu': { name: 'Bethel University', city: '', state: '' },
  'cookman.edu': { name: 'Bethune-Cookman University', city: '', state: '' },
  'bscc.edu': { name: 'Bevill State Community College', city: '', state: '' },
  'bigbend.edu': { name: 'Big Bend Community College', city: '', state: '' },
  'bigsandy.kctcs.edu': { name: 'Big Sandy Community and Technical College', city: '', state: '' },
  'bsc.edu': { name: 'Birmingham-Southern College', city: '', state: '' },
  'bishop.edu': { name: 'Bishop State Community College', city: '', state: '' },
  'bismarckstate.edu': { name: 'Bismark State College', city: '', state: '' },
  'bhc.edu': { name: 'Black Hawk College', city: '', state: '' },
  'bhsu.edu': { name: 'Black Hills State University', city: '', state: '' },
  'blackrivertech.edu': { name: 'Black River Technical College', city: '', state: '' },
  'bfcc.edu': { name: 'Blackfeet Community College', city: '', state: '' },
  'blackhawk.edu': { name: 'Blackhawk Technical College', city: '', state: '' },
  'bladencc.edu': { name: 'Bladen Community College', city: '', state: '' },
  'blinn.edu': { name: 'Blinn College', city: '', state: '' },
  'bloomfield.edu': { name: 'Bloomfield College', city: '', state: '' },
  'bluecc.edu': { name: 'Blue Mountain Community College', city: '', state: '' },
  'blueridgectc.edu': { name: 'Blue Ridge Community and Technical College', city: '', state: '' },
  'blueridge.edu': { name: 'Blue Ridge Community College', city: '', state: '' },
  'brcc.edu': { name: 'Blue Ridge Community College', city: '', state: '' },
  'bluefieldstate.edu': { name: 'Bluefield State College', city: '', state: '' },
  'bluegrass.kctcs.edu': { name: 'Bluegrass Community and Technical College', city: '', state: '' },
  'bluffton.edu': { name: 'Bluffton College', city: '', state: '' },
  'bju.edu': { name: 'Bob Jones University', city: '', state: '' },
  'bpcc.edu': { name: 'Bossier Parish Community College', city: '', state: '' },
  'bgsp.edu': { name: 'Boston Graduate School of Psychoanalysis', city: '', state: '' },
  'bowiestate.edu': { name: 'Bowie State University', city: '', state: '' },
  'brandman.edu': { name: 'Brandman University', city: '', state: '' },
  'brenau.edu': { name: 'Brenau University', city: '', state: '' },
  'brescia.edu': { name: 'Brescia University', city: '', state: '' },
  'briar-cliff.edu': { name: 'Briar Cliff College', city: '', state: '' },
  'bridgemont.edu': { name: 'Bridgemont Community and Technical College', city: '', state: '' },
  'bridgewater.edu': { name: 'Bridgewater College', city: '', state: '' },
  'bridgew.edu': { name: 'Bridgewater State University', city: '', state: '' },
  'byui.edu': { name: 'Brigham Young University - Idaho', city: '', state: '' },
  'byuh.edu': { name: 'Brigham Young University Hawaii', city: '', state: '' },
  'bristolcc.edu': { name: 'Bristol Community College', city: '', state: '' },
  'brookdalecc.edu': { name: 'Brookdale Community College', city: '', state: '' },
  'brookhavencollege.edu': { name: 'Brookhaven College', city: '', state: '' },
  'brookings.edu': { name: 'Brookings Institution', city: '', state: '' },
  'broward.edu': { name: 'Broward College', city: '', state: '' },
  'brunswickcc.edu': { name: 'Brunswick Community College', city: '', state: '' },
  'brynmawr.edu': { name: 'Bryn Mawr College', city: '', state: '' },
  'bucks.edu': { name: 'Bucks County Community College', city: '', state: '' },
  'bvu.edu': { name: 'Buena Vista University', city: '', state: '' },
  'bhcc.mass.edu': { name: 'Bunker Hill Community College', city: '', state: '' },
  'butlercc.edu': { name: 'Butler Community College', city: '', state: '' },
  'bc3.edu': { name: 'Butler County Community College', city: '', state: '' },
  'butte.edu': { name: 'Butte College', city: '', state: '' },
  'cabrillo.edu': { name: 'Cabrillo College', city: '', state: '' },
  'cabrini.edu': { name: 'Cabrini University', city: '', state: '' },
  'cccti.edu': { name: 'Caldwell Community College and Technical Institute', city: '', state: '' },
  'caldwell.edu': { name: 'Caldwell University', city: '', state: '' },
  'calhoun.edu': { name: 'Calhoun Community College', city: '', state: '' },
  'calcoast.edu': { name: 'California Coast University', city: '', state: '' },
  'cca.edu': { name: 'California College of the Arts', city: '', state: '' },
  'calarts.edu': { name: 'California Institute of the Arts', city: '', state: '' },
  'csum.edu': { name: 'California Maritime Academy', city: '', state: '' },
  'cnuas.edu': { name: 'California National University', city: '', state: '' },
  'calsouthern.edu': { name: 'California Southern University', city: '', state: '' },
  'csueastbay.edu': { name: 'California State University', city: '', state: '' },
  'calstate.edu': { name: 'California State University System', city: '', state: '' },
  'csuhayward.edu': { name: 'California State University, Hayward', city: '', state: '' },
  'cusm.edu': { name: 'California University of Science and Medicine', city: '', state: '' },
  'camdencc.edu': { name: 'Camden County College', city: '', state: '' },
  'cameron.edu': { name: 'Cameron University', city: '', state: '' },
  'campbellsville.edu': { name: 'Campbellsville College', city: '', state: '' },
  'canadacollege.edu': { name: 'Canada College', city: '', state: '' },
  'canisius.edu': { name: 'Canisius College', city: '', state: '' },
  'littlehoop.edu': { name: 'Cankdeska Cikana Community College', city: '', state: '' },
  'capecod.edu': { name: 'Cape Cod Community College', city: '', state: '' },
  'cfcc.edu': { name: 'Cape Fear Community College', city: '', state: '' },
  'capella.edu': { name: 'Capella University', city: '', state: '' },
  'ccc.commnet.edu': { name: 'Capital Community College', city: '', state: '' },
  'captechu.edu': { name: 'Capitol Technology University', city: '', state: '' },
  'ccnn.edu': { name: 'Career College of Northern Nevada', city: '', state: '' },
  'carlalbert.edu': { name: 'Carl Albert State College', city: '', state: '' },
  'sandburg.edu': { name: 'Carl Sandburg College', city: '', state: '' },
  'carlow.edu': { name: 'Carlow College', city: '', state: '' },
  'carolinascollege.edu': { name: 'Carolinas College of Health Sciences', city: '', state: '' },
  'carrington.edu': { name: 'Carrington College California-Sacramento', city: '', state: '' },
  'carroll.edu': { name: 'Carroll College', city: '', state: '' },
  'carrollcc.edu': { name: 'Carroll Community College', city: '', state: '' },
  'carrollu.edu': { name: 'Carroll University', city: '', state: '' },
  'cn.edu': { name: 'Carson-Newman College', city: '', state: '' },
  'carteret.edu': { name: 'Carteret Community College', city: '', state: '' },
  'carthage.edu': { name: 'Carthage College', city: '', state: '' },
  'carver.edu': { name: 'Carver College', city: '', state: '' },
  'cascadia.edu': { name: 'Cascadia Community College', city: '', state: '' },
  'caspercollege.edu': { name: 'Casper College', city: '', state: '' },
  'castleton.edu': { name: 'Castleton State University', city: '', state: '' },
  'catawba.edu': { name: 'Catawba College', city: '', state: '' },
  'cvcc.edu': { name: 'Catawba Valley Community College', city: '', state: '' },
  'cayuga-cc.edu': { name: 'Cayuga County Community College', city: '', state: '' },
  'cecil.edu': { name: 'Cecil College', city: '', state: '' },
  'cedarvalleycollege.edu': { name: 'Cedar Valley College', city: '', state: '' },
  'cedarville.edu': { name: 'Cedarville College', city: '', state: '' },
  'centenary.edu': { name: 'Centenary College of Louisiana', city: '', state: '' },
  'cacc.edu': { name: 'Central Alabama Community College', city: '', state: '' },
  'centralaz.edu': { name: 'Central Arizona College', city: '', state: '' },
  'cccc.edu': { name: 'Central Carolina Community College', city: '', state: '' },
  'cctech.edu': { name: 'Central Carolina Technical College', city: '', state: '' },
  'central.edu': { name: 'Central College', city: '', state: '' },
  'cccneb.edu': { name: 'Central Community College', city: '', state: '' },
  'centralgatech.edu': { name: 'Central Georgia Technical College', city: '', state: '' },
  'www.clcmn.edu': { name: 'Central Lakes College-Brainerd', city: '', state: '' },
  'cmcc.edu': { name: 'Central Maine Community College', city: '', state: '' },
  'cmmccollege.edu': { name: 'Central Maine Medical Center College of Nursing and Health Professions', city: '', state: '' },
  'cmc.edu': { name: 'Central Methodist College', city: '', state: '' },
  'cnm.edu': { name: 'Central New Mexico Community College', city: '', state: '' },
  'cotc.edu': { name: 'Central Ohio Technical College', city: '', state: '' },
  'cocc.edu': { name: 'Central Oregon Community College', city: '', state: '' },
  'cpcc.edu': { name: 'Central Piedmont Community College', city: '', state: '' },
  'centralstate.edu': { name: 'Central State University', city: '', state: '' },
  'ctcd.edu': { name: 'Central Texas College', city: '', state: '' },
  'cvcc.vccs.edu': { name: 'Central Virginia Community College', city: '', state: '' },
  'cwc.edu': { name: 'Central Wyoming College', city: '', state: '' },
  'centre.edu': { name: 'Centre College', city: '', state: '' },
  'century.edu': { name: 'Century College', city: '', state: '' },
  'cerritos.edu': { name: 'Cerritos College', city: '', state: '' },
  'cerrocoso.edu': { name: 'Cerro Coso Community College', city: '', state: '' },
  'chabotcollege.edu': { name: 'Chabot College', city: '', state: '' },
  'clpccd.edu': { name: 'Chabot-Las Positas Community College District', city: '', state: '' },
  'csc.edu': { name: 'Chadron State College', city: '', state: '' },
  'chaffey.edu': { name: 'Chaffey College', city: '', state: '' },
  'chaminade.edu': { name: 'Chaminade University of Honolulu', city: '', state: '' },
  'champlain.edu': { name: 'Champlain College', city: '', state: '' },
  'cgc.maricopa.edu': { name: 'Chandler-Gilbert Community College', city: '', state: '' },
  'chatfield.edu': { name: 'Chatfield College', city: '', state: '' },
  'chatham.edu': { name: 'Chatham College', city: '', state: '' },
  'chattahoocheetech.edu': { name: 'Chattahoochee Technical College', city: '', state: '' },
  'cv.edu': { name: 'Chattahoochee Valley Community College', city: '', state: '' },
  'chattanoogastate.edu': { name: 'Chattanooga State Community College', city: '', state: '' },
  'chemeketa.edu': { name: 'Chemeketa Community College', city: '', state: '' },
  'chesapeake.edu': { name: 'Chesapeake College', city: '', state: '' },
  'cheyney.edu': { name: 'Cheyney University', city: '', state: '' },
  'csopp.edu': { name: 'Chicago School of Professional Psychology', city: '', state: '' },
  'csu.edu': { name: 'Chicago State University', city: '', state: '' },
  'cdkc.edu': { name: 'Chief Dull Knife College', city: '', state: '' },
  'cvtc.edu': { name: 'Chippewa Valley Technical College', city: '', state: '' },
  'cbu.edu': { name: 'Christian Brothers University', city: '', state: '' },
  'cts.edu': { name: 'Christian Theological Seminary', city: '', state: '' },
  'cnu.edu': { name: 'Christopher Newport University', city: '', state: '' },
  'cincinnatistate.edu': { name: 'Cincinnati State Technical and Community College', city: '', state: '' },
  'cisco.edu': { name: 'Cisco College', city: '', state: '' },
  'citruscollege.edu': { name: 'Citrus College', city: '', state: '' },
  'ccsf.edu': { name: 'City College of San Francisco', city: '', state: '' },
  'ccc.edu': { name: 'City Colleges of Chicago', city: '', state: '' },
  'cityu.edu': { name: 'City University', city: '', state: '' },
  'cuny.edu': { name: 'City University of New York', city: '', state: '' },
  'clackamas.edu': { name: 'Clackamas Community College', city: '', state: '' },
  'claflin.edu': { name: 'Claflin University', city: '', state: '' },
  'claremont.edu': { name: 'Claremont Colleges', city: '', state: '' },
  'cgs.edu': { name: 'Claremont Graduate School', city: '', state: '' },
  'cst.edu': { name: 'Claremont School of Theology', city: '', state: '' },
  'clarendoncollege.edu': { name: 'Clarendon College', city: '', state: '' },
  'cau.edu': { name: 'Clark Atlanta University', city: '', state: '' },
  'clark.edu': { name: 'Clark College', city: '', state: '' },
  'clarkstate.edu': { name: 'Clark State Community College', city: '', state: '' },
  'clarke.edu': { name: 'Clarke College', city: '', state: '' },
  'clatsopcc.edu': { name: 'Clatsop Community College', city: '', state: '' },
  'clayton.edu': { name: 'Clayton State College', city: '', state: '' },
  'clevelandcc.edu': { name: 'Cleveland Community College', city: '', state: '' },
  'clevelandstatecc.edu': { name: 'Cleveland State Community College', city: '', state: '' },
  'clinch.edu': { name: 'Clinch Valley College', city: '', state: '' },
  'clintoncollege.edu': { name: 'Clinton College', city: '', state: '' },
  'clinton.edu': { name: 'Clinton Community College', city: '', state: '' },
  'cloud.edu': { name: 'Cloud County Community College', city: '', state: '' },
  'cptc.edu': { name: 'Clover Park Technical College', city: '', state: '' },
  'clovis.edu': { name: 'Clovis Community College', city: '', state: '' },
  'coahomacc.edu': { name: 'Coahoma Community College', city: '', state: '' },
  'cccd.edu': { name: 'Coast Colleges', city: '', state: '' },
  'coastalalabama.edu': { name: 'Coastal Alabama Community College', city: '', state: '' },
  'coastalbend.edu': { name: 'Coastal Bend College', city: '', state: '' },
  'coastalcarolina.edu': { name: 'Coastal Carolina Community College', city: '', state: '' },
  'coastalpines.edu': { name: 'Coastal Pines Technical College', city: '', state: '' },
  'coastline.edu': { name: 'Coastline Community College', city: '', state: '' },
  'cochise.edu': { name: 'Cochise College', city: '', state: '' },
  'coconino.edu': { name: 'Coconino Community College', city: '', state: '' },
  'coffeyville.edu': { name: 'Coffeyville Community College', city: '', state: '' },
  'coker.edu': { name: 'Coker College', city: '', state: '' },
  'colbycc.edu': { name: 'Colby Community College', city: '', state: '' },
  'cshl.edu': { name: 'Cold Spring Harbor Laboratory', city: '', state: '' },
  'peralta.edu': { name: 'College of Alameda', city: '', state: '' },
  'cod.edu': { name: 'College of DuPage', city: '', state: '' },
  'ceu.edu': { name: 'College of Eastern Utah', city: '', state: '' },
  'www.clcillinois.edu': { name: 'College of Lake County', city: '', state: '' },
  'marin.edu': { name: 'College of Marin', city: '', state: '' },
  'mountsaintvincent.edu': { name: 'College of Mount Saint Vincent', city: '', state: '' },
  'cnr.edu': { name: 'College of New Rochelle', city: '', state: '' },
  'csbsju.edu': { name: 'College of Saint Benedict', city: '', state: '' },
  'stkate.edu': { name: 'College of Saint Catherine', city: '', state: '' },
  'strose.edu': { name: 'College of Saint Rose', city: '', state: '' },
  'collegeofsanmateo.edu': { name: 'College of San Mateo', city: '', state: '' },
  'csi.edu': { name: 'College of Southern Idaho', city: '', state: '' },
  'csmd.edu': { name: 'College of Southern Maryland', city: '', state: '' },
  'csn.edu': { name: 'College of Southern Nevada', city: '', state: '' },
  'stfrancis.edu': { name: 'College of St. Francis', city: '', state: '' },
  'css.edu': { name: 'College of St. Scholastica', city: '', state: '' },
  'albemarle.edu': { name: 'College of the Albemarle', city: '', state: '' },
  'coa.edu': { name: 'College of the Atlantic', city: '', state: '' },
  'canyons.edu': { name: 'College of the Canyons', city: '', state: '' },
  'collegeofthedesert.edu': { name: 'College of the Desert', city: '', state: '' },
  'com.edu': { name: 'College of the Mainland', city: '', state: '' },
  'coto.edu': { name: 'College of the Ouachitas', city: '', state: '' },
  'redwoods.edu': { name: 'College of the Redwoods', city: '', state: '' },
  'cos.edu': { name: 'College of the Sequoias', city: '', state: '' },
  'siskiyous.edu': { name: 'College of the Siskiyous', city: '', state: '' },
  'wooster.edu': { name: 'College of Wooster', city: '', state: '' },
  'collin.edu': { name: 'Collin County Community College District', city: '', state: '' },
  'ccu.edu': { name: 'Colorado Christian University', city: '', state: '' },
  'cccs.edu': { name: 'Colorado Community College System', city: '', state: '' },
  'coloradomesa.edu': { name: 'Colorado Mesa University', city: '', state: '' },
  'cncc.edu': { name: 'Colorado Northwestern Community College', city: '', state: '' },
  'csuglobal.edu': { name: 'Colorado State University - Global Campus', city: '', state: '' },
  'csupueblo.edu': { name: 'Colorado State University-Pueblo', city: '', state: '' },
  'coloradotech.edu': { name: 'Colorado Technical University', city: '', state: '' },
  'columbiabasin.edu': { name: 'Columbia Basin College', city: '', state: '' },
  'gocolumbia.edu': { name: 'Columbia College (CA)', city: '', state: '' },
  'ccis.edu': { name: 'Columbia College (MO)', city: '', state: '' },
  'columbiasc.edu': { name: 'Columbia College (SC)', city: '', state: '' },
  'colum.edu': { name: 'Columbia College Chicago', city: '', state: '' },
  'colsouth.edu': { name: 'Columbia Southern University', city: '', state: '' },
  'columbiastate.edu': { name: 'Columbia State Community College', city: '', state: '' },
  'cuc.edu': { name: 'Columbia Union College', city: '', state: '' },
  'sunycgcc.edu': { name: 'Columbia-Greene Community College', city: '', state: '' },
  'cscc.edu': { name: 'Columbus State Community College', city: '', state: '' },
  'columbusstate.edu': { name: 'Columbus State University', city: '', state: '' },
  'columbustech.edu': { name: 'Columbus Technical College', city: '', state: '' },
  'ccac.edu': { name: 'Community College of Allegheny County', city: '', state: '' },
  'ccaurora.edu': { name: 'Community College of Aurora', city: '', state: '' },
  'ccbcmd.edu': { name: 'Community College of Baltimore County', city: '', state: '' },
  'ccbc.edu': { name: 'Community College of Beaver County', city: '', state: '' },
  'ccd.edu': { name: 'Community College of Denver', city: '', state: '' },
  'ccp.edu': { name: 'Community College of Philadelphia', city: '', state: '' },
  'ccri.edu': { name: 'Community College of Rhode Island', city: '', state: '' },
  'ccv.edu': { name: 'Community College of Vermont', city: '', state: '' },
  'ccsnh.edu': { name: 'Community College System of New Hampshire', city: '', state: '' },
  'ccaa.edu': { name: 'Concordia College - Ann Arbor', city: '', state: '' },
  'cord.edu': { name: 'Concordia College - Moorhead', city: '', state: '' },
  'ccsn.edu': { name: 'Concordia College - Seward', city: '', state: '' },
  'csp.edu': { name: 'Concordia College - St. Paul', city: '', state: '' },
  'cuw.edu': { name: 'Concordia University Wisconsin', city: '', state: '' },
  'conncoll.edu': { name: 'Connecticut College', city: '', state: '' },
  'ct.edu': { name: 'Connecticut State University System', city: '', state: '' },
  'connorsstate.edu': { name: 'Connors State College', city: '', state: '' },
  'contracosta.edu': { name: 'Contra Costa College', city: '', state: '' },
  '4cd.edu': { name: 'Contra Costa Community College District', city: '', state: '' },
  'cooper.edu': { name: 'Cooper Union for the Advancement of Science and Art', city: '', state: '' },
  'colin.edu': { name: 'Copiah-Lincoln Community College', city: '', state: '' },
  'cmccd.edu': { name: 'Copper Mountain Community College', city: '', state: '' },
  'coppin.edu': { name: 'Coppin State University', city: '', state: '' },
  'cornell-iowa.edu': { name: 'Cornell College', city: '', state: '' },
  'cornellcollege.edu': { name: 'Cornell College', city: '', state: '' },
  'corning-cc.edu': { name: 'Corning Community College', city: '', state: '' },
  'cccua.edu': { name: 'Cossatot Community College of the University of Arkansas', city: '', state: '' },
  'crc.losrios.edu': { name: 'Cosumnes River College', city: '', state: '' },
  'ccm.edu': { name: 'County College of Morris', city: '', state: '' },
  'covenant.edu': { name: 'Covenant College', city: '', state: '' },
  'cowley.edu': { name: 'Cowley County Community College', city: '', state: '' },
  'craftonhills.edu': { name: 'Crafton Hills College', city: '', state: '' },
  'cravencc.edu': { name: 'Craven Community College', city: '', state: '' },
  'crowder.edu': { name: 'Crowder College', city: '', state: '' },
  'www.cuesta.edu': { name: 'Cuesta College', city: '', state: '' },
  'cccnj.edu': { name: 'Cumberland County College', city: '', state: '' },
  'bmcc.cuny.edu': { name: 'CUNY Borough of Manhattan Community College', city: '', state: '' },
  'bcc.cuny.edu': { name: 'CUNY Bronx Community College', city: '', state: '' },
  'ccny.cuny.edu': { name: 'CUNY City College of NY', city: '', state: '' },
  'citytech.cuny.edu': { name: 'CUNY City Tech', city: '', state: '' },
  'csi.cuny.edu': { name: 'CUNY College of Staten Island', city: '', state: '' },
  'hostos.cuny.edu': { name: 'CUNY Hostos Community College', city: '', state: '' },
  'jjay.cuny.edu': { name: 'CUNY John Jay College of Criminal Justice', city: '', state: '' },
  'kbcc.cuny.edu': { name: 'CUNY Kingsborough Community College', city: '', state: '' },
  'lagcc.cuny.edu': { name: 'CUNY LaGuardia Community College', city: '', state: '' },
  'lehman.cuny.edu': { name: 'CUNY Lehman College', city: '', state: '' },
  'macauly.cuny.edu': { name: 'CUNY Macauly Honors College', city: '', state: '' },
  'mec.cuny.edu': { name: 'CUNY Medgar Evers College', city: '', state: '' },
  'qc.cuny.edu': { name: 'CUNY Queens College', city: '', state: '' },
  'qcc.cuny.edu': { name: 'CUNY Queensborough Community College', city: '', state: '' },
  'law.cuny.edu': { name: 'CUNY School of Law', city: '', state: '' },
  'york.cuny.edu': { name: 'CUNY York College', city: '', state: '' },
  'curry.edu': { name: 'Curry College', city: '', state: '' },
  'tri-c.edu': { name: 'Cuyahoga Community College District', city: '', state: '' },
  'cuyamaca.edu': { name: 'Cuyamaca College', city: '', state: '' },
  'cypresscollege.edu': { name: 'Cypress College', city: '', state: '' },
  'dslcc.edu': { name: 'Dabney S Lancaster Community College', city: '', state: '' },
  'daemen.edu': { name: 'Daemen College', city: '', state: '' },
  'dakotacollege.edu': { name: 'Dakota College at Bottineau', city: '', state: '' },
  'dctc.edu': { name: 'Dakota County Technical College', city: '', state: '' },
  'dsu.edu': { name: 'Dakota State University', city: '', state: '' },
  'dwu.edu': { name: 'Dakota Wesleyan University', city: '', state: '' },
  'dbu.edu': { name: 'Dallas Baptist University', city: '', state: '' },
  'dcccd.edu': { name: 'Dallas County Community College', city: '', state: '' },
  'daltonstate.edu': { name: 'Dalton State College', city: '', state: '' },
  'dana.edu': { name: 'Dana College', city: '', state: '' },
  'dwc.edu': { name: 'Daniel Webster College', city: '', state: '' },
  'dacc.edu': { name: 'Danville Area Community College', city: '', state: '' },
  'dcc.vccs.edu': { name: 'Danville Community College', city: '', state: '' },
  'darton.edu': { name: 'Darton State College', city: '', state: '' },
  'davenport.edu': { name: 'Davenport University', city: '', state: '' },
  'davidsonccc.edu': { name: 'Davidson County Community College', city: '', state: '' },
  'davidsondavie.edu': { name: 'Davidson-Davie Community College', city: '', state: '' },
  'dne.wvnet.edu': { name: 'Davis & Elkins College', city: '', state: '' },
  'dewv.edu': { name: 'Davis & Elkins College', city: '', state: '' },
  'daviscollege.edu': { name: 'Davis College', city: '', state: '' },
  'dawson.edu': { name: 'Dawson Community College', city: '', state: '' },
  'daytonastate.edu': { name: 'Daytona State College', city: '', state: '' },
  'deanza.edu': { name: 'De Anza College', city: '', state: '' },
  'dliflc.edu': { name: 'Defense Language Institute Foreign Language Center', city: '', state: '' },
  'delmar.edu': { name: 'Del Mar College', city: '', state: '' },
  'dcad.edu': { name: 'Delaware College of Art and Design', city: '', state: '' },
  'dccc.edu': { name: 'Delaware County Community College', city: '', state: '' },
  'dtcc.edu': { name: 'Delaware Technical Community College', city: '', state: '' },
  'delval.edu': { name: 'Delaware Valley University', city: '', state: '' },
  'dcc.edu': { name: 'Delgado Community College', city: '', state: '' },
  'delta.edu': { name: 'Delta College', city: '', state: '' },
  'deltastate.edu': { name: 'Delta State University', city: '', state: '' },
  'denmarktech.edu': { name: 'Denmark Technical College', city: '', state: '' },
  'depauw.edu': { name: 'DePauw University', city: '', state: '' },
  'dmacc.edu': { name: 'Des Moines Area Community College', city: '', state: '' },
  'dmu.edu': { name: 'Des Moines University', city: '', state: '' },
  'dsdt.edu': { name: 'Detroit School of Technology', city: '', state: '' },
  'devry.edu': { name: 'DeVry Institute of Technology', city: '', state: '' },
  'dvc.edu': { name: 'Diablo Valley College', city: '', state: '' },
  'dickinsonstate.edu': { name: 'Dickinson State University', city: '', state: '' },
  'digipen.edu': { name: 'DigiPen Institute of Technology', city: '', state: '' },
  'dillard.edu': { name: 'Dillard University', city: '', state: '' },
  'doane.edu': { name: 'Doane University', city: '', state: '' },
  'dc3.edu': { name: 'Dodge City Community College', city: '', state: '' },
  'dominican.edu': { name: 'Dominican College', city: '', state: '' },
  'dordt.edu': { name: 'Dordt College', city: '', state: '' },
  'dowling.edu': { name: 'Dowling College', city: '', state: '' },
  'durhamtech.edu': { name: 'Durham Technical Community College', city: '', state: '' },
  'sunydutchess.edu': { name: 'Dutchess Community College', city: '', state: '' },
  'dscc.edu': { name: 'Dyersburg State Community College', city: '', state: '' },
  'earlham.edu': { name: 'Earlham College', city: '', state: '' },
  'www.eacc.edu': { name: 'East Arkansas Community College', city: '', state: '' },
  'eastcentral.edu': { name: 'East Central College', city: '', state: '' },
  'eccc.edu': { name: 'East Central Community College', city: '', state: '' },
  'ecok.edu': { name: 'East Central University', city: '', state: '' },
  'elac.edu': { name: 'East Los Angeles College', city: '', state: '' },
  'eastms.edu': { name: 'East Mississippi Community College', city: '', state: '' },
  'etsu.edu': { name: 'East Tennessee State University', city: '', state: '' },
  'etbu.edu': { name: 'East Texas Baptist University', city: '', state: '' },
  'eac.edu': { name: 'Eastern Arizona College', city: '', state: '' },
  'easternct.edu': { name: 'Eastern Connecticut State University', city: '', state: '' },
  'easternflorida.edu': { name: 'Eastern Florida State College', city: '', state: '' },
  'egcc.edu': { name: 'Eastern Gateway Community College', city: '', state: '' },
  'eitc.edu': { name: 'Eastern Idaho Technical College', city: '', state: '' },
  'eiu.edu': { name: 'Eastern Illinois University', city: '', state: '' },
  'eicc.edu': { name: 'Eastern Iowa Community College District', city: '', state: '' },
  'emcc.edu': { name: 'Eastern Maine Community College', city: '', state: '' },
  'emu.edu': { name: 'Eastern Mennonite University', city: '', state: '' },
  'enmu.edu': { name: 'Eastern New Mexico University', city: '', state: '' },
  'roswell.enmu.edu': { name: 'Eastern New Mexico University-Roswell Campus', city: '', state: '' },
  'eosc.edu': { name: 'Eastern Oklahoma State College', city: '', state: '' },
  'eou.edu': { name: 'Eastern Oregon State College', city: '', state: '' },
  'es.vccs.edu': { name: 'Eastern Shore Community College', city: '', state: '' },
  'evms.edu': { name: 'Eastern Virginia Medical School', city: '', state: '' },
  'eastern.wvnet.edu': { name: 'Eastern West Virginia Community and Technical College', city: '', state: '' },
  'ewc.wy.edu': { name: 'Eastern Wyoming College', city: '', state: '' },
  'eastfieldcollege.edu': { name: 'Eastfield College', city: '', state: '' },
  'eckerd.edu': { name: 'Eckerd College', city: '', state: '' },
  'ecpi.edu': { name: 'ECPI University', city: '', state: '' },
  'edgecombe.edu': { name: 'Edgecombe Community College', city: '', state: '' },
  'edgewood.edu': { name: 'Edgewood College', city: '', state: '' },
  'edisonohio.edu': { name: 'Edison State Community College', city: '', state: '' },
  'edcc.edu': { name: 'Edmonds Community College', city: '', state: '' },
  'ewc.edu': { name: 'Edward Waters University', city: '', state: '' },
  'einsteinmed.edu': { name: 'Einsteinmed', city: '', state: '' },
  'compton.edu': { name: 'El Camino College-Compton Center', city: '', state: '' },
  'elcamino.edu': { name: 'El Camino Community College District', city: '', state: '' },
  'elcentrocollege.edu': { name: 'El Centro College', city: '', state: '' },
  'epcc.edu': { name: 'El Paso Community College', city: '', state: '' },
  'elgin.edu': { name: 'Elgin Community College', city: '', state: '' },
  'ecsu.edu': { name: 'Elizabeth City State University', city: '', state: '' },
  'etown.edu': { name: 'Elizabethtown College', city: '', state: '' },
  'elizabethtown.kctcs.edu': { name: 'Elizabethtown Community and Technical College', city: '', state: '' },
  'elmhurst.edu': { name: 'Elmhurst College', city: '', state: '' },
  'elms.edu': { name: 'Elms College', city: '', state: '' },
  'erau.edu': { name: 'Embry-Riddle Aeronautical University', city: '', state: '' },
  'emmanuel.edu': { name: 'Emmanuel College', city: '', state: '' },
  'ehc.edu': { name: 'Emory & Henry College', city: '', state: '' },
  'endicott.edu': { name: 'Endicott College', city: '', state: '' },
  'escc.edu': { name: 'Enterprise State Community College', city: '', state: '' },
  'ecc.edu': { name: 'Erie Community College', city: '', state: '' },
  'essex.edu': { name: 'Essex County College', city: '', state: '' },
  'estrellamountain.edu': { name: 'Estrella Mountain Community College', city: '', state: '' },
  'everest.edu': { name: 'Everest College', city: '', state: '' },
  'everettcc.edu': { name: 'Everett Community College', city: '', state: '' },
  'evc.edu': { name: 'Evergreen Valley College', city: '', state: '' },
  'fairmontstate.edu': { name: 'Fairmont State College', city: '', state: '' },
  'uncfsu.edu': { name: 'Fayetteville State University', city: '', state: '' },
  'faytechcc.edu': { name: 'Fayetteville Technical Community College', city: '', state: '' },
  'frc.edu': { name: 'Feather River Community College District', city: '', state: '' },
  'fielding.edu': { name: 'Fielding Institute', city: '', state: '' },
  'flcc.edu': { name: 'Finger Lakes Community College', city: '', state: '' },
  'fisk.edu': { name: 'Fisk University', city: '', state: '' },
  'fsc.edu': { name: 'Fitchburg State College', city: '', state: '' },
  'fvcc.edu': { name: 'Flathead Valley Community College', city: '', state: '' },
  'fhtc.edu': { name: 'Flint Hills Technical College', city: '', state: '' },
  'www.fdtc.edu': { name: 'Florence-Darlington Technical College', city: '', state: '' },
  'fkcc.edu': { name: 'Florida Keys Community College', city: '', state: '' },
  'fmuniv.edu': { name: 'Florida Memorial University', city: '', state: '' },
  'flsouthern.edu': { name: 'Florida Southern College', city: '', state: '' },
  'fsw.edu': { name: 'Florida SouthWestern State College', city: '', state: '' },
  'fscj.edu': { name: 'Florida State College at Jacksonville', city: '', state: '' },
  'flc.losrios.edu': { name: 'Folsom Lake College', city: '', state: '' },
  'fdltcc.edu': { name: 'Fond du Lac Tribal and Community College', city: '', state: '' },
  'fontbonne.edu': { name: 'Fontbonne College', city: '', state: '' },
  'foothill.edu': { name: 'Foothill College', city: '', state: '' },
  'fhda.edu': { name: 'Foothill-De Anza Community College District', city: '', state: '' },
  'forsythtech.edu': { name: 'Forsyth Technical Community College', city: '', state: '' },
  'fhsu.edu': { name: 'Fort Hays State University', city: '', state: '' },
  'fortlewis.edu': { name: 'Fort Lewis College', city: '', state: '' },
  'fpcc.edu': { name: 'Fort Peck Community College', city: '', state: '' },
  'fortscott.edu': { name: 'Fort Scott Community College', city: '', state: '' },
  'fvsu.edu': { name: 'Fort Valley State University', city: '', state: '' },
  'fountainheadcollege.edu': { name: 'Fountainhead College of Technology', city: '', state: '' },
  'foxcollege.edu': { name: 'Fox College', city: '', state: '' },
  'fvtc.edu': { name: 'Fox Valley Technical College', city: '', state: '' },
  'g.fmarion.edu': { name: 'Francis Marion University', city: '', state: '' },
  'fpctx.edu': { name: 'Frank Phillips College', city: '', state: '' },
  'fandm.edu': { name: 'Franklin and Marshall College', city: '', state: '' },
  'fplc.edu': { name: 'Franklin Pierce Law Center', city: '', state: '' },
  'franklinpierce.edu': { name: 'Franklin Pierce University', city: '', state: '' },
  'franklin.edu': { name: 'Franklin University', city: '', state: '' },
  'frederick.edu': { name: 'Frederick Community College', city: '', state: '' },
  'fresnocitycollege.edu': { name: 'Fresno City College', city: '', state: '' },
  'fresno.edu': { name: 'Fresno Pacific University', city: '', state: '' },
  'friends.edu': { name: 'Friends University', city: '', state: '' },
  'frontrange.edu': { name: 'Front Range Community College', city: '', state: '' },
  'fullsail.edu': { name: 'Full Sail University', city: '', state: '' },
  'fuller.edu': { name: 'Fuller Theological Seminary', city: '', state: '' },
  'fullcoll.edu': { name: 'Fullerton College', city: '', state: '' },
  'fmcc.edu': { name: 'Fulton-Montgomery Community College', city: '', state: '' },
  'gadsdenstate.edu': { name: 'Gadsden State Community College', city: '', state: '' },
  'galencollege.edu': { name: 'Galen College of Nursing-Louisville', city: '', state: '' },
  'gc.edu': { name: 'Galveston College', city: '', state: '' },
  'gannon.edu': { name: 'Gannon University', city: '', state: '' },
  'gcccks.edu': { name: 'Garden City Community College', city: '', state: '' },
  'garrettcollege.edu': { name: 'Garrett College', city: '', state: '' },
  'gadsenstate.edu': { name: 'Gasden State Community College', city: '', state: '' },
  'gaston.edu': { name: 'Gaston College', city: '', state: '' },
  'gateway.kctcs.edu': { name: 'Gateway Community and Technical College', city: '', state: '' },
  'gwcc.commnet.edu': { name: 'Gateway Community College', city: '', state: '' },
  'gatewaycc.edu': { name: 'GateWay Community College', city: '', state: '' },
  'gtc.edu': { name: 'Gateway Technical College', city: '', state: '' },
  'gavilan.edu': { name: 'Gavilan College', city: '', state: '' },
  'genesee.edu': { name: 'Genesee Community College', city: '', state: '' },
  'geneva.edu': { name: 'Geneva College', city: '', state: '' },
  'wallace.edu': { name: 'George C Wallace State Community College-Dothan', city: '', state: '' },
  'wallacestate.edu': { name: 'George C Wallace State Community College-Hanceville', city: '', state: '' },
  'wccs.edu': { name: 'George C Wallace State Community College-Selma', city: '', state: '' },
  'gfc.edu': { name: 'George Fox College', city: '', state: '' },
  'georgefox.edu': { name: 'George Fox University', city: '', state: '' },
  'ggc.edu': { name: 'Georgia Gwinnett College', city: '', state: '' },
  'highlands.edu': { name: 'Georgia Highlands College', city: '', state: '' },
  'gntc.edu': { name: 'Georgia Northwestern Technical College', city: '', state: '' },
  'gpc.edu': { name: 'Georgia Perimeter College', city: '', state: '' },
  'gptc.edu': { name: 'Georgia Piedmont Technical College', city: '', state: '' },
  'georgiasouthern.edu': { name: 'Georgia Southern University', city: '', state: '' },
  'gsw.edu': { name: 'Georgia Southwestern State University', city: '', state: '' },
  'georgian.edu': { name: 'Georgian Court University', city: '', state: '' },
  'germanna.edu': { name: 'Germanna Community College', city: '', state: '' },
  'glenoaks.edu': { name: 'Glen Oaks Community College', city: '', state: '' },
  'gccaz.edu': { name: 'Glendale Community College', city: '', state: '' },
  'glendale.edu': { name: 'Glendale Community College', city: '', state: '' },
  'msbcollege.edu': { name: 'Globe University & Minnesota School of Business', city: '', state: '' },
  'gccnj.edu': { name: 'Gloucester County College', city: '', state: '' },
  'gmi.edu': { name: 'GMI Engineering and Management Institute', city: '', state: '' },
  'gogebic.edu': { name: 'Gogebic Community College', city: '', state: '' },
  'ggu.edu': { name: 'Golden Gate University', city: '', state: '' },
  'goldenwestcollege.edu': { name: 'Golden West College', city: '', state: '' },
  'gbc.edu': { name: 'Goldey-Beacom College', city: '', state: '' },
  'goshen.edu': { name: 'Goshen College', city: '', state: '' },
  'goucher.edu': { name: 'Goucher College', city: '', state: '' },
  'govst.edu': { name: 'Governors State University', city: '', state: '' },
  'grace.edu': { name: 'Grace College', city: '', state: '' },
  'graceland.edu': { name: 'Graceland College', city: '', state: '' },
  'gram.edu': { name: 'Grambling State University', city: '', state: '' },
  'grcc.edu': { name: 'Grand Rapids Community College', city: '', state: '' },
  'grandview.edu': { name: 'Grand View University', city: '', state: '' },
  'ghc.edu': { name: 'Grays Harbor College', city: '', state: '' },
  'grayson.edu': { name: 'Grayson College', city: '', state: '' },
  'gbcnv.edu': { name: 'Great Basin College', city: '', state: '' },
  'greatbay.edu': { name: 'Great Bay Community College', city: '', state: '' },
  'gfcmsu.edu': { name: 'Great Falls College Montana State University', city: '', state: '' },
  'greenriver.edu': { name: 'Green River Community College', city: '', state: '' },
  'gcc.mass.edu': { name: 'Greenfield Community College', city: '', state: '' },
  'greenleaf.edu': { name: 'Greenleaf University', city: '', state: '' },
  'greensboro.edu': { name: 'Greensboro College', city: '', state: '' },
  'gvltec.edu': { name: 'Greenville Technical College', city: '', state: '' },
  'greenville.edu': { name: 'Greenville University', city: '', state: '' },
  'grossmont.edu': { name: 'Grossmont College', city: '', state: '' },
  'guilford.edu': { name: 'Guilford College', city: '', state: '' },
  'gtcc.edu': { name: 'Guilford Technical Community College', city: '', state: '' },
  'gac.edu': { name: 'Gustavus Adolphus College', city: '', state: '' },
  'gwinnetttech.edu': { name: 'Gwinnett Technical College', city: '', state: '' },
  'trenholmstate.edu': { name: 'H Councill Trenholm State Technical College', city: '', state: '' },
  'hagerstowncc.edu': { name: 'Hagerstown Community College', city: '', state: '' },
  'halifaxcc.edu': { name: 'Halifax Community College', city: '', state: '' },
  'hallmarkuniversity.edu': { name: 'Hallmark University', city: '', state: '' },
  'hsc.edu': { name: 'Hampden-Sydney College', city: '', state: '' },
  'hamptonu.edu': { name: 'Hampton University', city: '', state: '' },
  'hanover.edu': { name: 'Hanover College', city: '', state: '' },
  'harcum.edu': { name: 'Harcum College', city: '', state: '' },
  'harding.edu': { name: 'Harding University', city: '', state: '' },
  'harford.edu': { name: 'Harford Community College', city: '', state: '' },
  'harpercollege.edu': { name: 'Harper College', city: '', state: '' },
  'hssu.edu': { name: 'Harris-Stowe State University', city: '', state: '' },
  'hacc.edu': { name: 'Harrisburg Area Community College-Harrisburg', city: '', state: '' },
  'hartnell.edu': { name: 'Hartnell College', city: '', state: '' },
  'hartwick.edu': { name: 'Hartwick College', city: '', state: '' },
  'haskell.edu': { name: 'Haskell Indian Nations University', city: '', state: '' },
  'hastings.edu': { name: 'Hastings College', city: '', state: '' },
  'hawaii.hawaii.edu': { name: 'Hawaii Community College', city: '', state: '' },
  'hawkeyecollege.edu': { name: 'Hawkeye Community College', city: '', state: '' },
  'haywood.edu': { name: 'Haywood Community College', city: '', state: '' },
  'hazard.kctcs.edu': { name: 'Hazard Community and Technical College', city: '', state: '' },
  'heartland.edu': { name: 'Heartland Community College', city: '', state: '' },
  'heidelberg.edu': { name: 'Heidelberg College', city: '', state: '' },
  'umhelena.edu': { name: 'Helena College University of Montana', city: '', state: '' },
  'hauniv.edu': { name: 'Hellenic American University', city: '', state: '' },
  'hencc.kctcs.edu': { name: 'Henderson Community College', city: '', state: '' },
  'hendrix.edu': { name: 'Hendrix College', city: '', state: '' },
  'hennepintech.edu': { name: 'Hennepin Technical College', city: '', state: '' },
  'hfcc.edu': { name: 'Henry Ford College', city: '', state: '' },
  'herkimer.edu': { name: 'Herkimer County Community College', city: '', state: '' },
  'hesston.edu': { name: 'Hesston College', city: '', state: '' },
  'hibbing.edu': { name: 'Hibbing Community College', city: '', state: '' },
  'highland.edu': { name: 'Highland Community College', city: '', state: '' },
  'highlandcc.edu': { name: 'Highland Community College', city: '', state: '' },
  'highline.edu': { name: 'Highline Community College', city: '', state: '' },
  'hillcollege.edu': { name: 'Hill College', city: '', state: '' },
  'hccfl.edu': { name: 'Hillsborough Community College', city: '', state: '' },
  'hillsdale.edu': { name: 'Hillsdale College', city: '', state: '' },
  'hindscc.edu': { name: 'Hinds Community College', city: '', state: '' },
  'hiram.edu': { name: 'Hiram College', city: '', state: '' },
  'hws.edu': { name: 'Hobart and William Smith Colleges', city: '', state: '' },
  'hocking.edu': { name: 'Hocking College', city: '', state: '' },
  'hollins.edu': { name: 'Hollins College', city: '', state: '' },
  'holmescc.edu': { name: 'Holmes Community College', city: '', state: '' },
  'hcc.edu': { name: 'Holyoke Community College', city: '', state: '' },
  'honolulu.hawaii.edu': { name: 'Honolulu Community College', city: '', state: '' },
  'hood.edu': { name: 'Hood College', city: '', state: '' },
  'hoodseminary.edu': { name: 'Hood Theological', city: '', state: '' },
  'hopkinsville.kctcs.edu': { name: 'Hopkinsville Community College', city: '', state: '' },
  'hgtc.edu': { name: 'Horry-Georgetown Technical College', city: '', state: '' },
  'hcc.commnet.edu': { name: 'Housatonic Community College', city: '', state: '' },
  'hbu.edu': { name: 'Houston Baptist University', city: '', state: '' },
  'hccs.edu': { name: 'Houston Community College', city: '', state: '' },
  'howardcollege.edu': { name: 'Howard College', city: '', state: '' },
  'howardcc.edu': { name: 'Howard Community College', city: '', state: '' },
  'hccc.edu': { name: 'Hudson County Community College', city: '', state: '' },
  'hvcc.edu': { name: 'Hudson Valley Community College', city: '', state: '' },
  'humboldt.edu': { name: 'Humboldt State University', city: '', state: '' },
  'huntingdon.edu': { name: 'Huntingdon College', city: '', state: '' },
  'huntingtonjuniorcollege.edu': { name: 'Huntington Junior College', city: '', state: '' },
  'huntington.edu': { name: 'Huntington University', city: '', state: '' },
  'htu.edu': { name: 'Huston-Tillotson University', city: '', state: '' },
  'hutchcc.edu': { name: 'Hutchinson Community College', city: '', state: '' },
  'mssm.edu': { name: 'Icahn School of Medicine at Mount Sinai', city: '', state: '' },
  'ici.edu': { name: 'ICI University', city: '', state: '' },
  'ilisagvik.edu': { name: 'Ilisagvik College', city: '', state: '' },
  'ibc.edu': { name: 'Illinois Benedictine College', city: '', state: '' },
  'icc.edu': { name: 'Illinois Central College', city: '', state: '' },
  'iecc.edu': { name: 'Illinois Eastern Community Colleges', city: '', state: '' },
  'ivcc.edu': { name: 'Illinois Valley Community College', city: '', state: '' },
  'iwu.edu': { name: 'Illinois Wesleyan University', city: '', state: '' },
  'imperial.edu': { name: 'Imperial Valley College', city: '', state: '' },
  'indycc.edu': { name: 'Independence Community College', city: '', state: '' },
  'indianhills.edu': { name: 'Indian Hills Community College', city: '', state: '' },
  'irsc.edu': { name: 'Indian River State College', city: '', state: '' },
  'indianatech.edu': { name: 'Indiana Institute of Technology', city: '', state: '' },
  'indstate.edu': { name: 'Indiana State University', city: '', state: '' },
  'iu.edu': { name: 'Indiana University', city: '', state: '' },
  'iusb.edu': { name: 'Indiana University at South Bend', city: '', state: '' },
  'ius.edu': { name: 'Indiana University Southeast', city: '', state: '' },
  'iupuc.edu': { name: 'Indiana University/Purdue University at Columbus', city: '', state: '' },
  'ipfw.edu': { name: 'Indiana University/Purdue University at Fort Wayne', city: '', state: '' },
  'indwes.edu': { name: 'Indiana Wesleyan University, Marion', city: '', state: '' },
  'ias.edu': { name: 'Institute for Advanced Study', city: '', state: '' },
  'iwp.edu': { name: 'Institute for World Politics', city: '', state: '' },
  'itc.edu': { name: 'Interdenominational Theological Center', city: '', state: '' },
  'itu.edu': { name: 'International Technological University', city: '', state: '' },
  'inverhills.edu': { name: 'Inver Hills Community College', city: '', state: '' },
  'iona.edu': { name: 'Iona College', city: '', state: '' },
  'iowacentral.edu': { name: 'Iowa Central Community College', city: '', state: '' },
  'iowalakes.edu': { name: 'Iowa Lakes Community College', city: '', state: '' },
  'iwcc.edu': { name: 'Iowa Western Community College', city: '', state: '' },
  'idti.edu': { name: 'Island Drafting & Technical Institute', city: '', state: '' },
  'isothermal.edu': { name: 'Isothermal Community College', city: '', state: '' },
  'itascacc.edu': { name: 'Itasca Community College', city: '', state: '' },
  'iccms.edu': { name: 'Itawamba Community College', city: '', state: '' },
  'ivytech.edu': { name: 'Ivy Tech Community College', city: '', state: '' },
  'drakestate.edu': { name: 'J F Drake State Community and Technical College', city: '', state: '' },
  'reynolds.edu': { name: 'J Sargeant Reynolds Community College', city: '', state: '' },
  'jccmi.edu': { name: 'Jackson College', city: '', state: '' },
  'jscc.edu': { name: 'Jackson State Community College', city: '', state: '' },
  'jacksonville-college.edu': { name: 'Jacksonville College-Main Campus', city: '', state: '' },
  'ju.edu': { name: 'Jacksonville University', city: '', state: '' },
  'rhodesstate.edu': { name: 'James A Rhodes State College', city: '', state: '' },
  'faulknerstate.edu': { name: 'James H Faulkner State Community College', city: '', state: '' },
  'jamessprunt.edu': { name: 'James Sprunt Community College', city: '', state: '' },
  'sunyjcc.edu': { name: 'Jamestown Community College', city: '', state: '' },
  'jarvis.edu': { name: 'Jarvis Christian College', city: '', state: '' },
  'jeffco.edu': { name: 'Jefferson College', city: '', state: '' },
  'jefferson.kctcs.edu': { name: 'Jefferson Community and Technical College', city: '', state: '' },
  'sunyjefferson.edu': { name: 'Jefferson Community College', city: '', state: '' },
  'jdcc.edu': { name: 'Jefferson Davis Community College', city: '', state: '' },
  'guptoncollege.edu': { name: 'John A Gupton College', city: '', state: '' },
  'jalc.edu': { name: 'John A Logan College', city: '', state: '' },
  'jbu.edu': { name: 'John Brown University', city: '', state: '' },
  'jfku.edu': { name: 'John F. Kennedy University', city: '', state: '' },
  'jtcc.edu': { name: 'John Tyler Community College', city: '', state: '' },
  'jwcc.edu': { name: 'John Wood Community College', city: '', state: '' },
  'jh.edu': { name: 'Johns Hopkins University', city: '', state: '' },
  'jhuapl.edu': { name: 'Johns Hopkins University Applied Physics Laboratory', city: '', state: '' },
  'jwu.edu': { name: 'Johnson & Wales University', city: '', state: '' },
  'jbc.edu': { name: 'Johnson Bible College', city: '', state: '' },
  'jcsu.edu': { name: 'Johnson C. Smith University', city: '', state: '' },
  'jccc.edu': { name: 'Johnson County Community College', city: '', state: '' },
  'johnstoncc.edu': { name: 'Johnston Community College', city: '', state: '' },
  'jjc.edu': { name: 'Joliet Junior College', city: '', state: '' },
  'jones.edu': { name: 'Jones College', city: '', state: '' },
  'jcjc.edu': { name: 'Jones County Junior College', city: '', state: '' },
  'judson.edu': { name: 'Judson College', city: '', state: '' },
  'juniata.edu': { name: 'Juniata College', city: '', state: '' },
  'kzoo.edu': { name: 'Kalamazoo College', city: '', state: '' },
  'kvcc.edu': { name: 'Kalamazoo Valley Community College', city: '', state: '' },
  'kvctc.edu': { name: 'Kanawha Valley Community and Technical College', city: '', state: '' },
  'kcc.edu': { name: 'Kankakee Community College', city: '', state: '' },
  'kckcc.edu': { name: 'Kansas City Kansas Community College', city: '', state: '' },
  'kansascity.edu': { name: 'Kansas City University', city: '', state: '' },
  'kwu.edu': { name: 'Kansas Wesleyan University', city: '', state: '' },
  'kapiolani.hawaii.edu': { name: 'Kapiolani Community College', city: '', state: '' },
  'kaplan.edu': { name: 'Kaplan University', city: '', state: '' },
  'kaskaskia.edu': { name: 'Kaskaskia College', city: '', state: '' },
  'kauai.hawaii.edu': { name: 'Kauai Community College', city: '', state: '' },
  'keene.edu': { name: 'Keene State College', city: '', state: '' },
  'keiseruniversity.edu': { name: 'Keiser University', city: '', state: '' },
  'keller.edu': { name: 'Keller Graduate School of Management', city: '', state: '' },
  'kellogg.edu': { name: 'Kellogg Community College', city: '', state: '' },
  'kpc.alaska.edu': { name: 'Kenai Peninsula College', city: '', state: '' },
  'kvcc.me.edu': { name: 'Kennebec Valley Community College', city: '', state: '' },
  'kctcs.edu': { name: 'Kentucky Community & Technical College System', city: '', state: '' },
  'kysu.edu': { name: 'Kentucky State University', city: '', state: '' },
  'kettering.edu': { name: 'Kettering University', city: '', state: '' },
  'kilgore.edu': { name: 'Kilgore College', city: '', state: '' },
  'kilian.edu': { name: 'Kilian Community College', city: '', state: '' },
  'king.edu': { name: 'King University', city: '', state: '' },
  'kings.edu': { name: 'King\'s College', city: '', state: '' },
  'kirkwood.edu': { name: 'Kirkwood Community College', city: '', state: '' },
  'kirtland.edu': { name: 'Kirtland Community College', city: '', state: '' },
  'kishwaukeecollege.edu': { name: 'Kishwaukee College', city: '', state: '' },
  'klamathcc.edu': { name: 'Klamath Community College', city: '', state: '' },
  'knox.edu': { name: 'Knox College', city: '', state: '' },
  'knoxvillecollege.edu': { name: 'Knoxville College', city: '', state: '' },
  'koc.alaska.edu': { name: 'Kodiak College', city: '', state: '' },
  'fletcher.edu': { name: 'L E Fletcher Technical Community College', city: '', state: '' },
  'lasierra.edu': { name: 'La Sierra University', city: '', state: '' },
  'labette.edu': { name: 'Labette Community College', city: '', state: '' },
  'lco.edu': { name: 'Lac Courte Oreilles Ojibwa Community College', city: '', state: '' },
  'lackawanna.edu': { name: 'Lackawanna College', city: '', state: '' },
  'lagrange.edu': { name: 'LaGrange College', city: '', state: '' },
  'lakeareatech.edu': { name: 'Lake Area Technical Institute', city: '', state: '' },
  'lecom.edu': { name: 'Lake Erie College of Osteopathic Medicine', city: '', state: '' },
  'lfc.edu': { name: 'Lake Forest College', city: '', state: '' },
  'lakemichigancollege.edu': { name: 'Lake Michigan College', city: '', state: '' },
  'lrsc.edu': { name: 'Lake Region State College', city: '', state: '' },
  'lsc.edu': { name: 'Lake Superior College', city: '', state: '' },
  'lssu.edu': { name: 'Lake Superior State University', city: '', state: '' },
  'ltcc.edu': { name: 'Lake Tahoe Community College', city: '', state: '' },
  'lakelandcc.edu': { name: 'Lakeland Community College', city: '', state: '' },
  'lrcc.edu': { name: 'Lakes Region Community College', city: '', state: '' },
  'gotoltc.edu': { name: 'Lakeshore Technical College', city: '', state: '' },
  'lamarcc.edu': { name: 'Lamar Community College', city: '', state: '' },
  'lit.edu': { name: 'Lamar Institute of Technology', city: '', state: '' },
  'lsco.edu': { name: 'Lamar State College-Orange', city: '', state: '' },
  'lamarpa.edu': { name: 'Lamar State College-Port Arthur', city: '', state: '' },
  'lamar.edu': { name: 'Lamar University', city: '', state: '' },
  'lander.edu': { name: 'Lander University', city: '', state: '' },
  'lanecollege.edu': { name: 'Lane College', city: '', state: '' },
  'lanecc.edu': { name: 'Lane Community College', city: '', state: '' },
  'laney.edu': { name: 'Laney College', city: '', state: '' },
  'langston.edu': { name: 'Langston University', city: '', state: '' },
  'laniertech.edu': { name: 'Lanier Technical College', city: '', state: '' },
  'lcc.edu': { name: 'Lansing Community College', city: '', state: '' },
  'lccc.wy.edu': { name: 'Laramie County Community College', city: '', state: '' },
  'laredo.edu': { name: 'Laredo Community College', city: '', state: '' },
  'laspositascollege.edu': { name: 'Las Positas College', city: '', state: '' },
  'lasalle.edu': { name: 'LaSalle University', city: '', state: '' },
  'lasell.edu': { name: 'Lasell College', city: '', state: '' },
  'lassencollege.edu': { name: 'Lassen Community College', city: '', state: '' },
  'ldsbc.edu': { name: 'Latter-day Saints Business College', city: '', state: '' },
  'lauruscollege.edu': { name: 'Laurus College', city: '', state: '' },
  'ltu.edu': { name: 'Lawrence Technological University', city: '', state: '' },
  'lawsonstate.edu': { name: 'Lawson State Community College', city: '', state: '' },
  'lemoyne.edu': { name: 'Le Moyne College', city: '', state: '' },
  'lvc.edu': { name: 'Lebanon Valley College', city: '', state: '' },
  'lee.edu': { name: 'Lee College', city: '', state: '' },
  'lltc.edu': { name: 'Leech Lake Tribal College', city: '', state: '' },
  'leeward.hawaii.edu': { name: 'Leeward Community College', city: '', state: '' },
  'lccc.edu': { name: 'Lehigh Carbon Community College', city: '', state: '' },
  'loc.edu': { name: 'LeMoyne-Owen College', city: '', state: '' },
  'lenoircc.edu': { name: 'Lenoir Community College', city: '', state: '' },
  'lrc.edu': { name: 'Lenoir-Rhyne College', city: '', state: '' },
  'lesley.edu': { name: 'Lesley University', city: '', state: '' },
  'letu.edu': { name: 'LeTourneau University', city: '', state: '' },
  'lclark.edu': { name: 'Lewis & Clark College', city: '', state: '' },
  'lc.edu': { name: 'Lewis and Clark Community College', city: '', state: '' },
  'lewisu.edu': { name: 'Lewis University', city: '', state: '' },
  'lcsc.edu': { name: 'Lewis-Clark State College', city: '', state: '' },
  'llcc.edu': { name: 'Lincoln Land Community College', city: '', state: '' },
  'lmunet.edu': { name: 'Lincoln Memorial University', city: '', state: '' },
  'lincoln.edu': { name: 'Lincoln University', city: '', state: '' },
  'lindenwood.edu': { name: 'Lindenwood University', city: '', state: '' },
  'linnstate.edu': { name: 'Linn State Technical College', city: '', state: '' },
  'linnbenton.edu': { name: 'Linn-Benton Community College', city: '', state: '' },
  'lbhc.edu': { name: 'Little Big Horn College', city: '', state: '' },
  'littlepriest.edu': { name: 'Little Priest Tribal College', city: '', state: '' },
  'livingstone.edu': { name: 'Livingstone College', city: '', state: '' },
  'lhup.edu': { name: 'Lock Haven University', city: '', state: '' },
  'llu.edu': { name: 'Loma Linda University', city: '', state: '' },
  'lonestar.edu': { name: 'Lone Star College System', city: '', state: '' },
  'lbcc.edu': { name: 'Long Beach City College', city: '', state: '' },
  'liunet.edu': { name: 'Long Island University', city: '', state: '' },
  'lorainccc.edu': { name: 'Lorain County Community College', city: '', state: '' },
  'loras.edu': { name: 'Loras College', city: '', state: '' },
  'lfcc.edu': { name: 'Lord Fairfax Community College', city: '', state: '' },
  'lacitycollege.edu': { name: 'Los Angeles City College', city: '', state: '' },
  'laccd.edu': { name: 'Los Angeles Community College District', city: '', state: '' },
  'lahc.edu': { name: 'Los Angeles Harbor College', city: '', state: '' },
  'lamission.edu': { name: 'Los Angeles Mission College', city: '', state: '' },
  'piercecollege.edu': { name: 'Los Angeles Pierce College', city: '', state: '' },
  'lasc.edu': { name: 'Los Angeles Southwest College', city: '', state: '' },
  'lattc.edu': { name: 'Los Angeles Trade Technical College', city: '', state: '' },
  'lavc.edu': { name: 'Los Angeles Valley College', city: '', state: '' },
  'losmedanos.edu': { name: 'Los Medanos College', city: '', state: '' },
  'losrios.edu': { name: 'Los Rios Community College District', city: '', state: '' },
  'louisburg.edu': { name: 'Louisburg College', city: '', state: '' },
  'lacollege.edu': { name: 'Louisiana College', city: '', state: '' },
  'ladelta.edu': { name: 'Louisiana Delta Community College', city: '', state: '' },
  'lsua.edu': { name: 'Louisiana State University at Alexandria', city: '', state: '' },
  'lsue.edu': { name: 'Louisiana State University-Eunice', city: '', state: '' },
  'lowercolumbia.edu': { name: 'Lower Columbia College', city: '', state: '' },
  'luna.edu': { name: 'Luna Community College', city: '', state: '' },
  'lbwcc.edu': { name: 'Lurleen B Wallace Community College', city: '', state: '' },
  'luther.edu': { name: 'Luther College', city: '', state: '' },
  'luthersem.edu': { name: 'Luther Seminary', city: '', state: '' },
  'luzerne.edu': { name: 'Luzerne County Community College', city: '', state: '' },
  'lycoming.edu': { name: 'Lycoming College', city: '', state: '' },
  'lynchburg.edu': { name: 'Lynchburg College', city: '', state: '' },
  'lyndonstate.edu': { name: 'Lyndon State College', city: '', state: '' },
  'lyon.edu': { name: 'Lyon College', city: '', state: '' },
  'maccormac.edu': { name: 'MacCormac College', city: '', state: '' },
  'macomb.edu': { name: 'Macomb Community College', city: '', state: '' },
  'madisoncollege.edu': { name: 'Madison Area Technical College', city: '', state: '' },
  'madisonville.kctcs.edu': { name: 'Madisonville Community College', city: '', state: '' },
  'mum.edu': { name: 'Maharishi University of Management', city: '', state: '' },
  'malone.edu': { name: 'Malone College', city: '', state: '' },
  'mcc.commnet.edu': { name: 'Manchester Community College', city: '', state: '' },
  'mccnh.edu': { name: 'Manchester Community College', city: '', state: '' },
  'manhattantech.edu': { name: 'Manhattan Area Technical College', city: '', state: '' },
  'manhattan.edu': { name: 'Manhattan College', city: '', state: '' },
  'manor.edu': { name: 'Manor College', city: '', state: '' },
  'marietta.edu': { name: 'Marietta College', city: '', state: '' },
  'mbl.edu': { name: 'Marine Biological Laboratory', city: '', state: '' },
  'marionmilitary.edu': { name: 'Marion Military Institute', city: '', state: '' },
  'mtc.edu': { name: 'Marion Technical College', city: '', state: '' },
  'marlboro.edu': { name: 'Marlboro College', city: '', state: '' },
  'iavalley.edu': { name: 'Marshalltown Community College', city: '', state: '' },
  'martincc.edu': { name: 'Martin Community College', city: '', state: '' },
  'mbc.edu': { name: 'Mary Baldwin College', city: '', state: '' },
  'mwc.edu': { name: 'Mary Washington College', city: '', state: '' },
  'mica.edu': { name: 'Maryland Institute College of Arts', city: '', state: '' },
  'mmm.edu': { name: 'Marymount Manhattan College', city: '', state: '' },
  'marymount.edu': { name: 'Marymount University', city: '', state: '' },
  'maryvillecollege.edu': { name: 'Maryville College', city: '', state: '' },
  'maryville.edu': { name: 'Maryville University', city: '', state: '' },
  'marywood.edu': { name: 'Marywood University', city: '', state: '' },
  'massbay.edu': { name: 'Massachusetts Bay Community College', city: '', state: '' },
  'massasoit.mass.edu': { name: 'Massasoit Community College', city: '', state: '' },
  'matsu.alaska.edu': { name: 'Mat-Su College', city: '', state: '' },
  'mayland.edu': { name: 'Mayland Community College', city: '', state: '' },
  'mayo.edu': { name: 'Mayo Clinic', city: '', state: '' },
  'maysville.kctcs.edu': { name: 'Maysville Community and Technical College', city: '', state: '' },
  'mcdaniel.edu': { name: 'McDaniel College', city: '', state: '' },
  'mcdowelltech.edu': { name: 'McDowell Technical Community College', city: '', state: '' },
  'mchenry.edu': { name: 'McHenry County College', city: '', state: '' },
  'mclennan.edu': { name: 'McLennan Community College', city: '', state: '' },
  'mcm.edu': { name: 'McMurry University', city: '', state: '' },
  'mcneese.edu': { name: 'McNeese State University', city: '', state: '' },
  'mcpherson.edu': { name: 'McPherson College', city: '', state: '' },
  'mcg.edu': { name: 'Medical College of Georgia', city: '', state: '' },
  'mcw.edu': { name: 'Medical College of Wisconsin', city: '', state: '' },
  'musc.edu': { name: 'Medical University of South Carolina', city: '', state: '' },
  'mmc.edu': { name: 'Meharry Medical College', city: '', state: '' },
  'mendocino.edu': { name: 'Mendocino College', city: '', state: '' },
  'mccd.edu': { name: 'Merced College', city: '', state: '' },
  'mccc.edu': { name: 'Mercer County Community College', city: '', state: '' },
  'mercymavericks.edu': { name: 'Mercy College', city: '', state: '' },
  'meredith.edu': { name: 'Meredith College', city: '', state: '' },
  'meridiancc.edu': { name: 'Meridian Community College', city: '', state: '' },
  'merrimack.edu': { name: 'Merrimack College', city: '', state: '' },
  'merritt.edu': { name: 'Merritt College', city: '', state: '' },
  'mesacc.edu': { name: 'Mesa Community College', city: '', state: '' },
  'mesabirange.edu': { name: 'Mesabi Range Community and Technical College', city: '', state: '' },
  'mesalands.edu': { name: 'Mesalands Community College', city: '', state: '' },
  'messiah.edu': { name: 'Messiah College', city: '', state: '' },
  'mcckc.edu': { name: 'Metropolitan Community College (MO)', city: '', state: '' },
  'mccneb.edu': { name: 'Metropolitan Community College (NE)', city: '', state: '' },
  'msudenver.edu': { name: 'Metropolitan State College of Denver', city: '', state: '' },
  'metrostate.edu': { name: 'Metropolitan State University', city: '', state: '' },
  'mdc.edu': { name: 'Miami Dade College', city: '', state: '' },
  'mtu.edu': { name: 'Michigan Technological University', city: '', state: '' },
  'midmich.edu': { name: 'Mid Michigan Community College', city: '', state: '' },
  'manc.edu': { name: 'Mid-America Nazarene College', city: '', state: '' },
  'mpcc.edu': { name: 'Mid-Plains Community College', city: '', state: '' },
  'midsouthcc.edu': { name: 'Mid-South Community College', city: '', state: '' },
  'mstc.edu': { name: 'Mid-State Technical College', city: '', state: '' },
  'mga.edu': { name: 'Middle Georgia State College', city: '', state: '' },
  'mxcc.commnet.edu': { name: 'Middlesex Community College', city: '', state: '' },
  'middlesex.mass.edu': { name: 'Middlesex Community College', city: '', state: '' },
  'middlesexcc.edu': { name: 'Middlesex County College', city: '', state: '' },
  'midlandstech.edu': { name: 'Midlands Technical College', city: '', state: '' },
  'mwsu.edu': { name: 'Midwestern State University', city: '', state: '' },
  'midwestern.edu': { name: 'Midwestern University', city: '', state: '' },
  'miles.edu': { name: 'Miles College', city: '', state: '' },
  'milescc.edu': { name: 'Miles Community College', city: '', state: '' },
  'mlaw.edu': { name: 'Miles School of Law', city: '', state: '' },
  'milligan.edu': { name: 'Milligan College', city: '', state: '' },
  'millikin.edu': { name: 'Millikin University', city: '', state: '' },
  'millsaps.edu': { name: 'Millsaps College', city: '', state: '' },
  'matc.edu': { name: 'Milwaukee Area Technical College', city: '', state: '' },
  'msoe.edu': { name: 'Milwaukee School of Engineering', city: '', state: '' },
  'mineralarea.edu': { name: 'Mineral Area College', city: '', state: '' },
  'mcad.edu': { name: 'Minneapolis College of Art and Design', city: '', state: '' },
  'minneapolis.edu': { name: 'Minneapolis Community and Technical College', city: '', state: '' },
  'southeastmn.edu': { name: 'Minnesota State College-Southeast Technical', city: '', state: '' },
  'minnesota.edu': { name: 'Minnesota State Community and Technical College', city: '', state: '' },
  'mnstate.edu': { name: 'Minnesota State University Moorhead', city: '', state: '' },
  'mnwest.edu': { name: 'Minnesota West Community and Technical College', city: '', state: '' },
  'minotstateu.edu': { name: 'Minot State University', city: '', state: '' },
  'miracosta.edu': { name: 'MiraCosta College', city: '', state: '' },
  'missioncollege.edu': { name: 'Mission College', city: '', state: '' },
  'mc.edu': { name: 'Mississippi College', city: '', state: '' },
  'msdelta.edu': { name: 'Mississippi Delta Community College', city: '', state: '' },
  'mgccc.edu': { name: 'Mississippi Gulf Coast Community College', city: '', state: '' },
  'muw.edu': { name: 'Mississippi University for Women', city: '', state: '' },
  'mvsu.edu': { name: 'Mississippi Valley State University', city: '', state: '' },
  'mssc.edu': { name: 'Missouri Southern State College', city: '', state: '' },
  'missouristate.edu': { name: 'Missouri State University', city: '', state: '' },
  'wp.missouristate.edu': { name: 'Missouri State University-West Plains', city: '', state: '' },
  'mwsc.edu': { name: 'Missouri Western State College', city: '', state: '' },
  'mitchellcc.edu': { name: 'Mitchell Community College', city: '', state: '' },
  'mitchelltech.edu': { name: 'Mitchell Technical Institute', city: '', state: '' },
  'macc.edu': { name: 'Moberly Area Community College', city: '', state: '' },
  'mjc.edu': { name: 'Modesto Junior College', city: '', state: '' },
  'mohave.edu': { name: 'Mohave Community College', city: '', state: '' },
  'mvcc.edu': { name: 'Mohawk Valley Community College', city: '', state: '' },
  'molloy.edu': { name: 'Molloy College', city: '', state: '' },
  'monmouthcollege.edu': { name: 'Monmouth College', city: '', state: '' },
  'monroecollege.edu': { name: 'Monroe College', city: '', state: '' },
  'monroecc.edu': { name: 'Monroe Community College', city: '', state: '' },
  'monroeccc.edu': { name: 'Monroe County Community College', city: '', state: '' },
  'msubillings.edu': { name: 'Montana State University - Billings', city: '', state: '' },
  'msun.edu': { name: 'Montana State University - Northern', city: '', state: '' },
  'mtech.edu': { name: 'Montana Tech', city: '', state: '' },
  'montcalm.edu': { name: 'Montcalm Community College', city: '', state: '' },
  'mpc.edu': { name: 'Monterey Peninsula College', city: '', state: '' },
  'montgomerycollege.edu': { name: 'Montgomery College', city: '', state: '' },
  'montgomery.edu': { name: 'Montgomery Community College', city: '', state: '' },
  'mc3.edu': { name: 'Montgomery County Community College', city: '', state: '' },
  'montreat.edu': { name: 'Montreat College', city: '', state: '' },
  'moorparkcollege.edu': { name: 'Moorpark College', city: '', state: '' },
  'morainepark.edu': { name: 'Moraine Park Technical College', city: '', state: '' },
  'morainevalley.edu': { name: 'Moraine Valley Community College', city: '', state: '' },
  'moravian.edu': { name: 'Moravian College', city: '', state: '' },
  'msm.edu': { name: 'Morehouse School of Medicine', city: '', state: '' },
  'mvc.edu': { name: 'Moreno Valley College', city: '', state: '' },
  'morgancc.edu': { name: 'Morgan Community College', city: '', state: '' },
  'morgan.edu': { name: 'Morgan State University', city: '', state: '' },
  'morrisbrown.edu': { name: 'Morris Brown College', city: '', state: '' },
  'morris.edu': { name: 'Morris College', city: '', state: '' },
  'morton.edu': { name: 'Morton College', city: '', state: '' },
  'mscc.edu': { name: 'Motlow State Community College', city: '', state: '' },
  'mcc.edu': { name: 'Mott Community College', city: '', state: '' },
  'moultrietech.edu': { name: 'Moultrie Technical College', city: '', state: '' },
  'msj.edu': { name: 'Mount Saint Joseph College', city: '', state: '' },
  'msmc.edu': { name: 'Mount Saint Mary College', city: '', state: '' },
  'mscfs.edu': { name: 'Mount Senario College', city: '', state: '' },
  'msmary.edu': { name: 'Mount St. Mary\'s University', city: '', state: '' },
  'muc.edu': { name: 'Mount Union College', city: '', state: '' },
  'mwcc.edu': { name: 'Mount Wachusett Community College', city: '', state: '' },
  'mecc.edu': { name: 'Mountain Empire Community College', city: '', state: '' },
  'mctc.edu': { name: 'Mountwest Community and Technical College', city: '', state: '' },
  'mhcc.edu': { name: 'Mt. Hood Community College', city: '', state: '' },
  'mtsac.edu': { name: 'Mt. San Antonio College', city: '', state: '' },
  'msjc.edu': { name: 'Mt. San Jacinto Community College District', city: '', state: '' },
  'sacramento.mticollege.edu': { name: 'MTI College', city: '', state: '' },
  'mscok.edu': { name: 'Murray State College', city: '', state: '' },
  'mursuky.edu': { name: 'Murray State University', city: '', state: '' },
  'muskegoncc.edu': { name: 'Muskegon Community College', city: '', state: '' },
  'muskingum.edu': { name: 'Muskingum College', city: '', state: '' },
  'napavalley.edu': { name: 'Napa Valley College', city: '', state: '' },
  'nashcc.edu': { name: 'Nash Community College', city: '', state: '' },
  'nashuacc.edu': { name: 'Nashua Community College', city: '', state: '' },
  'nscc.edu': { name: 'Nashville State Community College', city: '', state: '' },
  'ncc.edu': { name: 'Nassau Community College', city: '', state: '' },
  'ndu.edu': { name: 'National Defense University', city: '', state: '' },
  'np.edu': { name: 'National Park College', city: '', state: '' },
  'npcc.edu': { name: 'National Park Community College', city: '', state: '' },
  'nrao.edu': { name: 'National Radio Astronomy Observatory', city: '', state: '' },
  'nu.edu': { name: 'National University', city: '', state: '' },
  'nl.edu': { name: 'National-Louis University', city: '', state: '' },
  'nv.edu': { name: 'Naugatuck Valley Community College', city: '', state: '' },
  'nps.edu': { name: 'Naval Postgraduate School', city: '', state: '' },
  'navarrocollege.edu': { name: 'Navarro College', city: '', state: '' },
  'naz.edu': { name: 'Nazareth College', city: '', state: '' },
  'ncta.unl.edu': { name: 'Nebraska College of Technical Agriculture', city: '', state: '' },
  'thenicc.edu': { name: 'Nebraska Indian Community College', city: '', state: '' },
  'nebrwesleyan.edu': { name: 'Nebraska Wesleyan University', city: '', state: '' },
  'neosho.edu': { name: 'Neosho County Community College', city: '', state: '' },
  'neumann.edu': { name: 'Neumann University', city: '', state: '' },
  'nevada.edu': { name: 'Nevada System of Higher Education', city: '', state: '' },
  'newcollege.edu': { name: 'New College of California', city: '', state: '' },
  'ncf.edu': { name: 'New College of Florida', city: '', state: '' },
  'neit.edu': { name: 'New England Institute of Technology', city: '', state: '' },
  'nhc.edu': { name: 'New Hampshire College', city: '', state: '' },
  'njcu.edu': { name: 'New Jersey City University', city: '', state: '' },
  'nmhu.edu': { name: 'New Mexico Highlands University', city: '', state: '' },
  'nmjc.edu': { name: 'New Mexico Junior College', city: '', state: '' },
  'nmmi.edu': { name: 'New Mexico Military Institute', city: '', state: '' },
  'nmsua.edu': { name: 'New Mexico State University-Alamogordo', city: '', state: '' },
  'cavern.nmsu.edu': { name: 'New Mexico State University-Carlsbad', city: '', state: '' },
  'dabcc.nmsu.edu': { name: 'New Mexico State University-Dona Ana', city: '', state: '' },
  'newriver.edu': { name: 'New River Community and Technical College', city: '', state: '' },
  'nr.edu': { name: 'New River Community College', city: '', state: '' },
  'nyit.edu': { name: 'New York Institute of Technology', city: '', state: '' },
  'nymc.edu': { name: 'New York Medical College', city: '', state: '' },
  'newberry.edu': { name: 'Newberry College', city: '', state: '' },
  'nhti.edu': { name: 'NHTI-Concord\'s Community College', city: '', state: '' },
  'niagaracc.suny.edu': { name: 'Niagara County Community College', city: '', state: '' },
  'niagara.edu': { name: 'Niagara University', city: '', state: '' },
  'nicholls.edu': { name: 'Nicholls State University', city: '', state: '' },
  'nicoletcollege.edu': { name: 'Nicolet Area Technical College', city: '', state: '' },
  'nsu.edu': { name: 'Norfolk State University', city: '', state: '' },
  'normandale.edu': { name: 'Normandale Community College', city: '', state: '' },
  'na.edu': { name: 'North American University', city: '', state: '' },
  'northark.edu': { name: 'North Arkansas College', city: '', state: '' },
  'ncat.edu': { name: 'North Carolina A&T State University', city: '', state: '' },
  'ncwc.edu': { name: 'North Carolina Wesleyan College', city: '', state: '' },
  'ncbc.edu': { name: 'North Central Bible College', city: '', state: '' },
  'northcentralcollege.edu': { name: 'North Central College', city: '', state: '' },
  'ncktc.edu': { name: 'North Central Kansas Technical College', city: '', state: '' },
  'ncmich.edu': { name: 'North Central Michigan College', city: '', state: '' },
  'ncmissouri.edu': { name: 'North Central Missouri College', city: '', state: '' },
  'ncstatecollege.edu': { name: 'North Central State College', city: '', state: '' },
  'nctc.edu': { name: 'North Central Texas College', city: '', state: '' },
  'nccc.edu': { name: 'North Country Community College', city: '', state: '' },
  'ndscs.edu': { name: 'North Dakota State College of Science', city: '', state: '' },
  'ndus.edu': { name: 'North Dakota University System', city: '', state: '' },
  'nfcc.edu': { name: 'North Florida Community College', city: '', state: '' },
  'northgatech.edu': { name: 'North Georgia Technical College', city: '', state: '' },
  'nhcc.edu': { name: 'North Hennepin Community College', city: '', state: '' },
  'nic.edu': { name: 'North Idaho College', city: '', state: '' },
  'niacc.edu': { name: 'North Iowa Area Community College', city: '', state: '' },
  'npcts.edu': { name: 'North Park College and Theological Seminary', city: '', state: '' },
  'northshore.edu': { name: 'North Shore Community College', city: '', state: '' },
  'northampton.edu': { name: 'Northampton Community College', city: '', state: '' },
  'ntc.edu': { name: 'Northcentral Technical College', city: '', state: '' },
  'nacc.edu': { name: 'Northeast Alabama Community College', city: '', state: '' },
  'northeast.edu': { name: 'Northeast Community College', city: '', state: '' },
  'nicc.edu': { name: 'Northeast Iowa Community College', city: '', state: '' },
  'nemcc.edu': { name: 'Northeast Mississippi Community College', city: '', state: '' },
  'northeaststate.edu': { name: 'Northeast State Community College', city: '', state: '' },
  'ntcc.edu': { name: 'Northeast Texas Community College', city: '', state: '' },
  'nwtc.edu': { name: 'Northeast Wisconsin Technical College', city: '', state: '' },
  'njc.edu': { name: 'Northeastern Junior College', city: '', state: '' },
  'nlu.edu': { name: 'Northeastern Louisiana University', city: '', state: '' },
  'neo.edu': { name: 'Northeastern Oklahoma A&M College', city: '', state: '' },
  'nsuok.edu': { name: 'Northeastern State University', city: '', state: '' },
  'netc.edu': { name: 'Northeastern Technical College', city: '', state: '' },
  'neu.edu': { name: 'Northeastern University', city: '', state: '' },
  'necc.edu': { name: 'Northern Essex Community College', city: '', state: '' },
  'nmcc.edu': { name: 'Northern Maine Community College', city: '', state: '' },
  'nmu.edu': { name: 'Northern Michigan University', city: '', state: '' },
  'noc.edu': { name: 'Northern Oklahoma College', city: '', state: '' },
  'northern.edu': { name: 'Northern State University', city: '', state: '' },
  'nvcc.edu': { name: 'Northern Virginia Community College', city: '', state: '' },
  'northland.edu': { name: 'Northland College', city: '', state: '' },
  'northlandcollege.edu': { name: 'Northland Community and Technical College', city: '', state: '' },
  'npc.edu': { name: 'Northland Pioneer College', city: '', state: '' },
  'nwacc.edu': { name: 'NorthWest Arkansas Community College', city: '', state: '' },
  'northwestcollege.edu': { name: 'Northwest College', city: '', state: '' },
  'nwfsc.edu': { name: 'Northwest Florida State College', city: '', state: '' },
  'nwicc.edu': { name: 'Northwest Iowa Community College', city: '', state: '' },
  'nwktc.edu': { name: 'Northwest Kansas Technical College', city: '', state: '' },
  'northwestms.edu': { name: 'Northwest Mississippi Community College', city: '', state: '' },
  'nwmissouri.edu': { name: 'Northwest Missouri State University', city: '', state: '' },
  'nnc.edu': { name: 'Northwest Nazarene College', city: '', state: '' },
  'northweststate.edu': { name: 'Northwest State Community College', city: '', state: '' },
  'ntcmn.edu': { name: 'Northwest Technical College', city: '', state: '' },
  'nwscc.edu': { name: 'Northwest-Shoals Community College', city: '', state: '' },
  'nwciowa.edu': { name: 'Northwestern College of Iowa', city: '', state: '' },
  'northwesterncollege.edu': { name: 'Northwestern College-Chicago Campus', city: '', state: '' },
  'nwcc.commnet.edu': { name: 'Northwestern Connecticut Community College', city: '', state: '' },
  'nsula.edu': { name: 'Northwestern State University', city: '', state: '' },
  'ncc.commnet.edu': { name: 'Norwalk Community College', city: '', state: '' },
  'norwich.edu': { name: 'Norwich University', city: '', state: '' },
  'nunez.edu': { name: 'Nunez Community College', city: '', state: '' },
  'oaklandcc.edu': { name: 'Oakland Community College', city: '', state: '' },
  'oakton.edu': { name: 'Oakton Community College', city: '', state: '' },
  'oakwood.edu': { name: 'Oakwood University', city: '', state: '' },
  'oxy.edu': { name: 'Occidental College', city: '', state: '' },
  'ocean.edu': { name: 'Ocean County College', city: '', state: '' },
  'odessa.edu': { name: 'Odessa College', city: '', state: '' },
  'ogeecheetech.edu': { name: 'Ogeechee Technical College', city: '', state: '' },
  'oglethorpe.edu': { name: 'Oglethorpe University', city: '', state: '' },
  'odc.edu': { name: 'Ohio Dominican College', city: '', state: '' },
  'onu.edu': { name: 'Ohio Northern University', city: '', state: '' },
  'ati.osu.edu': { name: 'Ohio State University Agricultural Technical Institute', city: '', state: '' },
  'owu.edu': { name: 'Ohio Wesleyan University', city: '', state: '' },
  'ohlone.edu': { name: 'Ohlone College', city: '', state: '' },
  'okbu.edu': { name: 'Oklahoma Baptist University', city: '', state: '' },
  'oc.edu': { name: 'Oklahoma Christian University', city: '', state: '' },
  'occc.edu': { name: 'Oklahoma City Community College', city: '', state: '' },
  'okcu.edu': { name: 'Oklahoma City University', city: '', state: '' },
  'students.olin.edu': { name: 'Olin College of Engineering', city: '', state: '' },
  'olivet.edu': { name: 'Olivet Nazarene University', city: '', state: '' },
  'sunyocc.edu': { name: 'Onondaga Community College', city: '', state: '' },
  'oru.edu': { name: 'Oral Roberts University', city: '', state: '' },
  'orangecoastcollege.edu': { name: 'Orange Coast College', city: '', state: '' },
  'sunyorange.edu': { name: 'Orange County Community College', city: '', state: '' },
  'octech.edu': { name: 'Orangeburg Calhoun Technical College', city: '', state: '' },
  'ogi.edu': { name: 'Oregon Graduate Institute of Science and Technology', city: '', state: '' },
  'ohsu.edu': { name: 'Oregon Health Sciences University', city: '', state: '' },
  'oit.edu': { name: 'Oregon Institute of Technology', city: '', state: '' },
  'www.ojc.edu': { name: 'Otero Junior College', city: '', state: '' },
  'otterbein.edu': { name: 'Otterbein College', city: '', state: '' },
  'ollusa.edu': { name: 'Our Lady of the Lake University', city: '', state: '' },
  'owens.edu': { name: 'Owens Community College', city: '', state: '' },
  'owensboro.kctcs.edu': { name: 'Owensboro Community and Technical College', city: '', state: '' },
  'oxnardcollege.edu': { name: 'Oxnard College', city: '', state: '' },
  'ozarka.edu': { name: 'Ozarka College', city: '', state: '' },
  'otc.edu': { name: 'Ozarks Technical Community College', city: '', state: '' },
  'pnwu.edu': { name: 'Pacific Northwest University of Health Sciences', city: '', state: '' },
  'puc.edu': { name: 'Pacific Union College', city: '', state: '' },
  'pacificu.edu': { name: 'Pacific University', city: '', state: '' },
  'paine.edu': { name: 'Paine College', city: '', state: '' },
  'pbac.edu': { name: 'Palm Beach Atlantic College', city: '', state: '' },
  'palmbeachstate.edu': { name: 'Palm Beach State College', city: '', state: '' },
  'paloverde.edu': { name: 'Palo Verde College', city: '', state: '' },
  'palomar.edu': { name: 'Palomar College', city: '', state: '' },
  'pamlicocc.edu': { name: 'Pamlico Community College', city: '', state: '' },
  'panola.edu': { name: 'Panola College', city: '', state: '' },
  'pvc.maricopa.edu': { name: 'Paradise Valley Community College', city: '', state: '' },
  'parisjc.edu': { name: 'Paris Junior College', city: '', state: '' },
  'park.edu': { name: 'Park University', city: '', state: '' },
  'parkland.edu': { name: 'Parkland College', city: '', state: '' },
  'pasadena.edu': { name: 'Pasadena City College', city: '', state: '' },
  'phcc.edu': { name: 'Pasco-Hernando Community College', city: '', state: '' },
  'phsc.edu': { name: 'Pasco-Hernando State College', city: '', state: '' },
  'pccc.edu': { name: 'Passaic County Community College', city: '', state: '' },
  'patrickhenry.edu': { name: 'Patrick Henry Community College', city: '', state: '' },
  'pdc.edu': { name: 'Paul D Camp Community College', city: '', state: '' },
  'paulquinn.edu': { name: 'Paul Quinn College', city: '', state: '' },
  'peace.edu': { name: 'Peace College', city: '', state: '' },
  'prcc.edu': { name: 'Pearl River Community College', city: '', state: '' },
  'pstcc.edu': { name: 'Pellissippi State Community College', city: '', state: '' },
  'pembroke.edu': { name: 'Pembroke State University', city: '', state: '' },
  'harrisburg.psu.edu': { name: 'Pennsylvania State University - Harrisburg', city: '', state: '' },
  'pcci.edu': { name: 'Pensacola Christian College', city: '', state: '' },
  'pensacolastate.edu': { name: 'Pensacola State College', city: '', state: '' },
  'peru.edu': { name: 'Peru State College', city: '', state: '' },
  'pcom.edu': { name: 'Philadelphia College of Osteopathic Medicine', city: '', state: '' },
  'philau.edu': { name: 'Philadelphia University', city: '', state: '' },
  'philander.edu': { name: 'Philander Smith College', city: '', state: '' },
  'pccua.edu': { name: 'Phillips Community College of the University of Arkansas', city: '', state: '' },
  'phillips.edu': { name: 'Phillips University', city: '', state: '' },
  'phoenixcollege.edu': { name: 'Phoenix College', city: '', state: '' },
  'piedmontcc.edu': { name: 'Piedmont Community College', city: '', state: '' },
  'ptc.edu': { name: 'Piedmont Technical College', city: '', state: '' },
  'pvcc.edu': { name: 'Piedmont Virginia Community College', city: '', state: '' },
  'pierce.ctc.edu': { name: 'Pierce College at Puyallup', city: '', state: '' },
  'pierpont.edu': { name: 'Pierpont Community and Technical College', city: '', state: '' },
  'ppcc.edu': { name: 'Pikes Peak Community College', city: '', state: '' },
  'pima.edu': { name: 'Pima Community College', city: '', state: '' },
  'pinetech.edu': { name: 'Pine Technical College', city: '', state: '' },
  'pittcc.edu': { name: 'Pitt Community College', city: '', state: '' },
  'platt.edu': { name: 'Platt College', city: '', state: '' },
  'polk.edu': { name: 'Polk State College', city: '', state: '' },
  'poly.edu': { name: 'Polytechnic University of New York', city: '', state: '' },
  'pupr.edu': { name: 'Polytechnic University of Puerto Rico', city: '', state: '' },
  'portervillecollege.edu': { name: 'Porterville College', city: '', state: '' },
  'pcc.edu': { name: 'Portland Community College', city: '', state: '' },
  'prairiestate.edu': { name: 'Prairie State College', city: '', state: '' },
  'prattcc.edu': { name: 'Pratt Community College', city: '', state: '' },
  'pratt.edu': { name: 'Pratt Institute', city: '', state: '' },
  'presby.edu': { name: 'Presbyterian College', city: '', state: '' },
  'prescott.edu': { name: 'Prescott College', city: '', state: '' },
  'pgcc.edu': { name: 'Prince George\'s Community College', city: '', state: '' },
  'pwsc.alaska.edu': { name: 'Prince William Sound College', city: '', state: '' },
  'pueblocc.edu': { name: 'Pueblo Community College', city: '', state: '' },
  'pulaskitech.edu': { name: 'Pulaski Technical College', city: '', state: '' },
  'purdueglobal.edu': { name: 'Purdue Global University', city: '', state: '' },
  'purduecal.edu': { name: 'Purdue University Calumet', city: '', state: '' },
  'pfw.edu': { name: 'Purdue University Fort Wayne', city: '', state: '' },
  'pnc.edu': { name: 'Purdue University North Central', city: '', state: '' },
  'pnw.edu': { name: 'Purdue University Northwest', city: '', state: '' },
  'queens.edu': { name: 'Queens University of Charlotte', city: '', state: '' },
  'quincycollege.edu': { name: 'Quincy College', city: '', state: '' },
  'quincy.edu': { name: 'Quincy University', city: '', state: '' },
  'qvcc.edu': { name: 'Quinebaug Valley Community College', city: '', state: '' },
  'qcc.edu': { name: 'Quinsigamond Community College', city: '', state: '' },
  'rrcc.mnscu.edu': { name: 'Rainy River Community College', city: '', state: '' },
  'ramapo.edu': { name: 'Ramapo College', city: '', state: '' },
  'randolph.edu': { name: 'Randolph Community College', city: '', state: '' },
  'rmc.edu': { name: 'Randolph-Macon College', city: '', state: '' },
  'rmwc.edu': { name: 'Randolph-Macon Woman\'s College', city: '', state: '' },
  'rangercollege.edu': { name: 'Ranger College', city: '', state: '' },
  'rappahannock.edu': { name: 'Rappahannock Community College', city: '', state: '' },
  'raritanval.edu': { name: 'Raritan Valley Community College', city: '', state: '' },
  'racc.edu': { name: 'Reading Area Community College', city: '', state: '' },
  'rrcc.edu': { name: 'Red Rocks Community College', city: '', state: '' },
  'redlandscc.edu': { name: 'Redlands Community College', city: '', state: '' },
  'reedleycollege.edu': { name: 'Reedley College', city: '', state: '' },
  'regent.edu': { name: 'Regent University', city: '', state: '' },
  'regis.edu': { name: 'Regis University', city: '', state: '' },
  'rlc.edu': { name: 'Rend Lake College', city: '', state: '' },
  'rtc.edu': { name: 'Renton Technical College', city: '', state: '' },
  'ric.edu': { name: 'Rhode Island College', city: '', state: '' },
  'rmcc.edu': { name: 'Rich Mountain Community College', city: '', state: '' },
  'rbc.edu': { name: 'Richard Bland College of the College of William and Mary', city: '', state: '' },
  'stockton.edu': { name: 'Richard Stockton College of New Jersey', city: '', state: '' },
  'richlandcollege.edu': { name: 'Richland College', city: '', state: '' },
  'richland.edu': { name: 'Richland Community College', city: '', state: '' },
  'richmondcc.edu': { name: 'Richmond Community College', city: '', state: '' },
  'ridgewater.edu': { name: 'Ridgewater College', city: '', state: '' },
  'riohondo.edu': { name: 'Rio Hondo College', city: '', state: '' },
  'rio.maricopa.edu': { name: 'Rio Salado College', city: '', state: '' },
  'ripon.edu': { name: 'Ripon College', city: '', state: '' },
  'rpcc.edu': { name: 'River Parishes Community College', city: '', state: '' },
  'rivervalley.edu': { name: 'River Valley Community College', city: '', state: '' },
  'riverland.edu': { name: 'Riverland Community College', city: '', state: '' },
  'rcc.edu': { name: 'Riverside City College', city: '', state: '' },
  'rccd.edu': { name: 'Riverside Community College District', city: '', state: '' },
  'riv.edu': { name: 'Rivier College', city: '', state: '' },
  'roanestate.edu': { name: 'Roane State Community College', city: '', state: '' },
  'roanoke.edu': { name: 'Roanoke College', city: '', state: '' },
  'roanokechowan.edu': { name: 'Roanoke-Chowan Community College', city: '', state: '' },
  'rmu.edu': { name: 'Robert Morris University', city: '', state: '' },
  'robertmorris.edu': { name: 'Robert Morris University Illinois', city: '', state: '' },
  'robeson.edu': { name: 'Robeson Community College', city: '', state: '' },
  'rctc.edu': { name: 'Rochester Community and Technical College', city: '', state: '' },
  'rockvalleycollege.edu': { name: 'Rock Valley College', city: '', state: '' },
  'rockefeller.edu': { name: 'Rockefeller University', city: '', state: '' },
  'rockford.edu': { name: 'Rockford College', city: '', state: '' },
  'rockhurst.edu': { name: 'Rockhurst College', city: '', state: '' },
  'rockinghamcc.edu': { name: 'Rockingham Community College', city: '', state: '' },
  'sunyrockland.edu': { name: 'Rockland Community College', city: '', state: '' },
  'rocky.edu': { name: 'Rocky Mountain College', city: '', state: '' },
  'rsu.edu': { name: 'Rogers State University', city: '', state: '' },
  'roguecc.edu': { name: 'Rogue Community College', city: '', state: '' },
  'roosevelt.edu': { name: 'Roosevelt University', city: '', state: '' },
  'rosary.edu': { name: 'Rosary College', city: '', state: '' },
  'rose.edu': { name: 'Rose State College', city: '', state: '' },
  'rose-hulman.edu': { name: 'Rose-Hulman Institute of Technology', city: '', state: '' },
  'rcbc.edu': { name: 'Rowan College at Burlington County', city: '', state: '' },
  'rcsj.edu': { name: 'Rowan College of South Jersey', city: '', state: '' },
  'rccc.edu': { name: 'Rowan-Cabarrus Community College', city: '', state: '' },
  'rcc.mass.edu': { name: 'Roxbury Community College', city: '', state: '' },
  'rustcollege.edu': { name: 'Rust College', city: '', state: '' },
  'scc.losrios.edu': { name: 'Sacramento City College', city: '', state: '' },
  'sacredheart.edu': { name: 'Sacred Heart University', city: '', state: '' },
  'sage.edu': { name: 'Sage Colleges', city: '', state: '' },
  'sagchip.edu': { name: 'Saginaw Chippewa Tribal College', city: '', state: '' },
  'svsu.edu': { name: 'Saginaw Valley State University', city: '', state: '' },
  'anselm.edu': { name: 'Saint Anselm College', city: '', state: '' },
  'stcloudstate.edu': { name: 'Saint Cloud State University', city: '', state: '' },
  'stedwards.edu': { name: 'Saint Edward\'s University', city: '', state: '' },
  'secon.edu': { name: 'Saint Elizabeth College of Nursing', city: '', state: '' },
  'saintjoe.edu': { name: 'Saint Joseph\'s College (IN)', city: '', state: '' },
  'sju.edu': { name: 'Saint Joseph\'s University', city: '', state: '' },
  'saintleo.edu': { name: 'Saint Leo University', city: '', state: '' },
  'smcks.edu': { name: 'Saint Mary College', city: '', state: '' },
  'saintmarys.edu': { name: 'Saint Mary\'s College (IN)', city: '', state: '' },
  'stmarys-ca.edu': { name: 'Saint Mary\'s College of California', city: '', state: '' },
  'smumn.edu': { name: 'Saint Mary\'s University of Minnesota', city: '', state: '' },
  'smcvt.edu': { name: 'Saint Michael\'s College', city: '', state: '' },
  'saintpaul.edu': { name: 'Saint Paul College', city: '', state: '' },
  'stvincent.edu': { name: 'Saint Vincent College', city: '', state: '' },
  'sxu.edu': { name: 'Saint Xavier University', city: '', state: '' },
  'salemcc.edu': { name: 'Salem Community College', city: '', state: '' },
  'skc.edu': { name: 'Salish Kootenai College', city: '', state: '' },
  'slcc.edu': { name: 'Salt Lake Community College', city: '', state: '' },
  'samford.edu': { name: 'Samford University', city: '', state: '' },
  'sampsoncc.edu': { name: 'Sampson Community College', city: '', state: '' },
  'sdcc.edu': { name: 'San Diego Christian College', city: '', state: '' },
  'deltacollege.edu': { name: 'San Joaquin Delta College', city: '', state: '' },
  'sjvc.edu': { name: 'San Joaquin Valley College-Visalia', city: '', state: '' },
  'sjcc.edu': { name: 'San Jose City College', city: '', state: '' },
  'sanjuancollege.edu': { name: 'San Juan College', city: '', state: '' },
  'smccd.edu': { name: 'San Mateo County Community College District', city: '', state: '' },
  'sandhills.edu': { name: 'Sandhills Community College', city: '', state: '' },
  'sans.edu': { name: 'SANS Technology Institute', city: '', state: '' },
  'sac.edu': { name: 'Santa Ana College', city: '', state: '' },
  'sbcc.edu': { name: 'Santa Barbara City College', city: '', state: '' },
  'scu.edu': { name: 'Santa Clara University', city: '', state: '' },
  'sfcc.edu': { name: 'Santa Fe Community College', city: '', state: '' },
  'smc.edu': { name: 'Santa Monica College', city: '', state: '' },
  'santarosa.edu': { name: 'Santa Rosa Junior College', city: '', state: '' },
  'sccollege.edu': { name: 'Santiago Canyon College', city: '', state: '' },
  'slc.edu': { name: 'Sarah Lawrence College', city: '', state: '' },
  'svcc.edu': { name: 'Sauk Valley Community College', city: '', state: '' },
  'scad.edu': { name: 'Savannah College of Art and Design', city: '', state: '' },
  'savannahstate.edu': { name: 'Savannah State University', city: '', state: '' },
  'savannahtech.edu': { name: 'Savannah Technical College', city: '', state: '' },
  'sunysccc.edu': { name: 'Schenectady County Community College', city: '', state: '' },
  'schiller.edu': { name: 'Schiller International University', city: '', state: '' },
  'saic.edu': { name: 'School of the Art Institute of Chicago', city: '', state: '' },
  'schoolcraft.edu': { name: 'Schoolcraft College', city: '', state: '' },
  'scottsdalecc.edu': { name: 'Scottsdale Community College', city: '', state: '' },
  'seattlecentral.edu': { name: 'Seattle Central College', city: '', state: '' },
  'seattlecolleges.edu': { name: 'Seattle Colleges', city: '', state: '' },
  'selmauniversity.edu': { name: 'Selma University', city: '', state: '' },
  'sscok.edu': { name: 'Seminole State College', city: '', state: '' },
  'sewanee.edu': { name: 'Sewanee, University of the South', city: '', state: '' },
  'sccc.edu': { name: 'Seward County Community College and Area Technical School', city: '', state: '' },
  'shastacollege.edu': { name: 'Shasta College', city: '', state: '' },
  'shawu.edu': { name: 'Shaw University', city: '', state: '' },
  'shawneecc.edu': { name: 'Shawnee Community College', city: '', state: '' },
  'shawnee.edu': { name: 'Shawnee State University', city: '', state: '' },
  'sheltonstate.edu': { name: 'Shelton State Community College', city: '', state: '' },
  'su.edu': { name: 'Shenandoah University', city: '', state: '' },
  'sheridan.edu': { name: 'Sheridan College', city: '', state: '' },
  'shoreline.edu': { name: 'Shoreline Community College', city: '', state: '' },
  'shorter.edu': { name: 'Shorter College', city: '', state: '' },
  'siena.edu': { name: 'Siena College', city: '', state: '' },
  'sierracollege.edu': { name: 'Sierra College', city: '', state: '' },
  'simmonscollegeky.edu': { name: 'Simmons College of Kentucky', city: '', state: '' },
  'simons-rock.edu': { name: 'Simon\'s Rock College', city: '', state: '' },
  'simpson.edu': { name: 'Simpson College', city: '', state: '' },
  'sinclair.edu': { name: 'Sinclair Community College', city: '', state: '' },
  'skagit.edu': { name: 'Skagit Valley College', city: '', state: '' },
  'skylinecollege.edu': { name: 'Skyline College', city: '', state: '' },
  'snead.edu': { name: 'Snead State Community College', city: '', state: '' },
  'snow.edu': { name: 'Snow College', city: '', state: '' },
  'sofia.edu': { name: 'Sofia University', city: '', state: '' },
  'solano.edu': { name: 'Solano Community College', city: '', state: '' },
  'somerset.kctcs.edu': { name: 'Somerset Community College', city: '', state: '' },
  'sonoma.edu': { name: 'Sonoma State University', city: '', state: '' },
  'southark.edu': { name: 'South Arkansas Community College', city: '', state: '' },
  'scsu.edu': { name: 'South Carolina State University', city: '', state: '' },
  'southcentral.edu': { name: 'South Central College', city: '', state: '' },
  'southgatech.edu': { name: 'South Georgia Technical College', city: '', state: '' },
  'solacc.edu': { name: 'South Louisiana Community College', city: '', state: '' },
  'southmountaincc.edu': { name: 'South Mountain Community College', city: '', state: '' },
  'spcc.edu': { name: 'South Piedmont Community College', city: '', state: '' },
  'southplainscollege.edu': { name: 'South Plains College', city: '', state: '' },
  'spscc.ctc.edu': { name: 'South Puget Sound Community College', city: '', state: '' },
  'ssc.edu': { name: 'South Suburban College', city: '', state: '' },
  'stcl.edu': { name: 'South Texas College of Law', city: '', state: '' },
  'bowlinggreen.kctcs.edu': { name: 'Southcentral Kentucky Community and Technical College', city: '', state: '' },
  'seark.edu': { name: 'Southeast Arkansas College', city: '', state: '' },
  'southeast.edu': { name: 'Southeast Community College Area', city: '', state: '' },
  'southeast.kctcs.edu': { name: 'Southeast Kentucky Community and Technical College', city: '', state: '' },
  'southeastmissourihospitalcollege.edu': { name: 'Southeast Missouri Hospital College of Nursing and Health Sciences', city: '', state: '' },
  'semo.edu': { name: 'Southeast Missouri State University', city: '', state: '' },
  'southeasttech.edu': { name: 'Southeast Technical Institute', city: '', state: '' },
  'scciowa.edu': { name: 'Southeastern Community College', city: '', state: '' },
  'sccnc.edu': { name: 'Southeastern Community College', city: '', state: '' },
  'sic.edu': { name: 'Southeastern Illinois College', city: '', state: '' },
  'southeasterntech.edu': { name: 'Southeastern Technical College', city: '', state: '' },
  'sautech.edu': { name: 'Southern Arkansas University Tech', city: '', state: '' },
  'southern.edu': { name: 'Southern College', city: '', state: '' },
  'sct.edu': { name: 'Southern College of Technology', city: '', state: '' },
  'southernct.edu': { name: 'Southern Connecticut State University', city: '', state: '' },
  'sctech.edu': { name: 'Southern Crescent Technical College', city: '', state: '' },
  'siu.edu': { name: 'Southern Illinois University-Carbondale', city: '', state: '' },
  'siue.edu': { name: 'Southern Illinois University-Edwardsville', city: '', state: '' },
  'smccme.edu': { name: 'Southern Maine Community College', city: '', state: '' },
  'snu.edu': { name: 'Southern Nazarene University', city: '', state: '' },
  'snhu.edu': { name: 'Southern New Hampshire University', city: '', state: '' },
  'sscc.edu': { name: 'Southern State Community College', city: '', state: '' },
  'suscc.edu': { name: 'Southern Union State Community College', city: '', state: '' },
  'suno.edu': { name: 'Southern University at New Orleans', city: '', state: '' },
  'susla.edu': { name: 'Southern University at Shreveport', city: '', state: '' },
  'southernwv.edu': { name: 'Southern West Virginia Community and Technical College', city: '', state: '' },
  'southside.edu': { name: 'Southside Virginia Community College', city: '', state: '' },
  'sbuniv.edu': { name: 'Southwest Baptist University', city: '', state: '' },
  'southwestgatech.edu': { name: 'Southwest Georgia Technical College', city: '', state: '' },
  'smsu.edu': { name: 'Southwest Minnesota State University', city: '', state: '' },
  'smcc.edu': { name: 'Southwest Mississippi Community College', city: '', state: '' },
  'swri.edu': { name: 'Southwest Research Institute', city: '', state: '' },
  'southwest.tn.edu': { name: 'Southwest Tennessee Community College', city: '', state: '' },
  'swt.edu': { name: 'Southwest Texas State University', city: '', state: '' },
  'sw.edu': { name: 'Southwest Virginia Community College', city: '', state: '' },
  'swtc.edu': { name: 'Southwest Wisconsin Technical College', city: '', state: '' },
  'swac.edu': { name: 'Southwestern Adventist College', city: '', state: '' },
  'sagu.edu': { name: 'Southwestern Assemblies of God University', city: '', state: '' },
  'swcc.edu': { name: 'Southwestern Christian College', city: '', state: '' },
  'swccd.edu': { name: 'Southwestern College (CA)', city: '', state: '' },
  'sckans.edu': { name: 'Southwestern College (KS)', city: '', state: '' },
  'swcciowa.edu': { name: 'Southwestern Community College', city: '', state: '' },
  'southwesterncc.edu': { name: 'Southwestern Community College', city: '', state: '' },
  'swic.edu': { name: 'Southwestern Illinois College', city: '', state: '' },
  'sipi.edu': { name: 'Southwestern Indian Polytechnic Institute', city: '', state: '' },
  'swmich.edu': { name: 'Southwestern Michigan College', city: '', state: '' },
  'socc.edu': { name: 'Southwestern Oregon Community College', city: '', state: '' },
  'southwestern.edu': { name: 'Southwestern University', city: '', state: '' },
  'sowela.edu': { name: 'SOWELA Technical Community College', city: '', state: '' },
  'sccsc.edu': { name: 'Spartanburg Community College', city: '', state: '' },
  'smcsc.edu': { name: 'Spartanburg Methodist College', city: '', state: '' },
  'auc.edu': { name: 'Spelman College', city: '', state: '' },
  'scc.spokane.edu': { name: 'Spokane Community College', city: '', state: '' },
  'spokanefalls.edu': { name: 'Spokane Falls Community College', city: '', state: '' },
  'src.edu': { name: 'Spoon River College', city: '', state: '' },
  'arbor.edu': { name: 'Spring Arbor College', city: '', state: '' },
  'shc.edu': { name: 'Spring Hill College', city: '', state: '' },
  'stcc.edu': { name: 'Springfield Technical Community College', city: '', state: '' },
  'stchas.edu': { name: 'St Charles Community College', city: '', state: '' },
  'sctcc.edu': { name: 'St Cloud Technical and Community College', city: '', state: '' },
  'sau.edu': { name: 'St. Ambrose University', city: '', state: '' },
  'sapc.edu': { name: 'St. Andrews Presbyterian College', city: '', state: '' },
  'ustanne.ednet.ns.ca': { name: 'St. Anne University', city: '', state: '' },
  'st-aug.edu': { name: 'St. Augustine\'s University', city: '', state: '' },
  'sbu.edu': { name: 'St. Bonaventure University', city: '', state: '' },
  'stclairc.on.ca': { name: 'St. Clair College', city: '', state: '' },
  'sc4.edu': { name: 'St. Clair County Community College', city: '', state: '' },
  'sjca.edu': { name: 'St. John\'s College - Annapolis', city: '', state: '' },
  'sjcsf.edu': { name: 'St. John\'s College - Santa Fe', city: '', state: '' },
  'sjrstate.edu': { name: 'St. Johns River State College', city: '', state: '' },
  'sjc.edu': { name: 'St. Joseph College (CT)', city: '', state: '' },
  'sjcme.edu': { name: 'St. Joseph\'s College (ME)', city: '', state: '' },
  'stlawu.edu': { name: 'St. Lawrence University', city: '', state: '' },
  'stlcop.edu': { name: 'St. Louis College of Pharmacy', city: '', state: '' },
  'stmartin.edu': { name: 'St. Martin\'s College', city: '', state: '' },
  'smcm.edu': { name: 'St. Mary\'s College of Maryland', city: '', state: '' },
  'stmarys.ca': { name: 'St. Mary\'s University', city: '', state: '' },
  'ustpaul.ca': { name: 'St. Paul University', city: '', state: '' },
  'spcollege.edu': { name: 'St. Petersburg College', city: '', state: '' },
  'stthomasu.ca': { name: 'St. Thomas University', city: '', state: '' },
  'stu.edu': { name: 'St. Thomas University (FL)', city: '', state: '' },
  'stanly.edu': { name: 'Stanly Community College', city: '', state: '' },
  'starkstate.edu': { name: 'Stark State College', city: '', state: '' },
  'scccd.edu': { name: 'State Center Community College District', city: '', state: '' },
  'sfccmo.edu': { name: 'State Fair Community College', city: '', state: '' },
  'farmingdale.edu': { name: 'State University of New York at Farmingdale', city: '', state: '' },
  'fredonia.edu': { name: 'State University of New York at Fredonia', city: '', state: '' },
  'oswego.edu': { name: 'State University of New York at Oswego', city: '', state: '' },
  'plattsburgh.edu': { name: 'State University of New York at Plattsburgh', city: '', state: '' },
  'brockport.edu': { name: 'State University of New York College at Brockport', city: '', state: '' },
  'buffalostate.edu': { name: 'State University of New York College at Buffalo', city: '', state: '' },
  'cortland.edu': { name: 'State University of New York College at Cortland', city: '', state: '' },
  'geneseo.edu': { name: 'State University of New York College at Geneseo', city: '', state: '' },
  'newpaltz.edu': { name: 'State University of New York College at New Paltz', city: '', state: '' },
  'potsdam.edu': { name: 'State University of New York College at Potsdam', city: '', state: '' },
  'cobleskill.edu': { name: 'State University of New York College of Agriculture and Technology at Cobleskill', city: '', state: '' },
  'esf.edu': { name: 'State University of New York College of Environmental Science and Forestry', city: '', state: '' },
  'alfredtech.edu': { name: 'State University of New York College of Technology at Alfred', city: '', state: '' },
  'sunyit.edu': { name: 'State University of New York Polytechnic Institute', city: '', state: '' },
  'sunycentral.edu': { name: 'State University of New York System', city: '', state: '' },
  'stephens.edu': { name: 'Stephens College', city: '', state: '' },
  'stevens.edu': { name: 'Stevens Institute of Technology', city: '', state: '' },
  'stevenson.edu': { name: 'Stevenson University', city: '', state: '' },
  'stillman.edu': { name: 'Stillman College', city: '', state: '' },
  'stonechild.edu': { name: 'Stone Child College', city: '', state: '' },
  'stratford.edu': { name: 'Stratford University', city: '', state: '' },
  'strayer.edu': { name: 'Strayer College', city: '', state: '' },
  'www3.sunysuffolk.edu': { name: 'Suffolk County Community College', city: '', state: '' },
  'sulross.edu': { name: 'Sul Ross State University', city: '', state: '' },
  'sunysullivan.edu': { name: 'Sullivan County Community College', city: '', state: '' },
  'sullivan.edu': { name: 'Sullivan University', city: '', state: '' },
  'summitunivofla.edu': { name: 'Summit University of Louisiana', city: '', state: '' },
  'downstate.edu': { name: 'SUNY Downstate Health Sciences University', city: '', state: '' },
  'sunymaritime.edu': { name: 'SUNY Maritime College', city: '', state: '' },
  'sunywcc.edu': { name: 'SUNY Westchester Community College', city: '', state: '' },
  'surry.edu': { name: 'Surry Community College', city: '', state: '' },
  'susqu.edu': { name: 'Susquehanna University', city: '', state: '' },
  'sussex.edu': { name: 'Sussex County Community College', city: '', state: '' },
  'sbc.edu': { name: 'Sweet Briar College', city: '', state: '' },
  'tabor.edu': { name: 'Tabor College', city: '', state: '' },
  'tacomacc.edu': { name: 'Tacoma Community College', city: '', state: '' },
  'taftcollege.edu': { name: 'Taft College', city: '', state: '' },
  'talladega.edu': { name: 'Talladega College', city: '', state: '' },
  'tcc.fl.edu': { name: 'Tallahassee Community College', city: '', state: '' },
  'tarleton.edu': { name: 'Tarleton State University', city: '', state: '' },
  'tccd.edu': { name: 'Tarrant County College', city: '', state: '' },
  'tayloru.edu': { name: 'Taylor University', city: '', state: '' },
  'tcicollege.edu': { name: 'Technical Career Institutes', city: '', state: '' },
  'tcl.edu': { name: 'Technical College of the Lowcountry', city: '', state: '' },
  'templejc.edu': { name: 'Temple College', city: '', state: '' },
  'tnstate.edu': { name: 'Tennessee State University', city: '', state: '' },
  'terra.edu': { name: 'Terra State Community College', city: '', state: '' },
  'texarkanacollege.edu': { name: 'Texarkana College', city: '', state: '' },
  'tamiu.edu': { name: 'Texas A&M International University', city: '', state: '' },
  'tamuc.edu': { name: 'Texas A&M University - Commerce', city: '', state: '' },
  'tamucc.edu': { name: 'Texas A&M University - Corpus Christi', city: '', state: '' },
  'tamuk.edu': { name: 'Texas A&M University - Kingsville', city: '', state: '' },
  'ace.tamut.edu': { name: 'Texas A&M University-Texarkana', city: '', state: '' },
  'texascollege.edu': { name: 'Texas College', city: '', state: '' },
  'tsu.edu': { name: 'Texas Southern University', city: '', state: '' },
  'harlingen.tstc.edu': { name: 'Texas State Technical College-Harlingen', city: '', state: '' },
  'marshall.tstc.edu': { name: 'Texas State Technical College-Marshall', city: '', state: '' },
  'waco.tstc.edu': { name: 'Texas State Technical College-Waco', city: '', state: '' },
  'westtexas.tstc.edu': { name: 'Texas State Technical College-West Texas', city: '', state: '' },
  'ttuhsc.edu': { name: 'Texas Tech University-Health Sciences Center', city: '', state: '' },
  'txwes.edu': { name: 'Texas Wesleyan University', city: '', state: '' },
  'stevenscollege.edu': { name: 'Thaddeus Stevens College of Technology', city: '', state: '' },
  'aii.edu': { name: 'The Art Institutes', city: '', state: '' },
  'jtsa.edu': { name: 'The Jewish Theological Seminary', city: '', state: '' },
  'principia.edu': { name: 'The Principia', city: '', state: '' },
  'scripps.edu': { name: 'The Scripps Research Institute', city: '', state: '' },
  'umwestern.edu': { name: 'The University of Montana Western', city: '', state: '' },
  'thomas.edu': { name: 'Thomas College', city: '', state: '' },
  'tesc.edu': { name: 'Thomas Edison State University', city: '', state: '' },
  'tju.edu': { name: 'Thomas Jefferson University', city: '', state: '' },
  'jefferson.edu': { name: 'Thomas Jefferson University', city: '', state: '' },
  'thomasmore.edu': { name: 'Thomas More College', city: '', state: '' },
  'tncc.edu': { name: 'Thomas Nelson Community College', city: '', state: '' },
  'trcc.commnet.edu': { name: 'Three Rivers Community College', city: '', state: '' },
  'trcc.edu': { name: 'Three Rivers Community College', city: '', state: '' },
  'thunderbird.edu': { name: 'Thunderbird School of Global Management', city: '', state: '' },
  'tcc.edu': { name: 'Tidewater Community College', city: '', state: '' },
  'tiffin.edu': { name: 'Tiffin University', city: '', state: '' },
  'tocc.edu': { name: 'Tohono O\'Odham Community College', city: '', state: '' },
  'tc3.edu': { name: 'Tompkins Cortland Community College', city: '', state: '' },
  'tougaloo.edu': { name: 'Tougaloo College', city: '', state: '' },
  'touro.edu': { name: 'Touro College', city: '', state: '' },
  'transy.edu': { name: 'Transylvania University', city: '', state: '' },
  'trenton.edu': { name: 'Trenton State College', city: '', state: '' },
  'tricountycc.edu': { name: 'Tri-County Community College', city: '', state: '' },
  'tctc.edu': { name: 'Tri-County Technical College', city: '', state: '' },
  'tridenttech.edu': { name: 'Trident Technical College', city: '', state: '' },
  'trident.edu': { name: 'Trident University', city: '', state: '' },
  'trine.edu': { name: 'Trine University', city: '', state: '' },
  'trinidadstate.edu': { name: 'Trinidad State Junior College', city: '', state: '' },
  'trinitybiblecollege.edu': { name: 'Trinity Bible College & Graduate School', city: '', state: '' },
  'trinitydc.edu': { name: 'Trinity College (DC)', city: '', state: '' },
  'trinity.edu': { name: 'Trinity University', city: '', state: '' },
  'tvcc.edu': { name: 'Trinity Valley Community College', city: '', state: '' },
  'triton.edu': { name: 'Triton College', city: '', state: '' },
  'tsufl.edu': { name: 'Troy State University', city: '', state: '' },
  'troy.edu': { name: 'Troy University', city: '', state: '' },
  'tmcc.edu': { name: 'Truckee Meadows Community College', city: '', state: '' },
  'tucsonu.edu': { name: 'Tucson University', city: '', state: '' },
  'tulsacc.edu': { name: 'Tulsa Community College', city: '', state: '' },
  'tunxis.edu': { name: 'Tunxis Community College', city: '', state: '' },
  'tusculum.edu': { name: 'Tusculum College', city: '', state: '' },
  'tuskegee.edu': { name: 'Tuskegee University', city: '', state: '' },
  'www.tjc.edu': { name: 'Tyler Junior College', city: '', state: '' },
  'uchastings.edu': { name: 'UC Hastings College of the Law', city: '', state: '' },
  'www.sunyulster.edu': { name: 'Ulster County Community College', city: '', state: '' },
  'umpqua.edu': { name: 'Umpqua Community College', city: '', state: '' },
  'union.edu': { name: 'Union College', city: '', state: '' },
  'ucc.edu': { name: 'Union County College', city: '', state: '' },
  'tui.edu': { name: 'Union Institute', city: '', state: '' },
  'uu.edu': { name: 'Union University', city: '', state: '' },
  'uscga.edu': { name: 'United States Coast Guard Academy', city: '', state: '' },
  'usiu.edu': { name: 'United States International University', city: '', state: '' },
  'usmma.edu': { name: 'United States Merchant Marine Academy', city: '', state: '' },
  'usma.edu': { name: 'United States Military Academy', city: '', state: '' },
  'usna.edu': { name: 'United States Naval Academy', city: '', state: '' },
  'uat.edu': { name: 'University of Advancing Technology', city: '', state: '' },
  'uakron.edu': { name: 'University of Akron', city: '', state: '' },
  'wayne.uakron.edu': { name: 'University of Akron Wayne College', city: '', state: '' },
  'uah.edu': { name: 'University of Alabama at Huntsville', city: '', state: '' },
  'alaska.edu': { name: 'University of Alaska', city: '', state: '' },
  'uaa.alaska.edu': { name: 'University of Alaska - Anchorage', city: '', state: '' },
  'uas.alaska.edu': { name: 'University of Alaska - Southeast', city: '', state: '' },
  'uafs.edu': { name: 'University of Arkansas - Fort Smith', city: '', state: '' },
  'ualr.edu': { name: 'University of Arkansas - Little Rock', city: '', state: '' },
  'uamont.edu': { name: 'University of Arkansas - Monticello', city: '', state: '' },
  'uaccb.edu': { name: 'University of Arkansas Community College-Batesville', city: '', state: '' },
  'uacch.edu': { name: 'University of Arkansas Community College-Hope', city: '', state: '' },
  'uaccm.edu': { name: 'University of Arkansas Community College-Morrilton', city: '', state: '' },
  'uams.edu': { name: 'University of Arkansas for Medical Sciences', city: '', state: '' },
  'uasys.edu': { name: 'University of Arkansas System eVersity', city: '', state: '' },
  'ubalt.edu': { name: 'University of Baltimore', city: '', state: '' },
  'bridgeport.edu': { name: 'University of Bridgeport', city: '', state: '' },
  'ucop.edu': { name: 'University of California, Office of the President', city: '', state: '' },
  'ucsf.edu': { name: 'University of California, San Francisco', city: '', state: '' },
  'uca.edu': { name: 'University of Central Arkansas', city: '', state: '' },
  'ucmo.edu': { name: 'University of Central Missouri', city: '', state: '' },
  'uchaswv.edu': { name: 'University of Charleston', city: '', state: '' },
  'uc.edu': { name: 'University of Cincinnati', city: '', state: '' },
  'cuanschutz.edu': { name: 'University of Colorado Anschutz Medical Campus', city: '', state: '' },
  'hsc.colorado.edu': { name: 'University of Colorado Health Sciences Center', city: '', state: '' },
  'udallas.edu': { name: 'University of Dallas', city: '', state: '' },
  'udmercy.edu': { name: 'University of Detroit Mercy', city: '', state: '' },
  'dbq.edu': { name: 'University of Dubuque', city: '', state: '' },
  'evansville.edu': { name: 'University of Evansville', city: '', state: '' },
  'findlay.edu': { name: 'University of Findlay', city: '', state: '' },
  'ugf.edu': { name: 'University of Great Falls', city: '', state: '' },
  'hartford.edu': { name: 'University of Hartford', city: '', state: '' },
  'hilo.hawaii.edu': { name: 'University of Hawaii at Hilo', city: '', state: '' },
  'manoa.hawaii.edu': { name: 'University of Hawaii at Manoa', city: '', state: '' },
  'uhcno.edu': { name: 'University of Holy Cross', city: '', state: '' },
  'uis.edu': { name: 'University of Illinois Springfield', city: '', state: '' },
  'uindy.edu': { name: 'University of Indianapolis', city: '', state: '' },
  'uj.edu': { name: 'University of Jamestown', city: '', state: '' },
  'kumc.edu': { name: 'University of Kansas School of Medicine', city: '', state: '' },
  'umaine.edu': { name: 'University of Maine', city: '', state: '' },
  'umf.maine.edu': { name: 'University of Maine at Farmington', city: '', state: '' },
  'umfk.maine.edu': { name: 'University of Maine at Fort Kent', city: '', state: '' },
  'umm.maine.edu': { name: 'University of Maine at Machias', city: '', state: '' },
  'umpi.maine.edu': { name: 'University of Maine at Presque Island', city: '', state: '' },
  'umw.edu': { name: 'University of Mary Washington', city: '', state: '' },
  'umuc.edu': { name: 'University of Maryland - University College', city: '', state: '' },
  'umes.edu': { name: 'University of Maryland Eastern Shore', city: '', state: '' },
  'umaryland.edu': { name: 'University of Maryland, Baltimore', city: '', state: '' },
  'umassd.edu': { name: 'University of Massachusetts at Dartmouth', city: '', state: '' },
  'uml.edu': { name: 'University of Massachusetts at Lowell', city: '', state: '' },
  'umdearborn.edu': { name: 'University of Michigan - Dearborn', city: '', state: '' },
  'umflint.edu': { name: 'University of Michigan-Flint', city: '', state: '' },
  'crk.umn.edu': { name: 'University of Minnesota - Crookston', city: '', state: '' },
  'd.umn.edu': { name: 'University of Minnesota - Duluth', city: '', state: '' },
  'mrs.umn.edu': { name: 'University of Minnesota - Morris', city: '', state: '' },
  'umc.edu': { name: 'University of Mississippi Medical Center', city: '', state: '' },
  'umr.edu': { name: 'University of Missouri - Rolla', city: '', state: '' },
  'umsl.edu': { name: 'University of Missouri - Saint Louis', city: '', state: '' },
  'unk.edu': { name: 'University of Nebraska, Kearney', city: '', state: '' },
  'une.edu': { name: 'University of New England', city: '', state: '' },
  'newhaven.edu': { name: 'University of New Haven', city: '', state: '' },
  'uno.edu': { name: 'University of New Orleans', city: '', state: '' },
  'una.edu': { name: 'University of North Alabama', city: '', state: '' },
  'unca.edu': { name: 'University of North Carolina at Asheville', city: '', state: '' },
  'unf.edu': { name: 'University of North Florida', city: '', state: '' },
  'ung.edu': { name: 'University of North Georgia', city: '', state: '' },
  'hsc.unt.edu': { name: 'University of North Texas Health Science Center', city: '', state: '' },
  'unco.edu': { name: 'University of Northern Colorado', city: '', state: '' },
  'phoenix.edu': { name: 'University of Phoenix', city: '', state: '' },
  'upike.edu': { name: 'University of Pikeville', city: '', state: '' },
  'up.edu': { name: 'University of Portland', city: '', state: '' },
  'upr.edu': { name: 'University of Puerto Rico', city: '', state: '' },
  'uor.edu': { name: 'University of Redlands', city: '', state: '' },
  'stthom.edu': { name: 'University of Saint Thomas (TX)', city: '', state: '' },
  'usao.edu': { name: 'University of Science & Arts of Oklahoma', city: '', state: '' },
  'scranton.edu': { name: 'University of Scranton', city: '', state: '' },
  'usouixfalls.edu': { name: 'University of Sioux Falls', city: '', state: '' },
  'usca.edu': { name: 'University of South Carolina - Aiken', city: '', state: '' },
  'email.uscupstate.edu': { name: 'University of South Carolina Upstate', city: '', state: '' },
  'uscb.edu': { name: 'University of South Carolina, Beaufort', city: '', state: '' },
  'usi.edu': { name: 'University of Southern Indiana', city: '', state: '' },
  'usm.maine.edu': { name: 'University of Southern Maine', city: '', state: '' },
  'usl.edu': { name: 'University of Southwestern Louisiana', city: '', state: '' },
  'usa.edu': { name: 'University of St. Augustine for Health Sciences', city: '', state: '' },
  'usjc.uwaterloo.ca': { name: 'University of St. Jerome\'s College', city: '', state: '' },
  'ut.edu': { name: 'University of Tampa', city: '', state: '' },
  'utc.edu': { name: 'University of Tennessee at Chattanooga', city: '', state: '' },
  'utm.edu': { name: 'University of Tennessee, Martin', city: '', state: '' },
  'panam.edu': { name: 'University of Texas - Pan American', city: '', state: '' },
  'utb.edu': { name: 'University of Texas at Brownsville', city: '', state: '' },
  'utd.edu': { name: 'University of Texas at Dallas', city: '', state: '' },
  'utep.edu': { name: 'University of Texas at El Paso', city: '', state: '' },
  'uttyler.edu': { name: 'University of Texas at Tyler', city: '', state: '' },
  'utmb.edu': { name: 'University of Texas Medical Branch', city: '', state: '' },
  'utpb.edu': { name: 'University of Texas Permian Basin', city: '', state: '' },
  'swmed.edu': { name: 'University of Texas Southwestern Medical Center', city: '', state: '' },
  'udc.edu': { name: 'University of the District of Columbia', city: '', state: '' },
  'uiw.edu': { name: 'University of the Incarnate Word', city: '', state: '' },
  'ozarks.edu': { name: 'University of the Ozarks', city: '', state: '' },
  'uop.edu': { name: 'University of the Pacific', city: '', state: '' },
  'uopeople.edu': { name: 'University of the People', city: '', state: '' },
  'uw.edu': { name: 'University of Washington', city: '', state: '' },
  'westal.edu': { name: 'University of West Alabama', city: '', state: '' },
  'uwf.edu': { name: 'University of West Florida', city: '', state: '' },
  'westga.edu': { name: 'University of West Georgia', city: '', state: '' },
  'uwosh.edu': { name: 'University of Wisconsin - Oshkosh', city: '', state: '' },
  'uwp.edu': { name: 'University of Wisconsin - Parkside', city: '', state: '' },
  'uwplatt.edu': { name: 'University of Wisconsin - Platteville', city: '', state: '' },
  'uwrf.edu': { name: 'University of Wisconsin - River Falls', city: '', state: '' },
  'uwstout.edu': { name: 'University of Wisconsin - Stout', city: '', state: '' },
  'uwsuper.edu': { name: 'University of Wisconsin - Superior', city: '', state: '' },
  'uww.edu': { name: 'University of Wisconsin - Whitewater', city: '', state: '' },
  'uwc.edu': { name: 'University of Wisconsin Colleges', city: '', state: '' },
  'uwsa.edu': { name: 'University of Wisconsin System', city: '', state: '' },
  'uiu.edu': { name: 'Upper Iowa University', city: '', state: '' },
  'urbancollege.edu': { name: 'Urban College of Boston', city: '', state: '' },
  'ursinus.edu': { name: 'Ursinus College', city: '', state: '' },
  'utahtech.edu': { name: 'Utah Tech University', city: '', state: '' },
  'uvsc.edu': { name: 'Utah Valley State College', city: '', state: '' },
  'utica.edu': { name: 'Utica College', city: '', state: '' },
  'valdosta.edu': { name: 'Valdosta State University', city: '', state: '' },
  'valenciacollege.edu': { name: 'Valencia College', city: '', state: '' },
  'vcsu.edu': { name: 'Valley City State University', city: '', state: '' },
  'vfmac.edu': { name: 'Valley Forge Military Academy and College', city: '', state: '' },
  'vgcc.edu': { name: 'Vance-Granville Community College', city: '', state: '' },
  'venturacollege.edu': { name: 'Ventura College', city: '', state: '' },
  'vcc.edu': { name: 'Vermilion Community College', city: '', state: '' },
  'vermontlaw.edu': { name: 'Vermont Law School', city: '', state: '' },
  'vtc.edu': { name: 'Vermont Technical College', city: '', state: '' },
  'vernoncollege.edu': { name: 'Vernon College', city: '', state: '' },
  'vvc.edu': { name: 'Victor Valley College', city: '', state: '' },
  'victoriacollege.edu': { name: 'Victoria College', city: '', state: '' },
  'vjc.edu': { name: 'Villa Julie College', city: '', state: '' },
  'vccs.edu': { name: 'Virginia Community College System', city: '', state: '' },
  'vhcc.edu': { name: 'Virginia Highlands Community College', city: '', state: '' },
  'vic.edu': { name: 'Virginia Intermont College', city: '', state: '' },
  'vmi.edu': { name: 'Virginia Military Institute', city: '', state: '' },
  'vsu.edu': { name: 'Virginia State University', city: '', state: '' },
  'vuu.edu': { name: 'Virginia Union University', city: '', state: '' },
  'vul.edu': { name: 'Virginia University of Lynchburg', city: '', state: '' },
  'vwc.edu': { name: 'Virginia Wesleyan College', city: '', state: '' },
  'virginiawestern.edu': { name: 'Virginia Western Community College', city: '', state: '' },
  'volstate.edu': { name: 'Volunteer State Community College', city: '', state: '' },
  'voorhees.edu': { name: 'Voorhees University', city: '', state: '' },
  'wabash.edu': { name: 'Wabash College', city: '', state: '' },
  'wagner.edu': { name: 'Wagner College', city: '', state: '' },
  'wakehealth.edu': { name: 'Wake Forest Baptist Health', city: '', state: '' },
  'waketech.edu': { name: 'Wake Technical Community College', city: '', state: '' },
  'waldenu.edu': { name: 'Walden University', city: '', state: '' },
  'wwcc.edu': { name: 'Walla Walla Community College', city: '', state: '' },
  'walshcollege.edu': { name: 'Walsh College', city: '', state: '' },
  'ws.edu': { name: 'Walters State Community College', city: '', state: '' },
  'warren.edu': { name: 'Warren County Community College', city: '', state: '' },
  'warren-wilson.edu': { name: 'Warren Wilson College', city: '', state: '' },
  'wartburg.edu': { name: 'Wartburg College', city: '', state: '' },
  'wuacc.edu': { name: 'Washburn University', city: '', state: '' },
  'washjeff.edu': { name: 'Washington & Jefferson College', city: '', state: '' },
  'wlu.edu': { name: 'Washington & Lee University', city: '', state: '' },
  'bible.edu': { name: 'Washington Bible College/Capital Bible Seminary', city: '', state: '' },
  'washcoll.edu': { name: 'Washington College', city: '', state: '' },
  'wccc.me.edu': { name: 'Washington County Community College', city: '', state: '' },
  'wscc.edu': { name: 'Washington State Community College', city: '', state: '' },
  'vancouver.wsu.edu': { name: 'Washington State University at Vancouver', city: '', state: '' },
  'wccnet.edu': { name: 'Washtenaw Community College', city: '', state: '' },
  'waubonsee.edu': { name: 'Waubonsee Community College', city: '', state: '' },
  'wctc.edu': { name: 'Waukesha County Technical College', city: '', state: '' },
  'wbu.edu': { name: 'Wayland Baptist University', city: '', state: '' },
  'waynecc.edu': { name: 'Wayne Community College', city: '', state: '' },
  'wcccd.edu': { name: 'Wayne County Community College District', city: '', state: '' },
  'waynesburg.edu': { name: 'Waynesburg College', city: '', state: '' },
  'wc.edu': { name: 'Weatherford College', city: '', state: '' },
  'webster.edu': { name: 'Webster University', city: '', state: '' },
  'wells.edu': { name: 'Wells College', city: '', state: '' },
  'wvc.edu': { name: 'Wenatchee Valley College', city: '', state: '' },
  'wit.edu': { name: 'Wentworth Institute of Technology', city: '', state: '' },
  'wma.edu': { name: 'Wentworth Military Academy & Junior College', city: '', state: '' },
  'wesley.edu': { name: 'Wesley College', city: '', state: '' },
  'westcoastuniversity.edu': { name: 'West Coast University', city: '', state: '' },
  'westgatech.edu': { name: 'West Georgia Technical College', city: '', state: '' },
  'westkentucky.kctcs.edu': { name: 'West Kentucky Community and Technical College', city: '', state: '' },
  'wlsc.wvnet.edu': { name: 'West Liberty State College', city: '', state: '' },
  'wlac.edu': { name: 'West Los Angeles College', city: '', state: '' },
  'westshore.edu': { name: 'West Shore Community College', city: '', state: '' },
  'wtamu.edu': { name: 'West Texas A&M University', city: '', state: '' },
  'westvalley.edu': { name: 'West Valley College', city: '', state: '' },
  'wvncc.edu': { name: 'West Virginia Northern Community College', city: '', state: '' },
  'wvstate.edu': { name: 'West Virginia State University', city: '', state: '' },
  'westliberty.edu': { name: 'West Virginia University at Parkersburg', city: '', state: '' },
  'wvwc.edu': { name: 'West Virginia Wesleyan College', city: '', state: '' },
  'wcu.edu': { name: 'Western Carolina University', city: '', state: '' },
  'wcsu.edu': { name: 'Western Connecticut State University', city: '', state: '' },
  'wdt.edu': { name: 'Western Dakota Technical Institute', city: '', state: '' },
  'wgu.edu': { name: 'Western Governors University', city: '', state: '' },
  'wiu.edu': { name: 'Western Illinois University', city: '', state: '' },
  'witcc.edu': { name: 'Western Iowa Tech Community College', city: '', state: '' },
  'wmc.edu': { name: 'Western Montana College', city: '', state: '' },
  'wncc.edu': { name: 'Western Nebraska Community College', city: '', state: '' },
  'wnc.edu': { name: 'Western Nevada College', city: '', state: '' },
  'wnec.edu': { name: 'Western New England College', city: '', state: '' },
  'wne.edu': { name: 'Western New England University', city: '', state: '' },
  'wnmu.edu': { name: 'Western New Mexico University', city: '', state: '' },
  'wosc.edu': { name: 'Western Oklahoma State College', city: '', state: '' },
  'wpcc.edu': { name: 'Western Piedmont Community College', city: '', state: '' },
  'western.edu': { name: 'Western State Colorado University', city: '', state: '' },
  'westerntc.edu': { name: 'Western Technical College', city: '', state: '' },
  'wtc.edu': { name: 'Western Texas College', city: '', state: '' },
  'westernu.edu': { name: 'Western University of Health Sciences', city: '', state: '' },
  'wwcc.wy.edu': { name: 'Western Wyoming Community College', city: '', state: '' },
  'westfield.mass.edu': { name: 'Westfield State College', city: '', state: '' },
  'wcslc.edu': { name: 'Westminster College of Salt Lake City', city: '', state: '' },
  'wts.edu': { name: 'Westminster Theological Seminary', city: '', state: '' },
  'westminsteru.edu': { name: 'Westminster University', city: '', state: '' },
  'westmont.edu': { name: 'Westmont College', city: '', state: '' },
  'wccc.edu': { name: 'Westmoreland County Community College', city: '', state: '' },
  'wcjc.edu': { name: 'Wharton County Junior College', city: '', state: '' },
  'whatcom.ctc.edu': { name: 'Whatcom Community College', city: '', state: '' },
  'wheatonma.edu': { name: 'Wheaton College, Norton MA', city: '', state: '' },
  'wjc.edu': { name: 'Wheeling Jesuit College', city: '', state: '' },
  'wetcc.edu': { name: 'White Earth Tribal and Community College', city: '', state: '' },
  'wmcc.edu': { name: 'White Mountains Community College', city: '', state: '' },
  'whittier.edu': { name: 'Whittier College', city: '', state: '' },
  'whitworth.edu': { name: 'Whitworth College', city: '', state: '' },
  'watc.edu': { name: 'Wichita Area Technical College', city: '', state: '' },
  'widener.edu': { name: 'Widener University', city: '', state: '' },
  'wilberforce.edu': { name: 'Wilberforce University', city: '', state: '' },
  'wileyc.edu': { name: 'Wiley College', city: '', state: '' },
  'wilkescc.edu': { name: 'Wilkes Community College', city: '', state: '' },
  'wilkes.edu': { name: 'Wilkes University', city: '', state: '' },
  'taftu.edu': { name: 'William Howard Taft University', city: '', state: '' },
  'jewell.edu': { name: 'William Jewell College', city: '', state: '' },
  'wmitchell.edu': { name: 'William Mitchell College of Law', city: '', state: '' },
  'wpunj.edu': { name: 'William Paterson University', city: '', state: '' },
  'wmpenn.edu': { name: 'William Penn College', city: '', state: '' },
  'wmwoods.edu': { name: 'William Woods University', city: '', state: '' },
  'wiltech.edu': { name: 'Williamsburg Technical College', city: '', state: '' },
  'willistonstate.edu': { name: 'Williston State College', city: '', state: '' },
  'wilmington.edu': { name: 'Wilmington College', city: '', state: '' },
  'wilmu.edu': { name: 'Wilmington University', city: '', state: '' },
  'wilsoncc.edu': { name: 'Wilson Community College', city: '', state: '' },
  'windward.hawaii.edu': { name: 'Windward Community College', city: '', state: '' },
  'wingate.edu': { name: 'Wingate University', city: '', state: '' },
  'winona.edu': { name: 'Winona State University', city: '', state: '' },
  'wssu.edu': { name: 'Winston-Salem State University', city: '', state: '' },
  'winthrop.edu': { name: 'Winthrop University', city: '', state: '' },
  'wiregrass.edu': { name: 'Wiregrass Georgia Technical College', city: '', state: '' },
  'witc.edu': { name: 'Wisconsin Indianhead Technical College', city: '', state: '' },
  'wlc.edu': { name: 'Wisconsin Lutheran College', city: '', state: '' },
  'wittenberg.edu': { name: 'Wittenberg University', city: '', state: '' },
  'woodbury.edu': { name: 'Woodbury University', city: '', state: '' },
  'wcc.yccd.edu': { name: 'Woodland Community College', city: '', state: '' },
  'whoi.edu': { name: 'Woods Hole Oceanographic Institution', city: '', state: '' },
  'worwic.edu': { name: 'Wor-Wic Community College', city: '', state: '' },
  'wcc.vccs.edu': { name: 'Wytheville Community College', city: '', state: '' },
  'xula.edu': { name: 'Xavier University of Louisiana', city: '', state: '' },
  'yvcc.edu': { name: 'Yakima Valley Community College', city: '', state: '' },
  'yc.edu': { name: 'Yavapai College', city: '', state: '' },
  'yu.edu': { name: 'Yeshiva University', city: '', state: '' },
  'yccc.edu': { name: 'York County Community College', city: '', state: '' },
  'yorktech.edu': { name: 'York Technical College', city: '', state: '' },
  'yosemite.edu': { name: 'Yosemite Community College District', city: '', state: '' },
  'yhc.edu': { name: 'Young Harris College', city: '', state: '' },
  'yti.edu': { name: 'YTI Career Institute', city: '', state: '' },
  'yc.yccd.edu': { name: 'Yuba College', city: '', state: '' },
  'zanestate.edu': { name: 'Zane State College', city: '', state: '' },
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

function isKnownUniversityDomain(domain) {
  return Boolean(UNIVERSITY_DIRECTORY[String(domain || '').toLowerCase()]);
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
  const isEmbeddedDemo = req.query?.demo === '1' && req.query?.embed === '1';
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', isEmbeddedDemo ? 'SAMEORIGIN' : 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), payment=(self), geolocation=(self)');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://js.stripe.com https://connect-js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://b.stripecdn.com; font-src 'self' https://fonts.gstatic.com https://b.stripecdn.com; img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com https://*.stripe.com https://b.stripecdn.com; connect-src 'self' https://maps.googleapis.com https://api.stripe.com https://connect-js.stripe.com https://b.stripecdn.com https://files.stripe.com https://m.stripe.com https://r.stripe.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://connect-js.stripe.com https://*.stripe.com; frame-ancestors " + (isEmbeddedDemo ? "'self'" : "'none'") + ";"
  );
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  }
  next();
}

function makeRateLimiter({ windowMs, max, message }) {
  const hits = new Map(); // in-memory fallback (single instance, or when Redis is down)
  // Periodically evict expired entries to prevent unbounded memory growth
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs).unref();

  function localHit(key) {
    const now = Date.now();
    const current = hits.get(key) || { count: 0, resetAt: now + windowMs };
    if (current.resetAt <= now) { current.count = 0; current.resetAt = now + windowMs; }
    current.count += 1;
    hits.set(key, current);
    return current;
  }

  return async (req, res, next) => {
    const key = (req.ip || req.socket.remoteAddress || 'unknown') + ':' + req.baseUrl + req.path;
    let count;
    let resetAt;
    if (redisReady) {
      // Shared fixed-window counter so the limit holds across instances.
      try {
        const redisKey = 'rl:' + key;
        count = await redisClient.incr(redisKey);
        if (count === 1) await redisClient.pexpire(redisKey, windowMs);
        const ttl = await redisClient.pttl(redisKey);
        resetAt = Date.now() + (ttl > 0 ? ttl : windowMs);
      } catch (_) {
        ({ count, resetAt } = localHit(key)); // Redis hiccup → degrade to per-instance limiting
      }
    } else {
      ({ count, resetAt } = localHit(key));
    }
    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - count)));
    res.setHeader('RateLimit-Reset', String(Math.ceil(resetAt / 1000)));
    if (count > max) {
      return res.status(429).json({ error: message || 'Too many requests. Please wait and try again.' });
    }
    next();
  };
}

const authRateLimit = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many authentication attempts. Please wait and try again.' });
const forgotPasswordRateLimit = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many password reset requests. Please wait and try again.' });
const sensitiveWriteRateLimit = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 40, message: 'Too many sensitive updates. Please wait and try again.' });
const trackingRateLimit = makeRateLimiter({ windowMs: 60 * 1000, max: 120, message: 'Too many tracking requests. Please slow down.' });
const adminRateLimit = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many admin requests. Please wait and try again.' });
const adminDashboardRateLimit = makeRateLimiter({ windowMs: 60 * 1000, max: 120, message: 'Too many admin dashboard requests. Please wait and try again.' });
const reportRateLimit = makeRateLimiter({ windowMs: 60 * 60 * 1000, max: 10, message: 'Too many reports submitted. Please wait before reporting again.' });

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
    fs.writeFileSync(tmpPath, JSON.stringify(sessions, null, 2), { mode: 0o600 });
    fs.renameSync(tmpPath, this.filePath);
    fs.chmodSync(this.filePath, 0o600);
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
      .then((result) => {
        if (result.rows[0]?.sess) return callback(null, result.rows[0].sess);
        // Retry once after 120 ms to handle Supabase read-replica lag.
        setTimeout(() => {
          this.pool.query('SELECT sess FROM linkup_sessions WHERE sid = $1 AND expires > NOW()', [sid])
            .then((r2) => callback(null, r2.rows[0]?.sess || null))
            .catch((err) => { console.error('[session:get-retry] Postgres error:', err.message); callback(err); });
        }, 120);
      })
      .catch((err) => {
        console.error('[session:get] Postgres error:', err.message);
        callback(err);
      });
  }

  set(sid, sess, callback = () => {}) {
    const expires = sess?.cookie?.expires ? new Date(sess.cookie.expires) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    this.pool.query(
      `INSERT INTO linkup_sessions (sid, sess, expires)
       VALUES ($1, $2, $3)
       ON CONFLICT (sid) DO UPDATE SET sess = EXCLUDED.sess, expires = EXCLUDED.expires`,
      [sid, sess, expires]
    ).then(() => callback(null)).catch((err) => {
      console.error('[session:set] Postgres error:', err.message);
      callback(err);
    });
  }

  destroy(sid, callback = () => {}) {
    this.pool.query('DELETE FROM linkup_sessions WHERE sid = $1', [sid])
      .then(() => callback(null))
      .catch((err) => {
        console.error('[session:destroy] Postgres error:', err.message);
        callback(err);
      });
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
app.use(logger.requestMiddleware());
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
    } else if (event.type === 'transfer.created' || event.type === 'transfer.updated' || event.type === 'transfer.reversed') {
      updateWalletTransactionByTransfer(db, event.data.object, event.type);
    }
    saveDb(db);
    res.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook handling error:', err);
    res.status(500).json({ error: 'Webhook handling failed' });
  }
}
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhookRequest);
app.use(express.json({ limit: '10mb' }));
app.use('/api', rejectCrossSiteWrites);
app.use('/api/auth', authRateLimit);
app.use('/api/auth/forgot-password', forgotPasswordRateLimit);
app.use('/api/profile/payment-method', sensitiveWriteRateLimit);
app.use('/api/profile/payout', sensitiveWriteRateLimit);
app.use('/api/cart/create-checkout-session', sensitiveWriteRateLimit);
app.use('/api/cart/create-embedded-checkout', sensitiveWriteRateLimit);
app.use('/api/cart/checkout', sensitiveWriteRateLimit);
app.use('/api/cart/checkout/complete', sensitiveWriteRateLimit);
app.use('/api/track', trackingRateLimit);
const sessionStore = USE_POSTGRES ? new PostgresSessionStore(pgPool) : new JsonSessionStore(SESSION_STORE_PATH);
const sessionMiddleware = session({
  name: 'linkup.sid',
  store: sessionStore,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === 'production' ? 'auto' : false,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
});
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  maxAge: NODE_ENV === 'production' ? '1h' : 0,
  setHeaders(res, filePath) {
    const fileName = path.basename(filePath);
    const isFrontendShellAsset = ['index.html', 'styles.css', 'app.js', 'boot.js'].includes(fileName);
    if (isFrontendShellAsset || filePath.endsWith('release-notes.md')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  },
}));

const io = new Server(httpServer, {
  cors: {
    origin: corsOriginDelegate,
    credentials: true,
  },
});
io.engine.use(sessionMiddleware);

// With Redis, chat/live-trip events fan out across instances via a pub/sub pair
// (dedicated clients so the fail-fast rate-limiter client is unaffected).
if (socketPubClient && socketSubClient) {
  const { createAdapter } = require('@socket.io/redis-adapter');
  io.adapter(createAdapter(socketPubClient, socketSubClient));
  console.log('Socket.IO Redis adapter enabled — events fan out across instances.');
}

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

// Register an iOS device token for APNs push notifications
app.post('/api/device-token', requireAuth, (req, res) => {
  const token = String(req.body.token || '').trim();
  const platform = String(req.body.platform || '').trim();
  if (!token || platform !== 'ios') {
    return res.status(400).json({ error: 'token and platform:ios are required' });
  }
  const db = loadDb();
  const user = (db.users || []).find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.iosDeviceTokens = (user.iosDeviceTokens || []).filter((t) => t !== token);
  user.iosDeviceTokens.push(token);
  // Keep the 5 most recent tokens per user to handle device re-registrations
  if (user.iosDeviceTokens.length > 5) user.iosDeviceTokens = user.iosDeviceTokens.slice(-5);
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json({ ok: true });
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
    safetyRecordings: [],
    rideMessages: {},
    userReports: [],
    waitlistLeads: [],
    adminAuditLog: [],
    userBlocks: [],
    passwordResetTokens: [],
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
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

function normalizeFriendInvites(invites) {
  return asArray(invites)
    .filter(isPlainObject)
    .map((invite) => ({
      id: String(invite.id || uuidv4()),
      email: normalizeEmail(invite.email).slice(0, 180),
      invitedAt: String(invite.invitedAt || invite.createdAt || new Date().toISOString()),
    }))
    .filter((invite) => invite.email);
}

function slugifyInvitePart(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 28);
}

function getLegacyFriendInviteCode(user) {
  const existing = String(user?.friendInviteCode || '').trim().toLowerCase();
  if (/^[a-z0-9_-]{8,80}$/.test(existing)) return existing;
  const source = String(user?.id || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return ('lu' + source).slice(0, 14);
}

function getFriendInviteCode(user, db = null) {
  const nameSlug = slugifyInvitePart(user?.firstName)
    || slugifyInvitePart(String(user?.email || '').split('@')[0])
    || 'linkup-member';
  const memberNumber = db && user?.id ? getUserMemberNumber(db, user.id) : null;
  if (memberNumber) return `${nameSlug}-${memberNumber}`.slice(0, 80);
  return getLegacyFriendInviteCode(user);
}

function buildFriendInviteUrl(user, db = null) {
  const inviteCode = getFriendInviteCode(user, db);
  return `${APP_BASE_URL.replace(/\/$/, '')}/?invite=${encodeURIComponent(inviteCode)}`;
}

function findUserByFriendInviteCode(db, inviteCode) {
  const normalizedCode = String(inviteCode || '').trim().toLowerCase();
  if (!normalizedCode) return null;
  return activeUsers(db).find((user) => (
    getFriendInviteCode(user, db) === normalizedCode ||
    getLegacyFriendInviteCode(user) === normalizedCode
  )) || null;
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
    friendInvites: normalizeFriendInvites(user.friendInvites),
    linkupAcceptedAt: asPlainObject(user.linkupAcceptedAt),
    strikes: asArray(user.strikes).filter(isPlainObject),
    apiTokens: asArray(user.apiTokens).filter(isPlainObject),
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
  normalized.safetyRecordings = uniqueById(normalized.safetyRecordings)
    .filter(isPlainObject)
    .filter((recording) => {
      const expiresAt = Number(recording.expiresAt);
      return Number.isFinite(expiresAt) && expiresAt > Date.now();
    });
  normalized.rideMessages = normalizeRideMessages(normalized.rideMessages);
  normalized.userReports = uniqueById(normalized.userReports);
  normalized.waitlistLeads = uniqueById(normalized.waitlistLeads).filter(isPlainObject);
  normalized.adminAuditLog = uniqueById(normalized.adminAuditLog).filter(isPlainObject);
  normalized.userBlocks = asArray(normalized.userBlocks).filter(isPlainObject);
  normalized.passwordResetTokens = asArray(normalized.passwordResetTokens).filter(isPlainObject);
  return normalized;
}

let dbCache = null;
let dbWritePromise = Promise.resolve();

// Entities migrated out of the linkup_state blob into their own per-row tables.
// saveDb() strips these before writing the blob; loadDb() repopulates them from
// the stores. The list grows as each entity is migrated.
const MIGRATED_BLOB_KEYS = ['trackingTrips', 'rideRequests'];

// Reload the small low-write blob from linkup_state after another instance
// changed it (cross-instance coherence for carts/follows/groups/audit log/etc.).
async function reloadBlob() {
  if (!USE_POSTGRES) return;
  const res = await pgPool.query('SELECT data FROM linkup_state WHERE state_key = $1', ['main']);
  if (res.rows[0]?.data) dbCache = normalizeDbShape(res.rows[0].data);
}
registerReload('blob', reloadBlob);

// ── Tracking-trip store ─────────────────────────────────────────────────
// Live-trip GPS trails: one Postgres row per trip (a location ping is the
// highest-frequency write), a dedicated JSON file in dev. Moved out of the
// linkup_state blob so a ping writes one row instead of the whole database.
const TRACKING_STORE_PATH = path.join(DATA_DIR, 'tracking-trips.json');
const trackingCache = new Map();
let trackingWritePromise = Promise.resolve();

function normalizeTrackingTrip(trip) {
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
}

function listTrackingTrips() {
  return Array.from(trackingCache.values());
}

function scheduleTrackingFileWrite() {
  trackingWritePromise = trackingWritePromise
    .then(() => {
      const tmp = TRACKING_STORE_PATH + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(listTrackingTrips(), null, 2), { mode: 0o600 });
      fs.renameSync(tmp, TRACKING_STORE_PATH);
      fs.chmodSync(TRACKING_STORE_PATH, 0o600);
    })
    .catch((err) => console.error('Tracking store file write error:', err));
}

// Upsert one trip. Replaces saveDb() for tracking mutations.
function persistTrackingTrip(trip) {
  if (!trip || !trip.id) return trip;
  trackingCache.set(trip.id, trip);
  if (USE_POSTGRES) {
    const snap = JSON.parse(JSON.stringify(trip));
    trackingWritePromise = trackingWritePromise
      .then(() => pgPool.query(
        `INSERT INTO linkup_tracking_trips (id, owner_id, viewer_token_hash, status, data, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (id) DO UPDATE SET owner_id = EXCLUDED.owner_id, viewer_token_hash = EXCLUDED.viewer_token_hash, status = EXCLUDED.status, data = EXCLUDED.data, updated_at = NOW()`,
        [snap.id, snap.ownerId || '', snap.viewerTokenHash || '', snap.status || '', snap]
      ))
      .then(() => publishInvalidation('linkup_tracking_trips', trip.id))
      .catch((err) => console.error('Tracking trip save error:', err));
  } else {
    scheduleTrackingFileWrite();
  }
  return trip;
}

function removeTrackingTripsWhere(predicate) {
  const removedIds = [];
  for (const trip of listTrackingTrips()) {
    if (predicate(trip)) { trackingCache.delete(trip.id); removedIds.push(trip.id); }
  }
  if (!removedIds.length) return 0;
  if (USE_POSTGRES) {
    trackingWritePromise = trackingWritePromise
      .then(() => pgPool.query('DELETE FROM linkup_tracking_trips WHERE id = ANY($1)', [removedIds]))
      .then(() => removedIds.forEach((id) => publishInvalidation('linkup_tracking_trips', id)))
      .catch((err) => console.error('Tracking trip delete error:', err));
  } else {
    scheduleTrackingFileWrite();
  }
  return removedIds.length;
}

async function reloadTrackingTrip(id) {
  if (!USE_POSTGRES) return;
  const res = await pgPool.query('SELECT data FROM linkup_tracking_trips WHERE id = $1', [id]);
  if (res.rows[0] && res.rows[0].data && res.rows[0].data.id) trackingCache.set(id, normalizeTrackingTrip(res.rows[0].data));
  else trackingCache.delete(id);
}
registerReload('linkup_tracking_trips', reloadTrackingTrip);

async function loadTrackingTrips() {
  trackingCache.clear();
  if (USE_POSTGRES) {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS linkup_tracking_trips (
        id TEXT PRIMARY KEY,
        owner_id TEXT NOT NULL DEFAULT '',
        viewer_token_hash TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT '',
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pgPool.query('CREATE INDEX IF NOT EXISTS linkup_tracking_trips_owner_idx ON linkup_tracking_trips (owner_id)');
    const res = await pgPool.query('SELECT data FROM linkup_tracking_trips ORDER BY updated_at ASC');
    for (const row of res.rows) if (row.data && row.data.id) trackingCache.set(row.data.id, normalizeTrackingTrip(row.data));
  } else {
    try {
      for (const raw of JSON.parse(fs.readFileSync(TRACKING_STORE_PATH, 'utf8'))) {
        if (raw && raw.id) trackingCache.set(raw.id, normalizeTrackingTrip(raw));
      }
    } catch (_) { /* no store file yet */ }
  }
  // One-time backfill: move trips still embedded in the main blob into the store.
  const mainDb = USE_POSTGRES ? (dbCache || getEmptyDb()) : readFileDb();
  const legacy = asArray(mainDb.trackingTrips);
  if (legacy.length) {
    for (const raw of legacy) if (raw && raw.id && !trackingCache.has(raw.id)) persistTrackingTrip(normalizeTrackingTrip(raw));
    mainDb.trackingTrips = [];
    saveDb(mainDb);
  }
}

// ── Ride-request store ──────────────────────────────────────────────────
// "Looking for a ride" posts: one Postgres row per request (dedicated JSON file
// in dev). Posting, offering, expiring, and moderating touch one row.
const RIDE_REQUEST_STORE_PATH = path.join(DATA_DIR, 'ride-requests.json');
const rideRequestCache = new Map();
let rideRequestWritePromise = Promise.resolve();

function listRideRequests() {
  return Array.from(rideRequestCache.values());
}

function scheduleRideRequestFileWrite() {
  rideRequestWritePromise = rideRequestWritePromise
    .then(() => {
      const tmp = RIDE_REQUEST_STORE_PATH + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(listRideRequests(), null, 2), { mode: 0o600 });
      fs.renameSync(tmp, RIDE_REQUEST_STORE_PATH);
      fs.chmodSync(RIDE_REQUEST_STORE_PATH, 0o600);
    })
    .catch((err) => console.error('Ride-request store file write error:', err));
}

function persistRideRequest(request) {
  if (!request || !request.id) return request;
  rideRequestCache.set(request.id, request);
  if (USE_POSTGRES) {
    const snap = JSON.parse(JSON.stringify(request));
    rideRequestWritePromise = rideRequestWritePromise
      .then(() => pgPool.query(
        `INSERT INTO linkup_ride_requests (id, rider_id, status, data, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (id) DO UPDATE SET rider_id = EXCLUDED.rider_id, status = EXCLUDED.status, data = EXCLUDED.data, updated_at = NOW()`,
        [snap.id, snap.riderId || '', snap.status || 'open', snap]
      ))
      .then(() => publishInvalidation('linkup_ride_requests', request.id))
      .catch((err) => console.error('Ride-request save error:', err));
  } else {
    scheduleRideRequestFileWrite();
  }
  return request;
}

function removeRideRequestsWhere(predicate) {
  const removedIds = [];
  for (const request of listRideRequests()) {
    if (predicate(request)) { rideRequestCache.delete(request.id); removedIds.push(request.id); }
  }
  if (!removedIds.length) return 0;
  if (USE_POSTGRES) {
    rideRequestWritePromise = rideRequestWritePromise
      .then(() => pgPool.query('DELETE FROM linkup_ride_requests WHERE id = ANY($1)', [removedIds]))
      .then(() => removedIds.forEach((id) => publishInvalidation('linkup_ride_requests', id)))
      .catch((err) => console.error('Ride-request delete error:', err));
  } else {
    scheduleRideRequestFileWrite();
  }
  return removedIds.length;
}

async function reloadRideRequest(id) {
  if (!USE_POSTGRES) return;
  const res = await pgPool.query('SELECT data FROM linkup_ride_requests WHERE id = $1', [id]);
  if (res.rows[0] && res.rows[0].data && res.rows[0].data.id) rideRequestCache.set(id, res.rows[0].data);
  else rideRequestCache.delete(id);
}
registerReload('linkup_ride_requests', reloadRideRequest);

async function loadRideRequests() {
  rideRequestCache.clear();
  if (USE_POSTGRES) {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS linkup_ride_requests (
        id TEXT PRIMARY KEY,
        rider_id TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'open',
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pgPool.query('CREATE INDEX IF NOT EXISTS linkup_ride_requests_rider_idx ON linkup_ride_requests (rider_id)');
    await pgPool.query('CREATE INDEX IF NOT EXISTS linkup_ride_requests_status_idx ON linkup_ride_requests (status)');
    const res = await pgPool.query('SELECT data FROM linkup_ride_requests ORDER BY updated_at ASC');
    for (const row of res.rows) if (row.data && row.data.id) rideRequestCache.set(row.data.id, row.data);
  } else {
    try {
      for (const raw of JSON.parse(fs.readFileSync(RIDE_REQUEST_STORE_PATH, 'utf8'))) {
        if (raw && raw.id) rideRequestCache.set(raw.id, raw);
      }
    } catch (_) { /* no store file yet */ }
  }
  // One-time backfill out of the main blob.
  const mainDb = USE_POSTGRES ? (dbCache || getEmptyDb()) : readFileDb();
  const legacy = uniqueById(asArray(mainDb.rideRequests));
  if (legacy.length) {
    for (const raw of legacy) if (raw && raw.id && !rideRequestCache.has(raw.id)) persistRideRequest(raw);
    mainDb.rideRequests = [];
    saveDb(mainDb);
  }
}

function readFileDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return normalizeDbShape(JSON.parse(raw));
  } catch (error) {
    return getEmptyDb();
  }
}

function loadDb() {
  const db = USE_POSTGRES ? normalizeDbShape(dbCache || getEmptyDb()) : readFileDb();
  // Migrated entities live in their own tables, not the blob — repopulate them
  // from the stores so the many read sites (db.trackingTrips, ...) keep working.
  db.trackingTrips = listTrackingTrips();
  db.rideRequests = listRideRequests();
  return db;
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
    .then(() => publishInvalidation('blob', 'main'))
    .catch((err) => {
      console.error('PostgreSQL saveDb error:', err);
    });
}

function saveDb(db) {
  // Migrated entities are persisted through their own stores, not the blob.
  // Strip them so the blob write stays small and doesn't re-serialize them.
  const forBlob = { ...db };
  for (const key of MIGRATED_BLOB_KEYS) delete forBlob[key];
  const normalized = normalizeDbShape(forBlob);
  normalized.meta.updatedAt = new Date().toISOString();
  if (USE_POSTGRES) {
    dbCache = normalized;
    queuePostgresDbSave(normalized);
    return;
  }

  const tmpPath = DB_PATH + '.tmp';
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(normalized, null, 2), { mode: 0o600 });
    fs.renameSync(tmpPath, DB_PATH);
    fs.chmodSync(DB_PATH, 0o600);
  } catch (err) {
    console.error('saveDb error:', err);
    try { fs.unlinkSync(tmpPath); } catch (_) {}
    throw err;
  }
}

async function initPostgresStorage() {
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS linkup_schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
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
  await pgPool.query(
    `INSERT INTO linkup_schema_migrations (version, name)
     VALUES (1, 'initial_state_and_sessions')
     ON CONFLICT (version) DO NOTHING`
  );

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
      // Load per-entity stores BEFORE the first saveDb — each backfills its rows
      // out of the blob, and saveDb strips those keys, so the order matters.
      await loadTrackingTrips();
      await loadRideRequests();
      saveDb(loadDb());
      await dbWritePromise;
      normalizeUserAccess(loadDb());
      await dbWritePromise;
      // Only after every cache is warm — a reload mid-load could race a backfill.
      await startInvalidationSubscriber();
    } else {
      await loadTrackingTrips();
      await loadRideRequests();
      saveDb(loadDb());
      normalizeUserAccess(loadDb());
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
      persistRideRequest(request);
      changed = true;
    }
  });
  if (changed) saveDb(db);
  return db;
}

function normalizeUserAccess(db) {
  let changed = false;
  (db.users || []).forEach((user) => {
    if (user.deletedAt) return;
    if (user.totpSecret && !String(user.totpSecret).startsWith('enc:v1:') && dataEncryptionKey) {
      user.totpSecret = encryptSensitiveValue(user.totpSecret);
      changed = true;
    }
    if (user.totpTempSecret && !String(user.totpTempSecret).startsWith('enc:v1:') && dataEncryptionKey) {
      user.totpTempSecret = encryptSensitiveValue(user.totpTempSecret);
      changed = true;
    }
    if (!user.universityDomain) {
      user.universityDomain = getEmailDomain(user.email);
      changed = true;
    }
    const supportedUniversity = SUPPORTED_UNIVERSITY_DOMAINS[user.universityDomain];
    const adminEmail = isAdminEmail(user.email);
    if (WAITLIST_MODE && !adminEmail && !user.suspendedAt) {
      if (user.serviceApproved !== false) {
        user.serviceApproved = false;
        user.waitlistedAt = user.waitlistedAt || new Date().toISOString();
        changed = true;
      }
    } else if ((supportedUniversity || adminEmail) && !user.suspendedAt && !user.manuallyWaitlistedAt && user.serviceApproved !== true) {
      user.serviceApproved = true;
      user.waitlistedAt = null;
      if (supportedUniversity && !user.schoolApprovedEmailSentAt) {
        user.schoolApprovedEmailSentAt = new Date().toISOString();
        sendSchoolApprovedEmail(user, supportedUniversity);
      }
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
  return ['dark', 'light', 'auto'].includes(value) ? value : 'dark';
}

function normalizeNotificationPreferences(value = {}, user = null) {
  const serviceApproved = !user || user.serviceApproved === true;
  return {
    weeklyRecapEmail: serviceApproved && value.weeklyRecapEmail !== false,
    rideAlertEmail: value.rideAlertEmail !== false,
  };
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

function hasTripDeparted(trip) {
  const interval = getTripInterval(trip);
  return interval.start <= Date.now();
}

function generateCompletionPin() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
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

function getRideParkingFeeCents(ride) {
  return Math.max(0, Number(ride?.parkingFeeCents || 0));
}

function getRideChargeCents(ride) {
  return Math.max(0, Number(ride?.priceCents || 0)) + getRideParkingFeeCents(ride);
}

function getRideCommissionableCents(ride) {
  return Math.max(0, Number(ride?.priceCents || 0));
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
    parkingFeeCents: getRideParkingFeeCents(ride),
    totalPriceCents: getRideChargeCents(ride),
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
    const isDriver = publicRide.driverId === userId;
    const isOwnRecord = passenger.studentId === userId;
    if (isDriver) return passenger;
    // Strip private fields from other passengers' records
    const { email, actualPickup, actualDropoff, driverRating, driverRatingComment, driverRatedAt, ...safePassenger } = passenger;
    if (isOwnRecord) {
      return { ...safePassenger, actualPickup, actualDropoff, driverRating, driverRatingComment, driverRatedAt };
    }
    return safePassenger;
  });
  if (!canUserSeeDriverFullName(ride, userId)) {
    publicRide.driverLastName = getMaskedLastName(ride.driverLastName);
  }
  if (!canUserSeeLicensePlate(ride, userId)) {
    delete publicRide.licensePlate;
  }
  // Completion PIN: only confirmed riders see it after departure (they share it verbally with the driver)
  // The driver never sees the raw PIN — they must receive it from the rider in person
  const isConfirmedRider = (publicRide.passengers || []).some((p) => p.studentId === userId);
  const departed = hasTripDeparted(publicRide);
  if (publicRide.driverId === userId) {
    // Driver sees only metadata (not the pin itself)
    publicRide.hasCompletionCode = Boolean(publicRide.completionPin);
    publicRide.completionConfirmedAt = publicRide.completionConfirmedAt || null;
  } else if (!isConfirmedRider || !departed) {
    publicRide.completionConfirmedAt = publicRide.completionConfirmedAt || null;
  }
  // Always strip internal fields from the response
  delete publicRide.completionPin;
  delete publicRide.completionPinAttempts;
  delete publicRide.completionPinLockedUntil;
  // Re-attach pin only for confirmed riders after departure
  if (isConfirmedRider && departed && ride.completionPin) {
    publicRide.completionPin = ride.completionPin;
  }
  return publicRide;
}

function createRideReference(db) {
  let referenceId = '';
  do {
    referenceId = 'LU-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  } while ((db.rides || []).some((ride) => ride.referenceId === referenceId));
  return referenceId;
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
  if (ride.status === 'removed') return false;
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
  if (request.status === 'removed') return false;
  if (request.riderId === userId) return true;
  const viewer = (db.users || []).find((user) => user.id === userId);
  if (request.sameSchoolDriverOnly && !isSameSchoolUser(viewer, request.university)) return false;
  return !areUsersBlocked(db, userId, request.riderId);
}

function fuzzDestinationLabel(name) {
  const parts = String(name || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length <= 1) return name ? name + ' (area)' : name;
  const filtered = parts.slice(1).filter((p) => !/^(USA|US|\d{5}(-\d{4})?)$/.test(p));
  const label = filtered.slice(0, 2).join(', ') || parts[1];
  return label + ' area';
}

function fuzzCoordinates(lat, lng, seed) {
  const hash = crypto.createHash('sha256').update(String(seed || '')).digest();
  const latOffset = (hash.readUInt32BE(0) / 0xFFFFFFFF - 0.5) * 0.008;
  const lngOffset = (hash.readUInt32BE(4) / 0xFFFFFFFF - 0.5) * 0.008;
  return [Number(lat) + latOffset, Number(lng) + lngOffset];
}

function publicRideRequest(request, viewerId) {
  const { riderEmail, riderLastName, ...safe } = request;
  safe.riderLastName = request.riderId === viewerId ? riderLastName : getMaskedLastName(riderLastName);
  const isRider = request.riderId === viewerId;
  const hasOffered = (request.driverOffers || []).some((offer) => offer.driverId === viewerId);
  if (!isRider && !hasOffered && request.hideDestination !== false) {
    safe.destination = fuzzDestinationLabel(request.destination);
    if (request.destinationLat != null && request.destinationLng != null) {
      const [fLat, fLng] = fuzzCoordinates(request.destinationLat, request.destinationLng, request.id);
      safe.destinationLat = fLat;
      safe.destinationLng = fLng;
    }
    safe.destinationFuzzy = true;
  }
  return safe;
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
  // Web push (VAPID — browsers and PWA)
  if (PUSH_NOTIFICATIONS_ENABLED && user?.pushSubscriptions?.length) {
    const body = JSON.stringify(payload);
    user.pushSubscriptions.forEach((subscription) => {
      webpush.sendNotification(subscription, body).catch((err) => {
        if (![404, 410].includes(Number(err.statusCode))) {
          console.error('Push notification failed:', err.message);
        }
      });
    });
  }
  // Native iOS push (APNs)
  sendApnsPush(user, payload);
}

function sendApnsPush(user, payload) {
  if (!APNS_ENABLED || !apnProvider || !user?.iosDeviceTokens?.length) return;
  const notification = new apn.Notification();
  notification.expiry = Math.floor(Date.now() / 1000) + 3600;
  notification.badge = 1;
  notification.sound = 'default';
  notification.alert = { title: payload.title || 'LinkUp', body: payload.body || '' };
  notification.payload = { url: payload.url || '/', ...(payload.data || {}) };
  notification.topic = APNS_BUNDLE_ID;
  apnProvider.send(notification, user.iosDeviceTokens).then((result) => {
    const failed = result.failed || [];
    if (!failed.length) return;
    const stale = failed
      .filter((f) => ['BadDeviceToken', 'Unregistered'].includes(f.response?.reason))
      .map((f) => f.device);
    failed
      .filter((f) => !['BadDeviceToken', 'Unregistered'].includes(f.response?.reason))
      .forEach((f) => console.error('[APNs] Push failed:', f.response?.reason, f.device));
    if (stale.length) {
      const db = loadDb();
      const u = db.users.find((u) => u.id === user.id);
      if (u) {
        u.iosDeviceTokens = (u.iosDeviceTokens || []).filter((t) => !stale.includes(t));
        saveDb(db);
      }
    }
  });
}

function notifyRideChatParticipants(db, ride, sender, message) {
  if (!PUSH_NOTIFICATIONS_ENABLED) return;
  const recipientIds = getRideChatParticipantIds(ride).filter((userId) => userId !== sender.id);
  const payload = {
    title: getChatNotificationTitle(ride),
    body: getChatNotificationBody(ride, sender, message.text),
    url: '/messages',
    tag: 'ride-chat-' + ride.id,
    data: { rideId: ride.id, type: 'ride-chat' },
  };
  (db.users || [])
    .filter((user) => recipientIds.includes(user.id))
    .forEach((user) => sendPushNotification(user, payload));
}

function normalizeRideAlertUserIds(value) {
  return [...new Set(asArray(value).map((id) => String(id || '').trim()).filter(Boolean))];
}

function isRideAlertSubscribed(viewer, targetUserId) {
  return normalizeRideAlertUserIds(viewer?.rideAlertUserIds).includes(String(targetUserId || '').trim());
}

function areUsersLinked(db, userId, otherUserId) {
  const user = (db.users || []).find((entry) => entry.id === userId);
  const other = (db.users || []).find((entry) => entry.id === otherUserId);
  return Boolean(user && other && isRideAlertSubscribed(user, other.id) && isRideAlertSubscribed(other, user.id));
}

function getUserLinkCount(db, userId) {
  return activeUsers(db)
    .filter((entry) => entry.id !== userId && !entry.suspendedAt)
    .filter((entry) => areUsersLinked(db, userId, entry.id))
    .length;
}

function normalizeLinkupRequests(value) {
  const seen = new Set();
  return asArray(value)
    .map((request) => {
      if (typeof request === 'string') {
        return { fromUserId: request.trim(), createdAt: '' };
      }
      return {
        fromUserId: String(request?.fromUserId || request?.userId || '').trim(),
        createdAt: request?.createdAt || '',
      };
    })
    .filter((request) => {
      if (!request.fromUserId || seen.has(request.fromUserId)) return false;
      seen.add(request.fromUserId);
      return true;
    });
}

function isLinkupRequestPending(recipient, requesterId) {
  const id = String(requesterId || '').trim();
  return normalizeLinkupRequests(recipient?.linkupRequests).some((request) => request.fromUserId === id);
}

function getLinkupStatus(db, viewer, targetUserId) {
  const target = (db.users || []).find((user) => user.id === targetUserId);
  if (!viewer || !target) return 'none';
  if (areUsersLinked(db, viewer.id, target.id)) return 'linked';
  if (isLinkupRequestPending(target, viewer.id)) return 'pending_sent';
  if (isLinkupRequestPending(viewer, target.id)) return 'pending_received';
  return 'none';
}

function acceptLinkupRequest(db, recipient, requester) {
  const acceptedAt = new Date().toISOString();
  recipient.linkupRequests = normalizeLinkupRequests(recipient.linkupRequests)
    .filter((request) => request.fromUserId !== requester.id);
  recipient.rideAlertUserIds = normalizeRideAlertUserIds(recipient.rideAlertUserIds);
  requester.rideAlertUserIds = normalizeRideAlertUserIds(requester.rideAlertUserIds);
  recipient.linkupAcceptedAt = asPlainObject(recipient.linkupAcceptedAt);
  requester.linkupAcceptedAt = asPlainObject(requester.linkupAcceptedAt);
  if (!recipient.rideAlertUserIds.includes(requester.id)) recipient.rideAlertUserIds.push(requester.id);
  if (!requester.rideAlertUserIds.includes(recipient.id)) requester.rideAlertUserIds.push(recipient.id);
  recipient.linkupAcceptedAt[requester.id] = recipient.linkupAcceptedAt[requester.id] || acceptedAt;
  requester.linkupAcceptedAt[recipient.id] = requester.linkupAcceptedAt[recipient.id] || acceptedAt;
}

function notifyRideAlertSubscribers(db, actor, item, itemType = 'ride') {
  if (!actor?.id) return;
  const actorName = getUserDisplayName(actor);
  const isRequest = itemType === 'request';
  const route = [item?.origin, item?.destination].filter(Boolean).join(' to ');
  const when = item?.date && item?.time ? describeTripTime(item) : '';
  const title = `${actorName} ${isRequest ? 'requested a ride' : 'posted a ride'}`;
  const body = route ? `${route}${when ? ' · ' + when : ''}` : `Open LinkUp to view the ${isRequest ? 'request' : 'ride'}.`;
  const url = isRequest ? '/rides/driver' : '/rides/rider';
  const subscribers = activeUsers(db)
    .filter((user) => user.id !== actor.id)
    .filter((user) => areUsersLinked(db, user.id, actor.id))
    .filter((user) => !areUsersBlocked(db, user.id, actor.id));

  subscribers.forEach((subscriber) => {
    sendPushNotification(subscriber, {
      title,
      body,
      url,
      tag: `${isRequest ? 'ride-request' : 'ride'}-alert-${item?.id || actor.id}`,
      data: {
        type: isRequest ? 'ride-request-alert' : 'ride-alert',
        userId: actor.id,
        rideId: isRequest ? '' : (item?.id || ''),
        requestId: isRequest ? (item?.id || '') : '',
      },
    });
    if (!normalizeNotificationPreferences(subscriber.notificationPreferences).rideAlertEmail) return;
    const textBody = `Hi ${subscriber.firstName || 'there'},\n\n${title}${route ? `:\n${route}` : ''}${when ? `\nTime: ${when}` : ''}\n\nOpen LinkUp to view it:\n${APP_BASE_URL}\n\nYou are receiving this because you tapped LinkUp on ${actorName}'s profile.\n\n- LinkUp`;
    const htmlBody = renderLinkUpEmail({
      eyebrow: 'Ride alert',
      title,
      intro: `Hi ${escapeHtml(subscriber.firstName || 'there')}, ${escapeHtml(actorName)} ${isRequest ? 'requested a ride' : 'posted a ride'}.`,
      bodyHtml: `<p style="margin:0;font-size:15px;line-height:1.65;color:#54636a;">${escapeHtml(route || 'Open LinkUp to view the latest ride activity.')}${when ? `<br><strong>Time:</strong> ${escapeHtml(when)}` : ''}</p>`,
      cta: { href: APP_BASE_URL, label: 'Open LinkUp' },
      footer: 'You are receiving this because you tapped LinkUp on this student profile.',
    });
    sendAuthEmail(subscriber.email, title, textBody, htmlBody);
  });
}

function generateVerificationCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

function setEmailVerificationCode(user) {
  const code = generateVerificationCode();
  user.emailVerified = false;
  user.emailVerificationCodeHash = hashToken(code);
  user.emailVerificationCodeExpiresAt = Date.now() + 1000 * 60 * 10;
  delete user.emailVerificationAttempts;
  return code;
}

function renderEmailCodeDigits(code, options = {}) {
  const size = options.size || 'large';
  const box = size === 'small'
    ? { width: 34, height: 42, font: 22, radius: 10, padding: '0 3px' }
    : { width: 52, height: 66, font: 32, radius: 14, padding: '0 5px' };
  return String(code || '').split('').map((d) =>
    `<td style="padding:${box.padding};"><div style="width:${box.width}px;height:${box.height}px;line-height:${box.height}px;text-align:center;background:#f0fafa;border:2px solid #3ecfcf;border-radius:${box.radius}px;font-size:${box.font}px;font-weight:900;color:#082023;font-family:monospace,monospace;">${escapeHtml(d)}</div></td>`
  ).join('');
}

function renderLinkUpEmail({ eyebrow = '', title = '', intro = '', bodyHtml = '', cta = null, footer = '' } = {}) {
  const eyebrowHtml = eyebrow
    ? `<p style="margin:18px 0 0;font-size:13px;letter-spacing:0.32em;text-transform:uppercase;color:#61eeee;font-weight:900;">${escapeHtml(eyebrow)}</p>`
    : '';
  const titleHtml = title
    ? `<h1 style="margin:0;font-size:34px;line-height:1.16;color:#102326;font-weight:900;">${escapeHtml(title)}</h1>`
    : '';
  const introHtml = intro
    ? `<p style="margin:20px 0 0;font-size:19px;line-height:1.62;color:#54636a;">${intro}</p>`
    : '';
  const ctaHtml = cta?.href && cta?.label
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px auto 0;">
        <tr>
          <td style="border-radius:999px;background:#0c747a;text-align:center;">
            <a href="${escapeHtml(cta.href)}" style="display:inline-block;padding:14px 24px;font-size:15px;font-weight:900;color:#ffffff;text-decoration:none;border-radius:999px;">${escapeHtml(cta.label)}</a>
          </td>
        </tr>
      </table>`
    : '';
  const footerText = footer || `Questions? Email ${SUPPORT_EMAIL}.`;
  return `
    <!doctype html>
    <html lang="en">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f4fbfb;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#102326;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4fbfb;padding:22px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #bdeff0;border-radius:24px;overflow:hidden;">
                <tr>
                  <td style="padding:54px 32px 50px;text-align:center;background:#073b3f;border-bottom:1px solid #bdeff0;">
                    <div style="font-size:40px;line-height:1;font-weight:900;color:#ffffff;letter-spacing:0;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">LinkUp</div>
                    ${eyebrowHtml}
                  </td>
                </tr>
                <tr>
                  <td style="padding:46px 42px 42px;background:#ffffff;">
                    ${titleHtml}
                    ${introHtml}
                    <div style="margin-top:36px;">
                    ${bodyHtml}
                    </div>
                    ${ctaHtml}
                  </td>
                </tr>
                <tr>
                  <td style="background:#f5fcfc;padding:28px 34px;text-align:center;border-top:1px solid #e4f7f7;">
                    <p style="margin:0;font-size:15px;line-height:1.55;color:#8aa1a6;">${footerText}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatRecapWeekRange(start, end) {
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  const endInclusive = new Date(end.getTime() - 1);
  return `${formatter.format(start)}-${formatter.format(endInclusive)}`;
}

function getPreviousWeeklyRecapRange(now = new Date()) {
  const end = new Date(now);
  end.setHours(0, 0, 0, 0);
  const daysSinceSunday = end.getDay();
  end.setDate(end.getDate() - daysSinceSunday);
  const start = new Date(end);
  start.setDate(start.getDate() - 7);
  return { start, end, key: getLocalDateKey(end) };
}

function getTripStartMs(trip) {
  if (trip?.date) {
    const datePart = String(trip.date || '').trim();
    const timePart = String(trip.time || '00:00').trim() || '00:00';
    const parsed = new Date(`${datePart}T${timePart}`);
    if (!Number.isNaN(parsed.getTime())) return parsed.getTime();
  }
  const fallback = new Date(trip?.createdAt || 0).getTime();
  return Number.isFinite(fallback) ? fallback : 0;
}

function countRidesTakenForRange(db, userId, start, end) {
  const startMs = start.getTime();
  const endMs = end.getTime();
  return (db.rides || [])
    .filter((ride) => (ride.passengers || []).some((passenger) => passenger.studentId === userId))
    .filter((ride) => {
      const rideMs = getTripStartMs(ride);
      return rideMs >= startMs && rideMs < endMs;
    })
    .length;
}

function countNewLinkupsForRange(user, start, end) {
  const startMs = start.getTime();
  const endMs = end.getTime();
  return Object.values(asPlainObject(user.linkupAcceptedAt))
    .map((acceptedAt) => new Date(acceptedAt || 0).getTime())
    .filter((acceptedAtMs) => Number.isFinite(acceptedAtMs) && acceptedAtMs >= startMs && acceptedAtMs < endMs)
    .length;
}

function buildWeeklyRecap(db, user, range) {
  return {
    weekLabel: formatRecapWeekRange(range.start, range.end),
    ridesTaken: countRidesTakenForRange(db, user.id, range.start, range.end),
    newLinkups: countNewLinkupsForRange(user, range.start, range.end),
  };
}

function renderWeeklyRecapEmail(user, recap) {
  const firstName = escapeHtml(user.firstName || 'there');
  const statCell = (label, value, sublabel) => `
    <td width="50%" valign="top" style="padding:0 6px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f0fbfb;border:1px solid #cdeff0;border-radius:18px;">
        <tr>
          <td style="padding:24px 16px 22px;text-align:center;">
            <p style="margin:0 0 10px;color:#0c747a;font-size:12px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;">${escapeHtml(label)}</p>
            <p style="margin:0;color:#102326;font-size:38px;line-height:1;font-weight:900;">${escapeHtml(String(value))}</p>
            <p style="margin:10px 0 0;color:#7a9ea3;font-size:12px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;">${escapeHtml(sublabel)}</p>
          </td>
        </tr>
      </table>
    </td>`;
  const bodyHtml = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        ${statCell('Rides taken', recap.ridesTaken, 'Completed this week')}
        ${statCell('New LinkUps', recap.newLinkups, 'Accepted this week')}
      </tr>
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:30px;background:#f5fcfc;border:1px solid #dff2f2;border-radius:16px;">
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0;color:#315458;font-size:15px;line-height:1.65;">Your recap only includes activity from ${escapeHtml(recap.weekLabel)}. Keep your profile updated so students know who they are riding with before pickup.</p>
        </td>
      </tr>
    </table>`;
  return renderLinkUpEmail({
    eyebrow: 'Weekly recap',
    title: 'Your week on LinkUp',
    intro: `Hi ${firstName}, here is your quick LinkUp recap for the week.`,
    bodyHtml,
    cta: { href: APP_BASE_URL, label: 'Open LinkUp' },
    footer: 'You are receiving this because weekly recap emails are enabled in your LinkUp notification settings.',
  });
}

function sendWeeklyRecapEmail(db, user, range) {
  if (user.serviceApproved !== true) return false;
  const preferences = normalizeNotificationPreferences(user.notificationPreferences, user);
  if (!preferences.weeklyRecapEmail || !user.email || isDeletedUser(user) || user.suspendedAt) return false;
  const recap = buildWeeklyRecap(db, user, range);
  const subject = 'Your LinkUp week';
  const textBody = [
    `Hi ${user.firstName || 'there'},`,
    '',
    `Here is your LinkUp recap for ${recap.weekLabel}.`,
    '',
    `Rides taken: ${recap.ridesTaken}`,
    `New LinkUps: ${recap.newLinkups}`,
    '',
    `Open LinkUp: ${APP_BASE_URL}`,
    '',
    'You are receiving this because weekly recap emails are enabled in your LinkUp notification settings.',
  ].join('\n');
  sendAuthEmail(user.email, subject, textBody, renderWeeklyRecapEmail(user, recap));
  return true;
}

function sendWeeklyRecapsIfDue(now = new Date()) {
  if (!WEEKLY_RECAP_EMAILS_ENABLED || now.getDay() !== 0) return;
  const range = getPreviousWeeklyRecapRange(now);
  const db = normalizeUserAccess(loadDb());
  db.meta = asPlainObject(db.meta);
  if (db.meta.weeklyRecapLastSentKey === range.key) return;
  const users = activeUsers(db).filter((user) => (
    user.serviceApproved === true
    && normalizeNotificationPreferences(user.notificationPreferences, user).weeklyRecapEmail
  ));
  let sentCount = 0;
  users.forEach((user) => {
    if (sendWeeklyRecapEmail(db, user, range)) sentCount += 1;
  });
  db.meta.weeklyRecapLastSentKey = range.key;
  db.meta.weeklyRecapLastSentAt = now.toISOString();
  db.meta.weeklyRecapLastSentCount = sentCount;
  saveDb(db);
  console.log(`Weekly recap emails processed for ${range.key}: ${sentCount}`);
}

function startWeeklyRecapScheduler() {
  if (!WEEKLY_RECAP_EMAILS_ENABLED) {
    console.log('Weekly recap emails disabled.');
    return;
  }
  sendWeeklyRecapsIfDue(new Date());
  setInterval(() => sendWeeklyRecapsIfDue(new Date()), WEEKLY_RECAP_CHECK_INTERVAL_MS).unref();
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
  const codeDigits = renderEmailCodeDigits(code);
  const htmlBody = renderLinkUpEmail({
    eyebrow: 'Student ride sharing',
    title: 'Verify your email',
    intro: `Hi ${escapeHtml(firstName)}, welcome to LinkUp! Enter this code in the app to finish creating your account.`,
    bodyHtml: `
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 10px;">
        <tr>${codeDigits}</tr>
      </table>
      <p style="margin:0 0 28px;font-size:12px;text-align:center;color:#8fa8ad;letter-spacing:1px;text-transform:uppercase;font-weight:700;">Your verification code</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background:#fdf8ec;border:1px solid #f0dfa0;border-radius:12px;padding:15px 18px;">
            <p style="margin:0;font-size:15px;line-height:1.6;color:#7a6520;"><strong>Expires in 10 minutes.</strong> If you didn't create a LinkUp account, you can safely ignore this email. No action is needed.</p>
          </td>
        </tr>
      </table>
    `,
    footer: 'LinkUp connects university students for safer, more affordable shared rides.<br>Questions? Reply to this email.',
  });
  sendAuthEmail(
    user.email,
    'Your LinkUp verification code',
    textBody,
    htmlBody
  );
}

function sendSchoolTransferVerificationCode(user, newEmail, code, newUniversity) {
  const firstName = user.firstName || 'there';
  const safeFirstName = escapeHtml(firstName);
  const safeNewEmail = escapeHtml(newEmail);
  const safeNewUniversity = escapeHtml(newUniversity || 'your new school');
  const textBody = [
    `Hi ${firstName},`,
    '',
    `Use this code to verify your new LinkUp school email for ${newUniversity || 'your new school'}:`,
    '',
    code,
    '',
    `New email: ${newEmail}`,
    '',
    'Your ride history, wallet, profile, ratings, and member number stay with you after the transfer.',
    '',
    'This code expires in 10 minutes. If you did not request a school transfer, you can ignore this email and your account will stay unchanged.',
    '',
    '- LinkUp',
  ].join('\n');
  const codeDigits = renderEmailCodeDigits(code);
  const htmlBody = renderLinkUpEmail({
    eyebrow: 'School transfer',
    title: 'Verify your new school email',
    intro: `Hi ${safeFirstName}, enter this code in LinkUp to move your account to ${safeNewUniversity}.`,
    bodyHtml: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
        <tr>
          <td style="background:#f4fbfb;border:1px solid #d8eeee;border-radius:14px;padding:16px 18px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#6a898f;">New school email</p>
            <p style="margin:0;font-size:16px;font-weight:800;color:#082023;word-break:break-word;">${safeNewEmail}</p>
          </td>
        </tr>
      </table>
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 10px;"><tr>${codeDigits}</tr></table>
      <p style="margin:0 0 28px;font-size:12px;text-align:center;color:#8fa8ad;letter-spacing:1px;text-transform:uppercase;font-weight:800;">School transfer code</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;">
        <tr><td style="background:#eefbfa;border:1px solid #ccefee;border-radius:12px;padding:15px 18px;"><p style="margin:0;font-size:13px;line-height:1.65;color:#315a60;">Your ride history, wallet, profile, ratings, and member number stay with you. Only your school network, campus matching, and university email update after verification.</p></td></tr>
      </table>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr><td style="background:#fdf8ec;border:1px solid #f0dfa0;border-radius:12px;padding:15px 18px;"><p style="margin:0;font-size:13px;line-height:1.6;color:#7a6520;"><strong>Expires in 10 minutes.</strong> If you did not request this school transfer, ignore this email and your account will stay unchanged.</p></td></tr>
      </table>
    `,
  });
  sendAuthEmail(newEmail, 'Verify your new LinkUp school email', textBody, htmlBody);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sendSchoolApprovedEmail(user, schoolName = '') {
  if (!user?.email) return;
  const firstName = user.firstName || 'there';
  const university = schoolName || getUserUniversityDisplay(user) || 'your school';
  const appUrl = APP_BASE_URL;
  const textBody = [
    `Hi ${firstName},`,
    '',
    `${university} has been approved on LinkUp.`,
    '',
    'Your account is ready, and you can now ride with LinkUp.',
    '',
    `Open LinkUp: ${appUrl}`,
    '',
    `Questions? Email ${SUPPORT_EMAIL}.`,
    '',
    '- LinkUp',
  ].join('\n');
  const htmlBody = renderLinkUpEmail({
    eyebrow: 'School approved',
    title: 'You can now ride with LinkUp',
    intro: `Hi ${escapeHtml(firstName)}, ${escapeHtml(university)} has been approved on LinkUp. Your account is ready.`,
    bodyHtml: '<p style="margin:0;font-size:15px;line-height:1.65;color:#54636a;">You can browse rides, request rides, list rides, and use your verified school network.</p>',
    cta: { href: appUrl, label: 'Open LinkUp' },
  });
  sendAuthEmail(user.email, 'Your school is approved on LinkUp', textBody, htmlBody);
}

function formatEmailCurrency(cents) {
  return '$' + (Math.max(0, Number(cents || 0)) / 100).toFixed(2);
}

function getEmailFirstName(user) {
  return String(user?.firstName || '').trim().split(/\s+/).filter(Boolean)[0] || 'there';
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
      destination: ride.destination || 'your destination',
      when: formatEmailDateTime(ride),
      driverName: driver ? [driver.firstName, driverLastInitial].filter(Boolean).join(' ') : (ride.driverName || 'Your driver'),
      vehicle: [ride.carColor, ride.carMaker, ride.carModel].filter(Boolean).join(' ') || (ride.rideshareService ? ride.rideshareService + ' ride' : ''),
      licensePlate: ride.licensePlate || '',
      arrivalCode: ride.completionPin || '',
      seat: getEmailSeatLabel(ride, seatId),
      pickup: actualPickup || ride.origin || 'Pickup location',
      dropoff: actualDropoff || ride.destination || 'Drop-off location',
      seatPrice: formatEmailCurrency(ride.priceCents),
      parkingFee: formatEmailCurrency(getRideParkingFeeCents(ride)),
      hasParkingFee: getRideParkingFeeCents(ride) > 0,
      price: formatEmailCurrency(getRideChargeCents(ride)),
    };
  });
}

function buildReservationEmailSubject(rideDetails) {
  if (rideDetails.length === 1) {
    return 'Your LinkUp ride to ' + rideDetails[0].destination + ' is confirmed';
  }
  return 'Your ' + rideDetails.length + ' LinkUp rides are confirmed';
}

function getSuccessfulRideSteps() {
  return [
    {
      title: 'Find your ride',
      helper: 'Browse open rides and reserve a seat.',
    },
    {
      title: 'Verify the driver',
      helper: 'Confirm name, license plate, and car match.',
    },
    {
      title: 'Check door safety',
      helper: 'Before the ride starts, confirm your door opens from inside, child lock is off, and report it if that changes.',
    },
    {
      title: 'Share live tracking (optional)',
      helper: 'Send your live trip to a trusted contact if you want extra peace of mind.',
    },
    {
      title: 'Use Safety Mode if needed (optional)',
      helper: 'Record only after everyone is notified and consent is handled where required.',
    },
    {
      title: 'Give the arrival code',
      helper: 'Read the 6-digit code so your driver can complete the ride.',
    },
    {
      title: 'Rate the driver',
      helper: 'Help the community by rating your driver.',
    },
  ];
}

function sendReservationConfirmationEmail(db, student, reservation, checkoutSession) {
  const rideDetails = buildReservationEmailRideDetails(db, reservation);
  if (!student?.email || !rideDetails.length) return;

  const firstName = getEmailFirstName(student);
  const totalCents = Number(checkoutSession.expectedAmountCents || checkoutSession.stripeAmountTotal || 0);
  const tripWord = rideDetails.length === 1 ? 'trip' : 'trips';
  const successSteps = getSuccessfulRideSteps();
  const textRideDetails = rideDetails.map((detail, index) => [
    `${index + 1}. ${detail.route}`,
    `When: ${detail.when}`,
    `Driver: ${detail.driverName}`,
    detail.vehicle ? `Vehicle: ${detail.vehicle}` : '',
    detail.licensePlate ? `License plate: ${detail.licensePlate}` : '',
    detail.arrivalCode ? `Arrival code: ${detail.arrivalCode}` : '',
    `Seat: ${detail.seat}`,
    `Pickup: ${detail.pickup}`,
    `Drop-off: ${detail.dropoff}`,
    detail.hasParkingFee ? `Seat price: ${detail.seatPrice}` : `Price: ${detail.price}`,
    detail.hasParkingFee ? `Parking / airport fee: ${detail.parkingFee}` : '',
    detail.hasParkingFee ? `Total: ${detail.price}` : '',
  ].filter(Boolean).join('\n')).join('\n\n');
  const textBody = [
    `Hi ${firstName},`,
    '',
    `Thanks for reserving your LinkUp ${tripWord}. Your seat is confirmed.`,
    '',
    textRideDetails,
    '',
    `Total paid: ${formatEmailCurrency(totalCents)}`,
    '',
    `${successSteps.length} steps to a successful ride:`,
    '',
    successSteps.map((step, index) => `${index + 1}. ${step.title}\n${step.helper}`).join('\n\n'),
    '',
    'You can view your ride details, chat with your driver, and manage trip safety tools in LinkUp.',
    `Need help? Email ${SUPPORT_EMAIL}.`,
    '',
    '- LinkUp',
  ].join('\n');

  const htmlRows = rideDetails.map((detail, index) => {
    const detailRows = [
      ['When', detail.when],
      ['Driver', detail.driverName],
      detail.vehicle ? ['Vehicle', detail.vehicle] : null,
      detail.licensePlate ? ['Plate', detail.licensePlate] : null,
      detail.arrivalCode ? ['Arrival code', detail.arrivalCode] : null,
      ['Seat', detail.seat],
      detail.hasParkingFee ? ['Seat price', detail.seatPrice] : ['Price', detail.price],
      detail.hasParkingFee ? ['Parking / airport fee', detail.parkingFee] : null,
      detail.hasParkingFee ? ['Total', detail.price] : null,
    ].filter(Boolean);
    const arrivalCodeDigits = String(detail.arrivalCode || '').split('').map((digit) => `
      <td style="padding:0 3px;">
        <div style="width:32px;height:40px;line-height:40px;text-align:center;border-radius:10px;background:#eafafa;border:1px solid #b7eeee;color:#102326;font-size:20px;font-weight:900;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">${escapeHtml(digit)}</div>
      </td>
    `).join('');
    return `
    <tr>
      <td style="padding:${index === 0 ? '0' : '16px 0 0'};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #d9eeee;border-radius:18px;background:#ffffff;overflow:hidden;">
          <tr>
            <td style="padding:18px 20px 14px;background:#f7fdfd;border-bottom:1px solid #e5f6f6;">
              <div style="font-size:11px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase;color:#0c747a;">Reservation ${index + 1}</div>
              <h2 style="margin:6px 0 0;font-size:21px;line-height:1.3;color:#102326;">${escapeHtml(detail.route)}</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 20px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:0 0 14px;">
                    <div style="font-size:11px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;color:#6c858a;">Pickup</div>
                    <div style="margin-top:4px;font-size:15px;line-height:1.45;color:#102326;">${escapeHtml(detail.pickup)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 16px;">
                    <div style="font-size:11px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;color:#6c858a;">Drop-off</div>
                    <div style="margin-top:4px;font-size:15px;line-height:1.45;color:#102326;">${escapeHtml(detail.dropoff)}</div>
                  </td>
                </tr>
              </table>
              ${detail.arrivalCode ? `
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px;background:#eafafa;border:1px solid #b7eeee;border-radius:14px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-size:11px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;color:#0c747a;">Arrival code</div>
                      <p style="margin:5px 0 12px;font-size:13px;line-height:1.45;color:#54636a;">Save this code. Give it to your driver at arrival so they can complete the ride, even if you do not have Wi-Fi.</p>
                      <table role="presentation" cellspacing="0" cellpadding="0"><tr>${arrivalCodeDigits}</tr></table>
                    </td>
                  </tr>
                </table>
              ` : ''}
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #edf4f4;padding-top:8px;">
                ${detailRows.map(([label, value]) => `
                  <tr>
                    <td style="width:112px;padding:7px 0;font-size:12px;font-weight:900;letter-spacing:1px;text-transform:uppercase;color:#37777d;">${escapeHtml(label)}</td>
                    <td style="padding:7px 0;font-size:15px;line-height:1.5;color:#33474d;">${escapeHtml(value)}</td>
                  </tr>
                `).join('')}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
  }).join('');
  const htmlSteps = successSteps.map((step, index) => `
    <tr>
      <td style="width:42px;padding:13px 0;vertical-align:top;">
        <div style="width:28px;height:28px;border-radius:50%;background:#eafafa;border:1px solid #b7eeee;color:#0c747a;text-align:center;line-height:26px;font-size:13px;font-weight:900;">${index + 1}</div>
      </td>
      <td style="padding:13px 0;vertical-align:top;border-bottom:${index === successSteps.length - 1 ? 'none' : '1px solid #dceeee'};">
        <div style="font-size:15px;font-weight:900;color:#102326;">${escapeHtml(step.title)}</div>
        <div style="margin-top:4px;font-size:14px;line-height:1.5;color:#54636a;">${escapeHtml(step.helper)}</div>
      </td>
    </tr>
  `).join('');

  const htmlBody = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Your LinkUp ride is confirmed</title>
      </head>
      <body style="margin:0;padding:0;background:#f4fbfb;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#102326;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4fbfb;padding:24px 14px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #d7fbfb;">
                <tr>
                  <td style="background:#ffffff;padding:24px 28px 26px;border-bottom:1px solid #e7f7f7;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <div style="font-size:28px;line-height:1;font-weight:900;color:#3a4649;letter-spacing:0;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">LinkUp</div>
                        </td>
                        <td align="right" style="vertical-align:middle;">
                          <span style="display:inline-block;padding:7px 11px;border-radius:999px;background:#eafafa;color:#0c747a;font-size:11px;font-weight:900;letter-spacing:1.3px;text-transform:uppercase;">Ride confirmed</span>
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin:24px 0 0;font-size:28px;line-height:1.18;color:#102326;">Your ride is confirmed</h1>
                    <p style="margin:10px 0 0;max-width:500px;font-size:15px;line-height:1.6;color:#54636a;">Hi ${escapeHtml(firstName)}, your LinkUp ${escapeHtml(tripWord)} ${rideDetails.length === 1 ? 'is' : 'are'} booked. Your trip details and arrival code are below.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 28px 28px;">
                    <div style="margin:0 0 18px;padding:16px 18px;border-radius:16px;background:#eafafa;border:1px solid #b7eeee;">
                      <div style="font-size:12px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase;color:#37777d;">Reservation confirmed</div>
                      <div style="margin-top:6px;font-size:15px;line-height:1.55;color:#33474d;">Your seat is booked. Open LinkUp when you are ready to chat with your driver, share tracking, or view your ride history.</div>
                    </div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${htmlRows}</table>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;">
                      <tr>
                        <td style="padding:18px 20px;border-radius:16px;background:#f7fdfd;border:1px solid #d7fbfb;">
                          <div style="font-size:12px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;color:#0c747a;">Total paid</div>
                          <div style="margin-top:6px;font-size:30px;font-weight:900;color:#102326;">${escapeHtml(formatEmailCurrency(totalCents))}</div>
                        </td>
                      </tr>
                    </table>
                    <div style="margin-top:22px;padding:22px;border-radius:18px;background:#f7fdfd;border:1px solid #d7fbfb;">
                      <h2 style="margin:0 0 6px;font-size:22px;line-height:1.3;color:#102326;">${successSteps.length} steps to a successful ride</h2>
                      <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#54636a;">A quick checklist for pickup, safety, and closing out the trip.</p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${htmlSteps}</table>
                    </div>
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px auto 0;">
                      <tr>
                        <td style="border-radius:999px;background:#0c747a;text-align:center;">
                        <a href="${escapeHtml(APP_BASE_URL)}/rides/yours" style="display:inline-block;padding:13px 22px;font-size:15px;font-weight:900;color:#ffffff;text-decoration:none;border-radius:999px;">Open ride checklist</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:22px 0 0;font-size:13px;line-height:1.65;color:#6b747a;text-align:center;">Need help? Email <a href="mailto:${escapeHtml(SUPPORT_EMAIL)}" style="color:#0c747a;font-weight:900;">${escapeHtml(SUPPORT_EMAIL)}</a>.</p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f2fbfb;padding:18px 28px;text-align:center;border-top:1px solid #d7fbfb;">
                    <p style="margin:0;font-size:12px;line-height:1.6;color:#8aa1a5;">LinkUp coordinates student ride sharing. Always confirm your driver's name, vehicle, and plate before getting in.</p>
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
    buildReservationEmailSubject(rideDetails),
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
  fs.writeFileSync(EMAIL_OUTBOX_PATH, JSON.stringify(outbox, null, 2), { mode: 0o600 });
  fs.chmodSync(EMAIL_OUTBOX_PATH, 0o600);
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

function normalizeSocialProfileUrl(platform, value) {
  const raw = String(value || '').trim();
  if (!raw) return { valid: true, url: '' };
  if (raw.length > 160 || /\s/.test(raw)) {
    return { valid: false, error: 'Social links must be valid profile URLs or usernames' };
  }

  const platformConfig = {
    instagram: {
      hostPattern: /(^|\.)instagram\.com$/i,
      baseUrl: 'https://www.instagram.com/',
      label: 'Instagram',
    },
    linkedin: {
      hostPattern: /(^|\.)linkedin\.com$/i,
      baseUrl: 'https://www.linkedin.com/in/',
      label: 'LinkedIn',
    },
    x: {
      hostPattern: /(^|\.)(x|twitter)\.com$/i,
      baseUrl: 'https://x.com/',
      label: 'X',
    },
  }[platform];

  const usernamePattern = platform === 'linkedin'
    ? /^[A-Za-z0-9-]{3,100}$/
    : /^@?[A-Za-z0-9._]{1,30}$/;

  if (usernamePattern.test(raw)) {
    return { valid: true, url: platformConfig.baseUrl + encodeURIComponent(raw.replace(/^@/, '')) };
  }

  const candidate = /^https?:\/\//i.test(raw) ? raw : 'https://' + raw;
  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname.replace(/^www\./i, '');
    if (!platformConfig.hostPattern.test(host)) {
      return { valid: false, error: platformConfig.label + ' link must use the official ' + platformConfig.label + ' domain' };
    }
    if (platform === 'linkedin' && !parsed.pathname.toLowerCase().startsWith('/in/')) {
      return { valid: false, error: 'LinkedIn link must be a public profile URL under /in/' };
    }
    if ((platform === 'instagram' || platform === 'x') && parsed.pathname.split('/').filter(Boolean).length > 1) {
      return { valid: false, error: platformConfig.label + ' link must point to a profile, not a post or page' };
    }
    parsed.protocol = 'https:';
    parsed.hash = '';
    parsed.search = '';
    return { valid: true, url: parsed.toString() };
  } catch (_) {
    return { valid: false, error: 'Social links must be valid profile URLs or usernames' };
  }
}

function normalizeSocialLinks(value = {}) {
  const links = {};
  for (const platform of ['instagram', 'linkedin', 'x']) {
    const result = normalizeSocialProfileUrl(platform, value?.[platform]);
    if (!result.valid) return result;
    links[platform] = result.url;
  }
  return { valid: true, links };
}

function normalizeWaitlistIntent(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return ['driver', 'rider', 'unsure'].includes(normalized) ? normalized : '';
}

function userNeedsRequiredSettings(user) {
  return getMissingRequiredSettings(user).length > 0;
}

function getUserMemberNumber(db, userId) {
  const users = Array.isArray(db?.users) ? db.users : [];
  const index = users.filter((entry) => !isAdminUser(entry) && !isDeletedUser(entry)).findIndex((entry) => entry.id === userId);
  return index >= 0 ? index + 1 : null;
}

function getAdminNumber(db, userId) {
  const users = Array.isArray(db?.users) ? db.users : [];
  const index = users.filter((entry) => isAdminUser(entry) && !isDeletedUser(entry)).findIndex((entry) => entry.id === userId);
  return index >= 0 ? index + 1 : null;
}

function isDeletedUser(user) {
  return Boolean(user?.deletedAt);
}

function activeUsers(db) {
  return asArray(db?.users).filter((user) => !isDeletedUser(user));
}

function isAdminUser(user) {
  return Boolean(user?.isAdmin) || ADMIN_EMAILS.has(normalizeEmail(user?.email || ''));
}

function isAdminEmail(email) {
  return ADMIN_EMAILS.has(normalizeEmail(email));
}

function hasServiceAccess(user) {
  return user?.serviceApproved === true || LOCAL_TEST_BYPASS_WAITLIST;
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
    notificationPreferences: normalizeNotificationPreferences(user.notificationPreferences, user),
    email: user.email,
    university: getUserUniversityDisplay(user),
    universityDomain: user.universityDomain || getEmailDomain(user.email),
    serviceApproved: hasServiceAccess(user),
    waitlisted: !hasServiceAccess(user),
    waitlistIntent: normalizeWaitlistIntent(user.waitlistIntent),
    emailVerified: user.emailVerified !== false,
    nameLastChangedAt: user.nameLastChangedAt || null,
    memberNumber: db ? getUserMemberNumber(db, user.id) : null,
    adminNumber: db ? getAdminNumber(db, user.id) : null,
    isAdmin: isAdminUser(user),
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
    pendingSchoolTransfer: user.pendingSchoolTransfer ? {
      email: maskEmail(user.pendingSchoolTransfer.email || ''),
      university: user.pendingSchoolTransfer.university || '',
      requestedAt: user.pendingSchoolTransfer.requestedAt || '',
      expiresAt: user.pendingSchoolTransfer.expiresAt || null,
    } : null,
    missingRequiredSettings,
    requiresRequiredSettings: missingRequiredSettings.length > 0,
    createdAt: user.createdAt || null,
    rideServicesPaused: RIDE_SERVICES_PAUSED,
    waitlistMode: WAITLIST_MODE && !LOCAL_TEST_BYPASS_WAITLIST,
    twoFactorEnabled: Boolean(user.totpEnabled),
    emailTwoFactorEnabled: Boolean(user.emailTwoFactorEnabled),
    friendInviteCount: normalizeFriendInvites(user.friendInvites).length,
    friendInviteJoinedCount: db ? activeUsers(db).filter((entry) => entry.invitedByUserId === user.id).length : 0,
    friendInviteCode: getFriendInviteCode(user, db),
    friendInviteUrl: buildFriendInviteUrl(user, db),
    wallet: db ? buildDriverWalletSummary(db, user.id) : null,
  };
}

function anonymizeDeletedUser(db, user) {
  const now = new Date().toISOString();
  const anonymizedEmail = `deleted-${user.id}@deleted.linkup.local`;
  user.deletedAt = now;
  user.deletedEmailHash = hashToken(normalizeEmail(user.email || ''));
  user.email = anonymizedEmail;
  user.firstName = 'Deleted';
  user.middleName = '';
  user.lastName = 'User';
  user.name = 'Deleted User';
  user.profilePictureDataUrl = '';
  user.classYear = '';
  user.major = '';
  user.socialLinks = {};
  user.friendInvites = [];
  user.friendInviteCode = '';
  user.pendingSchoolTransfer = null;
  user.emailVerified = false;
  user.serviceApproved = false;
  user.waitlistedAt = null;
  user.manuallyWaitlistedAt = null;
  user.waitlistIntent = '';
  user.defaultPaymentMethod = null;
  user.payoutInfo = null;
  user.totpEnabled = false;
  user.totpSecret = '';
  user.emailTwoFactorEnabled = false;
  user.passwordHash = null;
  user.updatedAt = now;

  db.carts = db.carts || {};
  delete db.carts[user.id];
  db.pushSubscriptions = (db.pushSubscriptions || []).filter((sub) => sub.userId !== user.id);
  db.deviceTokens = (db.deviceTokens || []).filter((token) => token.userId !== user.id);
  db.userBlocks = (db.userBlocks || []).filter((block) => block.blockerId !== user.id && block.blockedUserId !== user.id);

  (db.rides || []).forEach((ride) => {
    if (ride.driverId === user.id && !hasTripEnded(ride)) {
      ride.status = 'removed';
      ride.moderationNote = ride.moderationNote || 'Driver deleted account.';
      ride.removedAt = ride.removedAt || now;
    }
    ride.passengers = (ride.passengers || []).filter((passenger) => passenger.studentId !== user.id || hasTripEnded(ride));
  });

  (db.rideRequests || []).forEach((request) => {
    const before = request.driverOffers ? request.driverOffers.length : 0;
    if (request.riderId === user.id && request.status === 'open') {
      request.status = 'removed';
      request.moderationNote = request.moderationNote || 'Rider deleted account.';
      request.removedAt = request.removedAt || now;
    }
    request.driverOffers = (request.driverOffers || []).filter((offer) => offer.driverId !== user.id);
    if (request.riderId === user.id || request.driverOffers.length !== before) persistRideRequest(request);
  });

  (db.trackingTrips || []).forEach((trip) => {
    if (trip.ownerId === user.id) {
      trip.status = 'stopped';
      trip.stoppedAt = trip.stoppedAt || now;
      persistTrackingTrip(trip);
    }
  });
}

function maskEmail(email) {
  const [local, domain] = String(email || '').split('@');
  if (!local || !domain) return email;
  const masked = local[0] + '***' + (local.length > 1 ? local[local.length - 1] : '');
  return masked + '@' + domain;
}

async function sendTwoFactorEmail(to, code) {
  const codeDigits = renderEmailCodeDigits(code);
  const html = renderLinkUpEmail({
    eyebrow: 'Sign-in verification',
    title: 'Your sign-in code',
    intro: 'Enter this code to finish signing in to LinkUp.',
    bodyHtml: `
      <table style="border-collapse:separate;border-spacing:0;margin:0 auto 10px;" cellpadding="0" cellspacing="0"><tr>${codeDigits}</tr></table>
      <p style="font-size:13px;color:#7a6520;margin:22px 0 0;padding:14px 18px;background:#fdf8ec;border:1px solid #f0dfa0;border-radius:12px;"><strong>Expires in 10 minutes.</strong> If you didn't try to sign in, you can safely ignore this email.</p>
    `,
  });
  await sendAuthEmail(to, 'Your LinkUp sign-in code', `Your LinkUp sign-in code is: ${code}\n\nThis code expires in 10 minutes.`, html);
}

function sendFriendInviteEmail(inviter, friendEmail, db = null) {
  const inviterName = getUserDisplayName(inviter);
  const inviteUrl = buildFriendInviteUrl(inviter, db);
  const subject = `${inviterName} invited you to LinkUp`;
  const textBody = `${inviterName} has invited you to something creative: LinkUp.\n\nLinkUp helps verified students find, reserve, and share rides with people in their university network.\n\nJoin here:\n${inviteUrl}\n\n- LinkUp`;
  const htmlBody = renderLinkUpEmail({
    eyebrow: 'Friend invite',
    title: `${inviterName} invited you to LinkUp`,
    intro: `${escapeHtml(inviterName)} has invited you to something creative: a student ride network built around trust.`,
    bodyHtml: '<p style="margin:0;font-size:15px;line-height:1.65;color:#54636a;">With LinkUp, verified students can find rides, reserve seats, share trip tracking, and keep ride details organized in one place.</p>',
    cta: { href: inviteUrl, label: 'Open LinkUp' },
  });
  sendAuthEmail(friendEmail, subject, textBody, htmlBody);
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

function calcStripeFee(grossCents) {
  return Math.round(grossCents * STRIPE_FEE_RATE) + STRIPE_FEE_FIXED_CENTS;
}

function addWalletAmounts(target, grossCents, commissionableCents = grossCents) {
  const gross = Math.max(0, Number(grossCents || 0));
  const commissionBase = Math.max(0, Math.min(gross, Number(commissionableCents || 0)));
  const commission = Math.round(commissionBase * LINKUP_COMMISSION_RATE);
  const stripeFee = calcStripeFee(gross);
  const net = Math.max(0, gross - commission - stripeFee);
  target.grossCents += gross;
  target.commissionCents += commission;
  target.stripeFeesCents = (target.stripeFeesCents || 0) + stripeFee;
  target.netCents += net;
  return { gross, commission, stripeFee, net };
}

function addWalletLedgerAmounts(target, transaction) {
  const gross = Math.max(0, Number(transaction.grossCents || 0));
  const commission = Math.max(0, Number(transaction.commissionCents || 0));
  const stripeFee = Math.max(0, Number(transaction.stripeFeesCents ?? calcStripeFee(gross)));
  const net = Math.max(0, Number(transaction.amountCents || 0));
  target.grossCents += gross;
  target.commissionCents += commission;
  target.stripeFeesCents = (target.stripeFeesCents || 0) + stripeFee;
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
  if (transaction.needsCompletion) {
    // Unlocked immediately when driver confirms with the rider's PIN
    if (transaction.confirmedAt) return true;
    // Auto-release 48 h after scheduled ride end so riders can't hold earnings hostage
    const autoReleaseMs = new Date(transaction.availableAt || transaction.createdAt || 0).getTime()
      + 48 * 60 * 60 * 1000;
    return Number.isFinite(autoReleaseMs) && now.getTime() >= autoReleaseMs;
  }
  // Legacy behaviour for transactions created before the completion-code feature
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
    const grossCents = getRideChargeCents(ride);
    if (!grossCents) return;
    const commissionCents = Math.round(getRideCommissionableCents(ride) * LINKUP_COMMISSION_RATE);
    const stripeFeesCents = calcStripeFee(grossCents);
    const amountCents = Math.max(0, grossCents - commissionCents - stripeFeesCents);
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
      seatPriceCents: getRideCommissionableCents(ride),
      parkingFeeCents: getRideParkingFeeCents(ride),
      commissionCents,
      stripeFeesCents,
      commissionRate: LINKUP_COMMISSION_RATE,
      currency: checkoutSession.stripeCurrency || 'usd',
      rideId: ride.id,
      riderId: checkoutSession.studentId || paymentRecord?.studentId || '',
      sourceCheckoutSessionId: checkoutSession.id || '',
      sourcePaymentId,
      availableAt: new Date(getTripInterval(ride).end).toISOString(),
      needsCompletion: Boolean(ride.completionPin),
      confirmedAt: null,
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
    stripeFeeRate: STRIPE_FEE_RATE,
    stripeFeeFixedCents: STRIPE_FEE_FIXED_CENTS,
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
    thisWeek: { grossCents: 0, commissionCents: 0, stripeFeesCents: 0, netCents: 0, paidSeatCount: 0 },
    readyForPayout: { grossCents: 0, commissionCents: 0, stripeFeesCents: 0, netCents: 0, paidSeatCount: 0 },
    pendingRideCompletion: { grossCents: 0, commissionCents: 0, stripeFeesCents: 0, netCents: 0, paidSeatCount: 0 },
    allTime: { grossCents: 0, commissionCents: 0, stripeFeesCents: 0, netCents: 0, paidSeatCount: 0 },
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
        const grossCents = getRideChargeCents(ride);
        const commissionableCents = getRideCommissionableCents(ride);
        if (!grossCents) return;
        addWalletAmounts(summary.allTime, grossCents, commissionableCents);
        summary.allTime.paidSeatCount += 1;
        if (paidThisWeek) {
          addWalletAmounts(summary.thisWeek, grossCents, commissionableCents);
          summary.thisWeek.paidSeatCount += 1;
        }
        if (paidThisWeek) {
          const payoutBucket = hasTripEnded(ride) ? summary.readyForPayout : summary.pendingRideCompletion;
          addWalletAmounts(payoutBucket, grossCents, commissionableCents);
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
  // ── Session auth (web) ───────────────────────────────────────────
  if (req.session.userId) {
    const db = loadDb();
    const user = (db.users || []).find((entry) => entry.id === req.session.userId);
    if (!user || isDeletedUser(user)) {
      return req.session.destroy(() => res.status(401).json({ error: 'Account is no longer active.' }));
    }
    return next();
  }

  // ── Bearer token auth (iOS / Android / CLI) ──────────────────────
  const authHeader = req.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const rawToken = authHeader.slice(7).trim();
    if (!rawToken) return res.status(401).json({ error: 'Bearer token is empty' });
    const tokenHash = hashToken(rawToken);
    const db = loadDb();
    let foundUser = null;
    let foundToken = null;
    for (const u of (db.users || [])) {
      const t = asArray(u.apiTokens).find(
        (tk) => tk.hash === tokenHash && (!tk.expiresAt || tk.expiresAt > Date.now())
      );
      if (t) { foundUser = u; foundToken = t; break; }
    }
    if (!foundUser || isDeletedUser(foundUser)) {
      return res.status(401).json({ error: 'Invalid or expired API token' });
    }
    if (foundUser.suspendedAt) {
      return res.status(403).json({ error: foundUser.bannedByStrikesAt
        ? 'This account has been permanently banned.'
        : 'This account has been suspended.' });
    }
    foundToken.lastUsedAt = new Date().toISOString();
    req.session.userId = foundUser.id;
    saveDb(db);
    return next();
  }

  return res.status(401).json({ error: 'Not authenticated' });
}

function requireAdmin(req, res, next) {
  const db = loadDb();
  const user = (db.users || []).find((entry) => entry.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (!isAdminUser(user)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  req.adminUser = user;
  req.adminDb = db;
  next();
}

function saveSessionAndJson(req, res, payload, newUserId = null) {
  const doSave = () => {
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err.message || err);
        return res.status(500).json({ error: 'Could not save your login session. Please try again.' });
      }
      // Verify the session is readable from the store before telling the client it succeeded.
      // Catches silent Postgres read-after-write failures that would immediately break /api/auth/me.
      req.sessionStore.get(req.session.id, (getErr, storedSess) => {
        if (getErr || !storedSess) {
          console.error('Session verify failed after save:', getErr?.message || 'session not found');
          return res.status(500).json({ error: 'Login succeeded but session could not be verified. Please try again.' });
        }
        res.json(payload);
      });
    });
  };
  if (newUserId) {
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err.message || err);
        return res.status(500).json({ error: 'Could not save your login session. Please try again.' });
      }
      req.session.userId = newUserId;
      doSave();
    });
  } else {
    doSave();
  }
}

function requireServiceAccess(req, res, next) {
  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user || isDeletedUser(user)) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.suspendedAt) {
    const banMsg = user.bannedByStrikesAt
      ? 'This account has been permanently banned due to repeated terms of service violations.'
      : 'This account has been suspended by LinkUp moderation.';
    return res.status(403).json({ error: banMsg });
  }
  if (!hasServiceAccess(user)) {
    return res.status(403).json({ error: 'LinkUp has not launched at your university yet. Your account is on the waitlist, and we will notify you when access opens.' });
  }
  if (user.emailVerified === false) {
    return res.status(403).json({ error: 'Verify your email address before using LinkUp services.', code: 'EMAIL_NOT_VERIFIED' });
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

function requireCampusNetworkAccess(req, res, next) {
  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user || isDeletedUser(user)) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.suspendedAt) {
    const banMsg = user.bannedByStrikesAt
      ? 'This account has been permanently banned due to repeated terms of service violations.'
      : 'This account has been suspended by LinkUp moderation.';
    return res.status(403).json({ error: banMsg });
  }
  if (user.emailVerified === false) {
    return res.status(403).json({ error: 'Verify your email address before using LinkUp.', code: 'EMAIL_NOT_VERIFIED' });
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

function getSafetyRideForUser(db, userId) {
  const ride = findTrackableRideForUser(db, userId);
  return ride && isRideTrackableForUser(ride, userId) ? ride : null;
}

function getSafetyRideCounterparty(db, ride, userId) {
  if (!ride || !userId) return null;
  if (ride.driverId && ride.driverId !== userId) {
    return (db.users || []).find((user) => user.id === ride.driverId) || null;
  }
  const passenger = (ride.passengers || []).find((entry) => entry.studentId && entry.studentId !== userId);
  return passenger
    ? ((db.users || []).find((user) => user.id === passenger.studentId) || {
      id: passenger.studentId,
      firstName: passenger.studentFirstName,
      lastName: passenger.studentLastName,
      email: passenger.email || '',
    })
    : null;
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

app.get('/api/invites/:inviteCode', (req, res) => {
  const db = normalizeUserAccess(loadDb());
  const inviter = findUserByFriendInviteCode(db, req.params.inviteCode);
  if (!inviter) {
    return res.status(404).json({ error: 'Invite link not found' });
  }
  const inviterName = getUserDisplayName(inviter);
  res.json({
    inviterName,
    inviterFirstName: inviter.firstName || inviterName.split(/\s+/)[0] || 'A LinkUp member',
  });
});

// Sign up endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { firstName, middleName, lastName, birthday, email, password } = req.body;
  const gender = normalizeGender(req.body.gender);
  const inviteCode = String(req.body.inviteCode || '').trim().toLowerCase();
  if (!firstName || !lastName || !birthday || !gender || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (req.body.termsAccepted !== true || req.body.privacyAccepted !== true) {
    return res.status(400).json({ error: 'You must agree to the Terms and Conditions and Privacy Notice before creating an account' });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
    return res.status(400).json({ error: 'Enter a valid birthday' });
  }
  const birthdayDate = new Date(birthday + 'T00:00:00');
  const ageDays = (Date.now() - birthdayDate.getTime()) / (1000 * 60 * 60 * 24);
  if (isNaN(ageDays) || ageDays < 365 * 18 || ageDays > 365 * 120) {
    return res.status(400).json({ error: 'You must be at least 18 years old to use LinkUp' });
  }

  const normalizedEmail = normalizeEmail(email);
  const adminEmail = isAdminEmail(normalizedEmail);
  if (!isUniversityEmail(normalizedEmail) && !adminEmail) {
    return res.status(400).json({ error: 'Please use a valid university email address' });
  }
  const universityDomain = getEmailDomain(normalizedEmail);
  const supportedUniversity = extractUniversityFromEmail(normalizedEmail);
  const serviceApproved = LOCAL_TEST_BYPASS_WAITLIST || adminEmail || (!WAITLIST_MODE && Boolean(supportedUniversity));
  const university = supportedUniversity || (adminEmail ? 'LinkUp Admin' : getUniversityInfoFromDomain(universityDomain).name);

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.error });
  }

  const db = normalizeUserAccess(loadDb());
  const existingUser = db.users.find((u) => u.email === normalizedEmail);
  if (existingUser) {
    return res.status(400).json({ error: 'This email is already associated with an account' });
  }
  const isBannedUser = db.users.some(
    (u) => u.suspendedAt &&
      u.universityDomain === getEmailDomain(normalizedEmail) &&
      u.firstName.trim().toLowerCase() === String(firstName).trim().toLowerCase() &&
      u.lastName.trim().toLowerCase() === String(lastName).trim().toLowerCase() &&
      u.birthday === birthday
  );
  if (isBannedUser) {
    return res.status(403).json({ error: 'This account is not eligible to register on LinkUp' });
  }
  const invitedByUser = findUserByFriendInviteCode(db, inviteCode);

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
    waitlistIntent: '',
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
  if (invitedByUser && invitedByUser.email !== normalizedEmail) {
    user.invitedByUserId = invitedByUser.id;
    user.invitedByInviteCode = getFriendInviteCode(invitedByUser, db);
    user.invitedAt = new Date().toISOString();
  }

  if (BYPASS_EMAIL_VERIFICATION) {
    user.emailVerified = true;
    db.users.push(user);
    saveDb(db);
    return saveSessionAndJson(req, res, {
      message: 'Account created and verified for local testing.',
      email: user.email,
      requiresVerification: false,
      user: publicUser(user, db),
    }, user.id);
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
  if (!user || isDeletedUser(user)) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }
  if (user.emailVerified === true) {
    return saveSessionAndJson(req, res, publicUser(user, db), user.id);
  }
  if (BYPASS_EMAIL_VERIFICATION && String(code).trim() === '000000') {
    user.emailVerified = true;
    delete user.emailVerificationCodeHash;
    delete user.emailVerificationCodeExpiresAt;
    saveDb(db);
    return saveSessionAndJson(req, res, publicUser(user, db), user.id);
  }
  if (!user.emailVerificationCodeHash || user.emailVerificationCodeExpiresAt <= Date.now()) {
    return res.status(400).json({ error: 'Verification code expired. Request a new code.' });
  }
  const MAX_VERIFY_ATTEMPTS = 5;
  if ((user.emailVerificationAttempts || 0) >= MAX_VERIFY_ATTEMPTS) {
    return res.status(429).json({ error: 'Too many verification attempts. Please request a new code.' });
  }
  if (hashToken(String(code).trim()) !== user.emailVerificationCodeHash) {
    user.emailVerificationAttempts = (user.emailVerificationAttempts || 0) + 1;
    saveDb(db);
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  user.emailVerified = true;
  delete user.emailVerificationCodeHash;
  delete user.emailVerificationCodeExpiresAt;
  delete user.emailVerificationAttempts;
  saveDb(db);

  saveSessionAndJson(req, res, publicUser(user, db), user.id);
});

app.post('/api/auth/resend-verification', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.email === normalizeEmail(email));
  if (!user || isDeletedUser(user)) {
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
  const normalizedEmail = normalizeEmail(email);
  let user = db.users.find((u) => u.email === normalizedEmail);
  if (!user && NODE_ENV !== 'production' && BYPASS_EMAIL_VERIFICATION && isUniversityEmail(normalizedEmail)) {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }
    const universityDomain = getEmailDomain(normalizedEmail);
    const supportedUniversity = extractUniversityFromEmail(normalizedEmail);
    const localName = normalizedEmail.split('@')[0].split(/[._-]+/).filter(Boolean);
    user = {
      id: uuidv4(),
      firstName: titleCaseSchoolPart(localName[0]) || 'Local',
      middleName: '',
      lastName: titleCaseSchoolPart(localName.slice(1).join(' ')) || 'Tester',
      birthday: '2000-01-01',
      gender: 'prefer-not-to-say',
      email: normalizedEmail,
      university: supportedUniversity || getUniversityInfoFromDomain(universityDomain).name,
      universityDomain,
      serviceApproved: LOCAL_TEST_BYPASS_WAITLIST || (!WAITLIST_MODE && Boolean(supportedUniversity)),
      waitlistedAt: (LOCAL_TEST_BYPASS_WAITLIST || (!WAITLIST_MODE && supportedUniversity)) ? null : new Date().toISOString(),
      passwordHash: await bcrypt.hash(password, 10),
      emailVerified: true,
      themePreference: 'dark',
      termsAcceptedAt: new Date().toISOString(),
      privacyAcceptedAt: new Date().toISOString(),
      termsVersion: REQUIRED_TERMS_VERSION,
      privacyVersion: REQUIRED_PRIVACY_VERSION,
      policyAcceptedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    saveDb(db);
  }
  if (!user || isDeletedUser(user)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  let passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches && NODE_ENV !== 'production' && BYPASS_EMAIL_VERIFICATION && password === 'Testpass1!') {
    user.passwordHash = await bcrypt.hash(password, 10);
    user.emailVerified = true;
    saveDb(db);
    passwordMatches = true;
  }
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.emailVerified === false) {
    return res.status(403).json({ error: 'Please verify your email before signing in' });
  }

  // TOTP takes precedence; email 2FA is fallback
  if (user.totpEnabled && user.totpSecret) {
    req.session.pending2FAUserId = user.id;
    return req.session.save(() => res.json({ requires2FA: true, method: 'totp' }));
  }
  if (user.emailTwoFactorEnabled) {
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    req.session.pending2FAUserId = user.id;
    req.session.pending2FAEmailCode = code;
    req.session.pending2FAEmailExpiry = Date.now() + 10 * 60 * 1000;
    sendTwoFactorEmail(user.email, code).catch(() => {});
    return req.session.save(() => res.json({ requires2FA: true, method: 'email', emailHint: maskEmail(user.email) }));
  }

  saveSessionAndJson(req, res, publicUser(user, db), user.id);
});

// 2FA: complete sign-in (handles both TOTP and email methods)
app.post('/api/auth/2fa/verify', sensitiveWriteRateLimit, async (req, res) => {
  const pendingId = req.session.pending2FAUserId;
  if (!pendingId) return res.status(400).json({ error: 'No pending sign-in. Please sign in again.' });
  const code = String(req.body.code || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: 'Enter the 6-digit code' });
  const db = loadDb();
  const user = db.users.find((u) => u.id === pendingId);
  if (!user) return res.status(401).json({ error: 'Sign-in session expired. Please sign in again.' });

  if (user.totpEnabled && user.totpSecret) {
    const valid = speakeasy.totp.verify({ secret: decryptSensitiveValue(user.totpSecret), encoding: 'base32', token: code, window: 1 });
    if (!valid) return res.status(401).json({ error: 'Incorrect code. Check your authenticator app and try again.' });
  } else if (user.emailTwoFactorEnabled) {
    const storedCode = req.session.pending2FAEmailCode;
    const expiry = req.session.pending2FAEmailExpiry;
    if (!storedCode || !expiry || Date.now() > expiry) {
      return res.status(401).json({ error: 'Code expired. Please sign in again to receive a new code.' });
    }
    if (code !== storedCode) return res.status(401).json({ error: 'Incorrect code. Check your email and try again.' });
  } else {
    return res.status(401).json({ error: 'Sign-in session expired. Please sign in again.' });
  }

  delete req.session.pending2FAUserId;
  delete req.session.pending2FAEmailCode;
  delete req.session.pending2FAEmailExpiry;
  saveSessionAndJson(req, res, publicUser(user, db), user.id);
});

// 2FA: generate setup secret and QR code
app.post('/api/auth/2fa/setup', requireAuth, async (req, res) => {
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.totpEnabled) return res.status(400).json({ error: '2FA is already enabled on your account' });
  const secret = speakeasy.generateSecret({ name: `LinkUp (${user.email})`, issuer: 'LinkUp', length: 20 });
  user.totpTempSecret = encryptSensitiveValue(secret.base32);
  saveDb(db);
  const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url, { width: 220, margin: 1 });
  res.json({ secret: secret.base32, qrDataUrl, otpauthUrl: secret.otpauth_url });
});

// 2FA: confirm setup by verifying first TOTP code
app.post('/api/auth/2fa/enable', requireAuth, sensitiveWriteRateLimit, (req, res) => {
  const code = String(req.body.code || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: 'Enter the 6-digit code from your authenticator app' });
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!user.totpTempSecret) return res.status(400).json({ error: 'Start the setup process first' });
  const valid = speakeasy.totp.verify({ secret: decryptSensitiveValue(user.totpTempSecret), encoding: 'base32', token: code, window: 1 });
  if (!valid) return res.status(400).json({ error: 'Incorrect code. Make sure your authenticator app is synced and try again.' });
  user.totpSecret = user.totpTempSecret;
  user.totpEnabled = true;
  delete user.totpTempSecret;
  saveDb(db);
  res.json({ message: 'Two-factor authentication is now enabled.', user: publicUser(user, db) });
});

// 2FA: disable by verifying current TOTP code
app.post('/api/auth/2fa/disable', requireAuth, sensitiveWriteRateLimit, (req, res) => {
  const code = String(req.body.code || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: 'Enter your current 6-digit authenticator code to confirm' });
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!user.totpEnabled || !user.totpSecret) return res.status(400).json({ error: '2FA is not currently enabled' });
  const valid = speakeasy.totp.verify({ secret: decryptSensitiveValue(user.totpSecret), encoding: 'base32', token: code, window: 1 });
  if (!valid) return res.status(400).json({ error: 'Incorrect code. 2FA is still active.' });
  user.totpEnabled = false;
  delete user.totpSecret;
  delete user.totpTempSecret;
  saveDb(db);
  res.json({ message: 'Two-factor authentication has been removed.', user: publicUser(user, db) });
});

// Email 2FA: enable
app.post('/api/auth/2fa/email/enable', requireAuth, (req, res) => {
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.emailTwoFactorEnabled) return res.status(400).json({ error: 'Email verification is already enabled' });
  user.emailTwoFactorEnabled = true;
  saveDb(db);
  res.json({ message: 'Email verification is now enabled for sign-in.', user: publicUser(user, db) });
});

// Email 2FA: disable
app.post('/api/auth/2fa/email/disable', requireAuth, (req, res) => {
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!user.emailTwoFactorEnabled) return res.status(400).json({ error: 'Email verification is not enabled' });
  user.emailTwoFactorEnabled = false;
  saveDb(db);
  res.json({ message: 'Email verification has been removed.', user: publicUser(user, db) });
});

// Email 2FA: resend code during pending sign-in
app.post('/api/auth/2fa/email/resend', sensitiveWriteRateLimit, async (req, res) => {
  const pendingId = req.session.pending2FAUserId;
  if (!pendingId) return res.status(400).json({ error: 'No pending sign-in. Please sign in again.' });
  const db = loadDb();
  const user = db.users.find((u) => u.id === pendingId);
  if (!user || !user.emailTwoFactorEnabled) return res.status(400).json({ error: 'Sign-in session expired. Please sign in again.' });
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  req.session.pending2FAEmailCode = code;
  req.session.pending2FAEmailExpiry = Date.now() + 10 * 60 * 1000;
  await sendTwoFactorEmail(user.email, code).catch(() => {});
  req.session.save(() => res.json({ message: 'A new code has been sent to your email.' }));
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const db = loadDb();
  const normalizedEmail = normalizeEmail(email);
  const user = db.users.find((u) => u.email === normalizedEmail);

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
      `Hi ${user.firstName},\n\nUse this link to reset your LinkUp password. It expires in 1 hour:\n${resetUrl}\n\n- LinkUp`,
      renderLinkUpEmail({
        eyebrow: 'Password reset',
        title: 'Reset your password',
        intro: `Hi ${escapeHtml(user.firstName || 'there')}, use this secure link to reset your LinkUp password. It expires in 1 hour.`,
        bodyHtml: '<p style="margin:0;font-size:14px;line-height:1.65;color:#54636a;">If you did not request a password reset, you can safely ignore this email.</p>',
        cta: { href: resetUrl, label: 'Reset password' },
      })
    );

    if (NODE_ENV !== 'production') {
      console.log('[dev] Password reset link:', resetUrl);
    }
  }

  res.json({ message: 'If an account exists for that email, we sent password reset instructions.' });
});

app.post('/api/auth/change-password', requireAuth, sensitiveWriteRateLimit, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const matches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!matches) return res.status(400).json({ error: 'Current password is incorrect' });

  if (await bcrypt.compare(newPassword, user.passwordHash)) {
    return res.status(400).json({ error: 'New password must be different from your current password' });
  }

  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  user.pendingPasswordHash = await bcrypt.hash(newPassword, 10);
  user.passwordChangeCodeHash = hashToken(code);
  user.passwordChangeCodeExpiresAt = Date.now() + 1000 * 60 * 10;
  delete user.passwordChangeCodeAttempts;
  saveDb(db);

  const firstName = user.firstName || 'there';
  const textBody = [
    `Hi ${firstName},`,
    '',
    'Use this code to confirm your LinkUp password change:',
    '',
    code,
    '',
    'This code expires in 10 minutes. If you did not request a password change, you can ignore this email.',
    '',
    '— LinkUp',
  ].join('\n');

  const htmlBody = renderLinkUpEmail({
    eyebrow: 'Password change',
    title: 'Confirm your password change',
    intro: `Hi ${escapeHtml(firstName)}, enter this code to confirm your password change.`,
    bodyHtml: `
      <table cellspacing="0" cellpadding="0" style="margin:0 auto 10px;"><tr>${renderEmailCodeDigits(code, { size: 'small' })}</tr></table>
      <p style="margin:20px 0 0;font-size:13px;color:#7a6520;padding:14px 18px;background:#fdf8ec;border:1px solid #f0dfa0;border-radius:12px;"><strong>Expires in 10 minutes.</strong> Didn't request this? Ignore this email. Your password has not changed.</p>
    `,
  });

  try {
    const transporter = getMailTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: user.email,
        subject: 'Confirm your LinkUp password change',
        text: textBody,
        html: htmlBody,
      });
    }
  } catch (_) {}

  res.json({ message: `We sent a 6-digit code to ${user.email}. Enter it below to confirm.` });
});

app.post('/api/auth/change-password/confirm', requireAuth, sensitiveWriteRateLimit, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Verification code is required' });

  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  if (!user.passwordChangeCodeHash || !user.pendingPasswordHash || user.passwordChangeCodeExpiresAt <= Date.now()) {
    return res.status(400).json({ error: 'Verification code expired. Please start over.' });
  }
  const MAX_ATTEMPTS = 5;
  if ((user.passwordChangeCodeAttempts || 0) >= MAX_ATTEMPTS) {
    return res.status(429).json({ error: 'Too many attempts. Please start over.' });
  }
  if (hashToken(String(code).trim()) !== user.passwordChangeCodeHash) {
    user.passwordChangeCodeAttempts = (user.passwordChangeCodeAttempts || 0) + 1;
    saveDb(db);
    return res.status(400).json({ error: 'Invalid code' });
  }

  user.passwordHash = user.pendingPasswordHash;
  delete user.pendingPasswordHash;
  delete user.passwordChangeCodeHash;
  delete user.passwordChangeCodeExpiresAt;
  delete user.passwordChangeCodeAttempts;
  saveDb(db);
  res.json({ message: 'Password updated successfully.' });
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
  if (!user || isDeletedUser(user)) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(publicUser(user, db));
});

app.get('/api/me/conduct', requireAuth, (req, res) => {
  const db = loadDb();
  const user = (db.users || []).find((u) => u.id === req.session.userId);
  if (!user || isDeletedUser(user)) return res.status(404).json({ error: 'User not found' });
  const strikes = asArray(user.strikes).filter(isPlainObject).map((s) => ({
    id: s.id,
    level: s.level,
    category: s.category,
    categoryLabel: (STRIKE_CATEGORIES[s.level] || []).find((c) => c.id === s.category)?.label || s.category,
    reason: s.reason || '',
    issuedAt: s.issuedAt || '',
  }));
  res.json({
    strikes,
    strikeTotal: getStrikeTotal(user),
    strikeBanThreshold: STRIKE_BAN_THRESHOLD,
    banned: Boolean(user.bannedByStrikesAt),
  });
});

// ─── API Token management (mobile / CLI auth) ─────────────────────────────
// POST /api/auth/token  — exchange email+password for a long-lived Bearer token
// Intended for native iOS/Android apps that cannot use session cookies.
const API_TOKEN_RATE_LIMIT = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many token requests. Please wait.' });

app.post('/api/auth/token', API_TOKEN_RATE_LIMIT, async (req, res) => {
  const { email, password, label } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const db = loadDb();
  const user = (db.users || []).find((u) => normalizeEmail(u.email) === normalizeEmail(email));
  if (!user || isDeletedUser(user)) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.suspendedAt) return res.status(403).json({ error: 'Account is suspended' });
  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) return res.status(401).json({ error: 'Invalid credentials' });
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenRecord = {
    id: uuidv4(),
    hash: hashToken(rawToken),
    label: String(label || 'Mobile').slice(0, 64),
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    expiresAt: null,
  };
  if (!Array.isArray(user.apiTokens)) user.apiTokens = [];
  user.apiTokens = user.apiTokens.slice(-19);
  user.apiTokens.push(tokenRecord);
  saveDb(db);
  res.status(201).json({
    token: rawToken,
    tokenId: tokenRecord.id,
    label: tokenRecord.label,
    createdAt: tokenRecord.createdAt,
    user: publicUser(user, db),
  });
});

// GET /api/auth/tokens — list this user's active API tokens (hashes hidden)
app.get('/api/auth/tokens', requireAuth, (req, res) => {
  const db = loadDb();
  const user = (db.users || []).find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const tokens = asArray(user.apiTokens).map((t) => ({
    id: t.id,
    label: t.label,
    createdAt: t.createdAt,
    lastUsedAt: t.lastUsedAt,
    expiresAt: t.expiresAt,
  }));
  res.json({ tokens });
});

// DELETE /api/auth/tokens/:id — revoke a specific API token
app.delete('/api/auth/tokens/:id', requireAuth, (req, res) => {
  const db = loadDb();
  const user = (db.users || []).find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const before = (user.apiTokens || []).length;
  user.apiTokens = (user.apiTokens || []).filter((t) => t.id !== req.params.id);
  if (user.apiTokens.length === before) return res.status(404).json({ error: 'Token not found' });
  saveDb(db);
  res.json({ message: 'Token revoked.' });
});

// DELETE /api/auth/tokens — revoke all tokens (e.g. on logout from all devices)
app.delete('/api/auth/tokens', requireAuth, (req, res) => {
  const db = loadDb();
  const user = (db.users || []).find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.apiTokens = [];
  saveDb(db);
  res.json({ message: 'All API tokens revoked.' });
});

app.put('/api/profile', requireAuth, (req, res) => {
  const firstName = String(req.body.firstName || '').trim();
  const middleName = String(req.body.middleName || '').trim();
  const lastName = String(req.body.lastName || '').trim();
  const classYear = String(req.body.classYear || '').trim();
  const major = String(req.body.major || '').trim();
  const profilePictureValidation = validateProfilePictureDataUrl(req.body.profilePictureDataUrl);
  const socialLinksValidation = normalizeSocialLinks(req.body.socialLinks || {});
  if (!profilePictureValidation.valid) {
    return res.status(400).json({ error: profilePictureValidation.error });
  }
  if (!socialLinksValidation.valid) {
    return res.status(400).json({ error: socialLinksValidation.error });
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
  user.socialLinks = socialLinksValidation.links;
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
    const references = request.riderId === user.id || (request.driverOffers || []).some((offer) => offer.driverId === user.id);
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
    if (references) persistRideRequest(request);
  });

  (db.trackingTrips || []).forEach((trip) => {
    if (trip.ownerId === user.id) {
      trip.ownerFirstName = user.firstName;
      persistTrackingTrip(trip);
    }
  });

  saveDb(db);
  res.json(publicUser(user, db));
});

app.post('/api/profile/invite-friend', requireAuth, sensitiveWriteRateLimit, (req, res) => {
  const friendEmail = normalizeEmail(req.body.email);
  if (!friendEmail) {
    return res.status(400).json({ error: 'Enter your friend\'s email address.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(friendEmail)) {
    return res.status(400).json({ error: 'Enter a valid friend email address.' });
  }

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (friendEmail === normalizeEmail(user.email)) {
    return res.status(400).json({ error: 'Enter a friend\'s email instead of your own.' });
  }

  user.friendInvites = normalizeFriendInvites(user.friendInvites);
  user.friendInvites.push({
    id: uuidv4(),
    email: friendEmail,
    invitedAt: new Date().toISOString(),
  });
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  sendFriendInviteEmail(user, friendEmail, db);
  res.json({
    message: 'Invite sent to ' + friendEmail + '.',
    inviteCount: user.friendInvites.length,
  });
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

app.put('/api/profile/notifications', requireAuth, (req, res) => {
  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.notificationPreferences = normalizeNotificationPreferences(req.body.notificationPreferences || {}, user);
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json({
    message: user.serviceApproved === true
      ? 'Notification preferences saved.'
      : 'Notification preferences saved. Weekly recaps are off while you are on the waitlist.',
    notificationPreferences: user.notificationPreferences,
  });
});

app.put('/api/profile/waitlist-intent', requireAuth, sensitiveWriteRateLimit, (req, res) => {
  const waitlistIntent = normalizeWaitlistIntent(req.body.waitlistIntent);
  if (!waitlistIntent) {
    return res.status(400).json({ error: 'Choose driver, rider, or not sure yet.' });
  }

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.waitlistIntent = waitlistIntent;
  user.waitlistIntentUpdatedAt = new Date().toISOString();
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json(publicUser(user, db));
});

async function destroyAllUserSessions(userId) {
  if (USE_POSTGRES) {
    await pgPool.query("DELETE FROM linkup_sessions WHERE sess->>'userId' = $1", [userId]);
    return;
  }
  const sessions = sessionStore.readSessions();
  for (const [sid, sess] of Object.entries(sessions)) {
    if (sess?.userId === userId) delete sessions[sid];
  }
  sessionStore.writeSessions(sessions);
}

app.delete('/api/profile/account', requireAuth, sensitiveWriteRateLimit, async (req, res) => {
  const password = String(req.body.password || '');
  const confirmText = String(req.body.confirmText || '').trim().toUpperCase();
  if (!password) {
    return res.status(400).json({ error: 'Enter your password to delete your account.' });
  }
  if (confirmText !== 'DELETE') {
    return res.status(400).json({ error: 'Type DELETE to confirm account deletion.' });
  }

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user || isDeletedUser(user)) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (isAdminUser(user)) {
    return res.status(400).json({ error: 'Admin accounts cannot be deleted from profile settings.' });
  }
  const passwordMatches = user.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Password is incorrect.' });
  }

  anonymizeDeletedUser(db, user);
  saveDb(db);
  if (USE_POSTGRES) await dbWritePromise;
  await destroyAllUserSessions(user.id);
  req.session.destroy((error) => {
    if (error) return res.status(500).json({ error: 'Account data was deleted, but the session could not be closed.' });
    res.clearCookie('linkup.sid');
    res.json({ message: 'Your LinkUp account has been deleted.' });
  });
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

app.post('/api/profile/school-transfer/request', requireAuth, (req, res) => {
  const newEmail = normalizeEmail(req.body.email);
  if (!newEmail) {
    return res.status(400).json({ error: 'Enter your new university email address' });
  }
  if (!isUniversityEmail(newEmail)) {
    return res.status(400).json({ error: 'Please use a valid university email address for your new school' });
  }

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (isAdminUser(user)) {
    return res.status(400).json({ error: 'Admin accounts do not use school transfer requests' });
  }
  if (newEmail === user.email) {
    return res.status(400).json({ error: 'That is already your current account email' });
  }
  if ((db.users || []).some((entry) => entry.id !== user.id && normalizeEmail(entry.email) === newEmail)) {
    return res.status(400).json({ error: 'That email is already associated with another LinkUp account' });
  }

  const domain = getEmailDomain(newEmail);
  const requestedUniversity = String(req.body.university || '').trim();
  if (requestedUniversity.length > 120) {
    return res.status(400).json({ error: 'College name must be 120 characters or fewer' });
  }
  const university = extractUniversityFromEmail(newEmail) || requestedUniversity || getUniversityInfoFromDomain(domain).name;
  const code = generateVerificationCode();
  user.pendingSchoolTransfer = {
    email: newEmail,
    universityDomain: domain,
    university,
    codeHash: hashToken(code),
    expiresAt: Date.now() + 1000 * 60 * 10,
    attempts: 0,
    requestedAt: new Date().toISOString(),
  };
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  sendSchoolTransferVerificationCode(user, newEmail, code, university);
  res.json({
    message: 'We sent a 6-digit transfer code to your new school email.',
    pendingSchoolTransfer: publicUser(user, db).pendingSchoolTransfer,
  });
});

app.post('/api/profile/school-transfer/verify', requireAuth, (req, res) => {
  const code = String(req.body.code || '').trim();
  if (!code) return res.status(400).json({ error: 'Enter the 6-digit transfer code' });

  const db = normalizeUserAccess(loadDb());
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const pending = user.pendingSchoolTransfer;
  if (!pending?.email || !pending.codeHash) {
    return res.status(400).json({ error: 'No school transfer is pending' });
  }
  if (pending.expiresAt <= Date.now()) {
    delete user.pendingSchoolTransfer;
    saveDb(db);
    return res.status(400).json({ error: 'Transfer code expired. Request a new code.' });
  }
  if ((pending.attempts || 0) >= 5) {
    delete user.pendingSchoolTransfer;
    saveDb(db);
    return res.status(429).json({ error: 'Too many transfer attempts. Request a new code.' });
  }
  if (hashToken(code) !== pending.codeHash) {
    pending.attempts = (pending.attempts || 0) + 1;
    saveDb(db);
    return res.status(400).json({ error: 'Invalid transfer code' });
  }
  if ((db.users || []).some((entry) => entry.id !== user.id && normalizeEmail(entry.email) === pending.email)) {
    return res.status(400).json({ error: 'That email is already associated with another LinkUp account' });
  }

  const previousEmail = user.email;
  const previousUniversity = getUserUniversityDisplay(user);
  const wasServiceApproved = user.serviceApproved === true;
  const now = new Date().toISOString();
  user.emailHistory = Array.isArray(user.emailHistory) ? user.emailHistory : [];
  user.emailHistory.push({
    email: previousEmail,
    university: previousUniversity,
    universityDomain: user.universityDomain || getEmailDomain(previousEmail),
    changedAt: now,
    reason: 'school_transfer',
  });
  user.email = pending.email;
  user.universityDomain = pending.universityDomain || getEmailDomain(pending.email);
  user.university = pending.university || getUniversityInfoFromDomain(user.universityDomain).name;
  user.emailVerified = true;
  user.serviceApproved = !WAITLIST_MODE && Boolean(SUPPORTED_UNIVERSITY_DOMAINS[user.universityDomain]);
  user.waitlistedAt = user.serviceApproved ? null : (user.waitlistedAt || now);
  if (!wasServiceApproved && user.serviceApproved && !user.schoolApprovedEmailSentAt) {
    user.schoolApprovedEmailSentAt = now;
    sendSchoolApprovedEmail(user, user.university);
  }
  user.manuallyWaitlistedAt = null;
  user.schoolTransferredAt = now;
  delete user.pendingSchoolTransfer;
  user.updatedAt = now;

  (db.rides || []).forEach((ride) => {
    if (ride.driverId === user.id) {
      ride.university = user.university;
    }
    (ride.passengers || []).forEach((passenger) => {
      if (passenger.studentId === user.id) passenger.email = user.email;
    });
  });
  (db.rideRequests || []).forEach((request) => {
    const references = request.riderId === user.id || (request.driverOffers || []).some((offer) => offer.driverId === user.id);
    if (request.riderId === user.id) {
      request.riderEmail = user.email;
      request.university = user.university;
    }
    (request.driverOffers || []).forEach((offer) => {
      if (offer.driverId === user.id) offer.email = user.email;
    });
    if (references) persistRideRequest(request);
  });
  addAdminAuditEntry(db, null, 'completed_school_transfer', 'user', user, {
    targetLabel: user.email,
    previousEmail,
    previousUniversity,
    newUniversity: user.university,
  });
  saveDb(db);
  res.json({
    message: 'School transfer verified. Your LinkUp account has been updated.',
    user: publicUser(user, db),
  });
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
app.get('/api/profile/payout/onboarding/start', requireAuth, requireServiceAccess, startPayoutOnboarding);

app.post('/api/stripe/account-session', requireAuth, requireServiceAccess, async (req, res) => {
  const provider = getPayoutProviderName();
  if (!requireStripeBackedProvider(provider, res, 'account session')) return;
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
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
        capabilities: { transfers: { requested: true } },
        metadata: { linkupUserId: user.id },
      });
      accountId = account.id;
      setStripeConnectedAccount(user, account);
      saveDb(db);
    }
    const session = await stripe.accountSessions.create({
      account: accountId,
      components: {
        account_onboarding: { enabled: true },
        payouts: { enabled: true },
      },
    });
    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error('Stripe account session error:', err);
    const message = getPublicStripeErrorMessage(err, 'Unable to create Stripe session. Please try again.');
    res.status(502).json({ error: message });
  }
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

// Clears any stale session cookie — called before sign-in to avoid orphaned-cookie errors
app.post('/api/auth/clear-session', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.post('/api/waitlist/join', (req, res) => {
  const email = normalizeEmail(req.body.email);
  const firstName = String(req.body.firstName || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const waitlistIntent = normalizeWaitlistIntent(req.body.waitlistIntent) || 'unsure';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Enter a valid university email address' });
  }

  if (!isUniversityEmail(email)) {
    return res.status(400).json({ error: 'Please use a valid university email address' });
  }

  const db = normalizeUserAccess(loadDb());
  const existingUser = (db.users || []).find((user) => user.email === email);
  if (existingUser) {
    return res.json({
      joined: false,
      accountExists: true,
      message: existingUser.serviceApproved === true
        ? 'That email already has a LinkUp account. Sign in to continue.'
        : 'That email is already on the LinkUp waitlist. Sign in to view your spot.',
    });
  }

  const universityDomain = getEmailDomain(email);
  const schoolInfo = getUniversityInfoFromDomain(universityDomain);
  const knownDomain = isKnownUniversityDomain(universityDomain);
  const now = new Date().toISOString();
  db.waitlistLeads = asArray(db.waitlistLeads);
  let lead = db.waitlistLeads.find((entry) => normalizeEmail(entry.email) === email);

  if (lead) {
    lead.firstName = firstName || lead.firstName || '';
    lead.waitlistIntent = waitlistIntent;
    lead.universityDomain = universityDomain;
    lead.university = knownDomain ? schoolInfo.name : universityDomain;
    lead.updatedAt = now;
  } else {
    lead = {
      id: uuidv4(),
      firstName,
      email,
      university: knownDomain ? schoolInfo.name : universityDomain,
      universityDomain,
      waitlistIntent,
      createdAt: now,
      updatedAt: now,
    };
    db.waitlistLeads.push(lead);
  }

  saveDb(db);
  res.json({
    joined: true,
    message: 'You are on the waitlist. Create an account now if you want to reserve your member number.',
    lead: {
      firstName: lead.firstName,
      email: lead.email,
      university: lead.university,
      universityDomain: lead.universityDomain,
      waitlistIntent: lead.waitlistIntent,
    },
  });
});

app.get('/api/leaderboard/schools', requireAuth, (req, res) => {
  const db = normalizeUserAccess(loadDb());
  const schoolCounts = new Map();
  const leaderboardUsers = activeUsers(db).filter((user) => !isAdminUser(user));

  leaderboardUsers.forEach((user) => {
    const domain = user.universityDomain || getEmailDomain(user.email);
    const schoolInfo = getUniversityInfoFromDomain(domain);
    const school = user.university || schoolInfo.name || 'Unknown University';
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
    if (isAdminUser(driver)) return;
    const domain = driver?.universityDomain || getEmailDomain(driver?.email) || '';
    const schoolInfo = getUniversityInfoFromDomain(domain);
    const school = ride.university || driver?.university || schoolInfo.name || 'Unknown University';
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

  res.json({ schools, mileageSchools, totalUsers: leaderboardUsers.length, totalMilesSaved });
});

app.get('/api/leaderboard/waitlist-schools', (req, res) => {
  const db = normalizeUserAccess(loadDb());
  const schoolCounts = new Map();
  const needsReviewSchools = new Map();
  const seenEmails = new Set();

  function addWaitlistEntry(entry) {
    const email = normalizeEmail(entry.email);
    if (!email || seenEmails.has(email)) return;
    seenEmails.add(email);

    const domain = entry.universityDomain || getEmailDomain(email);
    const knownDomain = isKnownUniversityDomain(domain);
    const schoolInfo = getUniversityInfoFromDomain(domain);
    const school = knownDomain ? (entry.university || schoolInfo.name || domain) : (domain || 'Unknown school');
    const key = domain || school;

    if (!schoolCounts.has(key)) {
      schoolCounts.set(key, {
        school,
        domain,
        city: knownDomain ? (schoolInfo?.city || '') : '',
        state: knownDomain ? (schoolInfo?.state || '') : '',
        location: knownDomain ? [schoolInfo.city, schoolInfo.state].filter(Boolean).join(', ') : '',
        userCount: 0,
        riderCount: 0,
        driverCount: 0,
        unsureCount: 0,
        serviceApproved: false,
        needsReview: !knownDomain,
      });
    }

    const schoolEntry = schoolCounts.get(key);
    schoolEntry.userCount += 1;
    const waitlistIntent = normalizeWaitlistIntent(entry.waitlistIntent) || 'unsure';
    if (waitlistIntent === 'driver') schoolEntry.driverCount += 1;
    else if (waitlistIntent === 'rider') schoolEntry.riderCount += 1;
    else schoolEntry.unsureCount += 1;
    schoolEntry.needsReview = schoolEntry.needsReview || !knownDomain;
    if (!knownDomain && domain) {
      needsReviewSchools.set(domain, {
        domain,
        userCount: (needsReviewSchools.get(domain)?.userCount || 0) + 1,
      });
    }
  }

  activeUsers(db)
    .filter((user) => !isAdminUser(user) && user.serviceApproved !== true)
    .forEach(addWaitlistEntry);
  asArray(db.waitlistLeads).forEach(addWaitlistEntry);

  const schools = Array.from(schoolCounts.values()).sort((a, b) => {
    if (b.userCount !== a.userCount) return b.userCount - a.userCount;
    return a.school.localeCompare(b.school);
  });
  const needsReview = Array.from(needsReviewSchools.values()).sort((a, b) => {
    if (b.userCount !== a.userCount) return b.userCount - a.userCount;
    return a.domain.localeCompare(b.domain);
  });

  res.json({ schools, totalUsers: seenEmails.size, needsReviewSchools: needsReview });
});

// The public guided demo uses the same browser map as production but has no
// authenticated session. Keep this browser key HTTP-referrer restricted.
app.get('/api/demo/config/google-maps-key', (req, res) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return res.status(503).json({ error: 'Google Maps API key is not configured' });
  }
  res.json({ apiKey: GOOGLE_MAPS_API_KEY });
});

// Get Google Maps API key — requires authentication to prevent key harvesting
app.get('/api/config/google-maps-key', requireAuth, (req, res) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return res.status(503).json({ error: 'Google Maps API key is not configured' });
  }
  res.json({ apiKey: GOOGLE_MAPS_API_KEY });
});

app.get('/api/config/features', (req, res) => {
  res.json({ bites: LINKUP_BITES_ENABLED, social: LINKUP_SOCIAL_ENABLED });
});

app.post('/api/trips/track/start', requireAuth, requireServiceAccess, (req, res) => {
  const trustedEmail = normalizeEmail(req.body.trustedEmail);
  if (trustedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trustedEmail)) {
    return res.status(400).json({ error: 'Enter a valid email address for your trusted person' });
  }

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

  persistTrackingTrip(trip);
  if (trustedEmail) {
    const trackingText = 'Hi,\n\n' + (user.firstName || 'A LinkUp member') + ' wants to share their live LinkUp trip location with you for safety. Open this secure link to view this trip only while sharing is active:\n' + viewerUrl + '\n\nThis link expires when the trip ends or after 8 hours.\n\n- LinkUp';
    sendAuthEmail(
      trustedEmail,
      user.firstName + ' invited you to track their LinkUp trip',
      trackingText,
      renderLinkUpEmail({
        eyebrow: 'Live tracking',
        title: `${user.firstName || 'A LinkUp member'} invited you to track their trip`,
        intro: `${escapeHtml(user.firstName || 'A LinkUp member')} wants to share their live LinkUp trip location with you for safety.`,
        bodyHtml: '<p style="margin:0;font-size:14px;line-height:1.65;color:#54636a;">This secure link only works while sharing is active. It expires when the trip ends or after 8 hours.</p>',
        cta: { href: viewerUrl, label: 'View trip' },
      })
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
    persistTrackingTrip(trip);
    return res.status(410).json({ error: 'This tracking link has expired. Restart sharing to send a new invite.' });
  }

  trip.trustedEmail = trustedEmail;
  trip.updatedAt = new Date().toISOString();
  persistTrackingTrip(trip);

  if (!trip.viewerUrl) {
    return res.status(400).json({ error: 'This tracking trip was started before invite updates were supported. Copy the tracking link and send it manually, or restart sharing.' });
  }
  const trackingText = 'Hi,\n\n' + (user.firstName || 'A LinkUp member') + ' wants to share their live LinkUp trip location with you for safety. Open this secure link to view this trip only while sharing is active:\n' + trip.viewerUrl + '\n\nThis link expires when the trip ends or after 8 hours.\n\n- LinkUp';
  sendAuthEmail(
    trustedEmail,
    user.firstName + ' invited you to track their LinkUp trip',
    trackingText,
    renderLinkUpEmail({
      eyebrow: 'Live tracking',
      title: `${user.firstName || 'A LinkUp member'} invited you to track their trip`,
      intro: `${escapeHtml(user.firstName || 'A LinkUp member')} wants to share their live LinkUp trip location with you for safety.`,
      bodyHtml: '<p style="margin:0;font-size:14px;line-height:1.65;color:#54636a;">This secure link only works while sharing is active. It expires when the trip ends or after 8 hours.</p>',
      cta: { href: trip.viewerUrl, label: 'View trip' },
    })
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
    persistTrackingTrip(trip);
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
  persistTrackingTrip(trip);

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
  persistTrackingTrip(trip);
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
    persistTrackingTrip(trip);
    return res.status(410).json({ error: 'This tracking link has expired' });
  }

  const routeWasAdded = refreshTrackingTripRoute(db, trip);
  if (routeWasAdded) {
    trip.updatedAt = new Date().toISOString();
    persistTrackingTrip(trip);
  }
  res.json(publicTrackingTrip(trip));
});

app.post('/api/safety/recordings', requireAuth, requireServiceAccess, (req, res) => {
  const audioBase64 = String(req.body.audioBase64 || '').trim();
  const mimeType = String(req.body.mimeType || '').trim().slice(0, 80);
  const durationMs = Math.max(0, Math.min(30 * 60 * 1000, Number(req.body.durationMs || 0)));
  const consentAcknowledged = req.body.consentAcknowledged === true;
  const noticeShown = req.body.noticeShown === true;

  // Ride participants acknowledge Safety Mode in the UI and policy flow; keep the
  // endpoint available to both the driver and booked riders on the active ride.
  if (!audioBase64 || audioBase64.length > SAFETY_RECORDING_MAX_BASE64_CHARS || !/^[A-Za-z0-9+/=]+$/.test(audioBase64)) {
    return res.status(400).json({ error: 'Safety recording is missing or too large' });
  }
  if (!/^audio\//.test(mimeType)) {
    return res.status(400).json({ error: 'Upload an audio recording file' });
  }

  const db = loadDb();
  const user = (db.users || []).find((entry) => entry.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const ride = getSafetyRideForUser(db, user.id);
  if (!ride) {
    return res.status(400).json({ error: 'Safety recordings must be connected to an active or upcoming ride' });
  }

  db.safetyRecordings = db.safetyRecordings || [];
  const createdAtMs = Date.now();
  const recording = {
    id: uuidv4(),
    ownerId: user.id,
    ownerName: getUserDisplayName(user),
    ownerEmail: user.email || '',
    rideId: ride.id,
    rideOrigin: ride.origin || '',
    rideDestination: ride.destination || '',
    rideDate: ride.date || '',
    rideTime: ride.time || '',
    mimeType,
    audioBase64,
    durationMs,
    consentAcknowledged,
    noticeShown,
    status: 'stored',
    createdAt: new Date(createdAtMs).toISOString(),
    expiresAt: createdAtMs + SAFETY_RECORDING_RETENTION_MS,
  };
  db.safetyRecordings.push(recording);
  saveDb(db);
  res.status(201).json({
    message: 'Safety recording saved. LinkUp will retain it for 30 days and then automatically delete it.',
    recordingId: recording.id,
    expiresAt: recording.expiresAt,
  });
});

app.post('/api/safety/incidents', requireAuth, requireServiceAccess, (req, res) => {
  const reason = String(req.body.reason || '').trim().slice(0, 80);
  const details = String(req.body.details || '').trim().slice(0, 1000);
  const doorSafetyConfirmed = req.body.doorSafetyConfirmed === true;
  const doorSafetyIssue = req.body.doorSafetyIssue === true;
  const safetyRecordingId = String(req.body.safetyRecordingId || '').trim();

  if (!reason) {
    return res.status(400).json({ error: 'Add a short reason for the safety note' });
  }

  const db = loadDb();
  const reporter = (db.users || []).find((user) => user.id === req.session.userId);
  if (!reporter) return res.status(404).json({ error: 'Reporter not found' });
  const ride = getSafetyRideForUser(db, reporter.id);
  if (!ride) {
    return res.status(400).json({ error: 'Safety notes must be connected to an active or upcoming ride' });
  }
  const reportedUser = getSafetyRideCounterparty(db, ride, reporter.id);
  if (!reportedUser?.id) {
    return res.status(400).json({ error: 'No other ride participant is available for this safety note yet' });
  }

  db.userReports = db.userReports || [];
  const safetyDetails = [
    details,
    doorSafetyIssue ? 'Door safety issue reported: participant could not confirm the door opens from inside or child lock is off.' : '',
    doorSafetyConfirmed ? 'Door safety check confirmed by participant.' : '',
    safetyRecordingId ? `Safety recording ID: ${safetyRecordingId}` : '',
  ].filter(Boolean).join('\n\n');
  const report = {
    id: uuidv4(),
    type: 'safety_incident',
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
    details: safetyDetails,
    safetyRecordingId,
    doorSafetyIssue,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  db.userReports.push(report);
  saveDb(db);
  res.status(201).json({ message: 'Safety note sent to LinkUp for review.', reportId: report.id });
});


app.get('/api/ride-requests', requireAuth, requireServiceAccess, (req, res) => {
  const db = expireUnclaimedRideRequests(loadDb());
  const userId = req.session.userId;
  res.json((db.rideRequests || [])
    .filter((request) => isRideRequestVisibleToUser(db, request, userId))
    .map((request) => publicRideRequest(request, userId)));
});

app.post('/api/ride-requests', requireAuth, requireServiceAccess, (req, res) => {
  const { origin, destination, originLat, originLng, destinationLat, destinationLng, pickupRadiusMiles, dropoffRadiusMiles, date, time, riderCount, willingToPay, shareRideWithOthers, sameGenderDriverOnly, sameSchoolDriverOnly, noSmoking, estimatedDurationMinutes, distanceMiles, notes, hideDestination } = req.body;
  const eventName = String(req.body.eventName || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  const requestType = req.body.requestType === 'moving' ? 'moving' : 'ride';
  const isMovingRequest = requestType === 'moving';
  const movingSize = isMovingRequest ? String(req.body.movingSize || 'Small').trim() : '';
  if (!origin || !destination || !date || !time || willingToPay === undefined) {
    return res.status(400).json({ error: 'Missing trip request information' });
  }
  if (!isMovingRequest && !riderCount) {
    return res.status(400).json({ error: 'Missing trip request information' });
  }
  let movingPhotoDataUrl = '';
  if (isMovingRequest) {
    const rawPhoto = String(req.body.movingPhotoDataUrl || '').trim();
    if (!rawPhoto) {
      return res.status(400).json({ error: 'A photo of your items is required for moving requests' });
    }
    const photoMatch = rawPhoto.match(/^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!photoMatch) {
      return res.status(400).json({ error: 'Photo must be a PNG, JPG, or WebP image' });
    }
    const byteLength = Buffer.byteLength(photoMatch[2], 'base64');
    if (byteLength > 2 * 1024 * 1024) {
      return res.status(400).json({ error: 'Photo must be 2 MB or smaller' });
    }
    const buf = Buffer.from(photoMatch[2], 'base64');
    const mime = photoMatch[1].toLowerCase();
    const okPng = mime === 'image/png' && buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
    const okJpeg = (mime === 'image/jpeg' || mime === 'image/jpg') && buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    const okWebp = mime === 'image/webp' && buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP';
    if (!okPng && !okJpeg && !okWebp) {
      return res.status(400).json({ error: 'Photo data does not match a supported image type' });
    }
    movingPhotoDataUrl = rawPhoto;
  }
  if (String(origin).length > 200 || String(destination).length > 200) {
    return res.status(400).json({ error: 'Location names must be 200 characters or fewer' });
  }
  if (notes && String(notes).length > 500) {
    return res.status(400).json({ error: 'Notes must be 500 characters or fewer' });
  }

  if (!isValidTripDateTime(date, time)) {
    return res.status(400).json({ error: 'Enter a valid request date and time' });
  }

  const willingToPayCents = Math.round(Number(willingToPay) * 100);
  if (!Number.isInteger(willingToPayCents) || willingToPayCents < 50) {
    return res.status(400).json({ error: 'Offer amount must be at least $0.50' });
  }
  const riderCountNumber = isMovingRequest ? 1 : Number(riderCount);
  if (!isMovingRequest && (!Number.isInteger(riderCountNumber) || riderCountNumber < 1 || riderCountNumber > 7)) {
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
    eventName,
    originLat: parsedOriginLat,
    originLng: parsedOriginLng,
    destinationLat: parsedDestinationLat,
    destinationLng: parsedDestinationLng,
    pickupRadiusMiles: parsedPickupRadiusMiles,
    dropoffRadiusMiles: parsedDropoffRadiusMiles,
    distanceMiles: parsedDistanceMiles,
    date,
    time,
    requestType,
    movingSize,
    movingPhotoDataUrl,
    riderCount: riderCountNumber,
    willingToPayCents,
    estimatedDurationMinutes: sanitizeDurationMinutes(estimatedDurationMinutes),
    hideDestination: hideDestination !== false,
    shareRideWithOthers: isMovingRequest ? false : Boolean(shareRideWithOthers),
    sameGenderDriverOnly: Boolean(sameGenderDriverOnly),
    sameSchoolDriverOnly: Boolean(sameSchoolDriverOnly),
    noSmoking: isMovingRequest ? false : Boolean(noSmoking),
    notes: notes || '',
    driverOffers: [],
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  const conflict = findUserScheduleConflict(db, rider.id, request);
  if (conflict) {
    return res.status(400).json({ error: 'This request overlaps with another ride you are already driving, riding, or requesting: ' + describeTripTime(conflict) });
  }

  persistRideRequest(request);
  notifyRideAlertSubscribers(db, rider, request, 'request');
  saveDb(db);
  res.json(publicRideRequest(request, rider.id));
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
  persistRideRequest(request);
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
    referenceId: createRideReference(db),
    sourceRequestId: request.id,
    sharedRequestRide: true,
    seatingChartUnavailable: true,
    driverId: driver.id,
    driverFirstName: driver.firstName,
    driverLastName: driver.lastName,
    driverGender: driver.gender || '',
    sameGenderOnly: false,
    sameSchoolOnly: Boolean(request.sameSchoolDriverOnly),
    noSmoking: Boolean(request.noSmoking),
    university: driver.university,
    origin: request.origin,
    destination: request.destination,
    eventName: request.eventName || '',
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
  notifyRideAlertSubscribers(db, driver, ride, 'ride');
  saveDb(db);
  res.json(rideForUser(ride, req.session.userId, db));
});

app.get('/api/rides', requireAuth, requireServiceAccess, (req, res) => {
  const db = loadDb();
  res.json((db.rides || [])
    .filter((ride) => isRideBrowseVisibleToUser(db, ride, req.session.userId))
    .map((ride) => rideForUser(ride, req.session.userId, db)));
});

app.get('/api/events', requireAuth, requireServiceAccess, (req, res) => {
  const db = loadDb();
  const events = new Map();
  (db.rides || [])
    .filter((ride) => ride.eventName && isRideBrowseVisibleToUser(db, ride, req.session.userId))
    .forEach((ride) => {
      const name = String(ride.eventName || '').trim();
      const venue = String(ride.destination || '').trim();
      const key = [name.toLowerCase(), venue.toLowerCase(), String(ride.date || '')].join('|');
      const current = events.get(key) || {
        id: crypto.createHash('sha256').update(key).digest('hex').slice(0, 16),
        name,
        venue,
        lat: Number(ride.destinationLat),
        lng: Number(ride.destinationLng),
        date: ride.date || '',
        time: ride.time || '',
        rideCount: 0,
      };
      current.rideCount += 1;
      if (String(ride.time || '') < String(current.time || '')) current.time = ride.time || current.time;
      events.set(key, current);
    });
  res.json([...events.values()].sort((a, b) => {
    const aTime = new Date(`${a.date}T${a.time || '23:59'}`).getTime();
    const bTime = new Date(`${b.date}T${b.time || '23:59'}`).getTime();
    return aTime - bTime;
  }));
});

app.post('/api/rides', requireAuth, requireServiceAccess, (req, res) => {
  const { origin, destination, originLat, originLng, destinationLat, destinationLng, pickupRadiusMiles, dropoffRadiusMiles, date, time, hasReturnRide, returnDate, returnTime, sameGenderOnly, sameSchoolOnly, seatsAvailable, price, parkingFee, carMaker, carModel, carColor, licensePlate, termsAccepted, estimatedDurationMinutes, distanceMiles, notes } = req.body;
  const eventName = String(req.body.eventName || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  const rideProviderType = ['personal_car', 'rideshare_service', 'moving_service'].includes(req.body.rideProviderType) ? req.body.rideProviderType : '';
  const isRideshareService = rideProviderType === 'rideshare_service';
  const isMovingService = rideProviderType === 'moving_service';
  const rideshareService = String(req.body.rideshareService || '').trim();
  const rideshareSeatCount = Number(req.body.rideshareSeatCount);
  const movingVehicleType = isMovingService ? String(req.body.movingVehicleType || '').trim() : '';
  const movingCapacity = isMovingService ? String(req.body.movingCapacity || 'Small').trim() : '';
  const movingLoadingHelp = isMovingService ? Boolean(req.body.movingLoadingHelp) : false;
  const movingFurniture = isMovingService ? Boolean(req.body.movingFurniture) : false;
  const vehicleSeatCount = normalizeVehicleSeatCount(req.body.vehicleSeatCount);
  const availableSeatIds = normalizeSeatIds(req.body.availableSeatIds, vehicleSeatCount);
  if (!origin || !destination || !date || !time || !rideProviderType || price === undefined || originLat === undefined || originLng === undefined || destinationLat === undefined || destinationLng === undefined) {
    return res.status(400).json({ error: 'Missing ride information' });
  }
  if (!isRideshareService && !isMovingService && (!carMaker || !carModel || !carColor || !licensePlate)) {
    return res.status(400).json({ error: 'Personal car rides require vehicle information' });
  }
  if (!isRideshareService && !isMovingService && !availableSeatIds.length) {
    return res.status(400).json({ error: 'Select at least one available passenger seat' });
  }
  if (isRideshareService && !rideshareService) {
    return res.status(400).json({ error: 'Choose the rideshare service for this ride' });
  }
  if (isRideshareService && (!Number.isInteger(rideshareSeatCount) || rideshareSeatCount < 1 || rideshareSeatCount > 7)) {
    return res.status(400).json({ error: 'Rideshare service rides must have 1 to 7 available rider spots' });
  }
  if (isMovingService && !movingVehicleType) {
    return res.status(400).json({ error: 'Select a vehicle type for your moving service' });
  }
  if (termsAccepted !== true) {
    return res.status(400).json({ error: 'You must agree to the driver terms and conditions before listing a ride' });
  }
  if (req.body.driverDisclaimerAccepted !== true) {
    return res.status(400).json({ error: 'Confirm you have a valid driver\'s license and appropriate insurance before listing a ride' });
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
  const parkingFeeCents = Math.round(Number(parkingFee || 0) * 100);
  if (!Number.isInteger(parkingFeeCents) || parkingFeeCents < 0) {
    return res.status(400).json({ error: 'Parking / airport fee cannot be negative' });
  }
  if (parkingFeeCents > 50000) {
    return res.status(400).json({ error: 'Parking / airport fee must be $500 or less' });
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
    referenceId: createRideReference(db),
    driverId: driver.id,
    driverFirstName: driver.firstName,
    driverLastName: driver.lastName,
    driverGender: driver.gender || '',
    sameGenderOnly: Boolean(sameGenderOnly),
    sameSchoolOnly: Boolean(sameSchoolOnly),
    university: driver.university,
    origin,
    destination,
    eventName,
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
    movingVehicleType,
    movingCapacity,
    movingLoadingHelp,
    movingFurniture,
    seatingChartUnavailable: isRideshareService || isMovingService,
    sharedSeatCapacity: isRideshareService ? rideshareSeatCount : (isMovingService ? 1 : null),
    vehicleSeatCount: (isRideshareService || isMovingService) ? 0 : vehicleSeatCount,
    availableSeatIds: (isRideshareService || isMovingService) ? [] : availableSeatIds,
    seatsAvailable: isRideshareService ? rideshareSeatCount : (isMovingService ? 1 : availableSeatIds.length),
    priceCents,
    parkingFeeCents,
    carMaker: (isRideshareService || isMovingService) ? '' : String(carMaker).trim(),
    carModel: (isRideshareService || isMovingService) ? '' : String(carModel).trim(),
    carColor: (isRideshareService || isMovingService) ? '' : String(carColor).trim(),
    licensePlate: (isRideshareService || isMovingService) ? '' : String(licensePlate).trim().toUpperCase(),
    termsAcceptedAt: new Date().toISOString(),
    notes: notes || '',
    passengers: [],
    completionPin: generateCompletionPin(),
    completionPinAttempts: 0,
    completionPinLockedUntil: null,
    completionConfirmedAt: null,
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
  sendReservationConfirmationEmail(db, student, {
    ridesToReserve: [{ ride, seatId, actualPickup, actualDropoff }],
  }, {
    expectedAmountCents: getRideChargeCents(ride),
    stripeAmountTotal: getRideChargeCents(ride),
  });
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

// Driver confirms trip completion by entering the rider's 6-digit PIN
app.post('/api/rides/:rideId/complete', requireAuth, requireServiceAccess, (req, res) => {
  const { rideId } = req.params;
  const pin = String(req.body.pin || '').trim();
  if (!/^\d{6}$/.test(pin)) {
    return res.status(400).json({ error: 'Enter the 6-digit code from your rider' });
  }

  const db = loadDb();
  const driver = (db.users || []).find((u) => u.id === req.session.userId);
  if (!driver) return res.status(404).json({ error: 'User not found' });

  const ride = (db.rides || []).find((r) => r.id === rideId);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  if (ride.driverId !== driver.id) return res.status(403).json({ error: 'Only the driver can confirm this trip' });
  if (!hasTripDeparted(ride)) return res.status(400).json({ error: 'The trip has not departed yet' });
  if (!ride.completionPin) return res.status(400).json({ error: 'This ride does not use completion codes' });
  if (ride.completionConfirmedAt) return res.json({ message: 'This trip is already confirmed. Your earnings are in your wallet.', alreadyConfirmed: true });

  // Brute-force protection: 5 wrong attempts → 30-minute lockout
  const now = Date.now();
  if (ride.completionPinLockedUntil && now < new Date(ride.completionPinLockedUntil).getTime()) {
    const minutesLeft = Math.ceil((new Date(ride.completionPinLockedUntil).getTime() - now) / 60000);
    return res.status(429).json({ error: `Too many wrong attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.` });
  }

  if (pin !== ride.completionPin) {
    ride.completionPinAttempts = (ride.completionPinAttempts || 0) + 1;
    if (ride.completionPinAttempts >= 5) {
      ride.completionPinLockedUntil = new Date(now + 30 * 60 * 1000).toISOString();
      ride.completionPinAttempts = 0;
      saveDb(db);
      return res.status(400).json({ error: 'Too many wrong attempts. Try again in 30 minutes.' });
    }
    const remaining = 5 - ride.completionPinAttempts;
    saveDb(db);
    return res.status(400).json({ error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` });
  }

  // Correct PIN — confirm all pending driver earnings for this ride
  ride.completionConfirmedAt = new Date().toISOString();
  ride.completionPinAttempts = 0;
  ride.completionPinLockedUntil = null;

  let confirmedCount = 0;
  (db.walletTransactions || []).forEach((t) => {
    if (t.type === 'driver_earning_credit' && t.rideId === rideId && t.userId === driver.id && t.needsCompletion && !t.confirmedAt) {
      t.confirmedAt = ride.completionConfirmedAt;
      confirmedCount++;
    }
  });

  saveDb(db);

  const seatWord = confirmedCount === 1 ? 'rider' : 'riders';
  const msg = confirmedCount
    ? `Trip confirmed! Earnings for ${confirmedCount} ${seatWord} are now available in your wallet.`
    : 'Trip confirmed. Your earnings are already available in your wallet.';
  res.json({ message: msg, confirmedCount });
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

app.post('/api/feedback', requireAuth, async (req, res) => {
  const category = String(req.body.category || 'General feedback').trim().slice(0, 60);
  const subject = String(req.body.subject || '').trim().slice(0, 120);
  const message = String(req.body.message || '').trim().slice(0, 2000);
  if (!message) return res.status(400).json({ error: 'Feedback message is required' });

  const db = loadDb();
  const user = (db.users || []).find((u) => u.id === req.session.userId);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  const emailSubject = `[LinkUp Feedback] ${category}${subject ? ` — ${subject}` : ''}`;
  const plainText = [
    `Category: ${category}`,
    subject ? `Subject: ${subject}` : '',
    `From: ${displayName} <${user.email}>`,
    `University: ${user.university || 'Unknown'}`,
    `Member #: ${user.memberNumber || 'N/A'}`,
    '',
    message,
  ].filter((l) => l !== null).join('\n');

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a2628;">
  <div style="background:#0c747a;border-radius:10px 10px 0 0;padding:18px 24px;">
    <h2 style="margin:0;color:#fff;font-size:18px;">LinkUp Feedback</h2>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">${escapeHtml(category)}</p>
  </div>
  <div style="border:1px solid #d0dfe2;border-top:none;border-radius:0 0 10px 10px;padding:24px;">
    ${subject ? `<p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#0c747a;">${escapeHtml(subject)}</p>` : ''}
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
      <tr><td style="padding:6px 12px 6px 0;color:#6b747a;white-space:nowrap;font-weight:700;">From</td><td style="padding:6px 0;">${escapeHtml(displayName)} &lt;${escapeHtml(user.email)}&gt;</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#6b747a;white-space:nowrap;font-weight:700;">University</td><td style="padding:6px 0;">${escapeHtml(user.university || 'Unknown')}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#6b747a;white-space:nowrap;font-weight:700;">Member #</td><td style="padding:6px 0;">${escapeHtml(String(user.memberNumber || 'N/A'))}</td></tr>
    </table>
    <div style="background:#f5fafb;border:1px solid #d0dfe2;border-radius:8px;padding:16px 18px;white-space:pre-wrap;font-size:14px;line-height:1.65;color:#1a2628;">${escapeHtml(message)}</div>
    <p style="margin:18px 0 0;font-size:12px;color:#8fa8ad;">Sent from LinkUp Profile → Send feedback</p>
  </div>
</body>
</html>`;

  const transporter = getMailTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({ from: EMAIL_FROM, to: SUPPORT_EMAIL, subject: emailSubject, text: plainText, html: htmlBody });
    } catch (err) {
      console.error('Feedback email failed:', err.message);
      writeEmailToOutbox(SUPPORT_EMAIL, emailSubject, plainText, err.message, htmlBody);
    }
  } else {
    writeEmailToOutbox(SUPPORT_EMAIL, emailSubject, plainText, 'SMTP not configured', htmlBody);
  }
  res.json({ ok: true });
});

app.post('/api/reports', requireAuth, requireServiceAccess, reportRateLimit, (req, res) => {
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
      paid: true,
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

function updateWalletTransactionByTransfer(db, transfer, eventType) {
  const transactions = asArray(db.walletTransactions);
  const tx = transactions.find((t) => t.providerTransferId === transfer.id
    || t.id === transfer.metadata?.linkupPayoutId);
  if (!tx) return false;
  if (eventType === 'transfer.reversed' || transfer.reversed) {
    tx.status = 'failed';
    tx.failedAt = tx.failedAt || new Date().toISOString();
    tx.failureReason = tx.failureReason || 'Transfer reversed by Stripe';
  } else {
    tx.status = 'posted';
    tx.postedAt = tx.postedAt || new Date().toISOString();
  }
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
      unit_amount: Math.max(50, getRideChargeCents(ride)),
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
    const expectedAmountCents = checkoutRides.reduce((sum, ride) => sum + getRideChargeCents(ride), 0);
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
      statement_descriptor: 'LINKUP RIDE',
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

app.post('/api/cart/create-embedded-checkout', requireAuth, requireServiceAccess, async (req, res) => {
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
    const expectedAmountCents = checkoutRides.reduce((sum, ride) => sum + getRideChargeCents(ride), 0);
    const applyWallet = req.body.applyWalletCredit !== false;
    const walletCreditCents = applyWallet ? getCheckoutWalletCreditCents(db, student.id, expectedAmountCents) : 0;
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
        sessionId: walletSessionId,
        walletCreditCents,
        amountDueCents,
      });
    }

    const lineItems = getCheckoutLineItems(checkoutRides);
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      line_items: lineItems,
      customer_email: student.email,
      return_url: APP_BASE_URL + '/?checkout=success&session_id={CHECKOUT_SESSION_ID}',
      payment_intent_data: {
        statement_descriptor: 'LINKUP RIDE',
        description: 'LinkUp ride reservation',
      },
      metadata: {
        linkupStudentId: student.id,
        linkupRideIds: checkoutRides.map((ride) => ride.id).join(','),
        paymentProvider: provider,
        walletCreditCents: String(walletCreditCents),
      },
    });

    db.checkoutSessions = db.checkoutSessions || [];
    db.checkoutSessions.push({
      id: session.id,
      provider,
      providerPaymentId: session.id,
      stripeSessionId: session.id,
      studentId: student.id,
      cartEntries: cartEntries.map((entry) => ({ ...entry })),
      expectedAmountCents,
      walletCreditCents,
      amountDueCents,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    saveDb(db);

    res.json({ provider, clientSecret: session.client_secret, sessionId: session.id, walletCreditCents, amountDueCents });
  } catch (err) {
    console.error('Stripe embedded checkout error:', err);
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

app.get('/api/notifications', requireAuth, requireCampusNetworkAccess, (req, res) => {
  const db = expireUnclaimedRideRequests(loadDb());
  const user = (db.users || []).find((entry) => entry.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const notifications = [];
  const now = Date.now();
  const rides = Array.isArray(db.rides) ? db.rides : [];
  const rideRequests = Array.isArray(db.rideRequests) ? db.rideRequests : [];
  const alertUserIds = normalizeRideAlertUserIds(user.rideAlertUserIds);
  const alertUsers = activeUsers(db).filter((entry) => alertUserIds.includes(entry.id) && !entry.suspendedAt && areUsersLinked(db, user.id, entry.id) && !areUsersBlocked(db, user.id, entry.id));
  const linkupRequests = normalizeLinkupRequests(user.linkupRequests);

  linkupRequests.forEach((request) => {
    const requester = activeUsers(db).find((entry) => entry.id === request.fromUserId && !entry.suspendedAt);
    if (!requester || areUsersBlocked(db, user.id, requester.id)) return;
    notifications.push({
      id: 'linkup-request-' + requester.id,
      type: 'linkup-request',
      typeLabel: 'LinkUp request',
      title: `${getUserDisplayName(requester)} wants to LinkUp`,
      body: 'Accept to become Links and get each other\'s ride/request updates.',
      timeLabel: requester.universityDomain || getEmailDomain(requester.email),
      createdAt: request.createdAt ? Date.parse(request.createdAt) || 0 : 0,
      action: 'accept-linkup',
      actionLabel: 'Accept',
      userId: requester.id,
    });
  });

  rides.forEach((ride) => {
    const interval = getTripInterval(ride);
    const isDriver = ride.driverId === user.id;
    const passenger = (ride.passengers || []).find((entry) => entry.studentId === user.id);
    if ((isDriver || passenger) && interval.end >= now - 60 * 60 * 1000) {
      notifications.push({
        id: 'ride-' + ride.id,
        type: 'ride',
        typeLabel: 'Ride',
        title: isDriver ? 'Upcoming ride you listed' : 'Upcoming reserved ride',
        body: [ride.origin, ride.destination].filter(Boolean).join(' to ') || 'Open your ride details.',
        timeLabel: describeTripTime(ride),
        createdAt: ride.date && ride.time ? new Date(`${ride.date}T${ride.time}`).getTime() || now : now,
        action: 'rides',
        actionLabel: 'View rides',
      });
    }
  });

  alertUsers.forEach((linkedUser) => {
    notifications.push({
      id: 'linkup-' + linkedUser.id,
      type: 'linkup',
      typeLabel: 'LinkUp',
      title: `Linked with ${getUserDisplayName(linkedUser)}`,
      body: 'You will get updates when this student posts rides or requests.',
      timeLabel: linkedUser.universityDomain || getEmailDomain(linkedUser.email),
      createdAt: linkedUser.createdAt ? Date.parse(linkedUser.createdAt) || 0 : 0,
      action: 'profile',
      actionLabel: 'View profile',
      userId: linkedUser.id,
    });
  });

  rides
    .filter((ride) => alertUserIds.includes(ride.driverId))
    .filter((ride) => areUsersLinked(db, user.id, ride.driverId))
    .filter((ride) => !areUsersBlocked(db, user.id, ride.driverId))
    .forEach((ride) => {
      const actor = (db.users || []).find((entry) => entry.id === ride.driverId);
      if (!actor || actor.id === user.id) return;
      notifications.push({
        id: 'ride-alert-' + ride.id,
        type: 'ride-alert',
        typeLabel: 'Ride alert',
        title: `${getUserDisplayName(actor)} posted a ride`,
        body: [ride.origin, ride.destination].filter(Boolean).join(' to ') || 'Open Browse to view it.',
        timeLabel: describeTripTime(ride),
        createdAt: ride.createdAt ? Date.parse(ride.createdAt) || 0 : 0,
        action: 'browse',
        actionLabel: 'Browse',
      });
    });

  rideRequests
    .filter((request) => alertUserIds.includes(request.riderId))
    .filter((request) => areUsersLinked(db, user.id, request.riderId))
    .filter((request) => !areUsersBlocked(db, user.id, request.riderId))
    .forEach((request) => {
      const actor = (db.users || []).find((entry) => entry.id === request.riderId);
      if (!actor || actor.id === user.id) return;
      notifications.push({
        id: 'request-alert-' + request.id,
        type: 'ride-alert',
        typeLabel: 'Ride alert',
        title: `${getUserDisplayName(actor)} requested a ride`,
        body: [request.origin, request.destination].filter(Boolean).join(' to ') || 'Open Browse to view it.',
        timeLabel: describeTripTime(request),
        createdAt: request.createdAt ? Date.parse(request.createdAt) || 0 : 0,
        action: 'browse',
        actionLabel: 'Browse',
      });
    });

  notifications.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  res.json({ notifications: notifications.slice(0, 20) });
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

app.post('/api/users/:userId/ride-alerts', requireAuth, requireCampusNetworkAccess, (req, res) => {
  const targetUserId = String(req.params.userId || '').trim();
  const db = loadDb();
  const subscriber = (db.users || []).find((user) => user.id === req.session.userId);
  const targetUser = (db.users || []).find((user) => user.id === targetUserId && !isDeletedUser(user) && !user.suspendedAt);
  if (!subscriber) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (!targetUser) {
    return res.status(404).json({ error: 'User to LinkUp with not found' });
  }
  if (subscriber.id === targetUser.id) {
    return res.status(400).json({ error: 'You already receive your own ride activity.' });
  }
  if (areUsersBlocked(db, subscriber.id, targetUser.id)) {
    return res.status(403).json({ error: 'Ride alerts are unavailable for blocked users.' });
  }

  const status = getLinkupStatus(db, subscriber, targetUser.id);
  if (status === 'linked') {
    return res.json({
      message: `You and ${getUserDisplayName(targetUser)} are already Linked.`,
      rideAlertSubscribed: true,
      linkupStatus: 'linked',
    });
  }
  if (status === 'pending_received') {
    acceptLinkupRequest(db, subscriber, targetUser);
    saveDb(db);
    return res.json({
      message: `You and ${getUserDisplayName(targetUser)} are now Linked.`,
      rideAlertSubscribed: true,
      linkupStatus: 'linked',
    });
  }
  targetUser.linkupRequests = normalizeLinkupRequests(targetUser.linkupRequests);
  if (!targetUser.linkupRequests.some((request) => request.fromUserId === subscriber.id)) {
    targetUser.linkupRequests.push({ fromUserId: subscriber.id, createdAt: new Date().toISOString() });
    saveDb(db);
  }
  res.json({
    message: `LinkUp request sent to ${getUserDisplayName(targetUser)}.`,
    rideAlertSubscribed: false,
    linkupStatus: 'pending_sent',
  });
});

app.post('/api/users/:userId/ride-alerts/accept', requireAuth, requireCampusNetworkAccess, (req, res) => {
  const requesterId = String(req.params.userId || '').trim();
  const db = loadDb();
  const recipient = (db.users || []).find((user) => user.id === req.session.userId);
  const requester = (db.users || []).find((user) => user.id === requesterId && !isDeletedUser(user) && !user.suspendedAt);
  if (!recipient) return res.status(404).json({ error: 'User not found' });
  if (!requester) return res.status(404).json({ error: 'LinkUp request not found.' });
  if (areUsersBlocked(db, recipient.id, requester.id)) {
    return res.status(403).json({ error: 'LinkUp requests are unavailable for blocked users.' });
  }
  if (!isLinkupRequestPending(recipient, requester.id) && getLinkupStatus(db, recipient, requester.id) !== 'linked') {
    return res.status(404).json({ error: 'LinkUp request not found.' });
  }
  acceptLinkupRequest(db, recipient, requester);
  saveDb(db);
  res.json({
    message: `You and ${getUserDisplayName(requester)} are now Linked.`,
    rideAlertSubscribed: true,
    linkupStatus: 'linked',
  });
});

app.get('/api/users/search', requireAuth, requireCampusNetworkAccess, (req, res) => {
  const db = loadDb();
  const viewer = (db.users || []).find((user) => user.id === req.session.userId);
  if (!viewer) return res.status(404).json({ error: 'User not found' });

  const query = String(req.query.q || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (query.length < 2) {
    return res.json({ results: [] });
  }

  const queryParts = query.split(' ').filter(Boolean);
  const rides = Array.isArray(db.rides) ? db.rides : [];
  const rideRequests = Array.isArray(db.rideRequests) ? db.rideRequests : [];
  const results = activeUsers(db)
    .filter((user) => (
      user.id !== viewer.id &&
      !isAdminUser(user) &&
      !isDeletedUser(user) &&
      !user.suspendedAt &&
      !areUsersBlocked(db, viewer.id, user.id)
    ))
    .map((user) => {
      const searchable = [
        user.firstName,
        user.lastName,
        getUserDisplayName(user),
        user.major,
        user.classYear,
        getUserUniversityDisplay(user),
        user.universityDomain || getEmailDomain(user.email),
        `member ${getUserMemberNumber(db, user.id) || ''}`,
      ].filter(Boolean).join(' ').toLowerCase();
      const matched = queryParts.every((part) => searchable.includes(part));
      if (!matched) return null;

      const canSeeFullName = canUserSeeProfileFullName(db, user.id, viewer.id);
      const maskedNameParts = getMaskedUserNameParts(user);
      const firstName = user.firstName || maskedNameParts.firstName;
      const lastName = canSeeFullName ? (user.lastName || '') : maskedNameParts.lastName;
      const createdRides = rides.filter((ride) => ride.driverId === user.id);
      const joinedRides = rides.filter((ride) => (ride.passengers || []).some((passenger) => passenger.studentId === user.id));
      const openRideRequests = rideRequests.filter((request) => request.riderId === user.id && request.status === 'open').length;
      const linkupStatus = getLinkupStatus(db, viewer, user.id);
      return {
        id: user.id,
        name: [firstName, lastName].filter(Boolean).join(' ') || 'LinkUp member',
        firstName,
        profilePictureDataUrl: user.profilePictureDataUrl || '',
        university: getUserUniversityDisplay(user),
        universityDomain: user.universityDomain || getEmailDomain(user.email),
        classYear: user.classYear || '',
        major: user.major || '',
        memberNumber: getUserMemberNumber(db, user.id),
        linkCount: getUserLinkCount(db, user.id),
        rideAlertSubscribed: linkupStatus === 'linked',
        linkupStatus,
        stats: {
          ridesOffered: createdRides.length,
          ridesJoined: joinedRides.length,
          openRideRequests,
        },
      };
    })
    .filter(Boolean)
    .slice(0, 12);

  res.json({ results });
});

app.get('/api/users/:userId/profile', requireAuth, requireCampusNetworkAccess, (req, res) => {
  const db = expireUnclaimedRideRequests(loadDb());
  const user = (db.users || []).find((entry) => entry.id === req.params.userId);
  if (!user || isDeletedUser(user) || user.suspendedAt) {
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
  const viewer = (db.users || []).find((entry) => entry.id === req.session.userId);
  const linkupStatus = getLinkupStatus(db, viewer, user.id);

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
    memberNumber: getUserMemberNumber(db, user.id),
    adminNumber: getAdminNumber(db, user.id),
    linkCount: getUserLinkCount(db, user.id),
    serviceApproved: user.serviceApproved === true,
    isCurrentUser: user.id === req.session.userId,
    rideAlertSubscribed: linkupStatus === 'linked',
    linkupStatus,
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
    createdRides: createdRides.map((ride) => rideForUser(ride, studentId, db)),
    joinedRides: joinedRides.map((ride) => {
      const passenger = (ride.passengers || []).find((p) => p.studentId === studentId);
      return {
        ...rideForUser(ride, studentId, db),
        selectedSeatId: passenger?.seatId || '',
        actualPickup: passenger?.actualPickup || '',
        actualDropoff: passenger?.actualDropoff || '',
        driverRatingByCurrentUser: passenger?.driverRating || null,
        driverRatingCommentByCurrentUser: passenger?.driverRatingComment || '',
      };
    }),
    riderRequests,
    driverOffers: driverOffers.map((request) => publicRideRequest(request, studentId)),
    wallet: buildDriverWalletSummary(db, studentId),
  });
});

let applicationReady = false;
let applicationDraining = false;

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'LinkUp',
    version: APP_VERSION,
    environment: NODE_ENV,
    database: USE_POSTGRES ? 'postgres' : 'json',
    instanceMode: 'single',
    rideServicesPaused: RIDE_SERVICES_PAUSED,
    waitlistMode: WAITLIST_MODE,
    timestamp: new Date().toISOString(),
  });
});

app.get('/ready', async (req, res) => {
  if (!applicationReady || applicationDraining) {
    return res.status(503).json({ ok: false, ready: false, draining: applicationDraining });
  }
  try {
    if (pgPool) await pgPool.query('SELECT 1');
    return res.json({
      ok: true,
      ready: true,
      database: USE_POSTGRES ? 'postgres' : 'json',
      instanceMode: 'single',
      databasePoolMax: DATABASE_POOL_MAX,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Readiness check failed:', err.message);
    return res.status(503).json({ ok: false, ready: false, database: 'unavailable' });
  }
});

app.get('/api/version', (req, res) => {
  res.json({
    version: APP_VERSION,
    environment: NODE_ENV,
    rideServicesPaused: RIDE_SERVICES_PAUSED,
    waitlistMode: WAITLIST_MODE,
    requiredTermsVersion: REQUIRED_TERMS_VERSION,
    requiredPrivacyVersion: REQUIRED_PRIVACY_VERSION,
    timestamp: new Date().toISOString(),
  });
});

function getStrikeTotal(user) {
  return asArray(user?.strikes).reduce((sum, s) => sum + (Number(s?.level) || 0), 0);
}

function applyStrikeBanIfNeeded(user) {
  if (getStrikeTotal(user) >= STRIKE_BAN_THRESHOLD && !user.bannedByStrikesAt) {
    user.bannedByStrikesAt = new Date().toISOString();
    user.suspendedAt = user.suspendedAt || new Date().toISOString();
    user.serviceApproved = false;
    user.waitlistedAt = user.waitlistedAt || new Date().toISOString();
    user.manuallyWaitlistedAt = user.manuallyWaitlistedAt || new Date().toISOString();
    return true;
  }
  return false;
}

function liftStrikeBanIfNeeded(user) {
  if (user.bannedByStrikesAt && getStrikeTotal(user) < STRIKE_BAN_THRESHOLD) {
    user.bannedByStrikesAt = null;
    user.suspendedAt = null;
    user.serviceApproved = !WAITLIST_MODE;
    user.waitlistedAt = WAITLIST_MODE ? (user.waitlistedAt || new Date().toISOString()) : null;
    user.manuallyWaitlistedAt = WAITLIST_MODE ? (user.manuallyWaitlistedAt || new Date().toISOString()) : null;
    return true;
  }
  return false;
}

function summarizeAdminUser(user, db) {
  const strikes = asArray(user.strikes).filter(isPlainObject);
  return {
    id: user.id,
    memberNumber: getUserMemberNumber(db, user.id),
    adminNumber: getAdminNumber(db, user.id),
    name: getUserDisplayName(user),
    email: user.email || '',
    university: getUserUniversityDisplay(user),
    serviceApproved: user.serviceApproved === true,
    emailVerified: user.emailVerified !== false,
    isAdmin: isAdminUser(user),
    suspended: Boolean(user.suspendedAt),
    suspendedAt: user.suspendedAt || '',
    bannedByStrikes: Boolean(user.bannedByStrikesAt),
    moderationNote: user.moderationNote || '',
    joinedAt: user.createdAt || '',
    lastUpdatedAt: user.updatedAt || '',
    strikes,
    strikeTotal: getStrikeTotal(user),
  };
}

function summarizeAdminSchoolSignups(users) {
  const schools = new Map();
  (users || []).filter((user) => !isAdminUser(user) && !isDeletedUser(user)).forEach((user) => {
    const domain = user.universityDomain || getEmailDomain(user.email);
    const knownDomain = isKnownUniversityDomain(domain);
    const schoolInfo = getUniversityInfoFromDomain(domain);
    const school = knownDomain ? (getUserUniversityDisplay(user) || schoolInfo.name || domain || 'Unknown school') : (domain || 'Unknown school');
    const key = domain || school;
    if (!schools.has(key)) {
      schools.set(key, {
        school,
        domain,
        needsReview: !knownDomain,
        totalUsers: 0,
        waitlistedUsers: 0,
        approvedUsers: 0,
        driverIntent: 0,
        riderIntent: 0,
        unsureIntent: 0,
        unknownIntent: 0,
        latestSignupAt: '',
      });
    }

    const entry = schools.get(key);
    entry.totalUsers += 1;
    entry.needsReview = entry.needsReview || !knownDomain;
    if (user.serviceApproved === true) entry.approvedUsers += 1;
    else entry.waitlistedUsers += 1;

    const intent = normalizeWaitlistIntent(user.waitlistIntent);
    if (intent === 'driver') entry.driverIntent += 1;
    else if (intent === 'rider') entry.riderIntent += 1;
    else if (intent === 'unsure') entry.unsureIntent += 1;
    else entry.unknownIntent += 1;

    if (!entry.latestSignupAt || new Date(user.createdAt || 0) > new Date(entry.latestSignupAt || 0)) {
      entry.latestSignupAt = user.createdAt || '';
    }
  });

  return Array.from(schools.values()).sort((a, b) => {
    if (b.waitlistedUsers !== a.waitlistedUsers) return b.waitlistedUsers - a.waitlistedUsers;
    if (b.totalUsers !== a.totalUsers) return b.totalUsers - a.totalUsers;
    return a.school.localeCompare(b.school);
  });
}

function summarizeAdminRide(ride) {
  return {
    id: ride.id,
    driverId: ride.driverId || '',
    driverName: [ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || 'Driver',
    origin: ride.origin || '',
    destination: ride.destination || '',
    date: ride.date || '',
    time: ride.time || '',
    status: ride.status || 'listed',
    moderationNote: ride.moderationNote || '',
    seatsAvailable: ride.seatsAvailable ?? ride.seats ?? 0,
    passengerCount: (ride.passengers || []).length,
    createdAt: ride.createdAt || '',
  };
}

function summarizeAdminRequest(request) {
  return {
    id: request.id,
    riderId: request.riderId || '',
    riderName: [request.riderFirstName, request.riderLastName].filter(Boolean).join(' ') || 'Rider',
    origin: request.origin || '',
    destination: request.destination || '',
    date: request.date || '',
    time: request.time || '',
    status: request.status || 'open',
    moderationNote: request.moderationNote || '',
    requestType: request.requestType || 'ride',
    offerCount: (request.driverOffers || []).length,
    createdAt: request.createdAt || '',
  };
}

function summarizeAdminReport(report) {
  return {
    id: report.id,
    type: report.type || 'Report',
    status: report.status || 'open',
    reason: report.reason || '',
    details: report.details || '',
    reporterName: report.reporterName || '',
    reporterEmail: report.reporterEmail || '',
    reportedUserName: report.reportedUserName || '',
    reportedUserEmail: report.reportedUserEmail || '',
    rideId: report.rideId || '',
    rideRoute: [report.rideOrigin, report.rideDestination].filter(Boolean).join(' -> '),
    rideDate: report.rideDate || '',
    safetyRecordingId: report.safetyRecordingId || '',
    doorSafetyIssue: Boolean(report.doorSafetyIssue),
    adminNote: report.adminNote || '',
    createdAt: report.createdAt || '',
    resolvedAt: report.resolvedAt || '',
  };
}

function addAdminAuditEntry(db, adminUser, action, targetType, target, details = {}) {
  db.adminAuditLog = Array.isArray(db.adminAuditLog) ? db.adminAuditLog : [];
  const entry = {
    id: uuidv4(),
    action,
    targetType,
    targetId: target?.id || '',
    targetLabel: details.targetLabel || target?.email || target?.id || '',
    adminId: adminUser?.id || '',
    adminEmail: adminUser?.email || '',
    adminName: getUserDisplayName(adminUser || {}),
    details,
    createdAt: new Date().toISOString(),
  };
  db.adminAuditLog.push(entry);
  if (db.adminAuditLog.length > 500) db.adminAuditLog = db.adminAuditLog.slice(-500);
  return entry;
}

function summarizeAdminAuditEntry(entry) {
  return {
    id: entry.id,
    action: entry.action || '',
    targetType: entry.targetType || '',
    targetId: entry.targetId || '',
    targetLabel: entry.targetLabel || '',
    adminName: entry.adminName || '',
    adminEmail: entry.adminEmail || '',
    details: entry.details || {},
    createdAt: entry.createdAt || '',
  };
}

function summarizeAdminActivity(db) {
  const users = (db.users || []).map((user) => ({
    id: user.id,
    type: 'User',
    title: getUserDisplayName(user),
    detail: [user.email, getUserUniversityDisplay(user)].filter(Boolean).join(' - '),
    status: user.suspendedAt ? 'Suspended' : user.serviceApproved === true ? 'Approved' : 'Waitlist',
    createdAt: user.createdAt || '',
  }));
  const rides = (db.rides || []).map((ride) => ({
    id: ride.id,
    type: 'Ride',
    title: [ride.origin, ride.destination].filter(Boolean).join(' -> '),
    detail: [summarizeAdminRide(ride).driverName, ride.date, ride.time].filter(Boolean).join(' - '),
    status: ride.status || 'listed',
    createdAt: ride.createdAt || '',
  }));
  const requests = (db.rideRequests || []).map((request) => ({
    id: request.id,
    type: 'Request',
    title: [request.origin, request.destination].filter(Boolean).join(' -> '),
    detail: [summarizeAdminRequest(request).riderName, request.date, request.time].filter(Boolean).join(' - '),
    status: request.status || 'open',
    createdAt: request.createdAt || '',
  }));
  const reports = (db.userReports || []).map((report) => ({
    id: report.id,
    type: 'Report',
    title: report.reason || 'User report',
    detail: [report.reportedUserName, report.reporterName ? 'reported by ' + report.reporterName : ''].filter(Boolean).join(' - '),
    status: report.status || 'open',
    createdAt: report.createdAt || '',
  }));
  const payments = (db.payments || []).map((payment) => ({
    id: payment.id,
    type: 'Payment',
    title: payment.status || 'payment',
    detail: payment.amountCents ? '$' + (Number(payment.amountCents) / 100).toFixed(2) : '',
    status: payment.status || '',
    createdAt: payment.createdAt || '',
  }));
  return [...users, ...rides, ...requests, ...reports, ...payments]
    .filter((item) => item.createdAt)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 120);
}

app.get('/api/admin/overview', requireAuth, requireAdmin, adminDashboardRateLimit, (req, res) => {
  const db = expireUnclaimedRideRequests(req.adminDb || loadDb());
  const users = activeUsers(db);
  const rides = Array.isArray(db.rides) ? db.rides : [];
  const rideRequests = Array.isArray(db.rideRequests) ? db.rideRequests : [];
  const reports = Array.isArray(db.userReports) ? db.userReports : [];
  const payments = Array.isArray(db.payments) ? db.payments : [];
  const walletTransactions = Array.isArray(db.walletTransactions) ? db.walletTransactions : [];

  res.json({
    version: APP_VERSION,
    environment: NODE_ENV,
    rideServicesPaused: RIDE_SERVICES_PAUSED,
    generatedAt: new Date().toISOString(),
    metrics: {
      users: users.length,
      serviceApprovedUsers: users.filter((user) => user.serviceApproved === true).length,
      waitlistedUsers: users.filter((user) => user.serviceApproved !== true).length,
      suspendedUsers: users.filter((user) => Boolean(user.suspendedAt)).length,
      rides: rides.length,
      rideRequests: rideRequests.length,
      openRideRequests: rideRequests.filter((request) => request.status === 'open').length,
      openReports: reports.filter((report) => (report.status || 'open') === 'open').length,
      payments: payments.length,
      walletTransactions: walletTransactions.length,
    },
    users: users.slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 80).map((user) => summarizeAdminUser(user, db)),
    schoolSignups: summarizeAdminSchoolSignups(users),
    rides: rides.slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 80).map(summarizeAdminRide),
    rideRequests: rideRequests.slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 80).map(summarizeAdminRequest),
    reports: reports.slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 80).map(summarizeAdminReport),
    activity: summarizeAdminActivity(db),
    auditLog: (db.adminAuditLog || []).slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 120).map(summarizeAdminAuditEntry),
    strikeCategories: STRIKE_CATEGORIES,
    strikeBanThreshold: STRIKE_BAN_THRESHOLD,
  });
});

app.patch('/api/admin/users/:userId', requireAuth, requireAdmin, adminDashboardRateLimit, (req, res) => {
  const db = loadDb();
  const user = (db.users || []).find((entry) => entry.id === String(req.params.userId || ''));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const isTargetAdmin = isAdminUser(user);
  const wasServiceApproved = user.serviceApproved === true;
  if (req.body.serviceApproved !== undefined) {
    if (WAITLIST_MODE && req.body.serviceApproved === true && !isTargetAdmin) {
      return res.status(400).json({ error: 'Waitlist mode is on. Turn WAITLIST_MODE=false before approving student access.' });
    }
    user.serviceApproved = req.body.serviceApproved === true;
    user.waitlistedAt = user.serviceApproved ? null : (user.waitlistedAt || new Date().toISOString());
    user.manuallyWaitlistedAt = user.serviceApproved ? null : (user.manuallyWaitlistedAt || new Date().toISOString());
    if (!wasServiceApproved && user.serviceApproved && !user.schoolApprovedEmailSentAt) {
      user.schoolApprovedEmailSentAt = new Date().toISOString();
      sendSchoolApprovedEmail(user, getUserUniversityDisplay(user));
    }
    addAdminAuditEntry(db, req.adminUser, user.serviceApproved ? 'approved_user' : 'waitlisted_user', 'user', user, {
      targetLabel: user.email || getUserDisplayName(user),
    });
  }
  if (req.body.suspended !== undefined) {
    const shouldSuspend = req.body.suspended === true;
    if (shouldSuspend && user.id === req.adminUser.id) {
      return res.status(400).json({ error: 'You cannot suspend your own admin account' });
    }
    if (shouldSuspend && isTargetAdmin) {
      return res.status(400).json({ error: 'Admin accounts cannot be suspended here' });
    }
    user.suspendedAt = shouldSuspend ? (user.suspendedAt || new Date().toISOString()) : null;
    user.suspendedByAdminId = shouldSuspend ? req.adminUser.id : null;
    if (shouldSuspend) {
      user.serviceApproved = false;
      user.waitlistedAt = user.waitlistedAt || new Date().toISOString();
      user.manuallyWaitlistedAt = user.manuallyWaitlistedAt || new Date().toISOString();
    } else if (req.body.serviceApproved === undefined) {
      if (WAITLIST_MODE && !isTargetAdmin) {
        return res.status(400).json({ error: 'Waitlist mode is on. Turn WAITLIST_MODE=false before restoring student access.' });
      }
      user.serviceApproved = true;
      user.waitlistedAt = null;
      user.manuallyWaitlistedAt = null;
      if (!wasServiceApproved && !user.schoolApprovedEmailSentAt) {
        user.schoolApprovedEmailSentAt = new Date().toISOString();
        sendSchoolApprovedEmail(user, getUserUniversityDisplay(user));
      }
    }
    addAdminAuditEntry(db, req.adminUser, shouldSuspend ? 'suspended_user' : 'restored_user', 'user', user, {
      targetLabel: user.email || getUserDisplayName(user),
    });
  }
  if (req.body.moderationNote !== undefined) {
    const note = String(req.body.moderationNote || '').trim();
    if (note.length > 1000) return res.status(400).json({ error: 'Moderation note must be 1000 characters or fewer' });
    user.moderationNote = note;
    addAdminAuditEntry(db, req.adminUser, 'saved_user_note', 'user', user, {
      targetLabel: user.email || getUserDisplayName(user),
      notePreview: note.slice(0, 120),
    });
  }
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json({ message: 'User updated.', user: summarizeAdminUser(user, db) });
});

app.post('/api/admin/users/:userId/strikes', requireAuth, requireAdmin, adminDashboardRateLimit, async (req, res) => {
  const db = loadDb();
  const user = (db.users || []).find((entry) => entry.id === String(req.params.userId || ''));
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (isAdminUser(user)) return res.status(400).json({ error: 'Cannot issue strikes to admin accounts' });
  const level = Number(req.body.level);
  if (![1, 2, 3].includes(level)) return res.status(400).json({ error: 'Strike level must be 1, 2, or 3' });
  const validCategories = (STRIKE_CATEGORIES[level] || []).map((c) => c.id);
  const category = String(req.body.category || '').trim();
  if (category && !validCategories.includes(category)) return res.status(400).json({ error: 'Invalid category for this strike level' });
  const reason = String(req.body.reason || '').trim().slice(0, 500);
  const strike = {
    id: 'strike_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    level,
    category: category || validCategories[0],
    reason,
    issuedAt: new Date().toISOString(),
    issuedByAdminId: req.adminUser.id,
    issuedByAdminEmail: req.adminUser.email,
  };
  if (!Array.isArray(user.strikes)) user.strikes = [];
  user.strikes.push(strike);
  user.updatedAt = new Date().toISOString();
  const autoBanned = applyStrikeBanIfNeeded(user);
  addAdminAuditEntry(db, req.adminUser, 'issued_strike', 'user', user, {
    targetLabel: user.email || getUserDisplayName(user),
    strikeLevel: level,
    strikeCategory: strike.category,
    autoBanned,
  });
  saveDb(db);
  const levelLabels = { 1: 'Level 1 (minor)', 2: 'Level 2 (serious)', 3: 'Level 3 (severe)' };
  const categoryLabel = (STRIKE_CATEGORIES[level] || []).find((c) => c.id === strike.category)?.label || strike.category;
  const strikesLeft = Math.max(0, STRIKE_BAN_THRESHOLD - getStrikeTotal(user));
  await sendEmail(
    user.email,
    `Your LinkUp account has received a ${levelLabels[level]} violation`,
    `Hi ${escapeHtml(user.firstName || 'there')},\n\nYour LinkUp account has received a conduct strike.\n\nViolation: ${escapeHtml(categoryLabel)}\n${reason ? 'Note: ' + escapeHtml(reason) + '\n' : ''}\n${autoBanned ? 'Your account has been permanently banned due to repeated violations.' : `Strikes remaining before ban: ${strikesLeft}`}\n\nIf you believe this is an error, contact us at ridewlinkup@gmail.com.`,
    `<p>Hi ${escapeHtml(user.firstName || 'there')},</p><p>Your LinkUp account has received a conduct strike.</p><p><strong>Violation:</strong> ${escapeHtml(categoryLabel)}</p>${reason ? `<p><strong>Note:</strong> ${escapeHtml(reason)}</p>` : ''}<p>${autoBanned ? '<strong>Your account has been permanently banned due to repeated violations.</strong>' : `Strikes remaining before ban: <strong>${strikesLeft}</strong>`}</p><p>If you believe this is an error, contact us at <a href="mailto:ridewlinkup@gmail.com">ridewlinkup@gmail.com</a>.</p>`
  ).catch(() => {});
  res.json({ message: autoBanned ? 'Strike issued. Account permanently banned.' : 'Strike issued.', autoBanned, user: summarizeAdminUser(user, db) });
});

app.delete('/api/admin/users/:userId/strikes/:strikeId', requireAuth, requireAdmin, adminDashboardRateLimit, (req, res) => {
  const db = loadDb();
  const user = (db.users || []).find((entry) => entry.id === String(req.params.userId || ''));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const strikeId = String(req.params.strikeId || '');
  const beforeLen = (user.strikes || []).length;
  user.strikes = (user.strikes || []).filter((s) => s.id !== strikeId);
  if (user.strikes.length === beforeLen) return res.status(404).json({ error: 'Strike not found' });
  user.updatedAt = new Date().toISOString();
  liftStrikeBanIfNeeded(user);
  addAdminAuditEntry(db, req.adminUser, 'removed_strike', 'user', user, {
    targetLabel: user.email || getUserDisplayName(user),
  });
  saveDb(db);
  res.json({ message: 'Strike removed.', user: summarizeAdminUser(user, db) });
});

app.patch('/api/admin/reports/:reportId', requireAuth, requireAdmin, adminDashboardRateLimit, (req, res) => {
  const db = loadDb();
  const report = (db.userReports || []).find((entry) => entry.id === String(req.params.reportId || ''));
  if (!report) return res.status(404).json({ error: 'Report not found' });
  const status = String(req.body.status || '').trim().toLowerCase();
  if (!['open', 'reviewing', 'resolved', 'dismissed'].includes(status)) {
    return res.status(400).json({ error: 'Choose a valid report status' });
  }
  report.status = status;
  if (req.body.adminNote !== undefined) {
    const adminNote = String(req.body.adminNote || '').trim();
    if (adminNote.length > 1000) return res.status(400).json({ error: 'Admin note must be 1000 characters or fewer' });
    report.adminNote = adminNote;
  }
  report.updatedByAdminId = req.adminUser.id;
  report.updatedAt = new Date().toISOString();
  if (status === 'resolved' || status === 'dismissed') report.resolvedAt = report.updatedAt;
  addAdminAuditEntry(db, req.adminUser, 'updated_report', 'report', report, {
    targetLabel: report.reason || report.reportedUserEmail || report.id,
    status,
    notePreview: String(report.adminNote || '').slice(0, 120),
  });
  saveDb(db);
  res.json({ message: 'Report updated.', report: summarizeAdminReport(report) });
});

app.delete('/api/admin/rides/:rideId', requireAuth, requireAdmin, adminDashboardRateLimit, (req, res) => {
  const db = loadDb();
  const ride = (db.rides || []).find((entry) => entry.id === String(req.params.rideId || ''));
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  const note = String(req.body?.moderationNote || '').trim();
  if (note.length > 1000) return res.status(400).json({ error: 'Moderation note must be 1000 characters or fewer' });
  ride.status = 'removed';
  ride.removedAt = new Date().toISOString();
  ride.removedByAdminId = req.adminUser.id;
  ride.moderationNote = note || ride.moderationNote || 'Removed by LinkUp moderation';
  addAdminAuditEntry(db, req.adminUser, 'removed_ride', 'ride', ride, {
    targetLabel: [ride.origin, ride.destination].filter(Boolean).join(' -> ') || ride.id,
    notePreview: ride.moderationNote.slice(0, 120),
  });
  saveDb(db);
  res.json({ message: 'Ride removed.', ride: summarizeAdminRide(ride) });
});

app.delete('/api/admin/ride-requests/:requestId', requireAuth, requireAdmin, adminDashboardRateLimit, (req, res) => {
  const db = loadDb();
  const request = (db.rideRequests || []).find((entry) => entry.id === String(req.params.requestId || ''));
  if (!request) return res.status(404).json({ error: 'Request not found' });
  const note = String(req.body?.moderationNote || '').trim();
  if (note.length > 1000) return res.status(400).json({ error: 'Moderation note must be 1000 characters or fewer' });
  request.status = 'removed';
  request.removedAt = new Date().toISOString();
  request.removedByAdminId = req.adminUser.id;
  request.moderationNote = note || request.moderationNote || 'Removed by LinkUp moderation';
  addAdminAuditEntry(db, req.adminUser, 'removed_request', 'request', request, {
    targetLabel: [request.origin, request.destination].filter(Boolean).join(' -> ') || request.id,
    notePreview: request.moderationNote.slice(0, 120),
  });
  persistRideRequest(request);
  saveDb(db);
  res.json({ message: 'Request removed.', request: summarizeAdminRequest(request) });
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

app.get('/api/admin/safety/recordings', requireAuth, requireAdmin, adminDashboardRateLimit, (req, res) => {
  const db = loadDb();
  const reports = asArray(db.userReports);
  const recordings = asArray(db.safetyRecordings)
    .filter(isPlainObject)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .map((r) => ({
      id: r.id,
      ownerId: r.ownerId,
      ownerName: r.ownerName || '',
      ownerEmail: r.ownerEmail || '',
      rideId: r.rideId || '',
      rideOrigin: r.rideOrigin || '',
      rideDestination: r.rideDestination || '',
      rideDate: r.rideDate || '',
      mimeType: r.mimeType || 'audio/webm',
      durationMs: r.durationMs || 0,
      createdAt: r.createdAt || '',
      expiresAt: r.expiresAt || 0,
      linkedReport: reports.find((rep) => rep.safetyRecordingId === r.id) || null,
    }));
  res.json({ recordings });
});

app.get('/api/admin/safety/recordings/:id', requireAuth, requireAdmin, adminDashboardRateLimit, (req, res) => {
  const db = loadDb();
  const recording = asArray(db.safetyRecordings).find((r) => r.id === String(req.params.id || ''));
  if (!recording) return res.status(404).json({ error: 'Recording not found' });
  addAdminAuditEntry(db, req.adminUser, 'accessed_safety_recording', 'safety_recording', { id: recording.id }, {
    targetLabel: recording.ownerEmail || recording.ownerName,
    rideId: recording.rideId,
  });
  saveDb(db);
  res.json(recording);
});

app.post('/api/admin/db/restore', adminRateLimit, async (req, res) => {
  if (!ADMIN_PAYOUT_SECRET || !timingSafeEqualText(req.get('x-admin-secret'), ADMIN_PAYOUT_SECRET)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (!USE_POSTGRES) return res.status(400).json({ error: 'Only supported in Postgres mode' });
  try {
    const incoming = req.body;
    if (!incoming || !Array.isArray(incoming.users)) return res.status(400).json({ error: 'Invalid backup payload' });
    const normalized = normalizeDbShape(incoming);
    await pgPool.query(
      `INSERT INTO linkup_state (state_key, data, updated_at) VALUES ('main', $1, NOW())
       ON CONFLICT (state_key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [normalized]
    );
    dbCache = normalized;
    res.json({ message: 'Database restored', users: normalized.users.length, rides: normalized.rides.length });
  } catch (err) {
    console.error('DB restore error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/favicon.ico', (req, res) => {
  res.type('png').sendFile(path.join(__dirname, 'public', 'favicon-32.png'));
});

app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'previews', 'linkup-demo-preview.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let server;

async function shutdown(signal) {
  if (applicationDraining) return;
  applicationDraining = true;
  applicationReady = false;
  console.log(`${signal} received. Shutting down LinkUp...`);
  try {
    if (server) {
      await new Promise((resolve) => {
        const forceClose = setTimeout(resolve, 10000);
        forceClose.unref();
        server.close(() => {
          clearTimeout(forceClose);
          resolve();
        });
      });
    }
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
  const listenArgs = HOST ? [PORT, HOST] : [PORT];
  server = httpServer.listen(...listenArgs, () => {
    applicationReady = true;
    console.log(`LinkUp server listening on http://${HOST || 'localhost'}:${PORT}`);
    console.log(`Runtime capacity: single process, PostgreSQL pool max ${DATABASE_POOL_MAX}.`);
    startWeeklyRecapScheduler();
  });
  server.on('error', (err) => {
    console.error('Server startup error:', err);
    process.exit(1);
  });
});
