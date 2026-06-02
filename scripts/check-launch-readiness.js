const { execFileSync, spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function log(message) {
  console.log(`[launch-check] ${message}`);
}

function fail(message) {
  console.error(`[launch-check] ${message}`);
  process.exit(1);
}

function checkSyntax() {
  const files = [
    'server.js',
    'public/app.js',
    'public/boot.js',
  ];
  files.forEach((file) => {
    execFileSync(process.execPath, ['--check', path.join(repoRoot, file)], { stdio: 'inherit' });
  });
  log('JavaScript syntax passed.');
}

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function checkStaticAssetReferences() {
  const html = readText('public/index.html');
  const refs = [];
  const attrPattern = /\b(?:src|href)="([^"]+)"/g;
  let match;
  while ((match = attrPattern.exec(html))) refs.push(match[1]);

  const localRefs = refs
    .filter((ref) => !/^(?:https?:)?\/\//.test(ref))
    .filter((ref) => !ref.startsWith('#') && !ref.startsWith('mailto:'));

  localRefs.forEach((ref) => {
    const cleanRef = ref.replace(/^\//, '').split(/[?#]/)[0];
    if (!cleanRef) return;
    const fullPath = path.join(repoRoot, 'public', cleanRef);
    if (!fs.existsSync(fullPath)) fail(`Missing static asset referenced by index.html: ${ref}`);
  });

  const appScript = html.match(/<script\s+src="app\.js\?v=([^"]+)"/);
  if (!appScript) fail('index.html must load app.js with a cache-busting ?v= value.');
  if (!/login|session|fix|20\d{6}/i.test(appScript[1])) {
    fail(`app.js cache-busting version looks accidental: ${appScript[1]}`);
  }

  const bootScript = html.match(/<script\s+src="boot\.js\?v=([^"]+)"/);
  if (!bootScript) fail('index.html must load boot.js with a cache-busting ?v= value.');

  log('Static asset references passed.');
}

function requestJson({ port, method = 'GET', pathname, body, cookie }) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: pathname,
      method,
      headers: {
        ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
    }, (res) => {
      let text = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { text += chunk; });
      res.on('end', () => {
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch (_) {}
        resolve({ status: res.statusCode, headers: res.headers, data, text });
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function waitForServer(port, child, getOutput) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (child.exitCode !== null) {
        reject(new Error(`server exited early with code ${child.exitCode}\n${getOutput()}`));
        return;
      }
      try {
        const res = await requestJson({ port, pathname: '/api/auth/me' });
        if (res.status === 401) {
          resolve();
          return;
        }
      } catch (_) {}
      if (Date.now() - startedAt > 12000) {
        reject(new Error(`server did not become ready within 12 seconds\n${getOutput()}`));
        return;
      }
      setTimeout(tick, 250);
    };
    tick();
  });
}

async function checkAuthSmoke() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'linkup-launch-check-'));
  const dataDir = path.join(tempRoot, 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'db.json'), JSON.stringify({
    meta: { schemaVersion: 2 },
    users: [{
      id: 'startup-waitlist-user',
      firstName: 'Startup',
      lastName: 'Waitlist',
      birthday: '2000-01-01',
      gender: 'prefer-not-to-say',
      email: 'startup.waitlist@uci.edu',
      university: 'University of California, Irvine',
      universityDomain: 'uci.edu',
      serviceApproved: false,
      waitlistedAt: new Date(Date.now() - 86400000).toISOString(),
      passwordHash: 'unused',
      emailVerified: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }],
    rides: [],
    rideRequests: [],
    payments: [],
    friendInvites: [],
  }, null, 2));
  const envPath = path.join(tempRoot, '.env.launch-check');
  const port = 4300 + Math.floor(Math.random() * 1000);
  fs.writeFileSync(envPath, [
    'NODE_ENV=development',
    `PORT=${port}`,
    'HOST=127.0.0.1',
    `DATA_DIR=${dataDir}`,
    `SESSION_SECRET=launch_check_${Date.now()}`,
    'BYPASS_EMAIL_VERIFICATION=true',
    `APP_BASE_URL=http://127.0.0.1:${port}`,
    'DATABASE_URL=',
    'RIDE_SERVICES_PAUSED=false',
    'WAITLIST_MODE=false',
  ].join('\n'));

  const child = spawn(process.execPath, ['server.js'], {
    cwd: repoRoot,
    env: {
      ...process.env,
      LINKUP_ENV_FILE: envPath,
      PORT: String(port),
      DATA_DIR: dataDir,
      DATABASE_URL: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk.toString(); });
  child.stderr.on('data', (chunk) => { output += chunk.toString(); });

  try {
    await waitForServer(port, child, () => output);
    let startupOutbox = [];
    try {
      startupOutbox = JSON.parse(fs.readFileSync(path.join(dataDir, 'email-outbox.json'), 'utf8'));
    } catch (_) {}
    if (!startupOutbox.some((email) => email.to === 'startup.waitlist@uci.edu' && /school is approved/i.test(email.subject || ''))) {
      fail('Startup approved-school email was not sent to a waitlisted supported-school user.');
    }
    const signin = await requestJson({
      port,
      method: 'POST',
      pathname: '/api/auth/signin',
      body: { email: 'launch.smoke@uci.edu', password: 'Testpass1!' },
    });
    if (signin.status !== 200) {
      fail(`Sign-in smoke test failed with ${signin.status}: ${signin.text || JSON.stringify(signin.data)}`);
    }
    const cookie = (signin.headers['set-cookie'] || []).map((value) => value.split(';')[0]).join('; ');
    if (!cookie.includes('linkup.sid=')) fail('Sign-in smoke test did not set linkup.sid.');

    const me = await requestJson({ port, pathname: '/api/auth/me', cookie });
    if (me.status !== 200 || me.data?.email !== 'launch.smoke@uci.edu') {
      fail(`Session smoke test failed with ${me.status}: ${me.text || JSON.stringify(me.data)}`);
    }
    if (!/^http:\/\/127\.0\.0\.1:\d+\/\?invite=/.test(me.data?.friendInviteUrl || '')) {
      fail(`Session smoke test returned unexpected friendInviteUrl: ${JSON.stringify(me.data?.friendInviteUrl)}`);
    }
    const inviteCode = new URL(me.data.friendInviteUrl).searchParams.get('invite');
    const inviteLookup = await requestJson({ port, pathname: '/api/invites/' + encodeURIComponent(inviteCode) });
    if (inviteLookup.status !== 200 || inviteLookup.data?.inviterFirstName !== 'Launch') {
      fail(`Friend invite lookup smoke test failed with ${inviteLookup.status}: ${inviteLookup.text || JSON.stringify(inviteLookup.data)}`);
    }
    const invite = await requestJson({
      port,
      method: 'POST',
      pathname: '/api/profile/invite-friend',
      cookie,
      body: { email: 'friend.launch.smoke@example.com' },
    });
    if (invite.status !== 200) {
      fail(`Friend invite smoke test failed with ${invite.status}: ${invite.text || JSON.stringify(invite.data)}`);
    }
    if (invite.data?.inviteCount !== 1) {
      fail(`Friend invite smoke test returned unexpected inviteCount: ${JSON.stringify(invite.data)}`);
    }
    const outboxPath = path.join(dataDir, 'email-outbox.json');
    const outbox = JSON.parse(fs.readFileSync(outboxPath, 'utf8'));
    const inviteEmail = outbox.find((email) => email.to === 'friend.launch.smoke@example.com');
    if (!inviteEmail || !/invited you to LinkUp/.test(inviteEmail.subject || '')) {
      fail('Friend invite smoke test did not write the expected invite email.');
    }
    if (!String(inviteEmail.text || inviteEmail.html || '').includes('?invite=')) {
      fail('Friend invite smoke test email did not include the personalized invite link.');
    }
    log('Auth smoke test passed.');
  } finally {
    child.kill('SIGTERM');
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

(async () => {
  try {
    checkSyntax();
    checkStaticAssetReferences();
    await checkAuthSmoke();
    log('All launch-readiness checks passed.');
  } catch (error) {
    fail(`${error.message}\n${error.stack || ''}`);
  }
})();
