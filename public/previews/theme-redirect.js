(function () {
  var params = new URLSearchParams(window.location.search);
  var theme = params.get('theme') === 'light' ? 'light' : 'dark';
  var target = params.get('target') || '/';
  try {
    window.localStorage.setItem('linkup.theme', theme);
  } catch (_) {}
  window.location.replace(target);
}());
