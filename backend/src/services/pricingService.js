// Shebora Pricing and Commission Service
export const PLATFORM_COMMISSION_RATE = 0.10; // 10% platform commission

/**
 * Calculates official booking pricing on the server.
 * Never trust prices submitted from client browser.
 */
export function calculateBookingPrice({ basePrice, materialsCost = 0, isNightEmergency = false, distanceKm = 0 }) {
  const safeBase = Math.max(0, Number(basePrice) || 0);
  const safeMaterials = Math.max(0, Number(materialsCost) || 0);
  
  // Night emergency charge (between 10 PM and 6 AM): +200 BDT
  const emergencyFee = isNightEmergency ? 200 : 0;
  
  // Travel distance surcharge if beyond 8km: 25 BDT per extra km
  const distanceSurcharge = distanceKm > 8 ? Math.round((distanceKm - 8) * 25) : 0;
  
  const subtotal = safeBase + safeMaterials + emergencyFee + distanceSurcharge;
  const platformFee = Math.round(subtotal * PLATFORM_COMMISSION_RATE);
  const providerEarnings = subtotal - platformFee;
  const totalAmount = subtotal;

  return {
    baseAmount: safeBase,
    materialsCost: safeMaterials,
    emergencyFee,
    distanceSurcharge,
    platformFee,
    providerEarnings,
    totalAmount,
    currency: "BDT"
  };
}

/**
 * Validates legal booking status transitions
 */
export const ALLOWED_TRANSITIONS = {
  requested: ["accepted", "rejected", "cancelled"],
  accepted: ["on_the_way", "cancelled"],
  on_the_way: ["arrived", "cancelled"],
  arrived: ["in_progress"],
  in_progress: ["completed"],
  completed: [], // terminal
  cancelled: [], // terminal
  rejected: []   // terminal
};

export function isValidStatusTransition(currentStatus, nextStatus) {
  if (!currentStatus || !nextStatus) return false;
  if (currentStatus === nextStatus) return true;
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}
