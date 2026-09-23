/* ----------------------------- /lib/clock --------------------------- */
// Clock with a demo-only offset so timers can be accelerated in Demo Mode.
const Clock = {
  offset: 0,
  now() { return Date.now() + this.offset; },
  load() { this.offset = Store.get('bh.demo.clock', 0) || 0; },
  add(ms) { this.offset += ms; Store.set('bh.demo.clock', this.offset); },
  reset() { this.offset = 0; Store.set('bh.demo.clock', 0); },
};
