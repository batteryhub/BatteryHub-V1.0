/* ---------------------------- /config/env --------------------------- */
const ENV = Object.freeze({
  PUBLIC_PROVIDER: 'mock',            // 'mock' | 'batteryhub' (BatteryHub API, when it exists)
  PUBLIC_API_BASE_URL: null,          // BatteryHub API base URL, supplied at deploy time
  PUBLIC_DEFAULT_LOCALE: 'en',
  PUBLIC_DEFAULT_STATION: 'BH001',
  // SERVER_ONLY_* (payment secrets, W-Dian credentials, private tokens) live on the
  // BatteryHub backend only. Nothing sensitive is ever read or stored by this client.
});
