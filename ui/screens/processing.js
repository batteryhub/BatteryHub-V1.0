/* ---------- Processing (cinematic) ---------- */
Screens.processing = {
  path: '/rent/processing',
  guard() { if (!Session.data.paymentId) return '/rent'; if (rentalIsLive(State.rental) && State.rental.id === Session.data.rentalId) return '/rent/ready'; },
  view() {
    return html`${TopBar({ help: false, station: State.station, step: 3 })}
    <main class="proc" aria-busy="true">
      <div class="proc__stage" role="img" aria-label="${t('proc.label')}">
        <svg id="proc-phone" viewBox="0 0 320 380" aria-hidden="true">
          <defs><clipPath id="phClip"><rect x="112" y="42" width="96" height="186" rx="14"/></clipPath></defs>
          <g id="ph-group" style="transform-origin:160px 150px">
            <rect x="104" y="34" width="112" height="202" rx="22" fill="#0B1F3B" stroke="#2C5286" stroke-width="2"/>
            <rect x="112" y="42" width="96" height="186" rx="14" fill="#04101F"/>
            <rect x="143" y="48" width="34" height="9" rx="4.5" fill="#0B1F3B"/>
            <g clip-path="url(#phClip)"><rect id="ph-fill" x="112" y="228" width="96" height="186" fill="#00E676" opacity=".14"/></g>
            <g id="ph-meter" style="transform-origin:160px 150px">
            <rect x="136" y="112" width="44" height="22" rx="5" fill="none" stroke="#F5F8FC" stroke-width="2"/>
            <rect x="180" y="119" width="4" height="8" rx="1.5" fill="#F5F8FC"/>
            <rect id="ph-bat" x="139" y="115" width="5" height="16" rx="2.5" fill="#00E676"/>
            <text id="ph-pct" x="160" y="166" text-anchor="middle" fill="#F5F8FC" style="font:800 24px var(--font-ui);font-variant-numeric:tabular-nums">12%</text>
            <path id="ph-bolt" d="M162 180 l-9 13 h7 l-2 9 l10 -14 h-7 z" fill="#00E676" opacity="0"/>
            </g>
            <g id="ph-check" opacity="0" style="transform-origin:160px 138px">
              <circle id="ph-check-ring" cx="160" cy="138" r="30" fill="none" stroke="#00E676" stroke-width="2" opacity="0" style="transform-origin:160px 138px"/>
              <circle cx="160" cy="138" r="30" fill="#00E676" fill-opacity=".16" stroke="#00E676" stroke-width="3"/>
              <path id="ph-check-path" d="M145 139 l10 10 l20 -22" fill="none" stroke="#00E676" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
              <text x="160" y="196" text-anchor="middle" fill="#F5F8FC" style="font:800 20px var(--font-ui);font-variant-numeric:tabular-nums">100%</text>
            </g>
            <rect x="150" y="236" width="20" height="4" rx="2" fill="#2C5286"/>
          </g>
          <g id="cable" style="transform:translateY(96px)">
            <rect x="156" y="262" width="8" height="140" rx="4" fill="#E9EEF5"/>
            <rect x="149" y="240" width="22" height="30" rx="6" fill="#F5F8FC"/>
            <rect x="154" y="236" width="12" height="6" rx="2" fill="#A5B4CA"/>
          </g>
          <circle id="spark" cx="160" cy="238" r="10" fill="none" stroke="#00E676" stroke-width="3" opacity="0" style="transform-origin:160px 238px"/>
        </svg>
      </div>
      <div class="proc__caption" aria-live="polite"><h1 class="h1" id="proc-text" tabindex="-1">${t('proc.paid')}</h1></div>
      <div class="proc__bar" aria-hidden="true"><span id="proc-bar"></span></div>
    </main>`;
  },
  mount() {
    const ctl = { alive: true };
    this.run(ctl);
    return () => { ctl.alive = false; };
  },
  async run(ctl) {
    const $ = id => document.getElementById(id);
    const setText = s => { const el = $('proc-text'); if (el) el.textContent = s; };
    const bar = p => { const el = $('proc-bar'); if (el) el.style.width = p + '%'; };
    const rm = reduced();
    const apiP = (async () => {
      const existing = Session.data.rentalId && State.rental && State.rental.status !== 'returned' ? State.rental : null;
      if (existing) return existing;
      const r = await API.rentals.start(Session.data.paymentId);
      Session.patch({ rentalId: r.id }); State.rental = r; return r;
    })();
    apiP.catch(() => {});

    const anim = (el, kf, o) => el && !rm ? el.animate(kf, { fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)', ...o }).finished.catch(() => {}) : Promise.resolve();
    const countUp = (from, to, ms) => new Promise(res => {
      const t0 = performance.now();
      const step = now => {
        if (!ctl.alive) return res();
        const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3), v = Math.round(from + (to - from) * e);
        const pct = $('ph-pct'), b = $('ph-bat'), f = $('ph-fill');
        if (pct) pct.textContent = v + '%';
        if (b) b.setAttribute('width', String(Math.max(4, 38 * v / 100)));
        if (f) f.setAttribute('y', String(228 - 186 * v / 100));
        k < 1 ? requestAnimationFrame(step) : res();
      };
      requestAnimationFrame(step);
    });

    let rental;
    try {
      if (rm) {
        bar(40); setText(t('proc.connecting'));
        [rental] = await Promise.all([apiP, sleep(APP_RULES.processingReducedMs)]);
        bar(100);
      } else {
        bar(8);
        await sleep(250); setText(t('proc.connecting'));
        await anim($('cable'), [{ transform: 'translateY(96px)' }, { transform: 'translateY(0)' }], { duration: 850 });
        bar(28);
        anim($('spark'), [{ opacity: 1, transform: 'scale(.4)' }, { opacity: 0, transform: 'scale(3.2)' }], { duration: 600 });
        anim($('ph-bolt'), [{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
        // Charge all the way to 100%, then the battery readout turns into a check mark on the screen.
        bar(40); setTimeout(() => ctl.alive && bar(70), 1400);
        await countUp(12, 100, 2800);
        if (!ctl.alive) return;
        const fill = $('ph-fill'); if (fill) fill.setAttribute('opacity', '.24');
        await anim($('ph-meter'), [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.85)' }], { duration: 260, easing: 'ease-in' });
        $('ph-check')?.setAttribute('opacity', '1');
        anim($('ph-check'), [{ transform: 'scale(.4)' }, { transform: 'scale(1.08)', offset: .7 }, { transform: 'scale(1)' }], { duration: 480 });
        anim($('ph-check-path'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 420, delay: 180, easing: 'cubic-bezier(.3,.7,.2,1)' });
        anim($('ph-check-ring'), [{ opacity: .9, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.7)' }], { duration: 900, delay: 300, easing: 'ease-out' });
        if (navigator.vibrate) navigator.vibrate(15);
        bar(85);
        rental = await apiP;
        setText(t('proc.slot', { slot: rental.slot }));
        await sleep(1300); bar(100);
        await sleep(300);
      }
      if (!ctl.alive) return;
      go('/rent/ready', { replace: true });
    } catch (e) {
      if (!ctl.alive) return;
      Session.patch({ paymentId: null });
      go('/error/' + (e.code || 'release_failed'), { replace: true });
    }
  },
};
