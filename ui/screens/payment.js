/* ---------- Payment ---------- */
Screens.payment = {
  path: '/rent/payment',
  guard() {
    if (rentalIsLive(State.rental)) return '/rent/active';
    if (!Session.data.planId) return '/rent';
    if (Session.expired()) return '/error/session_expired';
  },
  view() {
    const st = State.station, plan = Domain.plan(st.pricing, Session.data.planId);
    const methods = API.payments.methods(st);
    const wallets = Domain.expressMethods(methods), hasCard = methods.includes('card');
    if (hasCard && Session.data.method !== 'card') Session.patch({ method: 'card' });
    const authAmount = Dev.s.auth !== '' ? Number(Dev.s.auth) : st.pricing.authorization.amount;
    const amount = fmt.money(plan.price, st.pricing.currency), busy = State.paying ? State.payingMethod : null;
    return html`${TopBar({ back: '/rent', station: st, step: 2, avail: true, keep: plan.kind === 'purchase' })}
    <main class="screen screen--pay">
      <section class="screen__visual visual--desktop-only">${StationSlotMap({ station: st, size: 'station--lg', uid: 'pay' })}</section>
      <div class="screen__body pay">
        <header class="pay__head"><h1 class="h1 pay__title" tabindex="-1">${t('pay.title')}</h1>
          <p class="pay__sub">${t(plan.kind === 'purchase' ? 'pay.sub.keep' : 'pay.sub')}</p></header>
        ${PaymentSummary(plan, st, authAmount)}
        ${State.payError ? html`<div class="alert" role="alert">${icon('alert')}<div><strong>${t(`err.${State.payError}.t`)}</strong>${t(`err.${State.payError}.d`)}</div></div>` : ''}
        ${!methods.length ? html`<div class="alert">${icon('alert')}<div>${t('pay.none')}</div></div>` : ''}
        ${wallets.length ? html`<div class="pay__express"><p class="pay__or pay__or--express"><span>${t('pay.express')}</span></p>${ExpressButtons(wallets, busy)}</div>` : ''}
        ${wallets.length && hasCard ? html`<p class="pay__or"><span>${t('pay.orwith')}</span></p>` : ''}
        ${hasCard ? CardFields() : ''}
        ${hasCard ? RentalTerms(plan, st) : ''}
        ${hasCard ? SlideToPay({ label: t('pay.slide', { amount }), a11y: t('pay.cta', { amount }), busy: busy === 'card', disabled: !!busy && busy !== 'card' }) : ''}
        ${!hasCard && wallets.length ? RentalTerms(plan, st) : ''}
        ${PayTrust()}
      </div>
    </main>`;
  },
  actions: {
    method(el) {
      Session.patch({ method: el.value });
      const panel = document.getElementById('cardpanel'); if (!panel) return;
      const open = PAYMENT_METHODS[el.value].form === true;
      panel.inert = !open;
      if (open && !CardForm.v.number && !matchMedia('(pointer: coarse)').matches) setTimeout(() => document.getElementById('cf-number')?.focus({ preventScroll: true }), 260);
      if (open) setTimeout(() => panel.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }), 280);
    },
    card(el, e) {
      const k = el.dataset.key; let val = el.value;
      if (k === 'number' || k === 'exp') {
        const pos = el.selectionStart ?? val.length, digitsBefore = Card.digits(val.slice(0, pos)).length;
        val = k === 'number' ? Card.formatNumber(val) : Card.formatExp(val);
        el.value = val;
        let i = 0, seen = 0; while (i < val.length && seen < digitsBefore) { if (/\d/.test(val[i])) seen++; i++; }
        try { el.setSelectionRange(i, i); } catch {}
      }
      if (k === 'cvc') { val = Card.digits(val).slice(0, Card.brand(CardForm.v.number)?.cvc || 4); el.value = val; }
      if (k === 'name') { val = val.toUpperCase().replace(/[^A-Z .'\-]/g, ''); if (el.value !== val) el.value = val; }
      CardForm.v[k] = val;
      if (CardForm.scanned) { CardForm.scanned = false; document.querySelectorAll('.cfield.is-scanned').forEach(f => f.classList.remove('is-scanned')); this.syncNote(); }
      if (k === 'number') {
        const b = Card.brand(val), br = document.getElementById('cf-brand'), cvc = document.getElementById('cf-cvc');
        if (br) { const mk = b ? BrandMark(b) : ''; br.innerHTML = typeof mk === 'string' ? esc(mk) : mk.v; br.classList.toggle('is-on', !!b); }
        if (cvc) cvc.maxLength = b?.cvc || 3;
        const d = Card.digits(val); if (b && d.length >= 15 && b.lengths.includes(d.length) && Card.luhn(d) && e?.inputType !== 'deleteContentBackward') document.getElementById('cf-exp')?.focus();
      }
      if (k === 'exp' && /^\d{2}\/\d{2}$/.test(val)) document.getElementById('cf-cvc')?.focus();
      this.syncErrors(false);
    },
    cardBlur(el) { CardForm.touched[el.dataset.key] = true; this.syncErrors(false); },
    scanCard() {
      Scan.open(got => {
        Object.assign(CardForm.v, { number: Card.formatNumber(got.number || CardForm.v.number), exp: got.exp || CardForm.v.exp, cvc: got.cvc || CardForm.v.cvc });
        CardForm.scanned = true; CardForm.touched = { number: true, exp: true, cvc: true };
        render({ keepFocus: true });
        setTimeout(() => document.getElementById('cardpanel')?.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }), 60);
      });
    },
    syncNote() {
      const n = document.getElementById('cf-note'); if (n) n.hidden = !CardForm.scanned;
    },
    syncErrors(all) {
      if (all) ['number', 'exp', 'cvc'].forEach(k => CardForm.touched[k] = true);
      const err = CardForm.errors();
      ['number', 'exp', 'cvc'].forEach(k => {
        const f = document.querySelector(`.cfield[data-field="${k}"]`); if (!f) return;
        const bad = CardForm.touched[k] && err[k];
        f.classList.toggle('is-invalid', !!bad); f.querySelector('input').setAttribute('aria-invalid', bad ? 'true' : 'false');
        f.querySelector('.field__err').textContent = bad ? t(err[k]) : '';
      });
      return err;
    },
    /** Slide-to-pay guard: a card payment needs complete, valid details. */
    ready() {
      if (CardForm.valid()) return true;
      const err = this.syncErrors(true);
      const panel = document.getElementById('cardpanel');
      if (panel) { panel.classList.remove('is-shake'); void panel.offsetWidth; panel.classList.add('is-shake'); panel.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); }
      const first = ['number', 'exp', 'cvc'].find(k => err[k]); if (first) setTimeout(() => document.getElementById('cf-' + first)?.focus({ preventScroll: true }), 350);
      return false;
    },
    express(el) { Screens.payment.actions.pay(el.dataset.method); },
    async pay(method = 'card') {
      if (State.paying) return;
      if (!navigator.onLine) { State.payError = 'network_unavailable'; return render(); }
      Session.patch({ method });
      State.paying = true; State.payingMethod = method; State.payError = null; render({ keepFocus: true });
      const st = State.station, plan = Domain.plan(st.pricing, Session.data.planId);
      try {
        const p = await API.payments.pay({ station: st, plan, method, card: method === 'card' ? { ...CardForm.v } : null });
        State.paying = false; State.payingMethod = null;
        if (p.status === 'succeeded') { CardForm.clear(); Session.patch({ paymentId: p.id }); go('/rent/processing', { replace: true }); }
        else { State.payError = p.status === 'cancelled' ? 'payment_cancelled' : 'payment_failed'; render(); }
      } catch (e) { State.paying = false; State.payingMethod = null; State.payError = 'payment_failed'; render(); }
    },
  },
  mount() { return mountSlideToPay(() => Screens.payment.actions.pay('card'), () => Screens.payment.actions.ready()); },
  leave() { State.payError = null; Scan.close(); },
};
