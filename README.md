# BatteryHub Customer WebApp

Mobile-first web app for renting a BatteryHub shared power bank. The customer scans the QR code on a station,
chooses a plan, pays and takes a power bank. The app then tracks the rental and guides the return.
No app install, no account. First deployment: Thailand pilot (THB). Built so more countries, currencies and
languages can be added through config.

**Brand:** navy `#0B1F3B`, electric green `#00E676`. Tagline: "Power When You Need It."

## Important: what this project is (and isn't)

- **There is no Next.js, React, TypeScript, `tsconfig.json`, `next.config.*` or npm dependency in this project.**
  None of these files were left out of the export. The project was built as a **zero-dependency, single-page
  web app**: plain HTML + CSS + modern JavaScript (ES2022) and tagged-template rendering.
- The deployed artifact is **one self-contained `index.html`**. For this export it has been split back into
  its logical modules under `src/`. `build.mjs` stitches them together again, and the result is
  **byte-identical** to the live page.
- All modules share **one script scope**, concatenated in the order listed in `src/manifest.json`. They do not
  use `import`/`export` yet. Converting each file to an ES module (or to Next.js/Vite) is mostly mechanical,
  because the folder boundaries already follow the intended layout.
- **All back-end behaviour is mocked** (`MockProvider`). This covers payments, stations, rentals and power-bank
  telemetry. Nothing talks to a real server, payment processor or station hardware.

## Run / build

```bash
npm run build      # or: node build.mjs          -> dist/index.html
npm run check      # also runs a JS syntax check
# then open dist/index.html in a browser, e.g. dist/index.html?station=BH001
```

Requirements: Node 18+ (build only). No `npm install` needed.

The only runtime external request is Google Fonts (Archivo, Montserrat), and the page has font fallbacks.

## Project structure

```
build.mjs                     zero-dependency build (src/ -> dist/index.html)
package.json                  scripts only, no dependencies
.env.example                  variable NAMES only (see Environment)
src/
  index.template.html         HTML shell (<head>, app mount points, placeholders for CSS/JS)
  manifest.json               concatenation order of CSS + JS modules
  styles/app.css              design tokens (CSS custom properties) + all component styles
  app/prelude.js              'use strict' + module map
  config/
    env.js                    ENV (public settings only)
    brand.js                  BRAND (name, tagline, optional official logo file paths)
    hardware.js               HARDWARE_MODELS (W-Dian 8-slot: layout, slot numbering, power-bank specs, cables)
    pricing.js                PRICING_PROFILES (plans, late fee, non-return charge, authorization, policy)
    payments.js               PAYMENT_PROCESSOR (Stripe label, card networks) + PAYMENT_METHODS
    stations.js               STATIONS demo seed (BH001–BH005); real data would come from the backend
  i18n/en.js                  STRINGS: every customer-facing text, with a t() helper
  lib/
    format.js                 fmt: money, durations, times (Intl-based)
    clock.js                  Clock (can be sped up in Demo Mode)
    storage.js                Store (safe localStorage wrapper)
    session.js                Session (plan, method, payment/rental IDs; survives refresh)
    api/provider.js           Provider interface (JSDoc) + MockProvider (in-browser fake backend)
    services.js               StationService, PaymentService, RentalService, createServices(ENV)
  integrations/wdian.js       WDianAdapter: isolated placeholder, every method throws "not mapped"
  data/phones.js              phone battery database (~280 models, mAh) for charge estimates
  domain/
    index.js                  pure business rules: plan lookup, late fee, estimates, express-wallet choice
    card.js                   card brand detection, formatting, Luhn/expiry/CVC checks, CardForm, CardScanner (mock)
  ui/
    icons.js                  inline SVG icon set
    components.js             TopBar, progress steps, plan cards, CardFields, camera Scan sheet,
                              StationSlotMap, PowerBankArt, SlideToPay, InfoTip, how-it-works carousel, ...
    screens/
      _registry.js            Screens object
      entry.js                /rent            plan selection
      payment.js              /rent/payment    checkout (Apple/Google Pay, card, slide-to-pay)
      processing.js           /rent/processing charging animation -> power bank released
      ready.js                /rent/ready      "Take your power bank" + slot
      active.js               /rent/active     rental timer, battery estimates, phone picker
      return.js               /rent/return     return to ANY free slot, then the final page
                                               (returned + thank you + rent again)
      done.js                 /rent/done       redirects to the final page (kept for old links)
      closed.js               /rent/closed     not returned (non-return charge)
      help.js                 /help
      error.js                /error/<code>
  app/
    state.js                  in-memory app state
    router.js                 hash router, guards, render loop, event delegation
    dev.js                    hidden Demo Mode panel
    boot.js                   start-up, session recovery
docs/design-references/       images supplied by the product owner (logo sheet, station photo,
                              power-bank product shot, checkout and plan-selection mockups).
                              Reference only; not loaded by the app.
```

## Architecture notes

- **Rendering:** `html` tagged templates escape by default (`raw()` opts out). Each screen has
  `{ path, guard(), view(), mount(), actions, leave() }`. `render()` swaps `#view`. Clicks and input events are
  delegated through `data-action`, `data-change` and `data-input` attributes.
- **Routing:** hash routes (`#/rent`, `#/rent/payment`, …). The station comes from `?station=BH001` and falls
  back to `ENV.PUBLIC_DEFAULT_STATION`. Guards redirect when the rental state doesn't allow a screen.
  An active rental is recovered after a page refresh.
- **Provider abstraction:** screens call only the services. Services call a `Provider` with these methods:
  `getStation`, `tokenizeCard`, `createPayment`, `startRental`, `getRental`, `beginReturn`, `cancelReturn`,
  `checkReturn`, `getPowerBank`. `createServices(ENV)` picks `MockProvider` today. A real BatteryHub API
  provider would implement the same interface.
- **Payment marks:** Visa, Mastercard, Apple Pay and Google Pay logos supplied by the product owner are embedded
  as data URIs in `config/payments.js` (`PAYMENT_LOGOS`). American Express is still a text badge.
- **Payments:** card data stays in memory only (`CardForm`). It is never written to the session, localStorage
  or the URL, and only a token plus the last 4 digits reach `createPayment`. In production the card fields and
  wallets should be the payment processor's hosted fields/SDK (Stripe Elements, Apple Pay JS,
  Google Pay API). Official wallet and network logos are not bundled: text badges are used, and
  `PAYMENT_METHODS[*].logoSrc` accepts licensed assets.
- **Express wallets:** chosen from the device OS. iOS/Safari shows Apple Pay and Google Pay; other devices show
  Google Pay only. Demo Mode can force either.
- **Returns:** customers may use **any free slot** at the station, so no slot is reserved. The station must report
  the slot on detection; `rental.returnSlot` is set then.
- **Accessibility:** WCAG-minded contrast, focus styles, keyboard support including the slide-to-pay control
  (Enter/Space/arrows), `aria-live` updates, and every animation respects `prefers-reduced-motion`.

## Environment

See `.env.example`. Only **public** settings exist on the client (`PUBLIC_*`, currently hard-coded in
`src/config/env.js` because there is no bundler to inject them). Secrets such as payment keys, webhook secrets
and W-Dian credentials must live on the BatteryHub backend only. **No secrets, API keys or passwords are in this
code.** The only token-like strings are the mock `tok_demo_*` values the fake provider generates at runtime.

## Demo Mode

Open with `?dev=1`, Shift+D, or by tapping the logo 5 times. It lets you:
- pick the station, slot and express wallet
- force the result of payment, release, availability or telemetry
- speed up time (1×/60×/600×) or jump to overdue
- simulate a return, a return that isn't detected, or a power bank that's never returned
- preview every error state, and reset everything

## Current business config (Thailand pilot)

| Setting | Value |
|---|---|
| Plans | 2 Hours ฿100 (Most Popular) · 24 Hours ฿300 · Keep It Yours ฿850 (purchase) |
| Late fee | ฿50 per started extra hour, capped at ฿300 per rental |
| Non-return charge | ฿1,000 |
| Deposit / pre-authorization, grace period, daily cap | **not set (null)**. The UI hides them. |
| Return policy | any free slot at the same station (`anyStation: false`) |
| Payment processor label | Stripe (Visa, Mastercard, Amex) |

## Open items / assumptions to confirm

- **Slot numbering:** 1–2 top row → 7–8 bottom row (row-major) in `HARDWARE_MODELS['wdian-8'].layout`.
  Confirm against W-Dian.
- **W-Dian integration:** unmapped. No endpoints were invented.
- **Real station data:** real station data plus return-slot reporting must come from the backend.
- **Built-in cables and processor:** cables are listed as iPhone, USB-C and Micro, and the processor is
  shown as Stripe. Both are shown to customers and need confirming.
- **Logos:** the logo is rebuilt in type and SVG. Official files can be set in `BRAND.logoSrc*`.
- **Phone battery capacities:** entered from memory. Spot-check the newest models.
- **Support channel:** none configured. The Help screen offers a copyable reference instead.
