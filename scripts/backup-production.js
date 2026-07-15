const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

require('dotenv').config({ path: process.env.LINKUP_ENV_FILE || '.env' });

const databaseUrl = process.env.DATABASE_URL || '';
if (!databaseUrl) throw new Error('DATABASE_URL is required');

const pgDump = process.env.PG_DUMP_PATH || '/opt/homebrew/opt/libpq/bin/pg_dump';
const pgRestore = process.env.PG_RESTORE_PATH || '/opt/homebrew/opt/libpq/bin/pg_restore';
for (const binary of [pgDump, pgRestore]) {
  if (!fs.existsSync(binary)) throw new Error(`PostgreSQL backup tool not found: ${binary}`);
}

const root = path.resolve(__dirname, '..');
const backupDir = path.resolve(process.env.BACKUP_DIR || path.join(root, 'data', 'backups'));
fs.mkdirSync(backupDir, { recursive: true, mode: 0o700 });
fs.chmodSync(backupDir, 0o700);

const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const backupPath = path.join(backupDir, `linkup-production-${timestamp}.dump`);
const sslMode = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true' ? 'verify-full' : 'require';
const childEnv = {
  ...process.env,
  PGSSLMODE: sslMode,
  ...(process.env.DATABASE_SSL_CA_PATH ? { PGSSLROOTCERT: process.env.DATABASE_SSL_CA_PATH } : {}),
};

function run(binary, args) {
  const result = spawnSync(binary, args, { env: childEnv, encoding: 'utf8' });
  if (result.status !== 0) {
    try { fs.unlinkSync(backupPath); } catch (_) {}
    throw new Error(`${path.basename(binary)} failed: ${String(result.stderr || '').trim() || `exit ${result.status}`}`);
  }
  return result;
}

run(pgDump, ['--format=custom', '--no-owner', '--no-privileges', `--file=${backupPath}`, databaseUrl]);
fs.chmodSync(backupPath, 0o600);
const listing = run(pgRestore, ['--list', backupPath]).stdout;
const stat = fs.statSync(backupPath);
if (stat.size < 1024 || !/TABLE|SCHEMA|DATABASE/i.test(listing)) {
  throw new Error('Backup verification failed: archive is empty or has no database objects');
}

const sha256 = crypto.createHash('sha256').update(fs.readFileSync(backupPath)).digest('hex');
const manifest = {
  createdAt: new Date().toISOString(),
  file: path.basename(backupPath),
  bytes: stat.size,
  sha256,
  sslMode,
  verifiedWithPgRestore: true,
};
const manifestPath = `${backupPath}.json`;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', { mode: 0o600 });

console.log(`[backup] verified ${manifest.file} (${manifest.bytes} bytes)`);
console.log(`[backup] manifest ${path.basename(manifestPath)}`);
