/* ---------- Closed (non-return) ---------- */
Screens.closed = {
  path: '/rent/closed',
  guard() { if (!State.rental || State.rental.status !== 'defaulted') return '/rent'; },
  view() {
    const r = State.rental, st = State.station;
    return html`${TopBar({ station: st })}
    <main class="screen screen--single"><div class="screen__body">
      <div class="state"><div class="state__mark state__mark--warn">${icon('box')}</div><h1 class="h1" tabindex="-1">${t('closed.title')}</h1><p class="muted">${t('closed.sub')}</p></div>
      <section class="surface">${RentalSummary([[t('ret.cost'), fmt.money(r.charges.rental, r.currency)], [Lbl(t('closed.charge'), t('tip.closedCharge')), fmt.money(r.charges.nonReturn, r.currency)], [t('ret.total'), fmt.money(r.total, r.currency)]], { total: true })}</section>
      ${CtaBar(SecondaryButton({ label: t('help.cta'), href: '#/help' }), html`<button class="btn btn--ghost" data-action="again">${t('done.againCta')}</button>`)}
    </div></main>`;
  },
  actions: { again() { Session.clearRental(); State.rental = null; go('/rent'); } },
};
