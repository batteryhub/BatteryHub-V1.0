/* ---------------------------- /lib/session -------------------------- */
// Minimal client state. Never contains payment details. Backend is the source of truth.
const Session = {
  KEY: 'bh.session.v1',
  data: null,
  load() { this.data = Store.get(this.KEY, null) || this.blank(); return this.data; },
  blank() { return { v: 1, stationId: null, planId: null, method: null, paymentId: null, rentalId: null, updatedAt: Date.now() }; },
  patch(p) { this.data = { ...this.data, ...p, updatedAt: Date.now() }; Store.set(this.KEY, this.data); return this.data; },
  clearRental() { return this.patch({ planId: null, method: null, paymentId: null, rentalId: null }); },
  reset() { this.data = this.blank(); Store.set(this.KEY, this.data); },
  expired() { return Date.now() - (this.data.updatedAt || 0) > APP_RULES.sessionTtlMs; },
};
