/* =====================================================================
   /ui/components
   ===================================================================== */
function BatteryHubLogo({ variant = 'full', tone = 'dark' } = {}) {
  const src = variant === 'full' ? BRAND.logoSrc : variant === 'compact' ? BRAND.logoCompactSrc : BRAND.logoIconSrc;
  if (src) return html`<span class="logo logo--${variant}"><img src="${src}" alt="BatteryHub"></span>`;
  const first = variant === 'compact' ? 'B' : 'Battery';
  return html`<span class="logo logo--${variant} ${tone === 'light' ? 'logo--on-light' : ''}" role="img" aria-label="BatteryHub"><span class="logo__battery" aria-hidden="true">${first}</span><span class="logo__hub" aria-hidden="true">Hub</span></span>`;
}

function StationHeader(station) {
  if (!station) return '';
  return html`<span class="station-chip">${icon('pin')}<span>${station.name}</span></span>`;
}

const JOURNEY = [['choose', 'bolt'], ['pay', 'card'], ['power', 'battery'], ['charge', 'plug'], ['return', 'station']];
/** Header progress. step: 1–5, 'done', or null. keep=true drops the Return step (Keep It purchases). */
function JourneyProgress(step, { keep = false } = {}) {
  const items = keep ? JOURNEY.slice(0, 4) : JOURNEY;
  const n = items.length, cur = step === 'done' ? n + 1 : Math.min(step, n);
  return html`<nav aria-label="${t('jp.label')}"><ol class="jp" style="--n:${n}">
    ${items.map(([k], i) => { const st = i + 1 < cur ? 'done' : i + 1 === cur ? 'current' : 'todo';
      return html`<li data-state="${st}" ${st === 'current' ? raw('aria-current="step"') : ''}><span class="jp__dot" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M2.5 6.3l2.2 2.2 4.8-5"/></svg></span><span class="jp__label">${t('journey.' + k)}</span></li>`; })}
  </ol></nav>`;
}
function TopBar({ back = null, station = null, showRental = false, help = true, step = null, keep = false, avail = false }) {
  const count = station && avail ? Domain.available(station) : null;
  return html`<header class="topbar">
    <div class="topbar__row">
      ${back ? html`<button class="icon-btn" data-action="nav" data-to="${back}" aria-label="${t('nav.back')}">${icon('back')}</button>` : ''}
      <span data-action="logo-tap" class="topbar__logo"><span class="topbar__logo-full">${BatteryHubLogo({ variant: 'full' })}</span><span class="topbar__logo-compact">${BatteryHubLogo({ variant: 'compact' })}</span></span>
      <div class="topbar__actions">
        ${station ? html`<div class="topbar__meta">${StationHeader(station)}${count != null ? html`<span class="topbar__avail"><i aria-hidden="true"></i>${t('header.ready', { n: count })}</span>` : ''}</div>` : ''}
        ${showRental ? html`<a class="pill-btn" href="#/rent/active"><span class="dot" aria-hidden="true"></span>${t('nav.rental')}</a>` : ''}
        ${help ? html`<a class="help-btn" href="#/help">${icon('help', 'icon--sm')}<span>${t('help.cta')}</span></a>` : ''}
      </div>
    </div>
    ${step ? JourneyProgress(step, { keep }) : ''}
  </header>`;
}

const HIW_SCENES = [
  `<rect x="38" y="8" width="44" height="90" rx="8" fill="#0B1F3B" stroke="#2C5286" stroke-width="1.5"/><rect x="42" y="14" width="36" height="78" rx="4" fill="#04101F"/><rect x="54" y="16" width="12" height="3" rx="1.5" fill="#16335B"/><text x="45.5" y="26.5" fill="#F5F8FC" style="font:900 5px var(--font-logo);letter-spacing:-.03em" textLength="17.25" lengthAdjust="spacingAndGlyphs">Battery</text><rect x="63.60" y="22.20" width="10.10" height="5.40" rx="1.00" fill="#00E676"/><text x="64.00" y="26.50" fill="#0B1F3B" style="font:900 5px var(--font-logo);letter-spacing:-.03em" textLength="9.00" lengthAdjust="spacingAndGlyphs">Hub</text>
    <rect x="45" y="30" width="30" height="12" rx="3" fill="#16335B"/><rect x="45" y="46" width="30" height="12" rx="3" fill="#16335B"/><rect x="45" y="62" width="30" height="12" rx="3" fill="#16335B"/>
    <rect x="48" y="34" width="12" height="2" rx="1" fill="#A5B4CA"/><rect x="48" y="50" width="12" height="2" rx="1" fill="#A5B4CA"/><rect x="48" y="66" width="12" height="2" rx="1" fill="#A5B4CA"/>
    <rect x="66" y="33" width="6" height="4" rx="1" fill="#F5F8FC"/><rect x="66" y="49" width="6" height="4" rx="1" fill="#F5F8FC"/><rect x="66" y="65" width="6" height="4" rx="1" fill="#F5F8FC"/>
    <g class="hsa-sel"><rect x="44.5" y="29.5" width="31" height="13" rx="3.5" fill="rgba(0,230,118,.15)" stroke="#00E676" stroke-width="1.4"/><circle class="hsa-tap" cx="70" cy="36" r="6" fill="none" stroke="#F5F8FC" stroke-width="1.5"/></g>
    <rect x="45" y="80" width="30" height="8" rx="4" fill="#00E676"/>
  `,
  `<rect x="38" y="8" width="44" height="90" rx="8" fill="#0B1F3B" stroke="#2C5286" stroke-width="1.5"/><rect x="42" y="14" width="36" height="78" rx="4" fill="#04101F"/><rect x="54" y="16" width="12" height="3" rx="1.5" fill="#16335B"/><text x="45.5" y="26.5" fill="#F5F8FC" style="font:900 5px var(--font-logo);letter-spacing:-.03em" textLength="17.25" lengthAdjust="spacingAndGlyphs">Battery</text><rect x="63.60" y="22.20" width="10.10" height="5.40" rx="1.00" fill="#00E676"/><text x="64.00" y="26.50" fill="#0B1F3B" style="font:900 5px var(--font-logo);letter-spacing:-.03em" textLength="9.00" lengthAdjust="spacingAndGlyphs">Hub</text>
    <rect x="45" y="80" width="30" height="8" rx="4" fill="#00E676"/>
    <g class="hsa-ok"><circle cx="60" cy="48" r="13" fill="#00E676"/><path d="M54 48.5l4 4 8-9" fill="none" stroke="#0B1F3B" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>
    <g class="hsa-card"><rect x="44" y="38" width="32" height="21" rx="3" fill="#F5F8FC"/><rect x="44" y="43" width="32" height="4" fill="#0B1F3B"/><rect x="47" y="51" width="10" height="3" rx="1" fill="#A5B4CA"/></g>
  `,
  `<rect x="34" y="6" width="52" height="24" rx="3" fill="#16335B" stroke="#2C5286"/><rect x="37" y="9" width="46" height="18" rx="1.5" fill="#061326"/><text x="43.5" y="20.5" fill="#F5F8FC" style="font:900 6px var(--font-logo);letter-spacing:-.03em" textLength="20.70" lengthAdjust="spacingAndGlyphs">Battery</text><rect x="65.22" y="15.34" width="12.12" height="6.48" rx="1.20" fill="#00E676"/><text x="65.70" y="20.50" fill="#0B1F3B" style="font:900 6px var(--font-logo);letter-spacing:-.03em" textLength="10.80" lengthAdjust="spacingAndGlyphs">Hub</text><rect x="54" y="30" width="12" height="3" fill="#0B1F3B"/><rect x="33" y="33" width="54" height="72" rx="5" fill="#0F2747" stroke="#2C5286"/><rect x="35.5" y="37" width="49" height="32" rx="3" fill="#0D2444"/><rect x="35.5" y="71" width="49" height="32" rx="3" fill="#0D2444"/><path class="hsa-arc" d="M43 40 Q32 53.5 43 67" fill="none" stroke="#00E676" stroke-width="1.4" stroke-linecap="round"/><path class="hsa-arc" d="M77 40 Q88 53.5 77 67" fill="none" stroke="#00E676" stroke-width="1.4" stroke-linecap="round"/><path class="hsa-arc" d="M43 74 Q32 87.5 43 101" fill="none" stroke="#00E676" stroke-width="1.4" stroke-linecap="round"/><path class="hsa-arc" d="M77 74 Q88 87.5 77 101" fill="none" stroke="#00E676" stroke-width="1.4" stroke-linecap="round"/><rect x="45" y="44" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="45.7" y="44.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="50" y="46.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="61" y="44" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="61.7" y="44.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="66" y="46.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="45" y="56" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="45.7" y="56.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="50" y="58.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="61" y="56" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="61.7" y="56.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="66" y="58.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="45" y="78" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><g class="hsa-out"><rect x="45.7" y="78.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628" stroke="#00E676" stroke-width=".9"/><rect x="50" y="80.6" width="4" height="1.8" rx=".5" fill="#00E676"/></g><rect x="61" y="78" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="61.7" y="78.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="66" y="80.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="45" y="90" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="45.7" y="90.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="50" y="92.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="61" y="90" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="61.7" y="90.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="66" y="92.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/>`,
  `<rect x="16" y="14" width="40" height="80" rx="7" fill="#0B1F3B" stroke="#2C5286" stroke-width="1.5"/><rect x="20" y="19" width="32" height="70" rx="4" fill="#04101F"/><rect x="31" y="22" width="10" height="2.5" rx="1.25" fill="#16335B"/><rect x="28" y="40" width="16" height="30" rx="3" fill="none" stroke="#F5F8FC" stroke-width="1.4"/><rect x="33" y="37" width="6" height="3" rx="1" fill="#F5F8FC"/><rect class="hsa-fillbar" x="30" y="42" width="12" height="26" rx="1.5" fill="#00E676"/><path class="hsa-bolt" d="M37 47l-4 7h3l-1 6 5-8h-3z" fill="#0B1F3B"/><path class="hsa-cable" pathLength="100" d="M88 107.5 C88 123, 36 121, 36 105.5" fill="none" stroke="#8E9BB0" stroke-width="3.4" stroke-linecap="round"/><path class="hsa-cable" pathLength="100" d="M88 107.5 C88 123, 36 121, 36 105.5" fill="none" stroke="#EEF2F7" stroke-width="1.8" stroke-linecap="round"/><circle class="hsa-spark" cx="36" cy="93.5" r="5" fill="#00E676"/><g class="hsa-plugin"><rect x="34.6" y="92.5" width="2.8" height="3" rx=".6" fill="#B8C2D1"/><rect x="32" y="95" width="8" height="7.5" rx="1.8" fill="#DDE4EE"/><rect x="33.4" y="102" width="5.2" height="4" rx="1.2" fill="#C5CEDB"/></g><rect x="72" y="40" width="32" height="56" rx="8" fill="#0A1628" stroke="#2A4C7A" stroke-width="1.2"/><rect x="74.5" y="42.5" width="27" height="51" rx="6" fill="none" stroke="#132B4B" stroke-width=".8"/><text x="75.8" y="63" fill="#F5F8FC" style="font:900 4.6px var(--font-logo);letter-spacing:-.03em" textLength="15.87" lengthAdjust="spacingAndGlyphs">Battery</text><rect x="92.45" y="59.04" width="9.29" height="4.97" rx="0.92" fill="#00E676"/><text x="92.82" y="63.00" fill="#0B1F3B" style="font:900 4.6px var(--font-logo);letter-spacing:-.03em" textLength="8.28" lengthAdjust="spacingAndGlyphs">Hub</text><circle class="hsa-led hsa-led0" cx="79.5" cy="78" r="1.7" fill="#00E676"/><circle class="hsa-led hsa-led1" cx="85.2" cy="78" r="1.7" fill="#00E676"/><circle class="hsa-led hsa-led2" cx="90.9" cy="78" r="1.7" fill="#00E676"/><circle class="hsa-led hsa-led3" cx="96.6" cy="78" r="1.7" fill="#00E676"/><rect x="86.6" y="96" width="2.8" height="3" rx=".6" fill="#B8C2D1"/><rect x="84" y="98.5" width="8" height="6" rx="1.8" fill="#DDE4EE"/><rect x="85.4" y="104" width="5.2" height="4" rx="1.2" fill="#C5CEDB"/>`,
  `<rect x="34" y="6" width="52" height="24" rx="3" fill="#16335B" stroke="#2C5286"/><rect x="37" y="9" width="46" height="18" rx="1.5" fill="#061326"/><text x="43.5" y="20.5" fill="#F5F8FC" style="font:900 6px var(--font-logo);letter-spacing:-.03em" textLength="20.70" lengthAdjust="spacingAndGlyphs">Battery</text><rect x="65.22" y="15.34" width="12.12" height="6.48" rx="1.20" fill="#00E676"/><text x="65.70" y="20.50" fill="#0B1F3B" style="font:900 6px var(--font-logo);letter-spacing:-.03em" textLength="10.80" lengthAdjust="spacingAndGlyphs">Hub</text><rect x="54" y="30" width="12" height="3" fill="#0B1F3B"/><rect x="33" y="33" width="54" height="72" rx="5" fill="#0F2747" stroke="#2C5286"/><rect x="35.5" y="37" width="49" height="32" rx="3" fill="#0D2444"/><rect x="35.5" y="71" width="49" height="32" rx="3" fill="#0D2444"/><path class="hsa-arc" d="M43 40 Q32 53.5 43 67" fill="none" stroke="#00E676" stroke-width="1.4" stroke-linecap="round"/><path class="hsa-arc" d="M77 40 Q88 53.5 77 67" fill="none" stroke="#00E676" stroke-width="1.4" stroke-linecap="round"/><path class="hsa-arc" d="M43 74 Q32 87.5 43 101" fill="none" stroke="#00E676" stroke-width="1.4" stroke-linecap="round"/><path class="hsa-arc" d="M77 74 Q88 87.5 77 101" fill="none" stroke="#00E676" stroke-width="1.4" stroke-linecap="round"/><rect x="45" y="44" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="45.7" y="44.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="50" y="46.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="61" y="44" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="61.7" y="44.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="66" y="46.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="45" y="56" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="45.7" y="56.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="50" y="58.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="61" y="56" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="61.7" y="56.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="66" y="58.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="45" y="78" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><g class="hsa-in"><rect x="45.7" y="78.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628" stroke="#00E676" stroke-width=".9"/><rect x="50" y="80.6" width="4" height="1.8" rx=".5" fill="#00E676"/></g><rect x="61" y="78" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="61.7" y="78.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="66" y="80.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="45" y="90" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="45.7" y="90.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="50" y="92.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><rect x="61" y="90" width="14" height="7" rx="3.5" fill="#030C18" stroke="#1E3A62" stroke-width=".7"/><rect x="61.7" y="90.7" width="12.6" height="5.6" rx="2.8" fill="#0A1628"/><rect x="66" y="92.6" width="4" height="1.8" rx=".5" fill="#00E676" opacity=".8"/><g class="hsa-done"><circle class="hsa-done-ring" cx="60" cy="116" r="9" fill="none" stroke="#00E676" stroke-width="1.2"/><circle cx="60" cy="116" r="7" fill="#00E676"/><path class="hsa-done-tick" d="M56.6 116.3l2.4 2.4 4.6-5.1" fill="none" stroke="#0B1F3B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" pathLength="10"/></g>`
];
const HIW_VIEWBOX = ['10 2 100 110', '10 2 100 110', '10 2 100 110', '10 2 100 126', '10 2 100 126'];
/** How-it-works carousel: auto-playing cards with a large animated scene and a short caption. */
const HIW_MS = 4600;
function HowItWorks(station) {
  const keys = ['choose', 'pay', 'power', 'charge', 'return'];
  const text = k => k === 'return' ? t(station.returnPolicy.anyStation ? 'hiw.return.d.any' : 'hiw.return.d.same') : t(`hiw.${k}.d`);
  return html`<section class="hiw" aria-roledescription="carousel" aria-label="${t('hiw.label')}" style="--hiw-ms:${HIW_MS}ms">
    <div class="hiw__stage" id="hiw-stage">
      ${keys.map((k, i) => html`<div class="hc ${i === 0 ? 'is-active' : ''}" role="group" aria-roledescription="slide" aria-label="${t('hiw.slide', { n: i + 1, total: keys.length })}" ${i === 0 ? '' : raw('aria-hidden="true"')} data-i="${i}">
        <div class="hc__art" aria-hidden="true">${raw(`<svg viewBox="${HIW_VIEWBOX[i]}">${HIW_SCENES[i]}</svg>`)}</div>
        <h3 class="hc__title">${t(`hiw.${k}.t`)}</h3>
        <p class="hc__text">${text(k)}</p>
      </div>`)}
    </div>
  </section>`;
}
/** Auto-advances; holds while hovered or touched; stops when the tab is hidden. */
function mountHowItWorks() {
  const stage = document.getElementById('hiw-stage'); if (!stage) return () => {};
  const root = stage.parentElement, cards = [...stage.children];
  let idx = 0, elapsed = 0, held = false;
  const show = next => {
    const prev = cards[idx];
    prev.classList.remove('is-active'); prev.classList.add('is-leaving'); prev.setAttribute('aria-hidden', 'true');
    setTimeout(() => prev.classList.remove('is-leaving'), 700);
    idx = next;
    cards[idx].classList.add('is-active'); cards[idx].removeAttribute('aria-hidden');
  };
  const timer = setInterval(() => {
    if (held || offscreen || document.hidden) return;
    elapsed += 100;
    if (elapsed >= HIW_MS) { elapsed = 0; show((idx + 1) % cards.length); }
  }, 100);
  let offscreen = false;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => { offscreen = !e.isIntersecting; root.classList.toggle('is-offscreen', offscreen); }, { threshold: 0.05 }) : null;
  if (io) io.observe(root);
  const hold = v => () => { held = v; root.classList.toggle('is-held', v); };
  const on = [['pointerenter', hold(true)], ['pointerleave', hold(false)], ['pointerdown', hold(true)], ['pointerup', hold(false)], ['pointercancel', hold(false)]];
  on.forEach(([ev, fn]) => root.addEventListener(ev, fn));
  return () => { clearInterval(timer); if (io) io.disconnect(); };
}

function StepIndicator(current) {
  const labels = [t('steps.plan'), t('steps.payment'), t('steps.power')];
  return html`<div><p class="sr-only">${t('steps.label', { n: current })}</p>
    <ol class="steps" aria-hidden="true">${labels.map((l, i) => html`<li data-state="${i + 1 < current ? 'done' : i + 1 === current ? 'current' : 'todo'}">${l}</li>`)}</ol></div>`;
}

function EntryCta(plan, pr) {
  const amount = fmt.money(plan.price, pr.currency);
  return html`<div class="cta-slide">${SlideToPay({ label: t('entry.slide', { plan: t(plan.name), amount }), a11y: t('entry.cta.a11y', { plan: t(plan.name), amount }), hint: t('entry.slideHint') })}</div>`;
  return html`<button class="cta-go" data-action="continue" aria-label="${t('entry.cta.a11y', { plan: t(plan.name), amount })}"><span class="cta-go__label">${t('entry.cta', { plan: t(plan.name) })}</span><span class="cta-go__end"><span class="num">${amount}</span>${icon('chevronR')}</span></button>`;
}
function PrimaryButton({ label, action, attrs = '', trailing = null, cls = '' }) {
  return html`<button class="btn btn--primary ${trailing ? 'btn--split' : ''} ${cls}" data-action="${action}" ${raw(attrs)}><span>${label}</span>${trailing ? html`<span class="num">${trailing}</span>` : ''}</button>`;
}
function SecondaryButton({ label, action, href }) {
  return href ? html`<a class="btn btn--secondary" href="${href}">${label}</a>` : html`<button class="btn btn--secondary" data-action="${action}">${label}</button>`;
}
function CtaBar(...children) { return html`<div class="cta-bar"><div class="cta-bar__inner">${children}</div></div>`; }

/** Per-hour price for rental plans, e.g. ฿50/hr, ฿12.5/hr (one decimal when needed). */
function perHour(plan, cur) {
  if (plan.kind !== 'rental' || !plan.durationMs) return null;
  const v = plan.price / (plan.durationMs / H);
  try { return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: cur, currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0, maximumFractionDigits: Number.isInteger(v) ? 0 : 1 }).format(v); }
  catch { return fmt.money(v, cur); }
}
function PlanCard(plan, pricing, selected) {
  const purchase = plan.kind === 'purchase', ph = perHour(plan, pricing.currency);
  return html`<label class="plan ${purchase ? 'plan--purchase' : ''} ${plan.popular ? 'plan--popular' : ''}">
    <input type="radio" name="plan" value="${plan.id}" ${selected ? raw('checked') : ''} data-change="plan" aria-describedby="pb-${plan.id}">
    ${plan.popular ? html`<span class="plan__pop">${raw('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>')}${t('plan.mostPopular')}</span>` : ''}
    <span class="plan__radio" aria-hidden="true"></span>
    <span class="plan__info"><span class="plan__name">${t(plan.name)}</span><span class="plan__blurb" id="pb-${plan.id}">${t(plan.blurb)}</span></span>
    <span class="plan__cost"><span class="plan__price num">${fmt.money(plan.price, pricing.currency)}</span>${ph ? html`<span class="plan__ph">${t('plan.perHour', { amount: ph })}</span>` : ''}</span>
  </label>`;
}
function PlanSelector(pricing, selectedId) {
  const rentals = pricing.plans.filter(p => p.kind === 'rental');
  const purchases = pricing.plans.filter(p => p.kind === 'purchase');
  return html`<fieldset class="plans"><legend class="plans__legend"><span class="plans__title">${t('entry.choose.a')}<em>${t('entry.choose.b')}</em></span><span class="plans__sub">${t('entry.choose.sub')}</span></legend>
    ${rentals.map(p => PlanCard(p, pricing, p.id === selectedId))}
    ${purchases.map(p => PlanCard(p, pricing, p.id === selectedId))}
  </fieldset>`;
}
function PlanDetails(plan, station) {
  const pr = station.pricing, cur = pr.currency;
  const rows = [];
  if (plan.kind === 'rental') {
    const extra = Terms.extraTime(pr);
    rows.push([Lbl(t('details.time'), t('tip.included')), fmt.short(plan.durationMs)]);
    rows.push([Lbl(t('details.extra'), extra), pr.lateFee ? `${fmt.money(pr.lateFee.amount, cur)} / ${Terms.period(pr.lateFee.everyMs)}` : t('details.extra.terms')]);
    if (pr.lateFee?.capPerRental != null) rows.push([Lbl(t('details.lateCap'), extra), t('details.lateCap.v', { cap: fmt.money(pr.lateFee.capPerRental, cur) })]);
    if (pr.gracePeriodMs) rows.push([Lbl(t('details.grace'), extra), fmt.short(pr.gracePeriodMs)]);
    if (pr.dailyCap != null) rows.push([Lbl(t('details.cap'), extra), fmt.money(pr.dailyCap, cur)]);
    const authAmt = Dev.s.auth !== '' ? Number(Dev.s.auth) : pr.authorization.amount;
    if (authAmt != null) rows.push([Lbl(t('details.auth'), t('tip.auth')), fmt.money(authAmt, cur)]);
    rows.push([Lbl(t('details.return'), Terms.returnRule(station)), station.returnPolicy.anyStation ? t('details.return.any') : t('details.return.same')]);
    if (pr.nonReturn?.charge != null) rows.push([Lbl(t('details.nonreturn'), Terms.nonReturn(pr)), fmt.money(pr.nonReturn.charge, cur)]);
  } else {
    rows.push([Lbl(t('details.keep'), t('tip.keep')), t('details.keep.v')]);
  }
  const cables = station.hardware?.powerBank?.cables;
  rows.unshift([t('inc.compat'), t('inc.compat.v')]);
  if (cables?.length) rows.unshift([t('inc.cables'), cables.join(', ')]);
  return html`<details class="details details--inc" id="plan-details"><summary><span class="inc__ic">${icon('doc')}</span><span class="inc__txt"><strong>${t('inc.title')}</strong><small>${t('inc.sub')}</small></span>${icon('chevron', 'icon--sm')}</summary>
    <div class="details__body"><dl class="rows">${rows.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl></div></details>`;
}
function InfoTip(text, about, { slot = null } = {}) {
  return html`<button type="button" class="info-btn" data-action="tip" data-tip="${text}" ${slot ? raw(`data-slot="${Number(slot)}"`) : ''} aria-controls="tip" aria-expanded="false" aria-label="${t('tip.about', { x: about })}">${icon('info')}</button>`;
}
/** Numbered front-view map of the station's slots (from hardware layout), with one slot highlighted. */
function SlotDiagram(target) {
  const hw = (State.station && State.station.hardware) || HARDWARE_MODELS['wdian-8'];
  const { columns, rows, modules = 2 } = hw.layout, rowsPer = rows / modules;
  const W = 200, pad = 14, gap = 10, pillH = 26, rowGap = 8, modGap = 12, modPad = 12;
  const pillW = (W - pad * 2 - modPad * 2 - gap * (columns - 1)) / columns;
  const modH = modPad * 2 + rowsPer * pillH + (rowsPer - 1) * rowGap;
  const top = 34, H = top + modules * modH + (modules - 1) * modGap + pad;
  let out = `<rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="14" fill="#0F2747" stroke="#2C5286"/>
    <rect x="${W / 2 - 34}" y="12" width="68" height="14" rx="7" fill="#04101F"/>
    <text x="${W / 2}" y="22.5" text-anchor="middle" fill="#A5B4CA" style="font:700 8px var(--font-ui);letter-spacing:.04em">${esc(t('diagram.front'))}</text>`;
  for (let m = 0; m < modules; m++) {
    const my = top + m * (modH + modGap);
    out += `<rect x="${pad}" y="${my}" width="${W - pad * 2}" height="${modH}" rx="10" fill="#0D2444" stroke="#22436F"/>`;
    for (let r = 0; r < rowsPer; r++) for (let c = 0; c < columns; c++) {
      const n = (m * rowsPer + r) * columns + c + 1; if (n > hw.slotCount) continue;
      const x = pad + modPad + c * (pillW + gap), y = my + modPad + r * (pillH + rowGap), on = n === target;
      out += `<rect x="${x}" y="${y}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${on ? '#00E676' : '#04101F'}" stroke="${on ? '#00E676' : '#2A4C7A'}" ${on ? 'filter="url(#sdGlow)"' : ''}/>
        <text x="${x + pillW / 2}" y="${y + pillH / 2 + 4.5}" text-anchor="middle" fill="${on ? '#0B1F3B' : '#A5B4CA'}" style="font:800 13px var(--font-ui)">${n}</text>`;
    }
  }
  return `<svg class="slotdiag" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('diagram.label', { n: target }))}">
    <defs><filter id="sdGlow" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${out}</svg>`;
}
const Lbl = (label, tip) => html`<span class="lbl">${label}${InfoTip(tip, label)}</span>`;
function InfoBox(text, { title = null, tone = '', id = null, hidden = false } = {}) {
  return html`<aside class="infobox ${tone ? 'infobox--' + tone : ''}" ${id ? raw(`id="${id}"`) : ''} ${hidden ? raw('hidden') : ''}>${icon(tone === 'warn' ? 'alert' : 'info')}<div>${title ? html`<strong>${title}</strong>` : ''}${text}</div></aside>`;
}
/* Customer-facing term explanations, built only from configured values. */
const Terms = {
  period(ms) { return ms === H ? t('unit.hour') : ms === 30 * M ? t('unit.halfhour') : fmt.short(ms); },
  extraTime(pr) {
    const cur = pr.currency;
    if (!pr.lateFee) return t('tip.extra.generic');
    let s = t('tip.extra.fee', { amount: fmt.money(pr.lateFee.amount, cur), period: Terms.period(pr.lateFee.everyMs) });
    if (pr.lateFee.capPerRental != null) s += ' ' + t('tip.extra.capRental', { cap: fmt.money(pr.lateFee.capPerRental, cur) });
    if (pr.gracePeriodMs) s += ' ' + t('tip.extra.grace', { grace: fmt.short(pr.gracePeriodMs) });
    if (pr.dailyCap != null) s += ' ' + t('tip.extra.cap', { cap: fmt.money(pr.dailyCap, cur) });
    return s;
  },
  nonReturn(pr) { return pr.nonReturn?.charge != null ? t('tip.nonreturn', { amount: fmt.money(pr.nonReturn.charge, pr.currency) }) : ''; },
  returnRule(st) { return st.returnPolicy.anyStation ? t('tip.return.any') : t('tip.return.same'); },
};
const Tips = {
  el: null, btn: null,
  init() {
    this.el = document.createElement('div'); this.el.id = 'tip'; this.el.className = 'tip'; this.el.setAttribute('role', 'status'); this.el.hidden = true;
    document.body.append(this.el);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(true); });
    window.addEventListener('scroll', () => this.close(), { passive: true });
    window.addEventListener('resize', () => this.close());
  },
  toggle(btn) { if (this.btn === btn) return this.close(); this.open(btn); },
  open(btn) {
    this.close(); this.btn = btn; btn.setAttribute('aria-expanded', 'true');
    const el = this.el, vw = innerWidth, vh = innerHeight;
    if (btn.dataset.slot) { el.innerHTML = SlotDiagram(Number(btn.dataset.slot)) + `<p class="tip__cap">${esc(btn.dataset.tip)}</p>`; el.classList.add('tip--diagram'); }
    else { el.textContent = btn.dataset.tip; el.classList.remove('tip--diagram'); }
    el.hidden = false;
    el.style.maxWidth = Math.min(300, vw - 32) + 'px'; el.style.left = '0px'; el.style.top = '0px';
    const r = btn.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
    const left = Math.min(Math.max(16, r.left + r.width / 2 - w / 2), vw - w - 16);
    let top = r.bottom + 10; if (top + h > vh - 12) top = r.top - h - 10;
    el.style.left = left + 'px'; el.style.top = Math.max(8, top) + 'px';
  },
  close(refocus) { if (!this.btn) return; this.btn.setAttribute('aria-expanded', 'false'); if (refocus) this.btn.focus(); this.btn = null; this.el.hidden = true; },
};

function TrustRow2(station) {
  const any = station.returnPolicy.anyStation;
  return html`<ul class="trust2">
    <li><span class="trust2__ic">${icon('bolt')}</span><span>${t('trust2.noapp')}</span></li>
    <li><span class="trust2__ic">${icon('shieldCheck')}</span><span>${t('trust2.secure')}</span></li>
    <li><span class="trust2__ic">${icon(any ? 'globe' : 'pin')}</span><span>${any ? t('trust2.any') : t('trust2.here', { station: station.name })}</span></li>
  </ul>`;
}
/** Brand mark for the card-number field: logo when we have one, else the short text label. */
function BrandMark(b) { const src = PAYMENT_BADGES[b.id]?.logoSrc; return src ? html`<img class="bm--${b.id}" src="${src}" alt="">` : b.label; }
function PayBadge(id) {
  const b = PAYMENT_BADGES[id] || { label: id, logoSrc: null };
  return b.logoSrc ? html`<span class="netchip netchip--img"><img src="${b.logoSrc}" alt="${b.label}" decoding="async"></span>`
                   : html`<span class="netchip netchip--${id.includes('_pay') ? 'wallet' : id}">${b.label}</span>`;
}
function PayFooter(station) {
  const wallets = { apple_pay: 'Apple Pay', google_pay: 'G Pay' };
  return html`<div class="payfoot"><span class="cardbox__secure">${icon('lock')}<span>${raw(esc(t('pay.secureBy', { name: '\u0000' })).replace('\u0000', `<strong>${esc(PAYMENT_PROCESSOR.name)}</strong>`))}</span></span>
    <span class="netchips" aria-label="Accepted payment methods">${PAYMENT_PROCESSOR.networks.map(PayBadge)}${station.paymentMethods.filter(m => wallets[m]).map(PayBadge)}</span></div>`;
}
function TrustRow(station) {
  return html`<ul class="trust">
    <li>${icon('noapp')}${Lbl(t('trust.noapp'), t('tip.noapp'))}</li>
    <li>${icon('shield')}${Lbl(t('trust.secure'), t('tip.secure'))}</li>
    ${station.returnPolicy.anyStation ? html`<li>${icon('swap')}${t('trust.anystation')}</li>` : ''}
  </ul>`;
}
function Journey() {
  const items = [['choose', 'bolt'], ['pay', 'card'], ['take', 'battery'], ['return', 'station']];
  return html`<ol class="journey" aria-label="How it works">${items.map(([k, ic]) => html`<li><span class="journey__item">${icon(ic)}${t('journey.' + k)}</span></li>`)}</ol>`;
}

/** Slide-to-pay: drag the thumb to the end; fizzy green liquid fills the track behind it. Enter/Space also confirms. */
function SlideToPay({ label, a11y, busy = false, disabled = false, hint = null }) {
  const bubbles = Array.from({ length: 14 }, (_, i) => {
    const left = (i * 37) % 100, size = 3 + (i * 7) % 6, dur = 1.4 + ((i * 13) % 10) / 8, delay = ((i * 29) % 20) / 10;
    return `<i style="left:${left}%;width:${size}px;height:${size}px;animation-duration:${dur}s;animation-delay:-${delay}s"></i>`;
  }).join('');
  return html`<div class="slide ${busy ? 'is-busy' : ''} ${disabled ? 'is-disabled' : ''}" id="slide" style="--x:0px">
    <div class="slide__fill" aria-hidden="true">
      <div class="slide__bubbles">${raw(bubbles)}</div>
      <span class="slide__halo"></span>
    </div>
    <svg class="slide__cable" id="slide-cable" aria-hidden="true"><path class="slide__cable-jacket"/><path class="slide__cable-shine"/></svg>
    <span class="slide__label" aria-hidden="true"><span class="slide__text">${busy ? t('pay.busy') : label}</span></span>${busy ? '' : raw('<svg class="slide__chev" aria-hidden="true" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>')}
    <button type="button" class="slide__thumb" id="slide-thumb" aria-label="${busy ? t('pay.busy') : a11y}" aria-describedby="slide-hint" ${busy || disabled ? raw('disabled') : ''} ${busy ? raw('aria-busy="true"') : ''}>
      ${raw(PLUG_SVG)}
    </button>
    <span class="sr-only" id="slide-hint">${hint || t('pay.slideHint')}</span>
  </div>`;
}
/** Thumb art: phone charging-cable plug (white housing, metal tip with contacts) pointing into the track. */
const PLUG_SVG = `<svg class="plug" viewBox="0 0 64 40" aria-hidden="true">
  <defs><linearGradient id="plugBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#EEF2F7"/><stop offset="1" stop-color="#C9D2DF"/></linearGradient>
    <linearGradient id="plugTip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3F5F8"/><stop offset=".45" stop-color="#B9C2CE"/><stop offset="1" stop-color="#8E99A8"/></linearGradient></defs>
  <path class="plug__relief" d="M0 15.5h6a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H0z" fill="#DDE3EC"/>
  <rect class="plug__body" x="7" y="7" width="36" height="26" rx="8" fill="url(#plugBody)"/>
  <path d="M12 10.5h26" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>
  <rect class="plug__collar" x="41" y="13" width="4" height="14" rx="1.5" fill="#D5DCE6"/>
  <rect class="plug__tip" x="44" y="14.5" width="18" height="11" rx="4" fill="url(#plugTip)"/>
  <g class="plug__pins" fill="#E2B650"><rect x="47.5" y="17" width="1.6" height="6" rx=".6"/><rect x="50.5" y="17" width="1.6" height="6" rx=".6"/><rect x="53.5" y="17" width="1.6" height="6" rx=".6"/><rect x="56.5" y="17" width="1.6" height="6" rx=".6"/></g>
  <circle class="plug__led" cx="25" cy="20" r="2.4" fill="#00E676"/>
</svg>`;
/** Cable from the track's left edge to the plug on the back of the thumb; the longer it gets, the more it curves. */
function drawSlideCable(el, x) {
  const svg = document.getElementById('slide-cable'); if (!svg) return;
  const h = el.clientHeight, mid = h / 2;
  const end = x + 3;                            // plug's strain relief, at the thumb's left edge
  const start = -6, len = Math.max(0, end - start);
  const amp = Math.min(h * .36, len * .22);     // curve depth grows with length
  const d = `M${start} ${mid + 6} C ${start + len * .3} ${mid + 6 + amp}, ${start + len * .62} ${mid - amp}, ${end} ${mid}`;
  svg.querySelectorAll('path').forEach(pth => pth.setAttribute('d', d));
}
function mountSlideToPay(onConfirm, guard = null) {
  const el = document.getElementById('slide'), thumb = document.getElementById('slide-thumb');
  if (!el || !thumb) return;
  const max = () => el.clientWidth - thumb.offsetWidth - 8;
  if (el.classList.contains('is-busy')) { drawSlideCable(el, max()); return; }
  drawSlideCable(el, 0);
  if (el.classList.contains('is-disabled')) return;
  let dragging = false, startX = 0, x = 0, done = false, raf = 0;
  const set = v => { x = Math.max(0, Math.min(max(), v)); el.style.setProperty('--x', x + 'px'); el.style.setProperty('--p', (x / max()).toFixed(3)); drawSlideCable(el, x); };
  // JS tween instead of a CSS transition so the cable stays attached to the plug the whole way
  const tween = (to, ms, cb) => {
    cancelAnimationFrame(raf);
    if (reduced()) { set(to); cb && cb(); return; }
    const from = x, t0 = performance.now(), back = to < from;
    el.classList.add('is-dragging');
    const ease = k => back ? 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2) : 1 - Math.pow(1 - k, 3);
    const step = now => { const k = Math.min(1, (now - t0) / ms); set(from + (to - from) * ease(k)); if (k < 1) raf = requestAnimationFrame(step); else { el.classList.remove('is-dragging'); cb && cb(); } };
    raf = requestAnimationFrame(step);
  };
  const finish = () => { if (done) return; if (guard && !guard()) { dragging = false; tween(0, 520); return; } done = true; dragging = false; tween(max(), 220, () => { el.classList.add('is-done'); if (navigator.vibrate) navigator.vibrate(12); setTimeout(onConfirm, reduced() ? 0 : 220); }); };
  const release = () => { if (!dragging) return; dragging = false; if (x >= max() * .86) finish(); else tween(0, 520); };
  thumb.addEventListener('pointerdown', e => { if (done) return; cancelAnimationFrame(raf); dragging = true; startX = e.clientX - x; thumb.setPointerCapture(e.pointerId); el.classList.add('is-dragging'); });
  thumb.addEventListener('pointermove', e => { if (dragging) set(e.clientX - startX); });
  thumb.addEventListener('pointerup', release); thumb.addEventListener('pointercancel', release);
  thumb.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); finish(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); tween(x + max() / 4, 220, () => { if (x >= max() * .86) finish(); }); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); tween(x - max() / 4, 220); }
  });
  const onResize = () => drawSlideCable(el, done ? max() : x);
  window.addEventListener('resize', onResize);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
}

/** Product render for the checkout card (brand navy body, green edge light). */
/** Product render of the BatteryHub power bank for the checkout card: slim matte-black body, large
 *  "Battery + Hub-box" wordmark along its length, RETURN arrow, 3 status LEDs, side ports and an end cap
 *  with the glowing B Hub light. Keeps the web app's green edge glow and floor glow. */
function PowerBankArt() {
  const F = 'Inter,system-ui,sans-serif';
  return raw(`<svg class="paycard__art" viewBox="0 0 160 172" aria-hidden="true">
    <defs><linearGradient id="pbBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A4250"/><stop offset=".35" stop-color="#232933"/><stop offset="1" stop-color="#0C0F14"/></linearGradient>
      <linearGradient id="pbSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#101318"/><stop offset="1" stop-color="#030406"/></linearGradient>
      <linearGradient id="pbCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1E25"/><stop offset="1" stop-color="#0B0D11"/></linearGradient>
      <filter id="pbGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2"/></filter>
      <filter id="pbGlowS" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.4"/></filter>
      <radialGradient id="pbFloor"><stop offset="0" stop-color="#00E676" stop-opacity=".35"/><stop offset="1" stop-color="#00E676" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="80" cy="154" rx="64" ry="12" fill="url(#pbFloor)"/>
    <g transform="rotate(38 80 86)">
      <!-- thickness / side face with ports -->
      <rect x="55" y="19" width="60" height="138" rx="13" fill="url(#pbSide)"/>
      <rect x="111" y="38" width="4" height="100" rx="2" fill="#00E676" filter="url(#pbGlow)" class="paycard__glow"/>
      <rect x="111.6" y="38" width="2.8" height="100" rx="1.4" fill="#5CFFA8" opacity=".9"/>
      <rect x="111.2" y="44" width="3.4" height="10" rx="1.7" fill="#050608" stroke="#2A303A" stroke-width=".5"/>
      <rect x="111.2" y="58" width="3.4" height="7" rx="1.7" fill="#050608" stroke="#2A303A" stroke-width=".5"/>
      <!-- top face -->
      <rect x="50" y="15" width="60" height="138" rx="13" fill="url(#pbBody)" stroke="#48505E" stroke-width=".8"/>
      <path d="M61 17c-6 1-9 5-9.5 11v40" stroke="#fff" stroke-opacity=".2" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <!-- RETURN marker (faces the top end) -->
      <g transform="translate(80 26) rotate(180)" fill="#E9EEF5" opacity=".85">
        <path d="M-15 -1.6l2.4 3.6h-4.8z"/>
        <text x="-10" y="1.8" font-family="${F}" font-weight="700" font-size="4.4" letter-spacing=".5">RETURN</text>
      </g>
      <!-- status LEDs -->
      <g fill="#35F58F" filter="url(#pbGlowS)"><circle cx="102" cy="36" r="1.3"/><circle cx="102" cy="41" r="1.3"/><circle cx="102" cy="46" r="1.3"/></g>
      <g fill="#8BFFC1"><circle cx="102" cy="36" r=".8"/><circle cx="102" cy="41" r=".8"/><circle cx="102" cy="46" r=".8"/></g>
      <!-- wordmark along the length -->
      <g transform="translate(81 84) rotate(-90)">
        <text x="-44" y="7.5" font-family="${F}" font-weight="900" font-size="21" fill="#F4F7FB" textLength="58" lengthAdjust="spacingAndGlyphs">Battery</text>
        <rect x="16.5" y="-11" width="32" height="23" rx="3.5" fill="#00E676"/>
        <text x="32.5" y="7.2" text-anchor="middle" font-family="${F}" font-weight="900" font-size="19" fill="#0B1F3B" textLength="26" lengthAdjust="spacingAndGlyphs">Hub</text>
      </g>
      <!-- end cap with small label and the glowing B Hub light -->
      <path d="M50 131h60v9a13 13 0 0 1-13 13H63a13 13 0 0 1-13-13z" fill="url(#pbCap)"/>
      <rect x="61" y="128" width="38" height="11" rx="2.5" fill="#1E232B" stroke="#343B47" stroke-width=".5"/>
      <g transform="translate(80 133.6) rotate(180)">
        <text x="-14" y="1.8" font-family="${F}" font-weight="800" font-size="5.4" fill="#E9EEF5" textLength="17" lengthAdjust="spacingAndGlyphs">Battery</text>
        <rect x="3.6" y="-3.1" width="10.4" height="6.2" rx="1.2" fill="#00E676"/>
        <text x="8.8" y="1.9" text-anchor="middle" font-family="${F}" font-weight="900" font-size="5.2" fill="#0B1F3B" textLength="8" lengthAdjust="spacingAndGlyphs">Hub</text>
      </g>
      <rect x="72" y="144.5" width="16" height="6" rx="1.6" fill="#00E676" filter="url(#pbGlow)" class="paycard__glow"/>
      <rect x="72.5" y="144.9" width="15" height="5.2" rx="1.4" fill="#2BF08D"/>
      <text x="80" y="148.9" text-anchor="middle" font-family="${F}" font-weight="900" font-size="3.8" fill="#0B1F3B" transform="rotate(180 80 147.5)">B Hub</text>
    </g></svg>`);
}
function PaymentSummary(plan, station, authAmount) {
  const cur = station.pricing.currency, pb = station.hardware?.powerBank || {};
  const feats = plan.kind === 'purchase'
    ? [['bolt', t('pay.f.bank')], ['check', t('pay.f.keep')]]
    : [['bolt', t('pay.f.bank')],
       ...(pb.cables?.length ? [['loop', t('pay.f.cables', { list: pb.cables.join(', ') })]] : []),
       ['pin', station.returnPolicy.anyStation ? t('pay.f.any') : t('pay.f.here', { station: station.name })]];
  if (plan.kind === 'purchase' && pb.cables?.length) feats.splice(1, 0, ['loop', t('pay.f.cables', { list: pb.cables.join(', ') })]);
  return html`<section class="paycard" aria-label="Summary">
    <div class="paycard__top">
      <div class="paycard__title"><h2 class="paycard__name">${t(plan.name)}${plan.popular ? html`<span class="paycard__badge">${t('plan.popular')}</span>` : ''}</h2>
        <p class="paycard__blurb">${t(plan.blurb)}</p></div>
      <span class="paycard__price num">${fmt.money(plan.price, cur)}</span>
    </div>
    <div class="paycard__mid">
      <ul class="paycard__feats">${feats.map(([ic, txt]) => html`<li>${icon(ic)}<span>${txt}</span></li>`)}</ul>
      ${PowerBankArt()}
    </div>
    ${authAmount != null && plan.kind === 'rental' ? html`<dl class="rows paycard__rows"><div><dt>${Lbl(t('pay.auth'), t('tip.auth'))}</dt><dd class="num">${fmt.money(authAmount, cur)}</dd></div></dl>
      <p class="note" style="margin:0">${icon('shield')}<span>${t('pay.auth.note')}</span></p>` : ''}
    <button class="paycard__change" data-action="nav" data-to="/rent"><span>${t('pay.change')}</span>${icon('chevronR')}</button>
  </section>`;
}
/** Animated wallet glyphs (original artwork, not the wallet brands' marks). tap: phone sending contactless
 *  waves. wallet: card sliding into a wallet with a sparkle. */
function WalletGlyph(kind) {
  if (kind === 'tap') return raw(`<svg class="xglyph xglyph--tap" viewBox="0 0 32 32" aria-hidden="true">
    <rect x="5" y="4.5" width="13" height="23" rx="3.2" class="xg-body"/><path d="M9.5 24h4" class="xg-line"/>
    <path d="M21.5 12.5a5 5 0 0 1 0 7" class="xg-wave xg-w1"/><path d="M24.5 9.5a9.4 9.4 0 0 1 0 13" class="xg-wave xg-w2"/><path d="M27.5 6.5a13.8 13.8 0 0 1 0 19" class="xg-wave xg-w3"/></svg>`);
  return raw(`<svg class="xglyph xglyph--wallet" viewBox="0 0 32 32" aria-hidden="true">
    <g class="xg-card"><rect x="7" y="4" width="16" height="11" rx="2" class="xg-cardbody"/><path d="M7 8h16" class="xg-cardstripe"/></g>
    <path d="M4 12.5a2.5 2.5 0 0 1 2.5-2.5h19a2.5 2.5 0 0 1 2.5 2.5v12a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 4 24.5z" class="xg-body"/>
    <path d="M28 16.5h-5a2.2 2.2 0 0 0 0 4.4h5" class="xg-line"/><circle cx="23.2" cy="18.7" r="1" class="xg-dot"/>
    <path d="M26.5 2.5v3M25 4h3" class="xg-spark"/></svg>`);
}
function ExpressButtons(list, busyMethod) {
  return html`${list.map((m, i) => { const busy = busyMethod === m;
    return html`<button type="button" class="xpay ${i === 0 ? 'xpay--primary' : ''} ${busy ? 'is-busy' : ''}" data-action="express" data-method="${m}" ${busyMethod ? raw('disabled') : ''} ${busy ? raw('aria-busy="true"') : ''}>
      <span class="xpay__text">${busy ? t('pay.busy') : html`${t('pay.buy', { wallet: '' })}${(PAYMENT_METHODS[m].logoSrc || PAYMENT_LOGOS[`${m}_${i === 0 ? 'light' : 'dark'}`])
        ? html`<img class="xpay__logo xpay__logo--${m}" src="${PAYMENT_METHODS[m].logoSrc || PAYMENT_LOGOS[`${m}_${i === 0 ? 'light' : 'dark'}`]}" alt="${t(PAYMENT_METHODS[m].label)}" decoding="async">`
        : html`<span class="xpay__mark">${WalletGlyph(PAYMENT_METHODS[m].glyph)}<strong>${t(PAYMENT_METHODS[m].label)}</strong></span>`}`}</span>${busy ? html`<span class="xpay__spin" aria-hidden="true"></span>` : icon('chevronR')}</button>`; })}`;
}
function PayTrust() {
  return html`<ul class="paytrust">
    <li>${icon('shieldCheck')}<span>${t('pay.t.secure')}</span></li>
    <li>${icon('bolt')}<span>${t('pay.t.instant')}</span></li>
    <li>${icon('globe')}<span>${t('pay.t.world')}</span></li>
  </ul>`;
}
/** Short, scannable rental terms shown right before paying. Amounts come from pricing config only. */
function RentalTerms(plan, station) {
  const pr = station.pricing, cur = pr.currency;
  if (plan.kind !== 'rental') return html`<aside class="terms" aria-label="${t('terms.title')}"><p class="terms__row">${icon('check', 'icon--sm')}<span>${t('terms.keep')}</span></p></aside>`;
  const late = pr.lateFee ? html`${t('terms.late.fee', { amount: fmt.money(pr.lateFee.amount, cur), period: Terms.period(pr.lateFee.everyMs) })}${pr.lateFee.capPerRental != null ? html`<small class="terms__cap">${t('terms.late.cap', { cap: fmt.money(pr.lateFee.capPerRental, cur) })}</small>` : ''}` : t('terms.late');
  return html`<aside class="terms" aria-label="${t('terms.title')}">
    <p class="terms__title">${t('terms.title')}</p>
    <p class="terms__row">${icon('clock', 'icon--sm')}<span>${t('terms.included', { dur: fmt.short(plan.durationMs) })}</span></p>
    <p class="terms__row terms__row--warn">${icon('alert', 'icon--sm')}<span>${late}</span></p>
    ${pr.nonReturn?.charge != null ? html`<p class="terms__row terms__row--warn">${icon('box', 'icon--sm')}<span>${t('terms.nonreturn', { amount: fmt.money(pr.nonReturn.charge, cur) })}</span></p>` : ''}
  </aside>`;
}
function PaymentMethod(id, checked, express) {
  const m = PAYMENT_METHODS[id];
  return html`<label class="method ${express ? 'method--express' : ''} ${m.form ? 'method--form' : ''}">
    <input type="radio" name="method" value="${id}" ${checked ? raw('checked') : ''} data-change="method" ${m.form ? raw('aria-controls="cardpanel"') : ''}>
    <span class="method__mark" aria-hidden="true">${icon(m.icon)}</span>${t(m.label)}<span class="plan__radio" aria-hidden="true"></span>
  </label>`;
}

const NETWORK_LABELS = { visa: 'VISA', mastercard: 'Mastercard', amex: 'AMEX', jcb: 'JCB', unionpay: 'UnionPay' };
/** Card box: header, number / expiry / CVC fields, processor line and accepted networks. */
function CardFields() {
  const v = CardForm.v, err = CardForm.errors(), show = k => CardForm.touched[k] && err[k];
  const b = Card.brand(v.number);
  const box = (k, input, { lbl = '', extra = '' } = {}) => html`<div class="cfield ${show(k) ? 'is-invalid' : ''} ${CardForm.scanned ? 'is-scanned' : ''}" data-field="${k}">
      <div class="cbox ${lbl ? 'cbox--lbl' : ''}">${lbl ? html`<label class="cbox__lbl" for="cf-${k}">${lbl}</label>` : ''}${input}${extra}</div>
      <p class="field__err" id="cf-${k}-err" aria-live="polite">${show(k) ? t(err[k]) : ''}</p></div>`;
  return html`<section class="cardbox" id="cardpanel" aria-labelledby="cardbox-t">
    <div class="cardbox__head">${icon('card')}<span id="cardbox-t">${t('pay.card')}</span><span class="plan__radio is-on" aria-hidden="true"></span></div>
    ${box('number', html`<input id="cf-number" class="cbox__input cbox__input--num" data-input="card" data-key="number" inputmode="numeric" autocomplete="cc-number" placeholder="${t('card.ph.number')}" aria-label="${t('card.number')}" value="${v.number}" aria-describedby="cf-number-err" spellcheck="false">`,
      { extra: html`<span class="field__brand ${b ? 'is-on' : ''}" id="cf-brand" aria-hidden="true">${b ? BrandMark(b) : ''}</span>
        <button type="button" class="field__scan" data-action="scanCard" aria-label="${t('card.scan')}" title="${t('card.scan')}">${icon('camera')}</button>` })}
    <div class="field-row">
      ${box('exp', html`<input id="cf-exp" class="cbox__input cbox__input--num" data-input="card" data-key="exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" value="${v.exp}" maxlength="5" aria-label="${t('card.exp')}" aria-describedby="cf-exp-err">`, { lbl: 'MM / YY' })}
      ${box('cvc', html`<input id="cf-cvc" class="cbox__input cbox__input--num" data-input="card" data-key="cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="${t('card.ph.cvc')}" value="${v.cvc}" maxlength="${b?.cvc || 3}" aria-label="${t('card.cvc')}" aria-describedby="cf-cvc-err">`,
        { lbl: 'CVC', extra: html`<button type="button" class="cbox__tip info-btn" data-action="tip" data-tip="${t('card.tip.cvc')}" aria-label="${t('card.cvc')}: ${t('card.tip.cvc')}">${icon('cvc')}</button>` })}
    </div>
    <p class="note cardpanel__note" id="cf-note" ${CardForm.scanned ? '' : raw('hidden')}>${icon('check')}<span>${t('card.filled')}</span></p>
    <div class="cardbox__foot">
      <span class="cardbox__secure">${icon('lock')}<span>${raw(esc(t('pay.secureBy', { name: '\u0000' })).replace('\u0000', `<strong>${esc(PAYMENT_PROCESSOR.name)}</strong>`))}</span></span>
      <span class="netchips" aria-label="Accepted cards">${PAYMENT_PROCESSOR.networks.map(PayBadge)}</span>
    </div>
  </section>`;
}
/** Full-screen camera sheet: front of card, then back. */
const Scan = {
  stream: null, step: 'front', busy: false, onDone: null,
  el() { let d = document.getElementById('scan'); if (!d) { d = document.createElement('dialog'); d.id = 'scan'; d.className = 'scan'; d.setAttribute('aria-labelledby', 'scan-title'); document.body.appendChild(d);
    d.addEventListener('click', e => { const b = e.target.closest('[data-scan]'); if (b) this.act(b.dataset.scan); });
    d.addEventListener('cancel', e => { e.preventDefault(); this.close(); }); } return d; },
  async open(onDone) {
    this.onDone = onDone; this.step = 'front'; this.busy = false; this.got = {};
    const d = this.el(); d.innerHTML = this.view(); d.showModal(); this.sync();
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('no-camera');
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } }, audio: false });
      if (!d.open) return this.stop();
      const v = d.querySelector('video'); v.srcObject = this.stream; await v.play().catch(() => {}); d.classList.add('has-cam');
    } catch { d.classList.add('no-cam'); }
  },
  view() {
    return `<div class="scan__inner">
      <div class="scan__head"><strong id="scan-title">${esc(t('scan.title'))}</strong><button class="icon-btn" data-scan="close" aria-label="${esc(t('scan.close'))}">${icon('x').v}</button></div>
      <ol class="scan__steps"><li data-s="front"><span>1</span>${esc(t('scan.front'))}</li><li data-s="back"><span>2</span>${esc(t('scan.back'))}</li></ol>
      <div class="scan__view">
        <video playsinline muted autoplay></video>
        <svg class="scan__demo" viewBox="0 0 320 202" aria-hidden="true">
          <g class="scan__demo-front"><rect x="1" y="1" width="318" height="200" rx="16" fill="#12305A" stroke="#2C5286"/><rect x="28" y="62" width="42" height="32" rx="6" fill="#C9A955" opacity=".9"/><path d="M28 78h42M42 62v32M56 62v32" stroke="#8E7433" stroke-width="1.2"/>
            <text x="28" y="132" fill="#EAF2FF" font-family="ui-monospace,Menlo,monospace" font-size="21" letter-spacing="2">4242 4242 4242 4242</text><text x="28" y="164" fill="#9FB3D1" font-family="ui-monospace,Menlo,monospace" font-size="12">DEMO CARDHOLDER</text><text x="210" y="164" fill="#9FB3D1" font-family="ui-monospace,Menlo,monospace" font-size="12">12/29</text></g>
          <g class="scan__demo-back"><rect x="1" y="1" width="318" height="200" rx="16" fill="#12305A" stroke="#2C5286"/><rect x="1" y="30" width="318" height="40" fill="#050D19"/><rect x="28" y="92" width="190" height="30" rx="3" fill="#DDE6F2"/><rect x="226" y="92" width="56" height="30" rx="3" fill="#fff"/><text x="238" y="113" fill="#0B1F3B" font-family="ui-monospace,Menlo,monospace" font-size="15" font-style="italic">123</text></g>
        </svg>
        <div class="scan__frame" aria-hidden="true"><i></i><i></i><i></i><i></i><span class="scan__sweep"></span></div>
        <div class="scan__flash" aria-hidden="true"></div>
        <p class="scan__toast" id="scan-toast" role="status"></p>
      </div>
      <p class="scan__hint" id="scan-hint"></p>
      <p class="scan__nocam note">${icon('alert').v}<span>${esc(t('scan.nocam'))}</span></p>
      <button class="scan__shutter" data-scan="capture" id="scan-shutter"><span class="scan__shutter-dot" aria-hidden="true"></span><span class="scan__shutter-text"></span></button>
      <button class="btn btn--ghost scan__manual" data-scan="close">${esc(t('scan.cancel'))}</button>
    </div>`;
  },
  sync() {
    const d = this.el(); d.dataset.step = this.step; d.classList.toggle('is-busy', this.busy);
    d.querySelectorAll('.scan__steps li').forEach(li => li.dataset.state = li.dataset.s === this.step ? 'current' : (this.step === 'back' && li.dataset.s === 'front' ? 'done' : ''));
    d.querySelector('#scan-hint').textContent = t(this.step === 'front' ? 'scan.front.hint' : 'scan.back.hint');
    const sh = d.querySelector('#scan-shutter'); sh.disabled = this.busy;
    sh.querySelector('.scan__shutter-text').textContent = this.busy ? t('scan.reading') : t(this.step === 'front' ? 'scan.capture.front' : 'scan.capture.back');
  },
  frame() {
    const v = this.el().querySelector('video'); if (!this.stream || !v.videoWidth) return null;
    const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0); return c;
  },
  toast(msg) { const n = document.getElementById('scan-toast'); if (!n) return; n.textContent = msg; n.classList.remove('is-on'); void n.offsetWidth; n.classList.add('is-on'); },
  async act(a) {
    if (a === 'close') return this.close();
    if (a !== 'capture' || this.busy) return;
    const d = this.el(); d.classList.remove('is-flash'); void d.offsetWidth; d.classList.add('is-flash'); if (navigator.vibrate) navigator.vibrate(10);
    this.busy = true; this.sync();
    const frame = this.frame();
    if (this.step === 'front') {
      Object.assign(this.got, await CardScanner.readFront(frame)); if (!d.open) return;
      this.busy = false; this.toast('✓ ' + t('scan.got.front')); this.step = 'back'; this.sync();
    } else {
      Object.assign(this.got, await CardScanner.readBack(frame)); if (!d.open) return;
      this.toast('✓ ' + t('scan.got.back')); await sleep(reduced() ? 0 : 650);
      const got = this.got; this.close(); this.onDone && this.onDone(got);
    }
  },
  stop() { if (this.stream) { this.stream.getTracks().forEach(tr => tr.stop()); this.stream = null; } },
  close() { this.stop(); const d = document.getElementById('scan'); if (d) { d.classList.remove('has-cam', 'no-cam', 'is-flash'); if (d.open) d.close(); } this.busy = false; },
};

/** BatteryHub station illustration, drawn from the real product (screen on stand, logo/steps panel,
 *  two 4-slot modules with light arcs), rendered in the web app's palette. Slot geometry comes from config. */
function StationSlotMap({ station, target = null, mode = 'availability', size = '', uid = 's' }) {
  const hw = station.hardware; const { columns, rows, modules = 2 } = hw.layout;
  const rowsPer = rows / modules;
  const modTop = m => 250 + m * 106, modH = 98;
  const pillW = 64, pillH = 22;
  const colX = c => (columns === 2 ? [78, 158][c] : 78 + c * 80);
  const slots = [], hotModules = new Set();
  for (let n = 1; n <= hw.slotCount; n++) {
    const r = Math.floor((n - 1) / columns), c = (n - 1) % columns;
    const m = Math.floor(r / rowsPer), ri = r % rowsPer;
    const x = colX(c), y = modTop(m) + 22 + ri * 34;
    const s = station.slots.find(z => z.number === n) || { state: 'empty' };
    const isT = n === target; if (isT) hotModules.add(m);
    const isFree = mode === 'return' && s.state === 'empty'; if (isFree) hotModules.add(m);
    const hasBank = s.state === 'occupied' || (isT && mode !== 'availability');
    const cx = x + pillW / 2, cy = y + pillH / 2;
    slots.push(html`<g class="${isT ? 'slot-target' : ''} ${isFree ? 'slot-free' : ''}" data-slot="${n}" ${isFree ? raw(`style="--i:${n}"`) : ''}>
      <rect class="station__slot" x="${x}" y="${y}" width="${pillW}" height="${pillH}" rx="11"/>
      ${isFree ? html`<path class="station__in" d="M${cx - 9} ${cy} h14 m-4.5 -4.5 l4.5 4.5 l-4.5 4.5"/>` : ''}
      ${hasBank ? html`<g class="station__bankg">
        <rect class="station__bank" x="${x + 1.5}" y="${y + 1.5}" width="${pillW - 3}" height="${pillH - 3}" rx="9.5"/>
        <rect class="station__led" x="${cx - 7}" y="${cy - 2.5}" width="14" height="5" rx="1.5"/></g>` : ''}
      ${isT ? html`<rect class="station__ring" x="${x - 3}" y="${y - 3}" width="${pillW + 6}" height="${pillH + 6}" rx="14"/>
        <g class="station__badge"><circle cx="${x + pillW - 2}" cy="${y - 2}" r="9"/>
        ${mode === 'returned' ? html`<path d="M${x + pillW - 6.5} ${y - 2} l3 3 l5.5 -6"/>` : html`<text x="${x + pillW - 2}" y="${y + 1.6}" text-anchor="middle">${n}</text>`}</g>` : ''}
    </g>`);
  }
  const mods = [];
  for (let m = 0; m < modules; m++) {
    const y = modTop(m);
    mods.push(html`<g class="${hotModules.has(m) ? 'module-hot' : ''}">
      <rect class="station__module" x="52" y="${y}" width="196" height="${modH}" rx="10"/>
      <path class="station__arc" d="M104 ${y + 9} A40 40 0 0 0 104 ${y + modH - 9}" filter="url(#glow-${uid})"/>
      <path class="station__arc" d="M196 ${y + 9} A40 40 0 0 1 196 ${y + modH - 9}" filter="url(#glow-${uid})"/>
    </g>`);
  }
  const label = mode === 'return' ? `Station ${station.name}: ${station.slots.filter(z => z.state === 'empty').length} free slots, highlighted in green` : target ? (mode === 'returned' ? `Power bank returned to slot ${target} at ${station.name}` : `Station ${station.name}, slot ${target} highlighted`)
                       : `Station ${station.name}, ${Domain.available(station)} of ${hw.slotCount} slots have a power bank`;
  const step = (cx, lbl, ic) => html`<circle cx="${cx}" cy="194" r="11" fill="none" stroke="#00E676" stroke-width="1.5"/>${raw(ic)}
    <text x="${cx}" y="222" text-anchor="middle" fill="#F5F8FC" style="font:700 7.5px var(--font-ui)">${lbl}</text>`;
  return html`<svg class="station ${size} ${mode === 'returned' ? 'station--returned' : ''}" id="station-${uid}" viewBox="30 150 240 320" role="img" aria-label="${label}">
    <defs>
      <linearGradient id="cab-${uid}" x1="0" x2="1"><stop offset="0" stop-color="#132D52"/><stop offset=".5" stop-color="#0F2747"/><stop offset="1" stop-color="#0B1F3B"/></linearGradient>
      <linearGradient id="scr-${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A1424"/><stop offset=".55" stop-color="#061326"/><stop offset="1" stop-color="#00B85E"/></linearGradient>
      <filter id="glow-${uid}" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="150" cy="462" rx="112" ry="7" fill="#000" opacity=".4"/>
    <!-- cabinet -->
    <rect class="station__cab" x="42" y="158" width="216" height="302" rx="14" fill="url(#cab-${uid})"/>
    <rect x="56" y="168" width="188" height="66" rx="33" fill="#04101F" stroke="#1B365C"/>
    <text x="68" y="193" fill="#F5F8FC" textLength="46" lengthAdjust="spacingAndGlyphs" style="font:900 12px var(--font-logo);letter-spacing:-.4px">Battery</text>
    <rect x="68" y="198" width="30" height="15" rx="3" fill="#00E676"/><text x="71" y="210" fill="#0B1F3B" textLength="24" lengthAdjust="spacingAndGlyphs" style="font:900 12px var(--font-logo);letter-spacing:-.4px">Hub</text>
    ${step(130, 'Pay', '<rect x="124" y="189.5" width="12" height="9" rx="1.5" fill="none" stroke="#F5F8FC" stroke-width="1.2"/><path d="M124 192.5h12" stroke="#F5F8FC" stroke-width="1.2"/>')}
    ${step(174, 'Charge', '<rect x="170" y="186.5" width="8" height="15" rx="2" fill="none" stroke="#F5F8FC" stroke-width="1.2"/><path d="M175 190l-2.5 4h3l-2.5 4" fill="none" stroke="#00E676" stroke-width="1.2"/>')}
    ${step(218, 'Return', '<path d="M212.5 196a5.5 5.5 0 1 0 1.6-4.3M212.5 189v3.5h3.5" fill="none" stroke="#F5F8FC" stroke-width="1.2" stroke-linecap="round"/>')}
    <path d="M150 192l3 2.5-3 2.5M194 192l3 2.5-3 2.5" fill="none" stroke="#7C90AE" stroke-width="1.2"/>
    ${mods}
    ${slots}
  </svg>`;
}

/** Rental TIME remaining shown as a liquid-filled battery (never the power bank's charge). */
function RentalTimeBattery() {
  const shell = 'M 100 24 H 146 A 34 34 0 0 1 180 58 V 290 A 34 34 0 0 1 146 324 H 54 A 34 34 0 0 1 20 290 V 58 A 34 34 0 0 1 54 24 Z';
  return html`<div class="rtb" id="rtb">
    <svg viewBox="0 0 200 340" aria-hidden="true">
      <defs>
        <clipPath id="rtbClip"><rect x="31" y="35" width="138" height="278" rx="25"/></clipPath>
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00E676"/><stop offset="1" stop-color="#009E52"/></linearGradient>
      </defs>
      <rect class="rtb__nub" x="72" y="4" width="56" height="16" rx="6"/>
      <rect class="rtb__nub-glow" x="72" y="4" width="56" height="16" rx="6"/>
      <path class="rtb__shell" d="${shell}"/>
      <g clip-path="url(#rtbClip)">
        <g class="rtb__liquid" id="rtb-liquid">
          <g class="rtb__wave"><path class="rtb__liquid-fill" d="M -140 40 q 35 -9 70 0 t 70 0 t 70 0 t 70 0 t 70 0 t 70 0 V 340 H -140 Z"/></g>
          <g class="rtb__wave" style="animation-duration:5s;animation-direction:reverse;opacity:.35"><path fill="#7CFFBE" d="M -140 38 q 35 7 70 0 t 70 0 t 70 0 t 70 0 t 70 0 t 70 0 V 46 H -140 Z"/></g>
        </g>
      </g>
      <path class="rtb__pulse rtb__pulse--tail" d="${shell}" pathLength="100"/>
      <path class="rtb__pulse" d="${shell}" pathLength="100"/>
    </svg>
    <div class="rtb__readout"><span class="rtb__big num" id="rtb-big">--</span><span class="rtb__clock num" id="rtb-clock"></span></div>
  </div>`;
}

function PhysicalBatteryStatus(pb) {
  const has = pb && pb.level != null;
  const sel = PhoneChoice.get() || {};
  const models = sel.brand && sel.brand !== 'Other' ? PHONES[sel.brand] : [];
  return html`<section class="surface pbs" aria-labelledby="pbs-t" id="pbs">
    <div class="pbs__head"><span class="pbs__title"><span id="pbs-t" style="display:inline-flex;align-items:center;gap:8px">${icon('battery')}${t('pb.title')}</span>${InfoTip(t('tip.pbLevel'), t('pb.title'))}</span>
      <span class="pbs__level num" id="pbs-level">${has ? pb.level + '%' : ''}</span></div>
    <div class="pbs__meter" id="pbs-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${has ? pb.level : 0}" aria-label="${t('pb.title')}" ${has ? '' : raw('hidden')}><span style="width:${has ? pb.level : 0}%"></span></div>
    <fieldset class="phone">
      <legend class="phone__legend">${icon('phone', 'icon--sm')}${t('phone.legend')}</legend>
      <div class="phone__brands" role="radiogroup" aria-label="${t('phone.brand')}">
        ${PHONE_BRANDS.map(bn => html`<label class="chip"><input type="radio" name="phone-brand" value="${bn}" data-change="phoneBrand" ${sel.brand === bn ? raw('checked') : ''}><span>${bn === 'Other' ? t('phone.other') : bn}</span></label>`)}
      </div>
      <label class="phone__model" ${sel.brand && sel.brand !== 'Other' ? '' : raw('hidden')}><span class="sr-only">${t('phone.model')}</span>
        <select id="phone-model" data-change="phoneModel">
          <option value="" ${sel.model ? '' : raw('selected')} disabled>${t('phone.pickModel')}</option>
          ${models.map(([m]) => html`<option value="${m}" ${sel.model === m ? raw('selected') : ''}>${m}</option>`)}
          <option value="__other" ${sel.model === '__other' ? raw('selected') : ''}>${t('phone.other')}</option>
        </select>
        ${icon('chevron', 'icon--sm')}
      </label>
    </fieldset>
    <div id="pbs-est" aria-live="polite">${PhoneEstimates(pb)}</div>
    <p class="muted small" style="margin:0">${t('pb.note')}</p>
  </section>`;
}
function PhoneEstimates(pb) {
  const phone = PhoneChoice.capacity(PhoneChoice.get());
  if (!phone) return html`<p class="phone__prompt">${t('phone.prompt')}</p>`;
  const cfg = HARDWARE_MODELS['wdian-8'].powerBank;
  const level = pb && pb.level != null ? pb.level : 100;
  const e = Domain.phoneEstimate(level, phone.mah, cfg);
  const pct = Math.round(e.percentPerHour / 5) * 5;
  const charges = (Math.round(e.charges * 10) / 10).toLocaleString(LOCALE);
  return html`<dl class="pbs__est pbs__est--3">
      <div><dt>${t('pb.runtime')}${InfoTip(t('tip.runtime', { pct }), t('pb.runtime'))}</dt><dd>${t('pb.runtimeV', { dur: fmt.short(e.runtimeMs) })}</dd></div>
      <div><dt>${t('pb.charges')}${InfoTip(t('tip.charges', { phone: phone.mah.toLocaleString(LOCALE), mah: cfg.capacityMah.toLocaleString(LOCALE), eff: Math.round(cfg.deliveryEfficiency * 100) }), t('pb.charges'))}</dt><dd>${t(Math.round(e.charges * 10) === 10 ? 'pb.chargesV1' : 'pb.chargesV', { n: charges })}</dd></div>
      <div><dt>${t('pb.speed')}${InfoTip(t('tip.speed'), t('pb.speed'))}</dt><dd>${t('pb.perHour', { pct })}</dd></div>
    </dl>
    <p class="phone__summary">${phone.typical ? t('pb.chargesPctTypical', { pct: Math.round(e.charges * 100), mah: phone.mah.toLocaleString(LOCALE) }) : t('pb.chargesPct', { pct: Math.round(e.charges * 100), name: phone.name })}${pb && pb.level != null ? '' : html` ${t('pb.assumeFull')}`}</p>`;
}
const Pbs = {
  update(pb) {
    const has = pb && pb.level != null;
    const lv = document.getElementById('pbs-level'); if (lv) lv.textContent = has ? pb.level + '%' : '';
    const m = document.getElementById('pbs-meter');
    if (m) { m.hidden = !has; m.setAttribute('aria-valuenow', has ? pb.level : 0); m.firstElementChild.style.width = (has ? pb.level : 0) + '%'; }
    this.estimates(pb);
  },
  estimates(pb) { const el = document.getElementById('pbs-est'); if (el) el.innerHTML = PhoneEstimates(pb).v; },
};
const PhoneActions = {
  phoneBrand(el) {
    PhoneChoice.set({ brand: el.value, model: el.value === 'Other' ? '__other' : null });
    const wrap = document.querySelector('.phone__model'), sel = document.getElementById('phone-model');
    if (el.value === 'Other') { wrap.hidden = true; }
    else {
      wrap.hidden = false;
      sel.innerHTML = `<option value="" selected disabled>${esc(t('phone.pickModel'))}</option>` + PHONES[el.value].map(([m]) => `<option value="${esc(m)}">${esc(m)}</option>`).join('') + `<option value="__other">${esc(t('phone.other'))}</option>`;
    }
    Pbs.estimates(State.pb);
  },
  phoneModel(el) { const cur = PhoneChoice.get() || {}; PhoneChoice.set({ brand: cur.brand, model: el.value }); Pbs.estimates(State.pb); },
};

function RentalSummary(rows, { total = false } = {}) {
  return html`<dl class="rows ${total ? 'rows--total' : ''}">${rows.filter(Boolean).map(([k, v]) => html`<div><dt>${k}</dt><dd class="num">${v}</dd></div>`)}</dl>`;
}

function ErrorState(code, { primary = null, secondary = null } = {}) {
  const k = STRINGS.en[`err.${code}.t`] ? code : 'generic';
  const ic = code === 'network_unavailable' ? 'wifiOff' : code === 'no_power_banks' || code === 'station_unavailable' ? 'battery' : 'alert';
  const warn = ['payment_cancelled', 'no_power_banks', 'station_unavailable', 'return_not_detected', 'network_unavailable', 'session_expired'].includes(code);
  return html`<div class="state" role="alert">
    <div class="state__mark ${warn ? 'state__mark--warn' : 'state__mark--error'}">${icon(ic)}</div>
    <h1 class="h1" tabindex="-1">${t(`err.${k}.t`)}</h1>
    <p class="muted">${t(`err.${k}.d`)}</p>
  </div>`;
}
/** Animated "returned" check: disc pops in, ring draws, check draws, then a light burst. */
function ReturnedMark() {
  return raw(`<svg class="rm" viewBox="0 0 120 120" aria-hidden="true">
    <circle class="rm-burst" cx="60" cy="60" r="34"/>
    <circle class="rm-disc" cx="60" cy="60" r="34"/>
    <circle class="rm-ring" cx="60" cy="60" r="34" pathLength="100"/>
    <path class="rm-check" d="M45 61l10 10 21-23" pathLength="100"/>
    <g class="rm-rays"><line class="rm-ray" x1="60" y1="18" x2="60" y2="8" transform="rotate(0 60 60)"/><line class="rm-ray" x1="60" y1="18" x2="60" y2="8" transform="rotate(45 60 60)"/><line class="rm-ray" x1="60" y1="18" x2="60" y2="8" transform="rotate(90 60 60)"/><line class="rm-ray" x1="60" y1="18" x2="60" y2="8" transform="rotate(135 60 60)"/><line class="rm-ray" x1="60" y1="18" x2="60" y2="8" transform="rotate(180 60 60)"/><line class="rm-ray" x1="60" y1="18" x2="60" y2="8" transform="rotate(225 60 60)"/><line class="rm-ray" x1="60" y1="18" x2="60" y2="8" transform="rotate(270 60 60)"/><line class="rm-ray" x1="60" y1="18" x2="60" y2="8" transform="rotate(315 60 60)"/><circle class="rm-spark" cx="60" cy="14" r="2.2" transform="rotate(22 60 60)" style="--d:0ms"/><circle class="rm-spark" cx="60" cy="14" r="2.2" transform="rotate(67 60 60)" style="--d:40ms"/><circle class="rm-spark" cx="60" cy="14" r="2.2" transform="rotate(112 60 60)" style="--d:80ms"/><circle class="rm-spark" cx="60" cy="14" r="2.2" transform="rotate(157 60 60)" style="--d:0ms"/><circle class="rm-spark" cx="60" cy="14" r="2.2" transform="rotate(202 60 60)" style="--d:40ms"/><circle class="rm-spark" cx="60" cy="14" r="2.2" transform="rotate(247 60 60)" style="--d:80ms"/><circle class="rm-spark" cx="60" cy="14" r="2.2" transform="rotate(292 60 60)" style="--d:0ms"/><circle class="rm-spark" cx="60" cy="14" r="2.2" transform="rotate(337 60 60)" style="--d:40ms"/></g>
  </svg>`);
}
function SuccessState(title, sub) {
  return html`<div class="state state--done"><div class="state__mark">${raw('<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>')}</div>
    <h1 class="display" style="font-size:clamp(2.4rem,10vw,3.4rem)" tabindex="-1">${title}</h1><p class="lede" style="margin:0">${sub}</p></div>`;
}
