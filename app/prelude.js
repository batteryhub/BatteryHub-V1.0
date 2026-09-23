'use strict';
/* =====================================================================
   BatteryHub Customer WebApp
   Module map (each block is a file boundary in the repo layout):
     /config/env            ENV
     /config/brand          BRAND
     /config/hardware       HARDWARE_MODELS
     /config/pricing        PRICING_PROFILES
     /config/payments       PAYMENT_METHODS
     /config/stations       STATIONS (demo seed; real data comes from backend)
     /i18n/en               STRINGS
     /lib/format            fmt
     /domain                Domain (pure business rules), types (JSDoc)
     /lib/api/provider      Provider interface + MockProvider
     /integrations/wdian    WDianAdapter (isolated, not wired)
     /lib/services          StationService, PaymentService, RentalService
     /lib/session           Session
     /lib/clock             Clock
     /ui/components         Logo, StationSlotMap, RentalTimeBattery, ...
     /ui/screens            Entry, Payment, Processing, Ready, Active, Return, Done, Closed, Help, Error
     /app                   Router, boot, dev panel
   ===================================================================== */
