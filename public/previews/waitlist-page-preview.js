(function () {
  const THEME_KEY = 'linkup.theme';
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
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY) { try { applyTheme(e.newValue || 'dark'); } catch (_) {} }
  });
}());
