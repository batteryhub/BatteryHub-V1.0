/* ---------- Entry / plan selection ---------- */
Screens.entry = {
  path: '/rent',
  view() {
    const st = State.station, pr = st.pricing;
    const planId = Session.data.planId && Domain.plan(pr, Session.data.planId) ? Session.data.planId : pr.defaultPlanId;
    if (Session.data.planId !== planId) Session.patch({ planId });
    const plan = Domain.plan(pr, planId);
    const avail = Domain.available(st);
    const header = TopBar({ station: st, showRental: rentalIsLive(State.rental), step: rentalIsLive(State.rental) ? null : 1, avail: true });
    if (!st.online || avail === 0) {
      const code = !st.online ? 'station_unavailable' : 'no_power_banks';
      return html`${header}<main class="screen screen--single screen--no-cta"><div class="screen__body">
        ${ErrorState(code)}<div class="btn-stack"><button class="btn btn--secondary" data-action="reload">${t('err.retry')}</button></div></div></main>`;
    }
    return html`${header}
    <main class="screen">
      <section class="screen__visual visual--desktop-only" aria-hidden="false">${StationSlotMap({ station: st, size: 'station--lg', uid: 'entry' })}</section>
      <div class="screen__body">
        <div class="hero">
          <h1 class="display" tabindex="-1">${t('brand.tagline')}</h1>
          <p class="lede">${t('entry.lede')}</p>
        </div>
        ${HowItWorks(st)}
        ${PlanSelector(pr, planId)}
        <div id="details-slot">${PlanDetails(plan, st)}</div>
        ${TrustRow2(st)}
        ${CtaBar(html`<div id="cta-slot">${EntryCta(plan, pr)}</div>${PayFooter(st)}`)}
      </div>
    </main>`;
  },
  actions: {
    plan(el) {
      Session.patch({ planId: el.value });
      const pr = State.station.pricing, plan = Domain.plan(pr, el.value);
      const open = document.getElementById('plan-details')?.open;
      document.getElementById('details-slot').innerHTML = PlanDetails(plan, State.station).v;
      if (open) document.getElementById('plan-details').open = true;
      { const amount = fmt.money(plan.price, pr.currency), txt = document.querySelector('#cta-slot .slide__text'), th = document.getElementById('slide-thumb');
        if (txt) txt.textContent = t('entry.slide', { plan: t(plan.name), amount });
        if (th) th.setAttribute('aria-label', t('entry.cta.a11y', { plan: t(plan.name), amount })); }
    },
    continue() { Session.patch({ method: null }); go('/rent/payment'); },
    reload() { render(); },
  },
  mount() { const a = mountHowItWorks(), b = mountSlideToPay(() => Screens.entry.actions.continue()); return () => { a && a(); b && b(); }; },
};
