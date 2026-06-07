(function () {
  const THEME_KEY = 'linkup.theme';
  const TOTAL = 7;

  /* ── Theme ── */
  function resolveTimeTheme() {
    const h = new Date().getHours();
    return (h >= 6 && h < 19) ? 'light' : 'dark';
  }

  function applyTheme(pref) {
    const theme = pref === 'light' ? 'light' : pref === 'auto' ? resolveTimeTheme() : 'dark';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }

  try { applyTheme(localStorage.getItem(THEME_KEY) || 'dark'); } catch (_) { applyTheme('dark'); }

  // Sync theme if user changes it in another tab (main app)
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY) { try { applyTheme(e.newValue || 'dark'); } catch (_) {} }
  });

  /* ── Guide navigation ── */
  const guideSections = [...document.querySelectorAll('.guide-section')];
  const navItems      = [...document.querySelectorAll('.guide-nav-item')];
  const dots          = [...document.querySelectorAll('.guide-dots span')];
  const prevBtn       = document.querySelector('.guide-prev-btn');
  const nextBtn       = document.querySelector('.guide-next-btn');
  const stepCount     = document.querySelector('.guide-step-count');

  let current = 1;

  function showGuide(step) {
    if (step < 1 || step > TOTAL) return;
    current = step;

    guideSections.forEach((s) => s.classList.toggle('active', Number(s.dataset.guide) === step));
    navItems.forEach((item) => item.classList.toggle('active', Number(item.dataset.guide) === step));
    dots.forEach((dot, i) => dot.classList.toggle('active', i + 1 === step));

    prevBtn.disabled = step === 1;
    prevBtn.dataset.prev = String(step - 1);

    const isLast = step === TOTAL;
    nextBtn.textContent = isLast ? 'Done' : 'Next →';
    nextBtn.dataset.next = isLast ? '' : String(step + 1);

    if (stepCount) stepCount.textContent = `${step} / ${TOTAL}`;

    // On mobile, scroll the active nav chip into view
    const activeNav = document.querySelector('.guide-nav-item.active');
    if (activeNav) activeNav.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-guide], [data-next], [data-prev]');
    if (!target) return;

    // Ignore clicks that land on the section content containers
    if (target.classList.contains('guide-section')) return;

    // "Done" on last step → back to waitlist
    if (target === nextBtn && current === TOTAL) {
      window.location.href = '/';
      return;
    }

    const step = Number(target.dataset.guide || target.dataset.next || target.dataset.prev);
    if (step >= 1 && step <= TOTAL) showGuide(step);
  });

  // Keyboard navigation (← → arrows)
  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); showGuide(current + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); showGuide(current - 1); }
  });
}());
