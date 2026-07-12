/* Public interactive demo (?demo=1): serves the real production UI with
   fictional fixture data captured from a scratch server (demo-data.js).
   No API mutation leaves the page — every write is answered locally. */
(() => {
  const demoParams = new URLSearchParams(window.location.search);
  if (demoParams.get('demo') !== '1') return;

  const originalFetch = window.fetch.bind(window);

  window.__LINKUP_DEMO_MODE__ = true;
  document.documentElement.classList.add('linkup-demo-mode');
  if (demoParams.get('embed') === '1') document.documentElement.classList.add('linkup-demo-embed');

  /* ── Fixtures: lazy-load demo-data.js so regular visitors never pay for it ── */
  let fixturesPromise = null;

  function shiftFixtureDates(root, capturedAt) {
    // Keep sample trips in the future forever: shift every date field by the
    // number of days since the fixtures were captured.
    const deltaDays = Math.round((Date.parse(new Date().toISOString().slice(0, 10)) - Date.parse(capturedAt)) / 86400000);
    if (!Number.isFinite(deltaDays) || deltaDays <= 0) return root;
    const shift = (value) => {
      const time = Date.parse(value + 'T12:00:00Z');
      return new Date(time + deltaDays * 86400000).toISOString().slice(0, 10);
    };
    const walk = (node) => {
      if (Array.isArray(node)) { node.forEach(walk); return; }
      if (!node || typeof node !== 'object') return;
      ['date', 'returnDate'].forEach((key) => {
        if (typeof node[key] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(node[key])) node[key] = shift(node[key]);
      });
      Object.values(node).forEach(walk);
    };
    walk(root);
    return root;
  }

  function loadFixtures() {
    if (fixturesPromise) return fixturesPromise;
    fixturesPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/demo-data.js?v=20260712-clean-route-fixtures';
      script.onload = () => {
        const data = window.__LINKUP_DEMO_DATA;
        if (!data?.fixtures) { reject(new Error('Demo fixtures missing')); return; }
        const fixtures = shiftFixtureDates(structuredClone(data.fixtures), data.capturedAt);
        // Follow the visitor's theme rather than the fixture account's setting
        try {
          const themePreference = window.localStorage.getItem('linkup.theme');
          if (themePreference) fixtures.me.themePreference = themePreference;
        } catch (_) {}
        resolve(fixtures);
      };
      script.onerror = () => reject(new Error('Demo fixtures failed to load'));
      document.head.appendChild(script);
    });
    return fixturesPromise;
  }

  const json = (body, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
  const bodyJson = (options) => {
    try { return JSON.parse(options?.body || '{}'); } catch (_) { return {}; }
  };

  const DEMO_BLOCKED = 'You found the edge of the demo — create a free account to do this for real.';

  /* Cart is interactive: adding/removing seats works, entirely in-page. */
  let cartRides = null;
  const getCartRides = (fx) => {
    if (!cartRides) cartRides = (fx.cart?.rides || []).map((ride) => structuredClone(ride));
    return cartRides;
  };

  async function answer(path, method, options) {
    const fx = await loadFixtures();

    if (path === '/api/auth/me' && method === 'GET') return json(fx.me);
    if (path === '/api/auth/signout') return json({ message: 'Demo closed.' });
    if (path === '/api/rides' && method === 'GET') return json(fx.rides);
    if (path === '/api/ride-requests' && method === 'GET') return json(fx.rideRequests);
    if (path === '/api/profile' && method === 'GET') return json(fx.profile);
    if (path === '/api/leaderboard/schools' && method === 'GET') return json(fx.leaderboard);
    if (path === '/api/notifications' && method === 'GET') return json({ notifications: [] });

    if (path === '/api/cart' && method === 'GET') {
      return json({ rides: getCartRides(fx), expiredRideCount: 0 });
    }
    const cartMatch = path.match(/^\/api\/cart\/([^/]+)$/);
    if (cartMatch && method === 'POST') {
      const rideId = decodeURIComponent(cartMatch[1]);
      const ride = fx.rides.find((item) => item.id === rideId);
      if (!ride) return json({ error: 'That sample ride is not in the demo.' }, 404);
      const payload = bodyJson(options);
      const rides = getCartRides(fx);
      const entry = {
        ...structuredClone(ride),
        selectedSeatId: payload.seatId || '',
        actualPickup: payload.actualPickup || '',
        actualDropoff: payload.actualDropoff || '',
        cartTermsAccepted: true,
      };
      const existingIndex = rides.findIndex((item) => item.id === ride.id);
      if (existingIndex >= 0) rides[existingIndex] = entry;
      else rides.push(entry);
      return json({ message: 'Seat added to cart', rides });
    }
    if (cartMatch && method === 'DELETE') {
      const rideId = decodeURIComponent(cartMatch[1]);
      cartRides = getCartRides(fx).filter((item) => item.id !== rideId);
      return json({ message: 'Removed from your cart.' });
    }

    // Payout "refresh status" returns the (fictional) current user
    if (path === '/api/profile/payout/status') return json(fx.me);

    // Quiet no-ops the app may fire in the background
    if (path === '/api/device-token') return json({ message: 'ok' });

    if (method !== 'GET') return json({ error: DEMO_BLOCKED }, 403);
    return json({ error: 'This area has no demo data yet — it works in the real app.' }, 404);
  }

  window.fetch = (input, options = {}) => {
    const requestUrl = typeof input === 'string' ? input : input.url;
    const url = new URL(requestUrl, window.location.origin);
    if (url.origin !== window.location.origin || !url.pathname.startsWith('/api/')) {
      return originalFetch(input, options);
    }

    // Configuration is not user data. Let the production UI load the normal
    // browser-safe Maps key so sample routes and pins render in the demo.
    if (url.pathname === '/api/config/google-maps-key') {
      return originalFetch('/api/demo/config/google-maps-key', { credentials: 'same-origin' });
    }

    const method = String(options.method || (typeof input !== 'string' && input.method) || 'GET').toUpperCase();
    return answer(url.pathname, method, options).catch(() => json({ error: 'Demo data failed to load. Refresh to try again.' }, 500));
  };

  /* ── Demo header: keep standalone and embedded previews identical ── */
  document.addEventListener('DOMContentLoaded', () => {
    const greetingBar = document.getElementById('dashboard-greeting-bar');
    const topRow = document.querySelector('#dashboard > .top-row');
    const topActions = topRow?.querySelector('.top-actions');
    if (greetingBar && topActions) {
      const greetingText = document.createElement('div');
      greetingText.className = 'greeting-text';
      const welcome = document.getElementById('welcome-message');
      const university = document.getElementById('student-university-label');
      if (welcome) greetingText.appendChild(welcome);
      if (university) greetingText.appendChild(university);
      greetingBar.replaceChildren(greetingText, topActions);
      topRow.remove();
    }
    const signout = document.getElementById('signout');
    signout?.addEventListener('click', (event) => {
      // Leaving the demo should exit the iframe, not render the waitlist inside it
      event.preventDefault();
      event.stopImmediatePropagation();
      try { window.top.location.assign('/'); } catch (_) { window.location.assign('/'); }
    }, true);
  });
})();
