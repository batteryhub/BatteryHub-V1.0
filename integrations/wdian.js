/* ------------------------- /integrations/wdian ---------------------- */
// Isolated adapter for Shenzhen Zhongdian Core Technology (W-Dian). The customer app never calls
// this directly: it sits behind the BatteryHub backend. Methods intentionally unimplemented until
// they're mapped from the supplier's documentation. No endpoint names are assumed here.
class WDianAdapter {
  constructor(config) { this.config = config; }
  notMapped(op) { throw new ProviderError('not_configured', `W-Dian operation "${op}" is not mapped yet`); }
  getStation() { this.notMapped('getStation'); }
  startRental() { this.notMapped('startRental'); }
  getRental() { this.notMapped('getRental'); }
  checkReturn() { this.notMapped('checkReturn'); }
  getPowerBank() { this.notMapped('getPowerBank'); }
}
