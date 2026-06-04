/**
 * Structured logger.
 *
 * Development  → human-readable coloured console output
 * Production   → newline-delimited JSON  (AWS CloudWatch / Datadog compatible)
 *
 * AWS migration: no code changes needed — set NODE_ENV=production and pipe
 * stdout to a CloudWatch log group via the ECS log driver or a log agent.
 */

const isProd = process.env.NODE_ENV === 'production';

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const MIN_LEVEL = LEVELS[process.env.LOG_LEVEL] ?? (isProd ? LEVELS.info : LEVELS.debug);

const COLOURS = { debug: '\x1b[36m', info: '\x1b[32m', warn: '\x1b[33m', error: '\x1b[31m', reset: '\x1b[0m' };

function write(level, message, meta = {}) {
  if ((LEVELS[level] ?? 0) < MIN_LEVEL) return;

  if (isProd) {
    const entry = { level, message, ...meta, timestamp: new Date().toISOString() };
    process.stdout.write(JSON.stringify(entry) + '\n');
  } else {
    const c = COLOURS[level] ?? '';
    const r = COLOURS.reset;
    const prefix = `${c}[${level.toUpperCase()}]${r}`;
    const metaStr = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
    console.log(`${prefix} ${message}${metaStr}`);
  }
}

const logger = {
  debug: (msg, meta) => write('debug', msg, meta),
  info:  (msg, meta) => write('info',  msg, meta),
  warn:  (msg, meta) => write('warn',  msg, meta),
  error: (msg, meta) => write('error', msg, meta),

  /**
   * Express request logger middleware.
   * Logs method, path, status, and duration for every request.
   */
  requestMiddleware() {
    return (req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const ms = Date.now() - start;
        const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
        write(level, `${req.method} ${req.path}`, {
          status: res.statusCode,
          ms,
          ip: req.ip,
        });
      });
      next();
    };
  },
};

module.exports = logger;
