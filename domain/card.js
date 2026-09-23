/* ------------------------------ /domain/card ------------------------------ */
// Client-side checks only, for fast feedback. The payment provider validates and tokenizes.
const CARD_BRANDS = [
  { id: 'amex',       label: 'AMEX',       re: /^3[47]/,                     lengths: [15],         cvc: 4, groups: [4, 6, 5] },
  { id: 'visa',       label: 'VISA',       re: /^4/,                         lengths: [13, 16, 19], cvc: 3 },
  { id: 'mastercard', label: 'MC',         re: /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/, lengths: [16], cvc: 3 },
  { id: 'jcb',        label: 'JCB',        re: /^35/,                        lengths: [16, 17, 18, 19], cvc: 3 },
  { id: 'unionpay',   label: 'UPI',      re: /^62/,                        lengths: [16, 17, 18, 19], cvc: 3 },
];
const Card = {
  digits: v => String(v || '').replace(/\D/g, ''),
  brand(num) { const d = this.digits(num); return CARD_BRANDS.find(b => b.re.test(d)) || null; },
  maxLen(num) { const b = this.brand(num); return b ? Math.max(...b.lengths) : 19; },
  formatNumber(num) {
    const d = this.digits(num).slice(0, this.maxLen(num)); const b = this.brand(d);
    const groups = b?.groups || [4, 4, 4, 4, 3]; const out = []; let i = 0;
    for (const g of groups) { if (i >= d.length) break; out.push(d.slice(i, i + g)); i += g; }
    return out.join(' ');
  },
  formatExp(v) {
    let d = this.digits(v).slice(0, 4);
    if (d.length === 1 && d > '1') d = '0' + d;
    return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  },
  luhn(d) { let sum = 0, alt = false; for (let i = d.length - 1; i >= 0; i--) { let n = +d[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } sum += n; alt = !alt; } return sum % 10 === 0; },
  /** @returns {{number?:string,name?:string,exp?:string,cvc?:string}} i18n keys of errors, empty when valid */
  validate(v) {
    const e = {}; const d = this.digits(v.number); const b = this.brand(d);
    if ((!b && d.length >= 4) || (b && !PAYMENT_PROCESSOR.networks.includes(b.id))) e.number = 'card.err.brand';
    else if (!b || !b.lengths.includes(d.length) || !this.luhn(d)) e.number = 'card.err.number';
    const m = /^(\d{2})\/(\d{2})$/.exec(v.exp || '');
    if (!m || +m[1] < 1 || +m[1] > 12) e.exp = 'card.err.exp';
    else { const now = new Date(Clock.now()); const end = new Date(2000 + +m[2], +m[1], 1); if (end <= now) e.exp = 'card.err.expired'; }
    if (this.digits(v.cvc).length !== (b?.cvc || 3)) e.cvc = 'card.err.cvc';
    return e;
  },
};
/** Card fields live in memory only: never in the session, localStorage or the URL. Cleared after paying. */
const CardForm = {
  v: { number: '', exp: '', cvc: '' }, touched: {}, scanned: false,
  clear() { this.v = { number: '', exp: '', cvc: '' }; this.touched = {}; this.scanned = false; },
  errors() { return Card.validate(this.v); },
  valid() { return !Object.keys(this.errors()).length; },
};
/** Camera card scanning. Production swaps in the payment provider's / an OCR SDK's scanner behind this
 *  same interface; frames never leave the device in this web app. The mock returns a sample test card. */
const CardScanner = {
  async readFront(/* frame */) { await sleep(900); const y = (new Date(Clock.now()).getFullYear() + 3) % 100; return { number: '4242 4242 4242 4242', exp: `12/${String(y).padStart(2, '0')}` }; },
  async readBack(/* frame */) { await sleep(800); return { cvc: '123' }; },
};

