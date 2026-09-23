/* ---------- Help ---------- */
const HELP_TOPICS = [['charging', 'battery'], ['return', 'station'], ['machine', 'alert'], ['payment', 'card'], ['missing', 'search'], ['other', 'chat']];
Screens.help = {
  path: '/help',
  topic: null,
  ref() {
    const r = State.rental; const st = State.station;
    return [st?.id, r?.id, r?.powerBankId].filter(Boolean).join('-') || (st?.id ?? 'BH');
  },
  view() {
    const r = State.rental, st = State.station;
    const back = rentalIsLive(r) ? '/rent/active' : '/rent';
    const ctx = [[t('r.station'), st ? `${st.name} (${st.id})` : null], [t('r.id'), r?.id], [t('r.pb'), r?.powerBankId], [t('r.slot'), r?.slot]].filter(x => x[1] != null);
    const tp = this.topic;
    return html`${TopBar({ back: tp ? '__topics' : back, station: st, help: false, showRental: rentalIsLive(r) })}
    <main class="screen screen--single screen--no-cta"><div class="screen__body">
      ${tp ? html`<h1 class="h1" tabindex="-1">${t('help.t.' + tp)}</h1><p class="lede" style="max-width:40ch;margin:0">${t('help.a.' + tp)}</p>
        <section class="surface"><h2 class="h2" style="margin-bottom:8px">${t('help.contact')}</h2>
          <p class="muted small" style="margin:0 0 12px">${t('help.contact.pending')}</p>
          <p class="ref" style="margin:0 0 12px">${t('help.ref')}: <code id="ref-code">${this.ref()}</code></p>
          <button class="btn btn--secondary" data-action="copy">${icon('copy')}<span id="copy-l">${t('help.copy')}</span></button></section>
        <button class="btn btn--ghost" data-action="topics">${t('help.back')}</button>`
      : html`<div><h1 class="h1" tabindex="-1">${t('help.title')}</h1><p class="muted" style="margin:8px 0 0">${t('help.sub')}</p></div>
        <ul class="menu">${HELP_TOPICS.map(([k, ic]) => html`<li><button data-action="topic" data-topic="${k}">${icon(ic)}<span>${t('help.t.' + k)}</span>${icon('chevronR', 'icon--sm')}</button></li>`)}</ul>`}
      ${ctx.length ? html`<section class="surface surface--quiet"><h2 class="h2" style="margin-bottom:8px;font-size:var(--fs-md)">${t('help.context')}</h2>${RentalSummary(ctx)}</section>` : ''}
    </div></main>`;
  },
  actions: {
    topic(el) { Screens.help.topic = el.dataset.topic; render(); },
    topics() { Screens.help.topic = null; render(); },
    async copy() { try { await navigator.clipboard.writeText(Screens.help.ref()); document.getElementById('copy-l').textContent = t('help.copied'); } catch {} },
  },
  leave() { this.topic = null; },
};
