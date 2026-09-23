/* ---------- Ready ---------- */
Screens.ready = {
  path: '/rent/ready',
  guard() { if (!State.rental) return '/rent'; },
  view() {
    const r = State.rental, st = State.station, keep = r.planKind === 'purchase';
    return html`${TopBar({ station: st, step: 3, keep })}
    <main class="screen">
      <section class="screen__visual">${StationSlotMap({ station: { ...st, slots: st.slots }, target: r.slot, mode: 'release', uid: 'ready' })}</section>
      <div class="screen__body screen__body--center">
        <div>
          <p class="badge" style="margin:0 0 16px">${icon('check', 'icon--sm')}${keep ? t('ready.owned') : t('ready.active')}</p>
          <h1 class="h1" tabindex="-1">${t('ready.take')}</h1>
        </div>
        <div class="slot-callout"><span class="muted" style="font-weight:700;font-size:var(--fs-lg)">${t('ready.slot')}</span><span class="slot-callout__num num">${r.slot}</span>${InfoTip(t('tip.slot'), t('ready.slot'), { slot: r.slot })}</div>
        <ol class="howto"><li>${t('ready.step1')}</li><li>${t('ready.step2')}</li><li>${keep ? t('ready.step3.keep') : t('ready.step3')}</li></ol>
        ${CtaBar(PrimaryButton({ label: keep ? t('ready.cta.keep') : t('ready.cta'), action: 'next' }), SecondaryButton({ label: t('help.cta'), href: '#/help' }))}
      </div>
    </main>`;
  },
  mount() {
    const svg = document.getElementById('station-ready'); if (!svg) return;
    const bank = svg.querySelector('.slot-target .station__bankg');
    const set = () => { if (bank) bank.classList.add('is-out'); svg.classList.add('is-live'); };
    if (reduced()) set(); else setTimeout(set, 450);
  },
  actions: { next() { go('/rent/active'); } },
};
