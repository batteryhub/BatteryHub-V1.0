/* -------------------------- /config/pricing ------------------------- */
// null = not yet confirmed. The UI hides anything that is null instead of guessing.
const PRICING_PROFILES = Object.freeze({
  'th-pilot': {
    currency: 'THB',
    plans: [
      { id: '2h',   kind: 'rental',   durationMs: 2 * H,  price: 100, name: 'plan.2h.name',   blurb: 'plan.2h.blurb', popular: true },
      { id: '24h',  kind: 'rental',   durationMs: 24 * H, price: 300, name: 'plan.24h.name',  blurb: 'plan.24h.blurb' },
      { id: 'keep', kind: 'purchase', durationMs: null,   price: 850, name: 'plan.keep.name', blurb: 'plan.keep.blurb' },
    ],
    defaultPlanId: '2h',
    authorization: { amount: null },     // deposit / preauthorization: supplied by payment config later
    lateFee: { amount: 50, everyMs: H, capPerRental: 300 },   // overdue: ฿50 per started extra hour, max ฿300 per rental
    gracePeriodMs: null,
    dailyCap: null,
    nonReturn: { charge: 1000, afterMs: null },   // default mechanism, never shown as a plan
  },
});
