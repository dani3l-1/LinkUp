(() => {
  const finishBoot = () => {
    document.body?.classList.remove('app-booting');
  };

  const showAuthForm = (formId) => {
    document.querySelectorAll('.tab-button').forEach((button) => {
      button.classList.toggle('active', button.dataset.tab + '-form' === formId);
    });
    document.querySelectorAll('.tab-content').forEach((content) => {
      content.classList.toggle('active', content.id === formId);
    });
  };

  const showMessage = (id, message) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = message || '';
    element.classList.toggle('show', Boolean(message));
  };

  const postJson = async (url, payload) => {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : {};
    if (!response.ok) throw new Error(data.error || 'Request failed.');
    return data;
  };

  const validateSignupPassword = () => {
    const password = document.getElementById('signup-password')?.value || '';
    const checks = {
      'req-length': password.length >= 8,
      'req-uppercase': /[A-Z]/.test(password),
      'req-lowercase': /[a-z]/.test(password),
      'req-number': /[0-9]/.test(password),
      'req-special': /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password),
    };
    Object.entries(checks).forEach(([id, met]) => {
      document.getElementById(id)?.classList.toggle('met', met);
    });
    return Object.values(checks).every(Boolean);
  };

  const enterAuthenticatedShell = (user) => {
    document.body?.classList.add('dashboard-mode');
    const siteLogo = document.querySelector('.site-logo');
    if (siteLogo) {
      siteLogo.src = 'assets/images/LinkUp-wordmark.png';
      siteLogo.alt = 'LinkUp';
    }
    document.getElementById('auth-section')?.classList.add('hidden');
    document.getElementById('dashboard')?.classList.remove('hidden');
    document.getElementById('header-actions')?.classList.remove('hidden');
    document.getElementById('header-left-actions')?.classList.remove('hidden');
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${user.firstName || 'there'}`;
  };

  const apiJson = async (url, options = {}) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    let response;
    try {
      response = await fetch(url, { credentials: 'same-origin', signal: controller.signal, ...options });
    } finally {
      window.clearTimeout(timeout);
    }
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : null;
    if (!response.ok) throw new Error(data?.error || 'Request failed.');
    return data;
  };

  const hideDashboardPages = () => {
    [
      'waitlist-page',
      'leaderboard-page',
      'public-profile-page',
      'profile-page',
      'request-ride-page',
      'list-ride-page',
      'chat-page',
      'your-rides-page',
      'cart-page',
      'payment-page',
    ].forEach((id) => document.getElementById(id)?.classList.add('hidden'));
  };

  const showDashboardHomeFallback = () => {
    hideDashboardPages();
    document.getElementById('dashboard-home')?.classList.remove('hidden');
  };

  const renderSimpleList = (items, emptyText) => {
    const ridesList = document.getElementById('rides-list');
    if (!ridesList) return;
    ridesList.innerHTML = '';
    if (!items?.length) {
      ridesList.innerHTML = `<div class="ride-empty-state"><p>${emptyText}</p></div>`;
      return;
    }
    items.slice(0, 20).forEach((item) => {
      const card = document.createElement('article');
      card.className = 'ride-card';
      const origin = item.origin || item.pickup || 'Pick-up';
      const destination = item.destination || item.dropoff || 'Drop-off';
      const price = item.priceCents ? `$${(Number(item.priceCents) / 100).toFixed(2)}` : '';
      card.innerHTML = `
        <div class="ride-card-header">
          <h4>${origin} → ${destination}</h4>
        </div>
        <div class="ride-details-grid">
          <div><strong>School:</strong> ${item.university || 'School not listed'}</div>
          <div><strong>Departure:</strong> ${item.date || ''} ${item.time || ''}</div>
          ${price ? `<div><strong>Price:</strong> ${price}</div>` : ''}
        </div>
      `;
      ridesList.appendChild(card);
    });
  };

  const showBrowseFallback = async (role) => {
    showDashboardHomeFallback();
    document.getElementById('browse-controls')?.classList.toggle('hidden', false);
    document.getElementById('browse-map-panel')?.classList.add('hidden');
    document.getElementById('browse-rider-layout')?.classList.toggle('rider-active', role === 'rider');
    document.getElementById('browse-driver-button')?.classList.toggle('active', role === 'driver');
    document.getElementById('browse-rider-button')?.classList.toggle('active', role === 'rider');
    const title = document.getElementById('browse-title');
    const subtitle = document.getElementById('browse-subtitle');
    const resultsTitle = document.getElementById('browse-results-title');
    const ridesList = document.getElementById('rides-list');
    if (title) title.textContent = role === 'driver' ? 'Browse requested rides' : 'Browse available rides';
    if (subtitle) subtitle.textContent = role === 'driver' ? 'Find riders near your route.' : 'Find seats posted by student drivers.';
    if (resultsTitle) resultsTitle.textContent = role === 'driver' ? 'Requested rides' : 'Available rides';
    if (ridesList) ridesList.textContent = role === 'driver' ? 'Loading ride requests...' : 'Loading rides...';
    try {
      const items = await apiJson(role === 'driver' ? '/api/ride-requests' : '/api/rides');
      renderSimpleList(items, role === 'driver' ? 'No ride requests are posted yet.' : 'No rides are posted yet.');
    } catch (error) {
      if (ridesList) ridesList.textContent = error.message || 'Unable to load rides.';
    }
  };

  const showPageFallback = (pageId) => {
    hideDashboardPages();
    document.getElementById('dashboard-home')?.classList.add('hidden');
    document.getElementById(pageId)?.classList.remove('hidden');
    if (pageId === 'profile-page') showProfileTabFallback('info');
  };

  const showProfileTabFallback = (tabName = 'info') => {
    document.querySelectorAll('.profile-sidebar-button').forEach((button) => {
      button.classList.toggle('active', button.dataset.profileTab === tabName);
    });
    document.querySelectorAll('[data-profile-panel]').forEach((panel) => {
      panel.classList.toggle('hidden', panel.dataset.profilePanel !== tabName);
    });
  };

  document.addEventListener('click', (event) => {
    const tabButton = event.target.closest?.('.tab-button[data-tab]');
    if (!tabButton) return;
    event.preventDefault();
    showAuthForm(tabButton.dataset.tab + '-form');
  }, true);

  document.addEventListener('click', async (event) => {
    if (window.__linkupCriticalNavAttached) return;
    const button = event.target.closest?.('button');
    if (!button || button.classList.contains('tab-button')) return;
    if (button.classList.contains('profile-sidebar-button') && button.dataset.profileTab) {
      event.preventDefault();
      showProfileTabFallback(button.dataset.profileTab);
      return;
    }
    const fallbackActions = {
      'browse-driver-button': () => showBrowseFallback('driver'),
      'browse-rider-button': () => showBrowseFallback('rider'),
      'profile-button': () => showPageFallback('profile-page'),
      'cart-button': () => showPageFallback('cart-page'),
      'leaderboard-button': () => showPageFallback('leaderboard-page'),
      'your-rides-button': () => showPageFallback('your-rides-page'),
      'chat-button': () => showPageFallback('chat-page'),
      'request-ride-button': () => showPageFallback('request-ride-page'),
      'list-ride-button': () => showPageFallback('list-ride-page'),
    };
    const action = fallbackActions[button.id];
    if (!action && button.id !== 'signout') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (button.disabled) return;
    if (button.id === 'signout') {
      try {
        await apiJson('/api/auth/signout', { method: 'POST' });
      } catch (_) {}
      if (window.__linkupShowPublicWaitlist) {
        window.__linkupShowPublicWaitlist();
      } else {
        document.body?.classList.remove('dashboard-mode');
        document.getElementById('dashboard')?.classList.add('hidden');
        document.getElementById('waitlist-page')?.classList.remove('hidden');
        document.getElementById('auth-section')?.classList.add('hidden');
        document.getElementById('header-actions')?.classList.add('hidden');
        document.getElementById('header-left-actions')?.classList.add('hidden');
      }
      return;
    }
    await action();
  }, true);

  document.addEventListener('input', (event) => {
    if (event.target?.id === 'signup-password') validateSignupPassword();
  }, true);

  document.addEventListener('submit', async (event) => {
    if (event.target?.id !== 'signin-form') return;
    if (window.__linkupSigninHandlerAttached) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showMessage('signin-error', '');

    const submitButton = event.target.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    try {
      // sign-in verifies and saves the session server-side before returning 200.
      // Reload immediately — don't make a second /api/auth/me call here because
      // a Postgres read replica can lag behind the write and return a false 401.
      await postJson('/api/auth/signin', {
        email: document.getElementById('signin-email')?.value.trim(),
        password: document.getElementById('signin-password')?.value,
      });
      window.location.replace(window.location.pathname);
    } catch (error) {
      showMessage('signin-error', error.message || 'Unable to sign in.');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }, true);

  document.addEventListener('submit', async (event) => {
    if (event.target?.id !== 'signup-form') return;
    if (window.__linkupSignupHandlerAttached) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showMessage('signup-error', '');

    if (!validateSignupPassword()) {
      showMessage('signup-error', 'Password must meet all requirements.');
      return;
    }
    if (!document.getElementById('signup-terms-agree')?.checked || !document.getElementById('signup-privacy-agree')?.checked) {
      showMessage('signup-error', 'You must agree to the Terms and Conditions and Privacy Notice before creating an account.');
      return;
    }

    const submitButton = event.target.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    try {
      const data = await postJson('/api/auth/signup', {
        firstName: document.getElementById('signup-first-name')?.value.trim(),
        middleName: document.getElementById('signup-middle-name')?.value.trim(),
        lastName: document.getElementById('signup-last-name')?.value.trim(),
        birthday: document.getElementById('signup-birthday')?.value,
        gender: document.getElementById('signup-gender')?.value,
        email: document.getElementById('signup-email')?.value.trim(),
        password: document.getElementById('signup-password')?.value,
        termsAccepted: true,
        privacyAccepted: true,
      });
      if (data.requiresVerification === false) {
        window.location.replace(window.location.pathname);
        return;
      }
      document.getElementById('verification-email-label').textContent = `Enter the 6-digit code sent to ${data.email}.`;
      showMessage('verification-message', data.message || 'Account created. We sent a 6-digit verification code to your email.');
      showAuthForm('verification-form');
    } catch (error) {
      showMessage('signup-error', error.message || 'Unable to create account.');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }, true);

  window.addEventListener('error', finishBoot);
  window.addEventListener('unhandledrejection', finishBoot);
  window.setTimeout(finishBoot, 5000);

  window.addEventListener('DOMContentLoaded', () => {
    validateSignupPassword();
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((response) => (response.ok ? response.json() : null))
      .then((user) => {
        if (user && !window.__linkupDashboardRendered) enterAuthenticatedShell(user);
      })
      .catch(() => {});
  });
})();
