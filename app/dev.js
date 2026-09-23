/* =====================================================================
   /app/dev  (Demo Mode controls. Never shown to customers.)
   Open with ?dev=1, Shift+D, or tapping the logo 5 times.
   ===================================================================== */
const DevPanel = {
  taps: [],
  tap() { const now = Date.now(); this.taps = this.taps.filter(t0 => now - t0 < 2500).concat(now); if (this.taps.length >= 5) { this.taps = []; this.enable(); this.open(); } },
  enable() { Dev.s.enabled = true; Dev.save(); document.body.classList.add('dev-on'); },
  open() { const d = document.getElementById('dev'); d.innerHTML = this.view(); if (!d.open) d.showModal(); },
  close() { document.getElementById('dev').close(); },
  view() {
    const s = Dev.s; const r = State.rental;
    const opt = (v, cur, label) => `<option value="${v}" ${String(cur) === String(v) ? 'selected' : ''}>${label}</option>`;
    return `<div class="dev__inner">
      <div class="dev__head"><strong>Demo mode · mock provider</strong><button class="icon-btn" data-dev="close" aria-label="Close">${icon('x').v}</button></div>
      <div class="dev__grid">
        <label>Station<select data-devset="station">${Object.keys(STATIONS).map(id => opt(id, State.station?.id, id + ' ' + STATIONS[id].name)).join('')}</select></label>
        <label>Next slot<select data-devset="slot">${opt('auto', s.slot, 'Auto (best charged)')}${[1,2,3,4,5,6,7,8].map(n => opt(n, s.slot, 'Slot ' + n)).join('')}</select></label>
        <label>Express wallet<select data-devset="wallet">${opt('auto', s.wallet, 'Auto (by phone OS)')}${opt('apple', s.wallet, 'Apple Pay (iOS)')}${opt('android', s.wallet, 'Google Pay (Android)')}</select></label>
        <label>Payment result<select data-devset="payment">${opt('success', s.payment, 'Succeeds')}${opt('fail', s.payment, 'Fails')}${opt('cancel', s.payment, 'Cancelled')}</select></label>
        <label>Release result<select data-devset="release">${opt('success', s.release, 'Releases')}${opt('fail', s.release, 'Release fails')}</select></label>
        <label>Availability<select data-devset="availability">${opt('normal', s.availability, 'Normal')}${opt('none', s.availability, 'No power banks')}${opt('offline', s.availability, 'Station offline')}</select></label>
        <label>Hardware telemetry<select data-devset="telemetry">${opt('level', s.telemetry, 'Level only')}${opt('full', s.telemetry, 'Level + estimates')}${opt('none', s.telemetry, 'Unavailable')}</select></label>
        <label>Demo authorization (THB)<input data-devset="auth" inputmode="numeric" placeholder="none" value="${esc(s.auth)}"></label>
        <label>Timer speed<select data-devset="speed">${opt(1, s.speed, '1×')}${opt(60, s.speed, '60×')}${opt(600, s.speed, '600×')}</select></label>
        <label>Auto-detect return<select data-devset="autoReturn">${opt('true', s.autoReturn, 'After ~6 s')}${opt('false', s.autoReturn, 'Manual only')}</select></label>
        <label>Simulated latency<select data-devset="latency">${opt('true', s.latency, 'On')}${opt('false', s.latency, 'Off')}</select></label>
      </div>
      <p class="dev__section">Active rental ${r ? `(${r.id}, ${r.status})` : '(none)'}</p>
      <div class="dev__actions">
        <button data-dev="plus30">+30 min</button>
        <button data-dev="overdue">Jump to overdue</button>
        <button data-dev="return">Simulate return</button>
        <button data-dev="notdetected">Return not detected</button>
        <button data-dev="nonreturn">Simulate non-return</button>
      </div>
      <p class="dev__section">Preview error state</p>
      <div class="dev__actions">${['payment_failed','payment_cancelled','station_unavailable','no_power_banks','slot_unavailable','release_failed','return_not_detected','network_unavailable','session_expired','station_not_found'].map(c => `<button data-dev="err" data-code="${c}">${c}</button>`).join('')}</div>
      <p class="dev__section">Session</p>
      <div class="dev__actions"><button data-dev="reset">Reset demo (session, backend, clock)</button><button data-dev="disable">Hide dev controls</button></div>
    </div>`;
  },
  async act(a, el) {
    const r = State.rental; const p = API.provider;
    if (a === 'close') return this.close();
    if (a === 'plus30') Clock.add(30 * M);
    if (a === 'overdue' && r?.includedUntil) Clock.add(r.includedUntil - Clock.now() + 12 * M);
    if (a === 'return' && r) { p.dev.forceReturn(r.id); }
    if (a === 'notdetected' && r) { p.dev.notDetected(r.id); if (r.status === 'active') { this.close(); return go('/rent/return'); } }
    if (a === 'nonreturn' && r) p.dev.nonReturn(r.id);
    if (a === 'err') { this.close(); return go('/error/' + el.dataset.code); }
    if (a === 'reset') { p.reset(); Session.reset(); Clock.reset(); State.rental = null; State.pb = null; await loadStation(Session.patch({ stationId: State.station?.id || ENV.PUBLIC_DEFAULT_STATION }).stationId); this.close(); return go('/rent', { replace: true }); }
    if (a === 'disable') { Dev.s.enabled = false; Dev.save(); document.body.classList.remove('dev-on'); return this.close(); }
    await refreshRental(); if (State.station) await loadStation(State.station.id); this.open(); render();
  },
  async set(key, val) {
    if (key === 'station') { if (rentalIsLive(State.rental)) return; Session.patch({ stationId: val, planId: null, method: null, paymentId: null }); await loadStation(val); this.open(); return go('/rent', { replace: true }); }
    if (key === 'speed') val = Number(val);
    if (key === 'autoReturn' || key === 'latency') val = val === 'true';
    if (key === 'auth') val = val.replace(/[^\d]/g, '');
    Dev.s[key] = val; Dev.save();
    if (['availability'].includes(key)) { await loadStation(State.station.id); render(); }
    if (key === 'wallet') { Session.patch({ method: null }); render(); }
  },
};
document.getElementById('dev').addEventListener('click', (e) => { const b = e.target.closest('[data-dev]'); if (b) DevPanel.act(b.dataset.dev, b); });
document.getElementById('dev').addEventListener('change', (e) => { const el = e.target.closest('[data-devset]'); if (el) DevPanel.set(el.dataset.devset, el.value); });
document.getElementById('dev-handle').addEventListener('click', () => DevPanel.open());
document.addEventListener('keydown', (e) => { if (e.shiftKey && (e.key === 'D' || e.key === 'd') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) { DevPanel.enable(); DevPanel.open(); } });
