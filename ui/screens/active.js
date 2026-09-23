/* ---------- Active rental ---------- */
Screens.active = {
  path: '/rent/active',
  guard() {
    const r = State.rental;
    if (!r) return '/rent';
    if (r.status === 'awaiting_return') return '/rent/return';
    if (r.status === 'returned') return '/rent/return';
    if (r.status === 'defaulted') return '/rent/closed';
  },
  view() {
    const r = State.rental, st = State.station, pr = st.pricing, plan = Domain.plan(pr, r.planId);
    const keep = r.planKind === 'purchase';
    if (keep) return html`${TopBar({ station: st, step: 'done', keep: true })}
      <main class="screen screen--no-cta"><section class="screen__visual">${SuccessState(t('active.owned.title'), t('active.owned.sub'))}</section>
      <div class="screen__body"><div id="pbs-slot">${PhysicalBatteryStatus(State.pb)}</div>
      <section class="surface surface--quiet"><h2 class="h2" style="margin-bottom:8px">${t('r.details')}</h2>${RentalSummary([[t('r.id'), r.id], [t('r.pb'), r.powerBankId], [t('r.station'), `${st.name} (${st.id})`], [t('r.plan'), t(plan.name)], [t('pay.purchase'), fmt.money(r.price, r.currency)]])}</section>
      <div class="btn-stack">${SecondaryButton({ label: t('help.cta'), href: '#/help' })}</div></div></main>`;
    return html`${TopBar({ station: st, step: 4 })}
    <main class="screen">
      <section class="screen__visual"><div class="rtb-wrap">
        <h1 class="sr-only" tabindex="-1">${t('active.title')}</h1>
        ${RentalTimeBattery()}
        <p class="rtb-label lbl" style="display:flex;justify-content:center"><span id="rtb-label">${t('active.remaining')}</span>${InfoTip(t('tip.rentalTime'), t('active.remaining'))}</p>
        <p class="rtb-sub" id="rtb-sub"></p>
        <p class="sr-only" aria-live="polite" id="rtb-sr"></p>
      </div></section>
      <div class="screen__body">
        ${InfoBox(`${Terms.extraTime(pr)} ${Terms.nonReturn(pr)}`, { title: t('box.extra.t'), tone: 'warn', id: 'overdue-box', hidden: true })}
        <div id="pbs-slot">${PhysicalBatteryStatus(State.pb)}</div>
        <section class="surface surface--quiet" aria-labelledby="rd-t">
          <h2 class="h2" id="rd-t" style="margin-bottom:8px">${t('r.details')}</h2>
          ${RentalSummary([
            [t('r.plan'), t(plan.name)],
            [t('r.station'), `${st.name}, ${t('r.slot').toLowerCase()} ${r.slot}`],
            [t('r.started'), fmt.time(r.startedAt)],
            r.includedUntil ? [Lbl(t('r.until'), t('tip.until')), fmt.dateTime(r.includedUntil)] : null,
            [Lbl(t('r.total'), t('tip.total')), raw(`<span id="est-total">${esc(fmt.money(Domain.estimatedTotal(r, pr, Clock.now()), r.currency))}</span>`)],
            [t('r.pb'), r.powerBankId],
            [t('r.id'), r.id],
          ])}
          <p class="muted small" style="margin:8px 0 0">${t('r.total.note')}</p>
        </section>
        ${CtaBar(PrimaryButton({ label: t('active.return'), action: 'return' }), SecondaryButton({ label: t('help.cta'), href: '#/help' }))}
      </div>
    </main>`;
  },
  mount() {
    const r = State.rental; const pr = State.station.pricing;
    let lastSr = '';
    const loadPb = async () => { try { State.pb = await API.rentals.powerBank(r.powerBankId, r); Pbs.update(State.pb); } catch {} };
    loadPb();
    const pbTimer = setInterval(loadPb, 30000);
    if (r.planKind === 'purchase') return () => clearInterval(pbTimer);
    const total = r.includedUntil - r.startedAt;
    const tick = async () => {
      if (Dev.s.speed > 1) Clock.add((Dev.s.speed - 1) * 1000);
      const now = Clock.now(), rem = Domain.remainingMs(r, now), over = rem < 0;
      const frac = Math.max(0, Math.min(1, rem / total));
      const liquid = document.getElementById('rtb-liquid'); if (!liquid) return;
      liquid.style.transform = `translateY(${(1 - frac) * 278}px)`;
      document.getElementById('rtb').classList.toggle('is-overdue', over);
      const ob = document.getElementById('overdue-box'); if (ob) ob.hidden = !over;
      document.getElementById('rtb-big').textContent = over ? '+' + fmt.short(-rem) : fmt.short(rem);
      document.getElementById('rtb-clock').textContent = over ? '' : fmt.clock(rem);
      document.getElementById('rtb-label').textContent = over ? t('active.overdue') : t('active.remaining');
      document.getElementById('rtb-sub').textContent = over ? (pr.lateFee ? t('active.overdue.fee') : t('active.overdue.sub')) : t('active.until', { time: fmt.time(r.includedUntil) });
      const et = document.getElementById('est-total'); if (et) et.textContent = fmt.money(Domain.estimatedTotal(r, pr, now), r.currency);
      const sr = over ? t('active.overdue') : `${fmt.short(rem)} ${t('active.remaining').toLowerCase()}`;
      const minuteKey = Math.floor(Math.abs(rem) / (5 * M));
      if (minuteKey + sr.slice(0, 3) !== lastSr) { lastSr = minuteKey + sr.slice(0, 3); document.getElementById('rtb-sr').textContent = sr; }
      if (Dev.dirty) { Dev.dirty = false; await refreshRental(); if (State.rental?.status !== 'active') render(); }
    };
    tick(); const timer = setInterval(tick, 1000);
    return () => { clearInterval(timer); clearInterval(pbTimer); };
  },
  actions: { return() { go('/rent/return'); }, ...PhoneActions },
};
