(() => {
  const from = new URLSearchParams(window.location.search).get('from');
  const frame = document.getElementById('demo-production-frame');
  const returnLink = document.querySelector('.demo-return-link');
  const railItems = [...document.querySelectorAll('.demo-rail-item')];
  const dots = [...document.querySelectorAll('.demo-dots span')];
  const hint = document.getElementById('demo-hint-text');
  const stepLabel = document.getElementById('demo-step-label');

  const steps = {
    1: {
      route: 'browse-rider',
      tour: 'find',
      label: 'Find a ride',
      hint: '<strong>Find a ride.</strong> This is the real production browse screen, filled only with fictional campus rides.',
    },
    2: {
      route: 'cart',
      tour: 'book',
      label: 'Book a seat',
      hint: '<strong>Book a seat.</strong> Review a fictional selected seat in the real production cart. Nothing is charged or saved.',
    },
    3: {
      route: 'your-rides',
      tour: 'ride-day',
      label: 'Ride day',
      hint: '<strong>Ride day.</strong> See the same reserved-trip details and safety tools that production riders use.',
    },
    4: {
      route: 'profile-payouts',
      tour: 'drive',
      label: 'Drive & earn',
      hint: '<strong>Drive & earn.</strong> Explore the real production wallet and driver payout experience with fictional balances.',
    },
  };

  let currentStep = 1;
  let frameThemeObserver = null;

  function syncThemeFromFrame() {
    try {
      const frameRoot = frame?.contentDocument?.documentElement;
      const theme = frameRoot?.dataset?.theme;
      if (theme !== 'light' && theme !== 'dark') return;
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      frameThemeObserver?.disconnect();
      frameThemeObserver = new MutationObserver(syncThemeFromFrame);
      frameThemeObserver.observe(frameRoot, { attributes: true, attributeFilter: ['data-theme'] });
    } catch (_) {}
  }

  if (from === 'waitlist' && returnLink) {
    returnLink.textContent = '← Back to waitlist';
    returnLink.setAttribute('aria-label', 'Return to waitlist page');
  }

  function showStep(stepNumber) {
    const nextStep = steps[stepNumber] || steps[1];
    currentStep = Number(stepNumber) || 1;
    railItems.forEach((item) => item.classList.toggle('active', Number(item.dataset.demoStep) === currentStep));
    dots.forEach((dot, index) => dot.classList.toggle('active', index === currentStep - 1));
    if (hint) hint.innerHTML = nextStep.hint;
    if (stepLabel) stepLabel.textContent = `Step ${currentStep} of 4 — ${nextStep.label}`;
    if (frame) {
      frame.setAttribute('aria-busy', 'true');
      frame.src = `/?demo=1&embed=1&tour=${encodeURIComponent(nextStep.tour)}#${encodeURIComponent(nextStep.route)}`;
    }
  }

  frame?.addEventListener('load', () => {
    frame.setAttribute('aria-busy', 'false');
    syncThemeFromFrame();
  });

  railItems.forEach((item) => {
    item.addEventListener('pointerdown', (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      try { item.setPointerCapture?.(event.pointerId); } catch (_) { /* synthetic events have no active pointer */ }
      showStep(Number(item.dataset.demoStep));
    });
    item.addEventListener('click', (event) => {
      // Suppress the browser's delayed synthetic click. Pointer navigation has
      // already happened on pointerdown.
      event.preventDefault();
      event.stopPropagation();
    });
    item.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      showStep(Number(item.dataset.demoStep));
    });
  });
  document.querySelectorAll('[data-demo-reset]').forEach((button) => button.addEventListener('click', () => {
    showStep(1);
  }));

  showStep(currentStep);
})();
