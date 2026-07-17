/* LinkUp LinkLine v2 icon system.
   LinkUp's own icon language — no stock icon sets. Every glyph is drawn on a
   24px grid with 1.9 rounded strokes and carries a filled "origin node": the
   dot where a journey, person, or place connects. People are drawn with node
   heads; wheels, clappers, keyholes, and map points are nodes too. Utility
   glyphs (chevrons, close, check, plus) stay pure but share the same geometry.
   Strokes use non-scaling-stroke (see styles.css) so weight stays optically
   consistent at every size. Always use currentColor so themes stay legible. */
(function () {
  'use strict';

  const icons = {
    /* Communication + navigation chrome */
    chat: '<path d="M19.5 13.5a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.5V16H7a2.5 2.5 0 0 1-2.5-2.5v-6A2.5 2.5 0 0 1 7 5h10a2.5 2.5 0 0 1 2.5 2.5Z"/><circle cx="8.3" cy="10.5" r="1.3" fill="currentColor"/><path d="M11.4 10.5h4.1"/>',
    search: '<circle cx="10.5" cy="10.5" r="5.8"/><path d="m14.9 14.9 4.6 4.6"/><circle cx="10.5" cy="10.5" r="1.3" fill="currentColor"/>',
    bell: '<path d="M6.5 14.5V9.7a5.5 5.5 0 0 1 11 0v4.8l1.7 2.6H4.8Z"/><circle cx="12" cy="20" r="1.3" fill="currentColor"/>',
    cart: '<path d="M3.5 5h2.2l1.6 9.3h10.4l1.9-6.8H6.4"/><circle cx="8.8" cy="18.8" r="1.3" fill="currentColor"/><circle cx="16.4" cy="18.8" r="1.3" fill="currentColor"/>',
    signout: '<path d="M10.5 4.5H6.2A1.7 1.7 0 0 0 4.5 6.2v11.6a1.7 1.7 0 0 0 1.7 1.7h4.3"/><circle cx="9.2" cy="12" r="1.3" fill="currentColor"/><path d="M11.9 12h7.4m0 0-3.1-3.1M19.3 12l-3.1 3.1"/>',

    /* People — heads are nodes */
    profile: '<circle cx="12" cy="7" r="3.2" fill="currentColor"/><path d="M5 19.5v-.4c0-3.3 2.9-5.5 7-5.5s7 2.2 7 5.5v.4"/>',
    rider: '<circle cx="10" cy="6.6" r="2.9" fill="currentColor"/><path d="M4.6 19.5c0-3.6 2.2-6 5.4-6s5.4 2.4 5.4 6"/><path d="M13.2 15.2 17.6 10.6"/><circle cx="19.4" cy="8.7" r="1.3" fill="currentColor"/>',
    community: '<circle cx="9" cy="7.3" r="2.8" fill="currentColor"/><path d="M3.5 19.5c0-3.6 2.2-5.9 5.5-5.9s5.5 2.3 5.5 5.9"/><circle cx="16.8" cy="8" r="2.3" fill="currentColor"/><path d="M17.4 13.6c2.1.5 3.4 2.7 3.4 5.4"/>',

    /* Rides + places */
    driver: '<circle cx="12" cy="12" r="8.3"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><path d="M3.7 12h4.6M15.7 12h4.6M12 14.2v6.1"/>',
    pin: '<path d="M12 21.4S5.5 15.8 5.5 10.4a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10.4" r="1.7" fill="currentColor"/>',
    route: '<circle cx="6" cy="18" r="1.5" fill="currentColor"/><path d="M7.5 16.5c2.8-2.4 1.2-5 3.2-7 1.6-1.6 3.4-1 4.9-2.4"/><circle cx="18" cy="5.8" r="2.1"/>',
    home: '<path d="M4.5 10.9 12 4.6l7.5 6.3V19a1.3 1.3 0 0 1-1.3 1.3H5.8A1.3 1.3 0 0 1 4.5 19Z"/><circle cx="12" cy="13.6" r="1.4" fill="currentColor"/>',
    bank: '<path d="m4.5 9.3 7.5-4.8 7.5 4.8"/><path d="M6.2 9.6v9.3M17.8 9.6v9.3M10 12.2v4.4M14 12.2v4.4M4.5 19.5h15"/><circle cx="12" cy="7.5" r="1.3" fill="currentColor"/>',
    live: '<circle cx="12" cy="12" r="4.6"/><path d="M12 3.2v2.4M12 18.4v2.4M3.2 12h2.4M18.4 12h2.4"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
    network: '<circle cx="6" cy="12" r="1.7" fill="currentColor"/><circle cx="17.7" cy="5.6" r="1.7" fill="currentColor"/><circle cx="17.7" cy="18.4" r="1.7" fill="currentColor"/><path d="M7.9 10.9l7.7-4.4M7.9 13.1l7.7 4.4"/>',
    package: '<path d="M12 3.6 19.8 8v8L12 20.4 4.2 16V8Z"/><path d="M4.6 8.3l7.4 4.1 7.4-4.1"/><circle cx="12" cy="12.6" r="1.4" fill="currentColor"/><path d="M12 14.6V20"/>',
    seat: '<circle cx="8.7" cy="4.2" r="1.5" fill="currentColor"/><path d="M8.7 6.4v13.1"/><path d="M8.7 11.4a3.2 3.2 0 0 0 3.2 3.2h3.7a1.7 1.7 0 0 1 1.7 1.7v3.2"/>',

    /* Trust + money */
    safety: '<path d="M12 3.6l6.8 2.5v5.2c0 4.3-2.4 7.2-6.8 9.4-4.4-2.2-6.8-5.1-6.8-9.4V6.1Z"/><circle cx="12" cy="10.6" r="1.5" fill="currentColor"/>',
    lock: '<path d="M6 10.5h12v8A1.5 1.5 0 0 1 16.5 20h-9A1.5 1.5 0 0 1 6 18.5Z"/><path d="M8.5 10.5V7.9a3.5 3.5 0 0 1 7 0v2.6"/><circle cx="12" cy="14.3" r="1.3" fill="currentColor"/><path d="M12 15.7v1.1"/>',
    wallet: '<path d="M4.5 8A2.5 2.5 0 0 1 7 5.5h10A2.5 2.5 0 0 1 19.5 8v9a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 17Z"/><path d="M19.5 10.5h-4.7a2.4 2.4 0 0 0 0 4.8h4.7"/><circle cx="14.8" cy="12.9" r="1.3" fill="currentColor"/>',
    money: '<path d="M4.5 6.8h15v10.4h-15Z"/><circle cx="12" cy="12" r="3.3"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
    dollar: '<path d="M12 3.8v16.4"/><path d="M15.9 7.3c-.7-1.1-2.1-1.8-3.9-1.8-2.2 0-3.7 1.2-3.7 2.9 0 3.9 7.7 2 7.7 5.9 0 1.8-1.7 3-4 3-2 0-3.5-.8-4.2-2"/>',

    /* Content + media */
    event: '<path d="M4.5 6.5h15V19a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19Z"/><path d="M8.2 3.8v2.4M15.8 3.8v2.4M4.5 10.5h15"/><circle cx="12" cy="15.2" r="1.4" fill="currentColor"/>',
    star: '<path d="M12 4 13.94 8.93 19.23 9.25 15.14 12.62 16.47 17.75 12 14.9 7.53 17.75 8.86 12.62 4.77 9.25 10.06 8.93Z"/><circle cx="12" cy="11.6" r="1.3" fill="currentColor"/>',
    camera: '<path d="M4.5 9.7A1.5 1.5 0 0 1 6 8.2h1.7l1.9-2.7h4.8l1.9 2.7H18a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5Z"/><circle cx="12" cy="13.2" r="3.1"/><circle cx="12" cy="13.2" r="1.3" fill="currentColor"/>',
    image: '<path d="M6.5 4.5h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z"/><path d="m4.9 15.9 4-4 3.4 3.4 2.7-2.7 4.1 4.1"/><circle cx="9.1" cy="8.7" r="1.4" fill="currentColor"/>',
    mic: '<path d="M12 3.6a2.9 2.9 0 0 1 2.9 2.9v5a2.9 2.9 0 0 1-5.8 0v-5A2.9 2.9 0 0 1 12 3.6Z"/><path d="M18.2 11.6a6.2 6.2 0 0 1-12.4 0"/><path d="M12 17.8v1.3"/><circle cx="12" cy="21" r="1.3" fill="currentColor"/>',
    play: '<path d="M9 5.9v12.2c0 .9 1 1.5 1.8 1L20.2 13c.8-.5.8-1.6 0-2.1l-9.4-6c-.8-.5-1.8.1-1.8 1Z" fill="currentColor" stroke="none"/>',
    upload: '<path d="M4.8 16.8v1.7A1.5 1.5 0 0 0 6.3 20h11.4a1.5 1.5 0 0 0 1.5-1.5v-1.7"/><path d="M12 14.8V6m0 0L8.6 9.4M12 6l3.4 3.4"/><circle cx="12" cy="18.2" r="1.3" fill="currentColor"/>',
    trash: '<path d="M6.8 7.5h10.4L16.2 20H7.8Z"/><path d="M4.5 7.5h15M9.6 7.5V5.2A1.2 1.2 0 0 1 10.8 4h2.4a1.2 1.2 0 0 1 1.2 1.2v2.3M10.3 10.8v5.6M13.7 10.8v5.6"/>',

    /* Status + time */
    alert: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2v5"/><circle cx="12" cy="16" r="1.3" fill="currentColor"/>',
    help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.3 9.4a2.7 2.7 0 1 1 3.9 2.4c-.8.4-1.2 1-1.2 1.8"/><circle cx="12" cy="16.6" r="1.3" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l3.1 1.9"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    filter: '<path d="M4.5 7.2h8.2M17.8 7.2h1.7M4.5 12h2.2M9.5 12h10M4.5 16.8h7M14.8 16.8h4.7"/><circle cx="15.25" cy="7.2" r="1.3" fill="currentColor"/><circle cx="8.1" cy="12" r="1.3" fill="currentColor"/><circle cx="13.15" cy="16.8" r="1.3" fill="currentColor"/>',

    /* Arrows carry a trailing origin node — motion starts at a point */
    back: '<path d="M17.5 12H4.8m0 0 4.2-4.2M4.8 12 9 16.2"/><circle cx="20.3" cy="12" r="1.3" fill="currentColor"/>',
    forward: '<path d="M6.5 12h12.7m0 0-4.2-4.2M19.2 12 15 16.2"/><circle cx="3.7" cy="12" r="1.3" fill="currentColor"/>',

    /* Pure utility glyphs — shared geometry, no node */
    chevronDown: '<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>',
    chevronUp: '<path d="m6.5 14.5 5.5-5.5 5.5 5.5"/>',
    chevronLeft: '<path d="m14.5 6.5-5.5 5.5 5.5 5.5"/>',
    chevronRight: '<path d="m9.5 6.5 5.5 5.5-5.5 5.5"/>',
    check: '<path d="m5 12.8 4.4 4.4L19 7.2"/>',
    close: '<path d="m6.5 6.5 11 11m0-11-11 11"/>',
    plus: '<path d="M12 5.5v13M5.5 12h13"/>',
    zoomIn: '<circle cx="10.5" cy="10.5" r="5.8"/><path d="m14.9 14.9 4.6 4.6M7.9 10.5h5.2M10.5 7.9v5.2"/>',
    zoomOut: '<circle cx="10.5" cy="10.5" r="5.8"/><path d="m14.9 14.9 4.6 4.6M7.9 10.5h5.2"/>',
  };

  const aliases = {
    location: 'pin',
    car: 'driver',
    user: 'profile',
    users: 'community',
    shield: 'safety',
    arrowLeft: 'back',
    arrowRight: 'forward',
    calendar: 'event',
    share: 'network',
    box: 'package',
    question: 'help',
    warning: 'alert',
  };

  function icon(name, options = {}) {
    const resolved = aliases[name] || name;
    const body = icons[resolved];
    if (!body) return '';
    const size = Number(options.size) || 20;
    const className = ['lu-icon', `lu-icon-${resolved}`, options.className || ''].filter(Boolean).join(' ');
    const label = options.label ? ` role="img" aria-label="${String(options.label).replace(/"/g, '&quot;')}"` : ' aria-hidden="true"';
    return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"${label}>${body}</svg>`;
  }

  function upgrade(root = document) {
    root.querySelectorAll('[data-lu-icon]').forEach((node) => {
      const name = node.dataset.luIcon;
      const size = node.dataset.luIconSize || 20;
      node.innerHTML = icon(name, { size, className: node.dataset.luIconClass || '' });
      node.classList.add('lu-icon-host');
    });
  }

  window.LinkUpIcons = Object.freeze({ icon, upgrade, names: Object.freeze(Object.keys(icons)) });
  document.addEventListener('DOMContentLoaded', () => upgrade());
})();
