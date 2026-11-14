// Bookable service options and server-authoritative starting prices (BDT).
const SERVICE_PACKAGES = {
  'AC Repair': [
    { id: 'ac-checkup', name: 'AC Inspection & Checkup', variants: [{ id: 'standard', label: '1 AC unit', price: 500 }] },
    { id: 'ac-jet-wash', name: 'AC Jet Wash', variants: [{ id: '1-1-5-ton', label: '1 – 1.5 Ton', price: 800 }, { id: '2-3-ton', label: '2 – 3 Ton', price: 1114 }] },
    { id: 'ac-master-service', name: 'AC Master Service', variants: [{ id: 'standard', label: '1 AC unit', price: 1323 }] },
    { id: 'ac-four-unit-wash', name: 'AC Jet Wash (4 ACs)', variants: [{ id: 'standard', label: '4 AC units', price: 2899 }] },
  ],
  'Painting': [
    { id: 'paint-one-room', name: 'Paint One Room', variants: [{ id: 'standard', label: 'Per room', price: 4500 }] },
    { id: 'paint-two-rooms', name: 'Paint Two Rooms', variants: [{ id: 'standard', label: '2 rooms', price: 8500 }] },
    { id: 'paint-wall-repair', name: 'Wall Putty & Preparation', variants: [{ id: 'standard', label: 'Per room', price: 1800 }] },
  ],
  'Electrical Repair': [
    { id: 'electrical-inspection', name: 'Electrical Safety Inspection', variants: [{ id: 'standard', label: 'Per visit', price: 650 }] },
    { id: 'switch-socket', name: 'Switch or Socket Repair', variants: [{ id: 'standard', label: 'Up to 2 points', price: 750 }] },
    { id: 'fan-installation', name: 'Ceiling Fan Installation', variants: [{ id: 'standard', label: 'Per fan', price: 850 }] },
    { id: 'wiring-repair', name: 'Wiring Fault Repair', variants: [{ id: 'standard', label: 'Per visit', price: 1200 }] },
  ],
  'Plumbing': [
    { id: 'plumbing-inspection', name: 'Plumbing Inspection', variants: [{ id: 'standard', label: 'Per visit', price: 500 }] },
    { id: 'leak-repair', name: 'Leak Repair', variants: [{ id: 'standard', label: 'One connection', price: 800 }] },
    { id: 'drain-clearing', name: 'Drain Blockage Clearing', variants: [{ id: 'standard', label: 'Per drain', price: 1200 }] },
    { id: 'fixture-installation', name: 'Tap or Fixture Installation', variants: [{ id: 'standard', label: 'Per fixture', price: 1500 }] },
  ],
  'Home Cleaning': [
    { id: 'clean-one-bedroom', name: 'Deep Clean', variants: [{ id: 'one-bedroom', label: '1 bedroom', price: 2500 }, { id: 'two-bedroom', label: '2 bedrooms', price: 3500 }, { id: 'three-bedroom', label: '3 bedrooms', price: 4800 }] },
    { id: 'sofa-cleaning', name: 'Sofa Shampooing', variants: [{ id: 'up-to-five-seats', label: 'Up to 5 seats', price: 1800 }, { id: 'six-to-eight-seats', label: '6–8 seats', price: 2600 }] },
    { id: 'bathroom-cleaning', name: 'Bathroom Deep Clean', variants: [{ id: 'standard', label: 'Per bathroom', price: 900 }] },
  ],
  'Appliance Repair': [
    { id: 'refrigerator-repair', name: 'Refrigerator Diagnosis & Repair', variants: [{ id: 'standard', label: 'Per appliance', price: 950 }] },
    { id: 'washing-machine-repair', name: 'Washing Machine Diagnosis & Repair', variants: [{ id: 'standard', label: 'Per appliance', price: 950 }] },
    { id: 'microwave-repair', name: 'Microwave Oven Diagnosis & Repair', variants: [{ id: 'standard', label: 'Per appliance', price: 800 }] },
  ],
};

export function getServicePackages(category) {
  return SERVICE_PACKAGES[category] || [{
    id: 'standard-service',
    name: 'Standard Service',
    variants: [{ id: 'standard', label: 'Per service', price: 0 }],
  }];
}

export function getServiceStartingOption(category, fallbackPrice, fallbackUnit = 'service') {
  const options = getServicePackages(category).flatMap(servicePackage =>
    servicePackage.variants.map(variant => ({ price: Number(variant.price), unit: variant.label }))
  ).filter(option => Number.isFinite(option.price) && option.price > 0);

  if (!options.length) return { price: Number(fallbackPrice) || 0, unit: fallbackUnit };
  return options.reduce((lowest, option) => option.price < lowest.price ? option : lowest);
}

export function findServicePackage(category, packageId, variantId) {
  const servicePackage = getServicePackages(category).find((item) => item.id === packageId);
  const variant = servicePackage?.variants.find((item) => item.id === variantId);
  return servicePackage && variant ? { servicePackage, variant } : null;
}
