/* ------------------------------ /domain ----------------------------- */
/**
 * @typedef {'rental'|'purchase'} PlanKind
 * @typedef {{id:string, kind:PlanKind, durationMs:number|null, price:number, name:string, blurb:string}} RentalPlan
 * @typedef {{number:number, state:'occupied'|'empty'|'fault', powerBankId:string|null}} MachineSlot
 * @typedef {{id:string, level:number|null, runtimeRange:[number,number]|null, phoneCharges:number|null}} PowerBank
 * @typedef {{id:string,name:string,location:string,online:boolean,slots:MachineSlot[],hardware:object,pricing:object,paymentMethods:string[],returnPolicy:{anyStation:boolean}}} Station
 * @typedef {{amount:number|null, status:'none'|'held'|'released'|'captured'}} Deposit
 * @typedef {{id:string, status:'succeeded'|'failed'|'cancelled', amount:number, currency:string, method:string, authorization:Deposit}} Payment
 * @typedef {'releasing'|'active'|'awaiting_return'|'returned'|'defaulted'|'purchased'} RentalStatus
 * @typedef {'waiting'|'detected'|'not_detected'} ReturnStatus
 * @typedef {{id:string, stationId:string, planId:string, planKind:PlanKind, slot:number, powerBankId:string, startedAt:number,
 *   includedUntil:number|null, price:number, currency:string, authorization:Deposit, status:RentalStatus,
 *   returnedAt:number|null, returnSlot:number|null, charges:{rental:number, late:number|null, nonReturn:number|null}, total:number|null}} Rental
 * @typedef {{v:number, stationId:string|null, planId:string|null, method:string|null, paymentId:string|null, rentalId:string|null, updatedAt:number}} CustomerSession
 */
const Domain = {
  plan(pricing, id) { return pricing.plans.find(p => p.id === id) || null; },
  available(station) { return station.slots.filter(s => s.state === 'occupied').length; },
  remainingMs(rental, now) { return rental.includedUntil == null ? null : rental.includedUntil - now; },
  isOverdue(rental, now) {
    if (rental.includedUntil == null) return false;
    const grace = 0; // grace applied in fee calc once configured
    return now > rental.includedUntil + grace;
  },
  lateFee(rental, pricing, now) {
    // Returns null when fee rules are not configured, so the UI never shows an invented number.
    if (!pricing.lateFee || rental.includedUntil == null) return null;
    const grace = pricing.gracePeriodMs || 0;
    const over = now - rental.includedUntil - grace;
    if (over <= 0) return 0;
    let fee = Math.ceil(over / pricing.lateFee.everyMs) * pricing.lateFee.amount;
    if (pricing.lateFee.capPerRental != null) fee = Math.min(fee, pricing.lateFee.capPerRental);
    if (pricing.dailyCap != null) {
      const days = Math.max(1, Math.ceil((now - rental.startedAt) / (24 * H)));
      fee = Math.min(fee, pricing.dailyCap * days - rental.price);
    }
    return Math.max(0, fee);
  },
  estimatedTotal(rental, pricing, now) {
    const late = Domain.lateFee(rental, pricing, now);
    return rental.price + (late || 0);
  },
  /** Charging estimates for a phone from the power bank's remaining charge. All inputs come from config / telemetry. */
  phoneEstimate(levelPct, phoneMah, pb) {
    const deliverable = pb.capacityMah * (levelPct / 100) * pb.deliveryEfficiency;
    const refRate = pb.referenceCharge.phoneMah * pb.referenceCharge.percentPerHour / 100;       // mAh per hour
    const pctCapRate = phoneMah * pb.referenceCharge.percentPerHour / 100;                        // never faster than the reference %/h
    const rate = pb.rateModel === 'fixed-percent' ? pctCapRate : Math.min(refRate, pctCapRate);
    return { deliverable, charges: deliverable / phoneMah, percentPerHour: rate / phoneMah * 100, runtimeMs: deliverable / rate * H };
  },
  /** One express wallet, picked by the phone's OS: Apple Pay on iPhone/iPad (every iOS browser is WebKit)
   *  and Safari on Mac; Google Pay on Android and everywhere else. Production should also confirm with
   *  ApplePaySession.canMakePayments() / Google Pay isReadyToPay() before showing it. */
  walletPlatform() {
    if (Dev.s.wallet && Dev.s.wallet !== 'auto') return Dev.s.wallet;
    const ua = navigator.userAgent || '';
    const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const macSafari = /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox|OPR/.test(ua);
    return ios || macSafari ? 'apple' : 'android';
  },
  expressMethod(methods) { return this.expressMethods(methods)[0] || null; },
  /** Wallets that work on this device, native one first: iPhone gets Apple Pay + Google Pay, Android gets Google Pay. */
  expressMethods(methods) {
    const platform = this.walletPlatform();
    const ok = m => PAYMENT_METHODS[m]?.express && (PAYMENT_METHODS[m].platform === platform || (platform === 'apple' && PAYMENT_METHODS[m].platform === 'android'));
    return methods.filter(ok).sort((a, b) => (PAYMENT_METHODS[b].platform === platform) - (PAYMENT_METHODS[a].platform === platform));
  },
};
