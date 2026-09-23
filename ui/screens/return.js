/* ---------- Return ---------- */
Screens.ret = {
  path: '/rent/return',
  guard() { const r = State.rental; if (!r) return '/rent'; if (r.status === 'defaulted') return '/rent/closed'; if (r.planKind === 'purchase') return '/rent/active'; },
  phase: 'waiting',
  view() {
    const r = State.rental, st = State.station;
    const returned = r.status === 'returned';
    const pr = st.pricing;
    if (returned) {
      const dur = r.returnedAt - r.startedAt;
      const rows = [
        [Lbl(t('ret.duration'), t('tip.duration')), fmt.short(dur)],
        [t('ret.cost'), fmt.money(r.charges.rental, r.currency)],
        r.charges.late ? [t('ret.late'), fmt.money(r.charges.late, r.currency)] : null,
        r.authorization.amount ? [Lbl(t('ret.auth'), t('tip.auth')), `${t('ret.authReleased')} (${fmt.money(r.authorization.amount, r.currency)})`] : null,
        [Lbl(t('ret.total'), t('tip.finalTotal')), fmt.money(r.total, r.currency)],
      ];
      return html`${TopBar({ station: st, step: 'done' })}
      <main class="screen">
        <section class="screen__visual">${StationSlotMap({ station: st, target: r.returnSlot, mode: 'returned', size: 'station--lg', uid: 'returned' })}</section>
        <div class="screen__body">
          <div class="returned-head">${ReturnedMark()}<h1 class="h1" tabindex="-1">${t('ret.done')}</h1>
            <p class="returned-head__thanks">${t('ret.thanks')}</p>
            ${r.returnSlot ? html`<p class="muted returned-head__where">${t('ret.where', { slot: r.returnSlot, station: st.name })}</p>` : ''}</div>
          <section class="surface">${RentalSummary(rows, { total: true })}</section>
          <div class="returned-again"><p class="muted">${t('done.again')}</p>
            ${CtaBar(PrimaryButton({ label: t('done.againCta'), action: 'again' }), SecondaryButton({ label: t('help.cta'), href: '#/help' }))}</div>
        </div>
      </main>`;
    }
    const nd = this.phase === 'not_detected';
    const free = st.slots.filter(z => z.state === 'empty').length;
    const step1 = t('ret.step1.free');
    return html`${TopBar({ back: '/rent/active', station: st, step: 5 })}
    <main class="screen">
      <section class="screen__visual">${StationSlotMap({ station: st, mode: 'return', uid: 'return' })}</section>
      <div class="screen__body screen__body--center">
        <h1 class="h1" tabindex="-1">${t('ret.title')}</h1>
        ${free ? html`<div class="free-callout" role="status"><span class="free-callout__num num">${free}</span><span class="free-callout__txt"><strong class="lbl">${free === 1 ? t('ret.free.1') : t('ret.free.n', { n: free })}${InfoTip(t('tip.returnSlot'), t('ready.slot'))}</strong><span>${t('ret.free.hint')}</span></span></div>`
               : html`<div class="free-callout free-callout--full" role="status"><span class="free-callout__num num">0</span><span class="free-callout__txt"><strong>${t('ret.full.t')}</strong><span>${t('ret.full.d')}</span></span></div>`}
        <ol class="howto"><li>${step1}</li><li><span class="lbl">${t('ret.step2')}${InfoTip(t('tip.returnWait'), t('ret.step2'))}</span></li><li>${t('ret.step3')}</li></ol>
        ${nd ? html`<div class="alert" role="alert" style="border-color:rgba(255,181,71,.5);background:rgba(255,181,71,.08)">${icon('alert')}<div><strong>${t('err.return_not_detected.t')}</strong>${t('err.return_not_detected.d')}</div></div>`
             : html`<p class="listening" role="status"><i aria-hidden="true"></i>${t('ret.waiting')}</p>`}
        ${CtaBar(nd || !free ? SecondaryButton({ label: t('err.help'), href: '#/help' }) : '', html`<button class="btn btn--ghost" data-action="cancel">${t('ret.cancel')}</button>`)}
      </div>
    </main>`;
  },
  mount() {
    const r = State.rental; let alive = true; let poll;
    if (r.status === 'returned') {
      const svg = document.getElementById('station-returned');
      const bank = svg?.querySelector('.slot-target .station__bankg');
      if (bank && !reduced() && !this.animated) {
        this.animated = true;
        bank.style.transition = 'none'; bank.classList.add('is-away');
        requestAnimationFrame(() => requestAnimationFrame(() => { bank.style.transition = ''; bank.classList.remove('is-away'); setTimeout(() => svg.classList.add('is-live'), 500); }));
      } else svg?.classList.add('is-live');
      return;
    }
    this.animated = false;
    const started = Date.now();
    (async () => {
      if (r.status !== 'awaiting_return') { State.rental = await API.rentals.beginReturn(r.id); if (alive) render(); return; }
      document.getElementById('station-return')?.classList.add('is-live');
      poll = setInterval(async () => {
        try {
          const res = await API.rentals.checkReturn(r.id);
          if (!alive) return;
          if (res.status === 'detected') { clearInterval(poll); State.rental = res.rental; this.phase = 'waiting'; await loadStation(State.rental.stationId); render(); }
          else if ((res.status === 'not_detected' || Date.now() - started > APP_RULES.returnDetectTimeoutMs) && this.phase !== 'not_detected') { this.phase = 'not_detected'; render(); }
        } catch {}
      }, 1500);
    })();
    return () => { alive = false; clearInterval(poll); };
  },
  actions: {
    async cancel() { State.rental = await API.rentals.cancelReturn(State.rental.id); Screens.ret.phase = 'waiting'; go('/rent/active', { replace: true }); },
    finish() { this.again(); },
    /** End of the journey: clear the finished rental and start fresh at this station. */
    async again() { Session.clearRental(); State.rental = null; Screens.ret.phase = 'waiting'; await loadStation(State.station.id); go('/rent'); },
  },
};
