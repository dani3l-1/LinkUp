require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const EMAIL_OUTBOX_PATH = path.join(__dirname, 'data', 'email-outbox.json');
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.error('FATAL: SESSION_SECRET environment variable is not set. Refusing to start.');
  process.exit(1);
}
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_USER || 'LinkUp <no-reply@linkup.local>';
const REQUIRED_TERMS_VERSION = process.env.REQUIRED_TERMS_VERSION || 'v2026.05.8';
const REQUIRED_PRIVACY_VERSION = process.env.REQUIRED_PRIVACY_VERSION || 'v2026.05.8';
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

function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), payment=(), geolocation=(self)');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com; connect-src 'self' https://maps.googleapis.com; frame-ancestors 'none';"
  );
  if (process.env.NODE_ENV === 'production') {
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

app.use(securityHeaders);
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()) : true,
  credentials: true,
}));
app.use(express.json({ limit: '100kb' }));
app.use('/api/auth', authRateLimit);
app.use('/api/profile/payment-method', sensitiveWriteRateLimit);
app.use('/api/profile/payout', sensitiveWriteRateLimit);
app.use('/api/cart/create-checkout-session', sensitiveWriteRateLimit);
app.use('/api/cart/checkout', sensitiveWriteRateLimit);
app.use('/api/cart/checkout/complete', sensitiveWriteRateLimit);
app.use('/api/track', trackingRateLimit);
app.use(
  session({
    name: 'linkup.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0,
}));

function getEmptyDb() {
  return {
    rides: [],
    rideRequests: [],
    users: [],
    carts: {},
    checkoutSessions: [],
    trackingTrips: [],
    rideMessages: {},
  };
}

function normalizeDbShape(db) {
  const base = getEmptyDb();
  const normalized = { ...base, ...(db && typeof db === 'object' ? db : {}) };
  if (!Array.isArray(normalized.rides)) normalized.rides = [];
  if (!Array.isArray(normalized.rideRequests)) normalized.rideRequests = [];
  if (!Array.isArray(normalized.users)) normalized.users = [];
  if (!normalized.carts || typeof normalized.carts !== 'object' || Array.isArray(normalized.carts)) normalized.carts = {};
  if (!Array.isArray(normalized.checkoutSessions)) normalized.checkoutSessions = [];
  if (!Array.isArray(normalized.trackingTrips)) normalized.trackingTrips = [];
  if (!normalized.rideMessages || typeof normalized.rideMessages !== 'object' || Array.isArray(normalized.rideMessages)) normalized.rideMessages = {};
  return normalized;
}

function loadDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return normalizeDbShape(JSON.parse(raw));
  } catch (error) {
    return getEmptyDb();
  }
}

function saveDb(db) {
  const tmpPath = DB_PATH + '.tmp';
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2));
    fs.renameSync(tmpPath, DB_PATH);
  } catch (err) {
    console.error('saveDb error:', err);
    try { fs.unlinkSync(tmpPath); } catch (_) {}
    throw err;
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

function canMatchSameGender(riderGender, driverGender) {
  if (!riderGender || !driverGender) return false;
  if (riderGender === 'prefer-not-to-say' || driverGender === 'prefer-not-to-say') return false;
  return riderGender === driverGender;
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
    vehicleSeatCount: inferVehicleSeatCount(ride),
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

function getRideChatDisabledAt(ride) {
  const interval = getTripInterval(ride);
  if (!interval.end) return null;
  return new Date(interval.end + 24 * 60 * 60 * 1000).toISOString();
}

function isRideChatDisabled(ride) {
  const disabledAt = getRideChatDisabledAt(ride);
  return Boolean(disabledAt && Date.now() >= new Date(disabledAt).getTime());
}

function rideForUser(ride, userId, db = null) {
  const publicRide = withRideMiles(ride, db);
  if (!canUserSeeLicensePlate(ride, userId)) {
    delete publicRide.licensePlate;
  }
  return publicRide;
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
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
  sendAuthEmail(
    user.email,
    'Your LinkUp verification code',
    `Hi ${user.firstName},\n\nYour LinkUp verification code is: ${code}\n\nThis code expires in 10 minutes.\n\n- LinkUp`
  );
}

function writeEmailToOutbox(to, subject, body, reason = 'SMTP not configured') {
  const email = {
    id: uuidv4(),
    to,
    subject,
    body,
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

async function sendAuthEmail(to, subject, body) {
  const transporter = getMailTransporter();
  if (!transporter) {
    writeEmailToOutbox(to, subject, body);
    return;
  }

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      text: body,
    });
    console.log('Auth email sent:', { to, subject });
  } catch (error) {
    writeEmailToOutbox(to, subject, body, error.message);
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

function userNeedsRequiredSettings(user) {
  return getMissingRequiredSettings(user).length > 0;
}

function publicUser(user) {
  const fallbackName = user.name || user.email.split('@')[0];
  const missingRequiredSettings = getMissingRequiredSettings(user);
  return {
    id: user.id,
    firstName: user.firstName || fallbackName,
    middleName: user.middleName || '',
    lastName: user.lastName || '',
    birthday: user.birthday || '',
    gender: user.gender || '',
    email: user.email,
    university: getUserUniversityDisplay(user),
    universityDomain: user.universityDomain || getEmailDomain(user.email),
    serviceApproved: user.serviceApproved === true,
    waitlisted: user.serviceApproved !== true,
    emailVerified: user.emailVerified !== false,
    nameLastChangedAt: user.nameLastChangedAt || null,
    defaultPaymentMethod: user.defaultPaymentMethod || null,
    payoutInfo: user.payoutInfo || null,
    termsVersion: user.termsVersion || '',
    privacyVersion: user.privacyVersion || '',
    requiredTermsVersion: REQUIRED_TERMS_VERSION,
    requiredPrivacyVersion: REQUIRED_PRIVACY_VERSION,
    requiresPolicyConsent: userNeedsPolicyConsent(user),
    missingRequiredSettings,
    requiresRequiredSettings: missingRequiredSettings.length > 0,
  };
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function validatePassword(password) {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
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

function normalizeCartEntries(db, userId) {
  db.carts = db.carts || {};
  const rawCart = db.carts[userId] || [];
  const entries = rawCart.map((entry) => {
    if (typeof entry === 'string') return { rideId: entry, seatId: '' };
    return { rideId: entry.rideId, seatId: entry.seatId || '' };
  }).filter((entry) => entry.rideId);
  db.carts[userId] = entries;
  return entries;
}

function getCartRideIds(db, userId) {
  return normalizeCartEntries(db, userId).map((entry) => entry.rideId);
}

function getTrackingTrips(db) {
  db.trackingTrips = db.trackingTrips || [];
  return db.trackingTrips;
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

function getCardBrand(cardDigits) {
  if (/^4/.test(cardDigits)) return 'Visa';
  if (/^5[1-5]/.test(cardDigits) || /^2[2-7]/.test(cardDigits)) return 'Mastercard';
  if (/^3[47]/.test(cardDigits)) return 'American Express';
  if (/^6(?:011|5)/.test(cardDigits)) return 'Discover';
  return 'Card';
}

function validatePayment(payment) {
  if (!payment || !payment.name || !payment.cardNumber || !payment.expiry || !payment.cvv) {
    return { valid: false, error: 'All payment fields are required' };
  }

  const cardDigits = String(payment.cardNumber).replace(/\D/g, '');
  const cvvDigits = String(payment.cvv).replace(/\D/g, '');
  if (cardDigits.length < 12 || cardDigits.length > 19) {
    return { valid: false, error: 'Please enter a valid card number' };
  }
  if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) {
    return { valid: false, error: 'Expiration must use MM/YY format' };
  }
  const [monthText] = payment.expiry.split('/');
  const month = Number(monthText);
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Please enter a valid expiration month' };
  }
  if (cvvDigits.length < 3 || cvvDigits.length > 4) {
    return { valid: false, error: 'Please enter a valid CVV' };
  }

  return {
    valid: true,
    last4: cardDigits.slice(-4),
    brand: getCardBrand(cardDigits),
    expiry: String(payment.expiry).trim(),
    billingName: String(payment.name || '').trim(),
    billingZip: String(payment.billingZip || '').trim(),
  };
}

function canStudentReserveRide(student, ride, seatId = '', db = null) {
  if (!ride) {
    return 'Ride not found';
  }
  if (ride.driverId === student.id) {
    return 'You cannot reserve your own ride';
  }
  if (ride.sameGenderOnly && !canMatchSameGender(student.gender, ride.driverGender)) {
    return 'This ride is limited to same-gender riders';
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
    termsAcceptedAt: new Date().toISOString(),
    privacyAcceptedAt: new Date().toISOString(),
    termsVersion: REQUIRED_TERMS_VERSION,
    privacyVersion: REQUIRED_PRIVACY_VERSION,
    policyAcceptedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

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
    return res.json(publicUser(user));
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
  res.json(publicUser(user));
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
  res.json(publicUser(user));
});

app.post('/api/auth/forgot-username', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const db = loadDb();
  const normalizedEmail = normalizeEmail(email);
  const user = db.users.find((u) => u.email === normalizedEmail);

  if (user) {
    sendAuthEmail(
      user.email,
      'Your LinkUp username',
      `Hi ${user.firstName},\n\nYour LinkUp username is: ${user.email}\n\n- LinkUp`
    );
  }

  res.json({ message: 'If an account exists for that email, we sent the username reminder.' });
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

    if (process.env.NODE_ENV !== 'production') {
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

  res.json(publicUser(user));
});

app.put('/api/profile', requireAuth, (req, res) => {
  const firstName = String(req.body.firstName || '').trim();
  const middleName = String(req.body.middleName || '').trim();
  const lastName = String(req.body.lastName || '').trim();

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
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
  res.json(publicUser(user));
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
  res.json(publicUser(user));
});

app.put('/api/profile/payment-method', requireAuth, (req, res) => {
  const paymentValidation = validatePayment({
    name: req.body.name,
    cardNumber: req.body.cardNumber,
    expiry: req.body.expiry,
    cvv: req.body.cvv,
    billingZip: req.body.billingZip,
  });
  if (!paymentValidation.valid) {
    return res.status(400).json({ error: paymentValidation.error });
  }

  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.defaultPaymentMethod = {
    brand: paymentValidation.brand,
    last4: paymentValidation.last4,
    expiry: paymentValidation.expiry,
    billingName: paymentValidation.billingName.slice(0, 120),
    billingZip: paymentValidation.billingZip.slice(0, 20),
    updatedAt: new Date().toISOString(),
  };
  user.updatedAt = new Date().toISOString();

  saveDb(db);
  res.json(publicUser(user));
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
  if (!req.body.confirmed) {
    return res.status(400).json({ error: 'Confirm that the payout information is accurate' });
  }

  const db = loadDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.payoutInfo = {
    legalName: legalName.slice(0, 120),
    method,
    email: email.slice(0, 160),
    phone: phone.slice(0, 40),
    handle: handle.slice(0, 80),
    address: address.slice(0, 220),
    notes: notes.slice(0, 300),
    commissionRate: 0.15,
    confirmedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  user.updatedAt = new Date().toISOString();

  saveDb(db);
  res.json(publicUser(user));
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

  res.json({ schools, mileageSchools, totalUsers: (db.users || []).length });
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
    viewerAccessExpiresAt: Date.now() + 1000 * 60 * 60 * 8,
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
  if (trip.viewerAccessExpiresAt && trip.viewerAccessExpiresAt <= Date.now()) {
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
  res.json(db.rideRequests || []);
});

app.post('/api/ride-requests', requireAuth, requireServiceAccess, (req, res) => {
  const { origin, destination, originLat, originLng, destinationLat, destinationLng, pickupRadiusMiles, dropoffRadiusMiles, date, time, riderCount, willingToPay, shareRideWithOthers, sameGenderDriverOnly, estimatedDurationMinutes, notes } = req.body;
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
    date,
    time,
    riderCount: riderCountNumber,
    willingToPayCents,
    estimatedDurationMinutes: sanitizeDurationMinutes(estimatedDurationMinutes),
    shareRideWithOthers: Boolean(shareRideWithOthers),
    sameGenderDriverOnly: Boolean(sameGenderDriverOnly),
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
  if (request.sameGenderDriverOnly && !canMatchSameGender(request.riderGender, driver.gender)) {
    return res.status(400).json({ error: 'This rider requested same-gender drivers only' });
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
    university: driver.university,
    origin: request.origin,
    destination: request.destination,
    originLat: request.originLat ?? null,
    originLng: request.originLng ?? null,
    destinationLat: request.destinationLat ?? null,
    destinationLng: request.destinationLng ?? null,
    pickupRadiusMiles: request.pickupRadiusMiles || 0,
    dropoffRadiusMiles: request.dropoffRadiusMiles || 0,
    distanceMiles: calculateDistanceMiles(request.originLat, request.originLng, request.destinationLat, request.destinationLng),
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
  res.json((db.rides || []).map((ride) => rideForUser(ride, req.session.userId, db)));
});

app.post('/api/rides', requireAuth, requireServiceAccess, (req, res) => {
  const { origin, destination, originLat, originLng, destinationLat, destinationLng, pickupRadiusMiles, dropoffRadiusMiles, date, time, hasReturnRide, returnDate, returnTime, sameGenderOnly, seatsAvailable, price, carMaker, carModel, carColor, licensePlate, termsAccepted, estimatedDurationMinutes, notes } = req.body;
  const vehicleSeatCount = normalizeVehicleSeatCount(req.body.vehicleSeatCount);
  const availableSeatIds = normalizeSeatIds(req.body.availableSeatIds, vehicleSeatCount);
  if (!origin || !destination || !date || !time || price === undefined || !carMaker || !carModel || !carColor || !licensePlate || originLat === undefined || originLng === undefined || destinationLat === undefined || destinationLng === undefined) {
    return res.status(400).json({ error: 'Missing ride information' });
  }
  if (!availableSeatIds.length) {
    return res.status(400).json({ error: 'Select at least one available passenger seat' });
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
    university: driver.university,
    origin,
    destination,
    originLat: parsedOriginLat,
    originLng: parsedOriginLng,
    destinationLat: parsedDestinationLat,
    destinationLng: parsedDestinationLng,
    pickupRadiusMiles: parsedPickupRadiusMiles,
    dropoffRadiusMiles: parsedDropoffRadiusMiles,
    distanceMiles: calculateDistanceMiles(parsedOriginLat, parsedOriginLng, parsedDestinationLat, parsedDestinationLng),
    date,
    time,
    estimatedDurationMinutes: sanitizeDurationMinutes(estimatedDurationMinutes),
    returnRide: hasReturnRide ? { date: returnDate, time: returnTime } : null,
    vehicleSeatCount,
    availableSeatIds,
    seatsAvailable: availableSeatIds.length,
    priceCents,
    carMaker: String(carMaker).trim(),
    carModel: String(carModel).trim(),
    carColor: String(carColor).trim(),
    licensePlate: String(licensePlate).trim().toUpperCase(),
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

  ride.passengers.push({
    studentId: student.id,
    studentFirstName: student.firstName,
    studentLastName: student.lastName,
    studentGender: student.gender || '',
    email: student.email,
    seatId,
  });
  ride.seatsAvailable = getAvailableOpenSeatIds(ride).length;
  saveDb(db);
  res.json(withRideMiles(ride, db));
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
  const text = String(req.body.text || '').trim();
  if (!text) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }
  if (text.length > 500) {
    return res.status(400).json({ error: 'Message must be 500 characters or fewer' });
  }

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
  saveDb(db);
  res.json({ message, messages: db.rideMessages[ride.id] });
});

app.get('/api/cart', requireAuth, requireServiceAccess, (req, res) => {
  const db = loadDb();
  const cartEntries = normalizeCartEntries(db, req.session.userId);
  const cartRides = cartEntries
    .map((entry) => {
      const ride = db.rides.find((item) => item.id === entry.rideId);
      return ride ? { ...rideForUser(ride, req.session.userId, db), selectedSeatId: entry.seatId } : null;
    })
    .filter(Boolean);

  saveDb(db);
  res.json({ rides: cartRides });
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
    const reserveError = canStudentReserveRide(student, ride, entry.seatId, db);
    if (reserveError) {
      const rideLabel = ride ? ride.origin + ' to ' + ride.destination : entry.rideId;
      return { error: reserveError + ': ' + rideLabel };
    }
    ridesToReserve.push({ ride, seatId: entry.seatId });
  }

  const internalConflict = findInternalRideConflict(ridesToReserve.map(({ ride }) => ride));
  if (internalConflict) {
    return { error: 'Two rides in your cart overlap: ' + describeTripTime(internalConflict[0]) + ' and ' + describeTripTime(internalConflict[1]) };
  }

  ridesToReserve.forEach(({ ride, seatId }) => {
    ride.passengers.push({
      studentId: student.id,
      studentFirstName: student.firstName,
      studentLastName: student.lastName,
      studentGender: student.gender || '',
      email: student.email,
      seatId,
    });
    ride.seatsAvailable = getAvailableOpenSeatIds(ride).length;
  });

  return { ridesToReserve };
}

app.post('/api/cart/checkout', requireAuth, requireServiceAccess, (req, res) => {
  const paymentValidation = validatePayment(req.body.payment);
  if (!paymentValidation.valid) {
    return res.status(400).json({ error: paymentValidation.error });
  }

  const db = loadDb();
  const student = db.users.find((u) => u.id === req.session.userId);
  if (!student) {
    return res.status(404).json({ error: 'User not found' });
  }

  const cartEntries = normalizeCartEntries(db, student.id);
  const reservation = reserveCartRides(db, student, cartEntries);
  if (reservation.error) {
    return res.status(400).json({ error: reservation.error });
  }

  db.payments = db.payments || [];
  db.payments.push({
    id: uuidv4(),
    studentId: student.id,
    rideIds: reservation.ridesToReserve.map(({ ride }) => ride.id),
    seats: reservation.ridesToReserve.map(({ ride, seatId }) => ({ rideId: ride.id, seatId })),
    cardLast4: paymentValidation.last4,
    status: 'paid',
    createdAt: new Date().toISOString(),
  });

  db.carts[student.id] = [];
  saveDb(db);
  res.json({ message: 'Payment complete. Your seats are booked.', rides: reservation.ridesToReserve.map(({ ride }) => withRideMiles(ride, db)) });
});

app.post('/api/cart/create-checkout-session', requireAuth, requireServiceAccess, (req, res) => {
  const db = loadDb();
  const student = db.users.find((u) => u.id === req.session.userId);
  if (!student) {
    return res.status(404).json({ error: 'User not found' });
  }

  const cartEntries = normalizeCartEntries(db, student.id);
  if (!cartEntries.length) {
    return res.status(400).json({ error: 'Your cart is empty' });
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

  db.checkoutSessions = db.checkoutSessions || [];
  const sessionId = uuidv4();
  db.checkoutSessions.push({
    id: sessionId,
    studentId: student.id,
    cartEntries: cartEntries.map((entry) => ({ ...entry })),
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  saveDb(db);

  res.json({ url: APP_BASE_URL + '/?checkout=success&session_id=' + sessionId, sessionId });
});

app.post('/api/cart/checkout/complete', requireAuth, requireServiceAccess, (req, res) => {
  const sessionId = String(req.body.sessionId || '').trim();
  const db = loadDb();
  const student = db.users.find((u) => u.id === req.session.userId);
  if (!student) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.checkoutSessions = db.checkoutSessions || [];
  const checkoutSession = db.checkoutSessions.find((session) => session.id === sessionId && session.studentId === student.id);
  if (!checkoutSession) {
    return res.status(404).json({ error: 'Checkout session not found' });
  }
  if (checkoutSession.status === 'paid') {
    return res.json({ message: 'Payment already completed.' });
  }

  const cartEntries = checkoutSession.cartEntries || normalizeCartEntries(db, student.id);
  const reservation = reserveCartRides(db, student, cartEntries);
  if (reservation.error) {
    checkoutSession.status = 'failed';
    saveDb(db);
    return res.status(400).json({ error: reservation.error });
  }

  checkoutSession.status = 'paid';
  checkoutSession.completedAt = new Date().toISOString();
  db.payments = db.payments || [];
  db.payments.push({
    id: uuidv4(),
    studentId: student.id,
    rideIds: reservation.ridesToReserve.map(({ ride }) => ride.id),
    seats: reservation.ridesToReserve.map(({ ride, seatId }) => ({ rideId: ride.id, seatId })),
    status: 'paid',
    createdAt: checkoutSession.completedAt,
  });
  db.carts[student.id] = [];
  saveDb(db);
  res.json({ message: 'Payment complete. Your selected seats are booked.', rides: reservation.ridesToReserve.map(({ ride }) => withRideMiles(ride, db)) });
});

app.post('/api/cart/:rideId', requireAuth, requireServiceAccess, (req, res) => {
  const { rideId } = req.params;
  const seatId = String(req.body.seatId || '').trim();
  if (req.body.termsAccepted !== true) {
    return res.status(400).json({ error: 'You must agree to the Terms and Conditions before adding this ride' });
  }
  const db = loadDb();
  const student = db.users.find((u) => u.id === req.session.userId);
  if (!student) {
    return res.status(404).json({ error: 'User not found' });
  }

  const ride = db.rides.find((r) => r.id === rideId);
  const reserveError = canStudentReserveRide(student, ride, seatId, db);
  if (reserveError) {
    return res.status(400).json({ error: reserveError });
  }

  const cartEntries = normalizeCartEntries(db, student.id);
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
    existingEntry.termsAcceptedAt = new Date().toISOString();
  } else {
    cartEntries.push({ rideId: ride.id, seatId, termsAcceptedAt: new Date().toISOString() });
  }
  saveDb(db);

  res.json({ message: 'Seat added to cart', rides: cartEntries });
});

app.delete('/api/cart/:rideId', requireAuth, requireServiceAccess, (req, res) => {
  const { rideId } = req.params;
  const db = loadDb();
  const cartEntries = normalizeCartEntries(db, req.session.userId);
  db.carts[req.session.userId] = cartEntries.filter((entry) => entry.rideId !== rideId);
  saveDb(db);

  res.json({ message: 'Ride removed from cart' });
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
        driverRatingByCurrentUser: passenger?.driverRating || null,
        driverRatingCommentByCurrentUser: passenger?.driverRatingComment || '',
      };
    }),
    riderRequests,
    driverOffers,
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`LinkUp server listening on http://localhost:${PORT}`);
});
