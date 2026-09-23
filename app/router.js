/* =====================================================================
   /app/router  (hash routing; station comes from ?station= or #/rent?station=)
   ===================================================================== */
const ROUTES = {
  '/rent': Screens.entry, '/rent/payment': Screens.payment, '/rent/processing': Screens.processing, '/rent/ready': Screens.ready,
  '/rent/active': Screens.active, '/rent/return': Screens.ret, '/rent/done': Screens.done, '/rent/closed': Screens.closed, '/help': Screens.help,
};
let current = { screen: null, cleanup: null, path: null };

function parseHash() {
  const h = location.hash.replace(/^#/, '') || '/rent';
  const [path, q] = h.split('?');
  return { path: path === '/' || path === '' ? '/rent' : path, query: new URLSearchParams(q || '') };
}
function go(path, { replace = false } = {}) {
  const url = '#' + path;
  if (replace) history.replaceState(null, '', url); else history.pushState(null, '', url);
  render({ transition: true });
}

async function render({ transition = false, keepFocus = false } = {}) {
  const { path } = parseHash();
  let screen = ROUTES[path]; let params = {};
  if (!screen && path.startsWith('/error/')) { screen = Screens.error; params.code = path.split('/')[2]; }
  if (!screen) { history.replaceState(null, '', '#/rent'); return render(); }
  if (!State.station && screen !== Screens.error) { history.replaceState(null, '', '#/error/station_not_found'); return render(); }

  if (screen.guard) { const redirect = screen.guard(params); if (redirect && redirect !== path) { history.replaceState(null, '', '#' + redirect); return render({ transition }); } }

  const changed = current.path !== path;
  if (changed && current.screen?.leave) current.screen.leave();
  if (current.cleanup) { try { current.cleanup(); } catch {} current.cleanup = null; }

  Tips.close();
  const view = document.getElementById('view');
  const paint = () => {
    view.innerHTML = screen.view(params).v;
    if (changed || transition) { view.classList.remove('view-enter'); void view.offsetWidth; if (!reduced()) view.classList.add('view-enter'); }
  };
  paint();
  current = { screen, path, cleanup: null };
  if (changed && !keepFocus) { const h = view.querySelector('h1'); if (h) h.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  if (screen.mount) { const c = await screen.mount(params); if (current.screen === screen && typeof c === 'function') current.cleanup = c; else if (typeof c === 'function' && current.screen !== screen) c(); }
}

/* event delegation */
document.addEventListener('click', async (e) => {
  if (!e.target.closest('.info-btn, #tip')) Tips.close();
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action;
  if (a === 'tip') { e.preventDefault(); e.stopPropagation(); return Tips.toggle(el); }
  if (a === 'nav') { e.preventDefault(); if (el.dataset.to === '__topics') { Screens.help.topic = null; return render(); } return go(el.dataset.to); }
  if (a === 'logo-tap') return DevPanel.tap();
  const fn = current.screen?.actions?.[a]; if (fn) { e.preventDefault(); fn.call(current.screen, el, e); }
});
document.addEventListener('change', (e) => {
  const el = e.target.closest('[data-change]'); if (!el) return;
  const fn = current.screen?.actions?.[el.dataset.change]; if (fn) fn.call(current.screen, el, e);
});
document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-input]'); if (!el) return;
  const fn = current.screen?.actions?.[el.dataset.input]; if (fn) fn.call(current.screen.actions, el, e);
});
document.addEventListener('focusout', (e) => {
  const el = e.target.closest('[data-input="card"]'); if (!el) return;
  current.screen?.actions?.cardBlur?.call(current.screen.actions, el, e);
});
window.addEventListener('popstate', () => render({ transition: true }));
window.addEventListener('hashchange', () => render({ transition: true }));

/* network status */
function syncNet() {
  const bar = document.getElementById('netbar');
  bar.innerHTML = icon('wifiOff').v + esc(t('net.offline'));
  bar.classList.toggle('is-on', !navigator.onLine);
}
window.addEventListener('online', async () => { syncNet(); await refreshRental(); render(); });
window.addEventListener('offline', syncNet);
