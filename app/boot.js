/* =====================================================================
   /app/boot
   ===================================================================== */
(async function boot() {
  document.documentElement.lang = LOCALE; document.documentElement.dir = RTL.has(LOCALE) ? 'rtl' : 'ltr';
  Clock.load(); Session.load(); syncNet(); Tips.init();
  const search = new URLSearchParams(location.search);
  const { query } = parseHash();
  if (search.get('dev') === '1' || query.get('dev') === '1' || location.hash.includes('dev=1')) DevPanel.enable();
  if (Dev.s.enabled) document.body.classList.add('dev-on');

  // Station context from QR/NFC parameters.
  const fromUrl = (search.get('station') || query.get('station') || '').toUpperCase() || null;
  await refreshRental();
  let stationId = rentalIsLive(State.rental) ? State.rental.stationId : (fromUrl || Session.data.stationId || ENV.PUBLIC_DEFAULT_STATION);
  if (fromUrl && fromUrl !== Session.data.stationId && !rentalIsLive(State.rental)) Session.patch({ stationId: fromUrl, planId: null, method: null, paymentId: null });
  else Session.patch({ stationId });
  try { await loadStation(stationId); } catch (e) { State.station = null; }

  // Recover an in-flight rental after refresh / reopening the QR.
  const { path } = parseHash();
  if (rentalIsLive(State.rental) && (path === '/rent' || path === '/rent/payment' || path === '/rent/processing')) history.replaceState(null, '', '#/rent/active');
  else if (query.has('station') || query.has('dev')) history.replaceState(null, '', '#' + path);
  render();
})();