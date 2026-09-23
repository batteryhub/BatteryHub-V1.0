/* ------------------------- /config/stations ------------------------- */
// Demo seed only. In production the BatteryHub API returns this per station.
const STATIONS = Object.freeze({
  BH001: { id: 'BH001', name: 'Ban Tai', location: 'Ban Tai', country: 'TH', hardwareModel: 'wdian-8', pricingProfile: 'th-pilot',
           paymentMethods: ['apple_pay', 'google_pay', 'card'], returnPolicy: { anyStation: false } },
  BH002: { id: 'BH002', name: 'Pilot station 2', location: 'Thailand', country: 'TH', hardwareModel: 'wdian-8', pricingProfile: 'th-pilot',
           paymentMethods: ['card'], returnPolicy: { anyStation: false } },
  BH003: { id: 'BH003', name: 'Pilot station 3', location: 'Thailand', country: 'TH', hardwareModel: 'wdian-8', pricingProfile: 'th-pilot',
           paymentMethods: ['apple_pay', 'google_pay', 'card'], returnPolicy: { anyStation: false } },
  BH004: { id: 'BH004', name: 'Pilot station 4', location: 'Thailand', country: 'TH', hardwareModel: 'wdian-8', pricingProfile: 'th-pilot',
           paymentMethods: ['apple_pay', 'google_pay', 'card'], returnPolicy: { anyStation: false } },
  BH005: { id: 'BH005', name: 'Pilot station 5', location: 'Thailand', country: 'TH', hardwareModel: 'wdian-8', pricingProfile: 'th-pilot',
           paymentMethods: ['card'], returnPolicy: { anyStation: false } },
});

const APP_RULES = Object.freeze({
  sessionTtlMs: 30 * M,               // plan/payment selection expiry
  returnDetectTimeoutMs: 120000,      // show "not detected" guidance after this
  processingMinMs: 4200,              // cinematic minimum
  processingReducedMs: 1400,
});
