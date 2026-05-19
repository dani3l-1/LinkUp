(() => {
  const finishBoot = () => {
    document.body?.classList.remove('app-booting');
  };

  window.addEventListener('error', finishBoot);
  window.addEventListener('unhandledrejection', finishBoot);
  window.setTimeout(finishBoot, 5000);
})();
