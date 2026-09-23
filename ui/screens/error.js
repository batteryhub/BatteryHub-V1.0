/* ---------- Error ---------- */
Screens.error = {
  path: '/error',
  view(params) {
    const code = params.code || 'generic';
    const retryTo = { payment_failed: '/rent/payment', payment_cancelled: '/rent/payment', release_failed: '/rent/payment', slot_unavailable: '/rent/payment',
      session_expired: '/rent', no_power_banks: '/rent', station_unavailable: '/rent', network_unavailable: null, return_not_detected: '/rent/return' }[code];
    return html`${TopBar({ station: State.station })}
    <main class="screen screen--single screen--no-cta"><div class="screen__body">
      ${ErrorState(code)}
      <div class="btn-stack">
        ${code === 'station_not_found' ? '' : retryTo ? PrimaryButton({ label: code === 'session_expired' ? t('err.home') : t('err.retry'), action: 'retry', attrs: `data-to="${retryTo}"` }) : PrimaryButton({ label: t('err.retry'), action: 'reload' })}
        ${SecondaryButton({ label: t('err.help'), href: '#/help' })}
      </div>
    </div></main>`;
  },
  actions: {
    retry(el) { if (el.dataset.to === '/rent') Session.patch({ paymentId: null }); go(el.dataset.to, { replace: true }); },
    reload() { location.reload(); },
  },
};
