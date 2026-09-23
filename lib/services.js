/* ------------------------------- /lib/services ---------------------- */
// BatteryHub domain services. UI talks to these only.
class BatteryHubStationService {
  constructor(p) { this.p = p; }
  async get(id) {
    const s = await this.p.getStation(id);
    return { ...s, hardware: HARDWARE_MODELS[s.hardwareModel], pricing: PRICING_PROFILES[s.pricingProfile] };
  }
}
class BatteryHubPaymentService {
  constructor(p) { this.p = p; }
  methods(station) { return station.paymentMethods.filter(m => PAYMENT_METHODS[m]); }
  async pay({ station, plan, method, card = null }) {
    // Raw card data is handed only to tokenizeCard (the provider's SDK in production); the BatteryHub backend sees a token.
    const cardToken = method === 'card' && card ? await this.p.tokenizeCard(card) : null;
    return this.p.createPayment({ stationId: station.id, planId: plan.id, method, amount: plan.price, currency: station.pricing.currency, card: cardToken });
  }
}
class BatteryHubRentalService {
  constructor(p) { this.p = p; }
  start(paymentId) { return this.p.startRental({ paymentId }); }
  get(id) { return this.p.getRental(id); }
  beginReturn(id) { return this.p.beginReturn(id); }
  cancelReturn(id) { return this.p.cancelReturn(id); }
  checkReturn(id) { return this.p.checkReturn(id); }
  powerBank(id, rental) { return this.p.getPowerBank(id, rental); }
}
function createServices(env) {
  // 'batteryhub' → a BatteryHubApiProvider (fetch → ENV.PUBLIC_API_BASE_URL) implementing the Provider interface.
  const provider = new MockProvider();
  return { provider, stations: new BatteryHubStationService(provider), payments: new BatteryHubPaymentService(provider), rentals: new BatteryHubRentalService(provider) };
}
const API = createServices(ENV);

/* =====================================================================
   /ui/html  (tiny escaping template helper)
   ===================================================================== */
class Raw { constructor(v) { this.v = v; } toString() { return this.v; } }
const raw = v => new Raw(v);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const out = v => v == null || v === false ? '' : v instanceof Raw ? v.v : Array.isArray(v) ? v.map(out).join('') : esc(v);
function html(strings, ...vals) { let s = ''; strings.forEach((str, i) => { s += str; if (i < vals.length) s += out(vals[i]); }); return raw(s); }
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
