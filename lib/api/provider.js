/* -------------------------- /lib/api/provider ----------------------- */
/** Provider interface. Real providers implement the same shape.
 *  getStation(id) · createPayment(req) · startRental(req) · getRental(id)
 *  beginReturn(id) · cancelReturn(id) · checkReturn(id) · getPowerBank(id)
 */
class ProviderError extends Error { constructor(code, msg) { super(msg || code); this.code = code; } }

// Demo settings (developer-only). Persisted so demos survive refresh.
const DEV_DEFAULTS = { enabled: false, payment: 'success', release: 'success', slot: 'auto', availability: 'normal',
  telemetry: 'level', auth: '', speed: 1, autoReturn: true, latency: true, wallet: 'auto' };
const Dev = { s: { ...DEV_DEFAULTS, ...Store.get('bh.demo.settings', {}) },
  save() { Store.set('bh.demo.settings', this.s); } };

class MockProvider {
  constructor() { this.KEY = 'bh.demo.backend.v1'; this.db = Store.get(this.KEY, null) || this.seed(); }
  seed() {
    const db = { stations: {}, payments: {}, rentals: {} };
    const levels = [92, 85, null, 78, 100, 88, null, 64];
    Object.keys(STATIONS).forEach(id => {
      db.stations[id] = { online: true, slots: levels.map((lv, i) => ({ number: i + 1, state: lv == null ? 'empty' : 'occupied',
        powerBankId: lv == null ? null : `${id === 'BH001' ? '' : id + '-'}PB00${i + 1}`, level: lv })) };
    });
    Store.set(this.KEY, db); return db;
  }
  persist() { Store.set(this.KEY, this.db); }
  reset() { Store.del(this.KEY); this.db = this.seed(); }
  async wait(min = 250, max = 650) { if (!Dev.s.latency) return; await new Promise(r => setTimeout(r, min + Math.random() * (max - min))); }
  id(prefix) { return prefix + Math.random().toString(36).slice(2, 8).toUpperCase(); }

  async getStation(id) {
    await this.wait(120, 300);
    const cfg = STATIONS[id]; const st = this.db.stations[id];
    if (!cfg || !st) throw new ProviderError('station_not_found');
    let slots = st.slots.map(s => ({ number: s.number, state: s.state, powerBankId: s.powerBankId }));
    if (Dev.s.availability === 'none') slots = slots.map(s => ({ ...s, state: 'empty', powerBankId: null }));
    return { id, name: cfg.name, location: cfg.location, online: Dev.s.availability !== 'offline' && st.online, slots,
             hardwareModel: cfg.hardwareModel, pricingProfile: cfg.pricingProfile, paymentMethods: cfg.paymentMethods, returnPolicy: cfg.returnPolicy };
  }
  async tokenizeCard(card) {
    await this.wait(250, 450);
    const d = Card.digits(card.number);
    return { token: 'tok_demo_' + Math.random().toString(36).slice(2, 12), brand: Card.brand(d)?.id || 'unknown', last4: d.slice(-4) };
  }
  async createPayment({ stationId, planId, method, amount, currency, card = null }) {
    await this.wait(700, 1200);
    const outcome = Dev.s.payment;
    const authAmount = Dev.s.auth === '' ? null : Number(Dev.s.auth);
    const p = { id: this.id('PAY-'), stationId, planId, method, card: card ? { brand: card.brand, last4: card.last4 } : null, amount, currency, status: outcome === 'success' ? 'succeeded' : outcome === 'cancel' ? 'cancelled' : 'failed',
                authorization: { amount: authAmount, status: authAmount ? 'held' : 'none' }, createdAt: Clock.now() };
    this.db.payments[p.id] = p; this.persist();
    return p;
  }
  async startRental({ paymentId }) {
    await this.wait(900, 1500);
    const pay = this.db.payments[paymentId];
    if (!pay || pay.status !== 'succeeded') throw new ProviderError('payment_failed');
    if (Dev.s.release === 'fail') throw new ProviderError('release_failed');
    const st = this.db.stations[pay.stationId];
    const occupied = st.slots.filter(s => s.state === 'occupied');
    if (!occupied.length || Dev.s.availability === 'none') throw new ProviderError('no_power_banks');
    let slot = Dev.s.slot !== 'auto' ? st.slots.find(s => s.number === Number(Dev.s.slot) && s.state === 'occupied') : null;
    if (!slot) slot = occupied.slice().sort((a, b) => (b.level || 0) - (a.level || 0))[0];
    const pricing = PRICING_PROFILES[STATIONS[pay.stationId].pricingProfile];
    const plan = Domain.plan(pricing, pay.planId);
    const now = Clock.now();
    const r = { id: this.id('R-'), stationId: pay.stationId, planId: plan.id, planKind: plan.kind, slot: slot.number, powerBankId: slot.powerBankId,
      startedAt: now, includedUntil: plan.durationMs ? now + plan.durationMs : null, price: pay.amount, currency: pay.currency,
      authorization: pay.authorization, status: plan.kind === 'purchase' ? 'purchased' : 'active', returnedAt: null, returnSlot: null,
      charges: { rental: pay.amount, late: null, nonReturn: null }, total: null, bankLevel: slot.level, paymentId };
    slot.state = 'empty'; slot.powerBankId = null; slot.level = null;
    this.db.rentals[r.id] = r; this.persist();
    return this.view(r);
  }
  view(r) { const { bankLevel, paymentId, ...pub } = r; return { ...pub }; }
  async getRental(id) { await this.wait(100, 250); const r = this.db.rentals[id]; if (!r) throw new ProviderError('session_expired'); return this.view(r); }
  async beginReturn(id) {
    await this.wait(200, 400);
    const r = this.db.rentals[id]; if (!r) throw new ProviderError('session_expired');
    // Customers may use ANY free slot, so nothing is reserved. The station reports the slot on detection.
    r.status = 'awaiting_return'; r.returnSlot = null; r.returnRequestedAt = Date.now();
    this.persist(); return this.view(r);
  }
  async cancelReturn(id) { const r = this.db.rentals[id]; if (r && r.status === 'awaiting_return') { r.status = 'active'; this.persist(); } return r ? this.view(r) : null; }
  async checkReturn(id) {
    await this.wait(80, 200);
    const r = this.db.rentals[id]; if (!r) throw new ProviderError('session_expired');
    if (r.status === 'returned') return { status: 'detected', rental: this.view(r) };
    if (r.forceNotDetected) return { status: 'not_detected', rental: this.view(r) };
    if (r.status === 'awaiting_return' && Dev.s.autoReturn && Date.now() - r.returnRequestedAt > 6500) { this.completeReturn(r); return { status: 'detected', rental: this.view(r) }; }
    return { status: 'waiting', rental: this.view(r) };
  }
  completeReturn(r) {
    const pricing = PRICING_PROFILES[STATIONS[r.stationId].pricingProfile];
    const now = Clock.now();
    r.status = 'returned'; r.returnedAt = now;
    r.charges.late = Domain.lateFee(r, pricing, now);
    r.total = r.price + (r.charges.late || 0);
    if (r.authorization.amount) r.authorization.status = 'released';
    const st = this.db.stations[r.stationId];
    if (!r.returnSlot) { const free = st.slots.filter(s => s.state === 'empty'); r.returnSlot = free.length ? free[Math.floor(Math.random() * free.length)].number : r.slot; }   // demo: customer picked a free slot
    const slot = st.slots.find(s => s.number === r.returnSlot);
    if (slot) { slot.state = 'occupied'; slot.powerBankId = r.powerBankId; slot.level = Math.max(5, (r.bankLevel || 60) - 20); }
    this.persist();
  }
  async getPowerBank(id, rental) {
    await this.wait(100, 250);
    if (Dev.s.telemetry === 'none') return { id, level: null, runtimeRange: null, phoneCharges: null };
    const r = rental && this.db.rentals[rental.id];
    const start = r?.bankLevel ?? 80;
    const drain = rental ? Math.floor((Clock.now() - rental.startedAt) / (6 * M)) : 0;   // demo drain only
    const level = Math.max(3, start - drain);
    const full = Dev.s.telemetry === 'full';
    return { id, level, runtimeRange: full ? [Math.max(1, Math.round(level / 17)), Math.max(2, Math.round(level / 12))] : null,
             phoneCharges: full ? Math.round(level / 50 * 10) / 10 : null };   // demo values; real ones come from hardware data
  }
  /* developer hooks */
  dev = {
    forceReturn: (id) => { const r = this.db.rentals[id]; if (!r) return; r.forceNotDetected = false; this.completeReturn(r); },
    notDetected: (id) => { const r = this.db.rentals[id]; if (r) { r.forceNotDetected = true; this.persist(); } },
    nonReturn: (id) => { const r = this.db.rentals[id]; if (!r) return; const pricing = PRICING_PROFILES[STATIONS[r.stationId].pricingProfile];
      r.status = 'defaulted'; r.charges.nonReturn = pricing.nonReturn.charge; r.total = r.price + pricing.nonReturn.charge;
      if (r.authorization.amount) r.authorization.status = 'captured'; this.persist(); },
  };
}
