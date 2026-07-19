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
    const cleanRef = ref.split(/[?#]/)[0];
    if (path.extname(cleanRef) && !ref.startsWith('/')) {
      fail(`Browser asset URLs in index.html must be root-absolute for clean routes: ${ref}`);
    }
  });

  localRefs.forEach((ref) => {
    const cleanRef = ref.replace(/^\//, '').split(/[?#]/)[0];
    if (!cleanRef) return;
    if (ref.startsWith('/') && !path.extname(cleanRef)) return;
    const fullPath = path.join(repoRoot, 'public', cleanRef);
    if (!fs.existsSync(fullPath)) fail(`Missing static asset referenced by index.html: ${ref}`);
  });

  const appScript = html.match(/<script\s+src="\/?app\.js\?v=([^"]+)"/);
  if (!appScript) fail('index.html must load app.js with a cache-busting ?v= value.');
  if (!/login|session|fix|20\d{6}/i.test(appScript[1])) {
    fail(`app.js cache-busting version looks accidental: ${appScript[1]}`);
  }

  const bootScript = html.match(/<script\s+src="\/?boot\.js\?v=([^"]+)"/);
  if (!bootScript) fail('index.html must load boot.js with a cache-busting ?v= value.');
  const demoMode = readText('public/demo-mode.js');
  if (!/script\.src\s*=\s*['"]\/demo-data\.js\?v=/.test(demoMode)) {
    fail('demo-mode.js must load demo-data.js from the site root so clean subpage routes keep demo fixtures working.');
  }
  const runtimeLogoSources = [readText('public/app.js'), readText('public/boot.js')].join('\n');
  if (/\.src\s*=\s*['"]assets\/images\/LinkUp-/.test(runtimeLogoSources)) {
    fail('Runtime LinkUp logo assignments must use root-absolute /assets paths so clean subpage routes do not break them.');
  }
  const runtimeAssetAssignment = /(?:\.src|\.href|setAttribute\(\s*['"](?:src|href)['"]\s*,)\s*=*\s*['"](?!\/|https?:|data:|#)([^'"]+\.(?:css|js|png|jpe?g|webp|svg|ico))/gi;
  let runtimeMatch;
  for (const [file, source] of [['public/app.js', readText('public/app.js')], ['public/boot.js', readText('public/boot.js')], ['public/demo-mode.js', demoMode]]) {
    runtimeAssetAssignment.lastIndex = 0;
    if ((runtimeMatch = runtimeAssetAssignment.exec(source))) {
      fail(`Runtime browser assets must be root-absolute in ${file}: ${runtimeMatch[1]}`);
    }
  }

  log('Static asset references passed.');
}

function checkUiIntegrity() {
  const app = readText('public/app.js');
  const demoMode = readText('public/demo-mode.js');
  const styles = readText('public/styles.css');
  const components = readText('public/ui-components.css');
  const demoHtml = readText('public/previews/linkup-demo-preview.html');
  const demoScript = readText('public/previews/linkup-production-demo.js');
  const serviceWorker = readText('public/service-worker.js');
  const server = readText('server.js');

  const assertBalancedCss = (source, file) => {
    let depth = 0;
    let line = 1;
    const openings = [];
    for (const character of source) {
      if (character === '\n') line += 1;
      if (character === '{') {
        depth += 1;
        openings.push(line);
      } else if (character === '}') {
        depth -= 1;
        openings.pop();
        if (depth < 0) fail(`${file} has an unmatched closing brace near line ${line}.`);
      }
    }
    if (depth !== 0) fail(`${file} has ${depth} unmatched opening brace(s), last opened near line ${openings.at(-1)}.`);
  };

  assertBalancedCss(styles, 'styles.css');
  assertBalancedCss(components, 'ui-components.css');

  if (/!important/.test(components)) {
    fail('ui-components.css must use normal cascade ownership; !important is not allowed.');
  }

  if (/[?&]ui=/.test(demoHtml) || /[?&]ui=/.test(demoScript)) {
    fail('Demo routes must inherit versioned production assets; do not add a separate ui= cache revision.');
  }

  if (!/fetch\(['"]\/release-notes\.md['"]/.test(app)) {
    fail('Release notes must use a root-absolute URL so clean demo routes cannot receive index.html.');
  }
  if (!/demo-settings-readonly/.test(demoMode)
    || !/input, select, textarea/.test(demoMode)
    || !/\.profile-sidebar-button, #profile-back-home/.test(demoMode)
    || !/MutationObserver/.test(demoMode)) {
    fail('Demo settings must remain visible and navigable while every editable control stays read-only.');
  }
  if (!/input:not\(\[type="radio"\]\):not\(\[type="checkbox"\]\):disabled/.test(components)) {
    fail('Demo read-only styling must not reveal full-card radio or checkbox inputs.');
  }
  if (!/profile-picture-input-hidden:disabled/.test(components)
    || !/profile-avatar-edit-overlay:disabled/.test(components)
    || !/theme-choice-card input\[type="radio"\]:disabled/.test(components)) {
    fail('Disabled demo settings must keep file, avatar-overlay, and theme hit-area controls hidden.');
  }

  ['/rides', '/rides/request', '/rides/list', '/rides/yours', '/cart', '/checkout', '/messages', '/profile'].forEach((pathname) => {
    if (!app.includes(`'${pathname}'`)) fail(`Clean route mapping is missing ${pathname}.`);
  });

  if (!/rel="icon"/.test(demoHtml) || !server.includes("app.get('/favicon.ico'")) {
    fail('Demo and standalone pages must have LinkUp favicon coverage.');
  }

  [demoHtml, demoScript, serviceWorker, server].forEach((source) => {
    if (/\/#(?:chat|browse|cart|your-rides|profile|request-ride|list-ride|payment)/.test(source)) {
      fail('New internal links must use clean paths, not legacy hash routes.');
    }
  });

  if (!server.includes("app.get('/demo'")) fail('Server must expose the interactive demo at /demo.');
  if (!/src="\/rides\/rider\?demo=1(?:&amp;|&)embed=1"/.test(demoHtml)) {
    fail('The interactive demo iframe must start on the signed-in rider browse route.');
  }

  if (/\.cart-item-card\.cart-item-selected\s*\{[^}]*background:\s*rgba\(12,\s*22,\s*26/gs.test(styles)) {
    fail('Legacy cart selected-state background conflicts with light theme. Keep theme state in the canonical theme block.');
  }
  if (/\.top-row\s*>\s*div:first-child\s*\{/.test(styles)) {
    fail('Dashboard top-row layout must not style the first div generically; the navigation may be the first child and become vertical.');
  }

  ['.ride-card', '.ride-details', '.cart-item-card'].forEach((selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const definitions = styles.match(new RegExp(`^${escaped}\\s*\\{`, 'gm')) || [];
    if (definitions.length !== 1) {
      fail(`${selector} must have exactly one base definition in styles.css; found ${definitions.length}.`);
    }
  });

  ['#list-ride-page', '#your-rides-page.card'].forEach((selector) => {
    if (!components.includes(`${selector} {`)) fail(`${selector} must be owned by ui-components.css.`);
  });

  if (/ui-overrides\.css/.test(readText('public/index.html')) || /ui-overrides\.css/.test(demoHtml)) {
    fail('Legacy ui-overrides.css must not be loaded; canonical page rules belong in ui-components.css.');
  }

  const renderCartItem = app.match(/function renderCartItem\(ride\)\s*\{([\s\S]*?)\n\}/)?.[1] || '';
  if (/buildRideSummary\s*\(/.test(renderCartItem)) {
    fail('renderCartItem must render cart markup directly; build-then-strip causes duplicate UI when ride cards change.');
  }
  if (!/document\.createElement\(['"]div['"]\)/.test(renderCartItem) || !/cart-item-card/.test(renderCartItem)) {
    fail('renderCartItem must create a dedicated cart-item-card root.');
  }

  if (!/html\[data-theme="light"\]\s+\.cart-item-card\.cart-item-selected/.test(styles)) {
    fail('Canonical theme stylesheet must define the selected cart card in light mode.');
  }

  log('UI integrity checks passed.');
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
        const ready = await requestJson({ port, pathname: '/ready' });
        const auth = await requestJson({ port, pathname: '/api/auth/me' });
        if (ready.status === 200 && ready.data?.ready === true && auth.status === 401) {
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
      email: 'startup.waitlist@ucla.edu',
      university: 'University of California, Los Angeles',
      universityDomain: 'ucla.edu',
      serviceApproved: false,
      waitlistedAt: new Date(Date.now() - 86400000).toISOString(),
      passwordHash: 'unused',
      emailVerified: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }, {
      id: 'unknown-waitlist-school-user',
      firstName: 'Unknown',
      lastName: 'School',
      birthday: '2000-01-01',
      gender: 'prefer-not-to-say',
      email: 'unknown.student@unknownuniversity.edu',
      university: 'unknownuniversity.edu',
      universityDomain: 'unknownuniversity.edu',
      serviceApproved: false,
      waitlistedAt: new Date(Date.now() - 43200000).toISOString(),
      waitlistIntent: 'rider',
      passwordHash: 'unused',
      emailVerified: true,
      createdAt: new Date(Date.now() - 43200000).toISOString(),
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
    const nestedRoute = await requestJson({ port, pathname: '/rides/rider?demo=1&embed=1' });
    if (nestedRoute.status !== 200 || !/href="\/styles\.css\?v=/.test(nestedRoute.text) || !/src="\/demo-mode\.js\?v=/.test(nestedRoute.text) || !/src="\/app\.js\?v=/.test(nestedRoute.text)) {
      fail(`Nested clean route did not return root-absolute production assets (${nestedRoute.status}).`);
    }
    const demoPage = await requestJson({ port, pathname: '/demo?from=waitlist' });
    if (demoPage.status !== 200 || !/src="\/rides\/rider\?demo=1&amp;embed=1"/.test(demoPage.text)) {
      fail(`Interactive demo did not target the signed-in rider route (${demoPage.status}).`);
    }
    for (const asset of ['/styles.css', '/ui-components.css', '/app.js', '/boot.js', '/demo-mode.js', '/demo-data.js', '/assets/images/LinkUp-header.png', '/assets/images/LinkUp-wordmark.png']) {
      const response = await requestJson({ port, pathname: asset });
      if (response.status !== 200 || /text\/html/.test(String(response.headers['content-type'] || ''))) {
        fail(`Clean-route critical asset failed: ${asset} returned ${response.status} ${response.headers['content-type'] || ''}.`);
      }
    }
    log('Clean-route and demo asset smoke test passed.');
    let startupOutbox = [];
    try {
      startupOutbox = JSON.parse(fs.readFileSync(path.join(dataDir, 'email-outbox.json'), 'utf8'));
    } catch (_) {}
    if (!startupOutbox.some((email) => email.to === 'startup.waitlist@ucla.edu' && /school is approved/i.test(email.subject || ''))) {
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
    const waitlistIntent = await requestJson({
      port,
      method: 'PUT',
      pathname: '/api/profile/waitlist-intent',
      cookie,
      body: { waitlistIntent: 'driver' },
    });
    if (waitlistIntent.status !== 200 || waitlistIntent.data?.waitlistIntent !== 'driver') {
      fail(`Waitlist intent smoke test failed with ${waitlistIntent.status}: ${waitlistIntent.text || JSON.stringify(waitlistIntent.data)}`);
    }
    const waitlistLeaderboard = await requestJson({ port, pathname: '/api/leaderboard/waitlist-schools', cookie });
    const unknownSchool = (waitlistLeaderboard.data?.schools || []).find((school) => school.domain === 'unknownuniversity.edu');
    if (waitlistLeaderboard.status !== 200 || !unknownSchool || unknownSchool.school !== 'unknownuniversity.edu' || unknownSchool.needsReview !== true) {
      fail(`Waitlist leaderboard smoke test failed with ${waitlistLeaderboard.status}: ${waitlistLeaderboard.text || JSON.stringify(waitlistLeaderboard.data)}`);
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
    const deleteAccount = await requestJson({
      port,
      method: 'DELETE',
      pathname: '/api/profile/account',
      cookie,
      body: { password: 'Testpass1!', confirmText: 'DELETE' },
    });
    if (deleteAccount.status !== 200) {
      fail(`Delete account smoke test failed with ${deleteAccount.status}: ${deleteAccount.text || JSON.stringify(deleteAccount.data)}`);
    }
    const deletedMe = await requestJson({ port, pathname: '/api/auth/me', cookie });
    if (deletedMe.status !== 401) {
      fail(`Deleted account session smoke test expected 401, got ${deletedMe.status}: ${deletedMe.text || JSON.stringify(deletedMe.data)}`);
    }
    // Users migrated out of the blob into their own per-row store (users.json in file mode).
    const usersPath = path.join(dataDir, 'users.json');
    const storedUsers = fs.existsSync(usersPath) ? JSON.parse(fs.readFileSync(usersPath, 'utf8')) : [];
    const deletedUser = storedUsers.find((user) => user.id === me.data.id);
    if (!deletedUser?.deletedAt || !String(deletedUser.email || '').endsWith('@deleted.linkup.local') || deletedUser.firstName !== 'Deleted') {
      fail(`Delete account smoke test did not anonymize the user: ${JSON.stringify(deletedUser)}`);
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
    checkUiIntegrity();
    await checkAuthSmoke();
    log('All launch-readiness checks passed.');
  } catch (error) {
    fail(`${error.message}\n${error.stack || ''}`);
  }
})();
