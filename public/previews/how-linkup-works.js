(function () {
  const guideSections = [...document.querySelectorAll('.guide-section')];
  const navItems = [...document.querySelectorAll('.guide-nav-item')];
  const dots = [...document.querySelectorAll('.guide-dots span')];
  const prevButton = document.querySelector('.guide-prev-btn');
  const nextButton = document.querySelector('.guide-next-btn');

  function showGuide(step) {
    guideSections.forEach((section) => section.classList.toggle('active', Number(section.dataset.guide) === step));
    navItems.forEach((item) => item.classList.toggle('active', Number(item.dataset.guide) === step));
    dots.forEach((dot, index) => dot.classList.toggle('active', index + 1 === step));
    prevButton.disabled = step === 1;
    prevButton.dataset.prev = String(Math.max(1, step - 1));
    nextButton.textContent = step === 7 ? 'Done' : 'Next';
    nextButton.dataset.next = String(Math.min(7, step + 1));
  }

  document.addEventListener('click', (event) => {
    const guideTarget = event.target.closest('[data-guide], [data-next], [data-prev]');
    if (!guideTarget) return;
    const step = Number(guideTarget.dataset.guide || guideTarget.dataset.next || guideTarget.dataset.prev);
    if (step >= 1 && step <= 7) showGuide(step);
  });
}());
