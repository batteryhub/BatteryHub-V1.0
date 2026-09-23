/* ---------- Done ---------- */
Screens.done = {
  path: '/rent/done',
  // Merged into the "Power bank returned" page; kept only so old links land somewhere sensible.
  guard() { return State.rental?.status === 'returned' ? '/rent/return' : '/rent'; },
  view() {
    return html`${TopBar({ station: State.station, help: false, step: 'done' })}
    <main class="screen screen--single screen--no-cta"><div class="screen__body">
      ${SuccessState(t('done.title'), t('done.sub'))}
      <div class="btn-stack" style="margin-top:24px"><p class="muted" style="text-align:center;margin:0">${t('done.again')}</p>
        ${SecondaryButton({ label: t('done.againCta'), action: 'again' })}</div>
    </div></main>`;
  },
  mount() { if (State.rental && !rentalIsLive(State.rental)) { Session.clearRental(); } },
  actions: { async again() { Session.clearRental(); State.rental = null; await loadStation(State.station.id); go('/rent'); } },
};
