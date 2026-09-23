/* ------------------------- /config/hardware ------------------------- */
const H = 3600000, M = 60000;
const HARDWARE_MODELS = Object.freeze({
  'wdian-8': {
    slotCount: 8,
    // Slot arrangement must match the physical station. Update from real product photos.
    layout: { columns: 2, rows: 4, modules: 2, numbering: 'row-major', screen: 'top' },   // 2 stacked modules × (2×2), matches product photo
    powerBank: {
      capacityMah: 8000, maxOutputW: 22.5,
      // Share of stored energy that reaches the phone after voltage conversion, cable and phone-side losses (industry norm ~60–70%).
      deliveryEfficiency: 0.65,
      // Supplier estimate (not a guarantee): ~70% of an iPhone 16 Pro (3,582 mAh) in one hour.
      referenceCharge: { phoneMah: 3582, percentPerHour: 70 },
      // 'fixed-mah': same mAh per hour for every phone (bigger batteries fill a smaller %). 'fixed-percent': 70%/h for every phone.
      rateModel: 'fixed-mah',
      typicalPhoneMah: 4500,
      // Built-in cables, shown on the checkout card. Confirm against the W-Dian power bank model.
      cables: ['iPhone', 'USB-C', 'Micro'],
    },
    // Optional real render: { src, slots: { 1: {x,y,w,h}, ... } } replaces the schematic.
    render: null,
  },
});
