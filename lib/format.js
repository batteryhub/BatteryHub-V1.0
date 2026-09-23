/* ----------------------------- /lib/format -------------------------- */
const fmt = {
  money(amount, currency) {
    try { return new Intl.NumberFormat(LOCALE, { style: 'currency', currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }).format(amount); }
    catch { return currency + ' ' + amount; }
  },
  clock(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return [h, m, sec].map(n => String(n).padStart(2, '0')).join(':');
  },
  short(ms) {
    const totalM = Math.max(0, Math.floor(ms / M));
    const h = Math.floor(totalM / 60), m = totalM % 60;
    if (h && m) return t('dur.hm', { h, m });
    if (h) return t('dur.h', { h });
    return t('dur.m', { m });
  },
  time(ts) { return new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' }).format(ts); },
  dateTime(ts) { return new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(ts); },
};

