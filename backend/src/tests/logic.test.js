// Unit Tests for Shebora Core Business Logic (Node.js test runner)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateBookingPrice,
  isValidStatusTransition,
  PLATFORM_COMMISSION_RATE
} from '../services/pricingService.js';

import {
  calculateDistanceKm,
  isWithinDhaka,
  getClosestNeighborhood,
  filterEligibleProviders
} from '../services/geoService.js';

test('1. Pricing Service: Standard booking calculation', () => {
  const result = calculateBookingPrice({
    basePrice: 1200,
    materialsCost: 0,
    isNightEmergency: false,
    distanceKm: 5
  });

  assert.equal(result.baseAmount, 1200);
  assert.equal(result.materialsCost, 0);
  assert.equal(result.emergencyFee, 0);
  assert.equal(result.distanceSurcharge, 0);
  assert.equal(result.totalAmount, 1200);
  assert.equal(result.platformFee, 120); // 10%
  assert.equal(result.providerEarnings, 1080); // 90%
});

test('2. Pricing Service: Emergency night surcharge & extra distance fee', () => {
  const result = calculateBookingPrice({
    basePrice: 1000,
    materialsCost: 500,
    isNightEmergency: true, // +200 BDT
    distanceKm: 12 // 4km over 8km * 25 = +100 BDT
  });

  assert.equal(result.baseAmount, 1000);
  assert.equal(result.materialsCost, 500);
  assert.equal(result.emergencyFee, 200);
  assert.equal(result.distanceSurcharge, 100);
  assert.equal(result.totalAmount, 1800);
  assert.equal(result.platformFee, 180);
  assert.equal(result.providerEarnings, 1620);
});

test('3. Booking Lifecycle: Valid state progression', () => {
  assert.equal(isValidStatusTransition('requested', 'accepted'), true);
  assert.equal(isValidStatusTransition('accepted', 'on_the_way'), true);
  assert.equal(isValidStatusTransition('on_the_way', 'arrived'), true);
  assert.equal(isValidStatusTransition('arrived', 'in_progress'), true);
  assert.equal(isValidStatusTransition('in_progress', 'completed'), true);
});

test('4. Booking Lifecycle: Rejects illegal backward or skipped state transitions', () => {
  assert.equal(isValidStatusTransition('requested', 'completed'), false); // Cannot jump directly
  assert.equal(isValidStatusTransition('completed', 'cancelled'), false); // Terminal state
  assert.equal(isValidStatusTransition('completed', 'in_progress'), false); // Cannot undo completion
  assert.equal(isValidStatusTransition('cancelled', 'accepted'), false); // Terminal state
});

test('5. Geolocation: Haversine distance calculation in Dhaka', () => {
  // Gulshan-2 (23.7925, 90.4167) to Banani (23.7937, 90.4066) ~ 1.0 km
  const distance = calculateDistanceKm(23.7925, 90.4167, 23.7937, 90.4066);
  assert.ok(distance >= 0.8 && distance <= 1.5, `Distance was ${distance}`);
});

test('6. Geolocation: Boundaries validation for Dhaka metropolitan area', () => {
  // Inside Dhaka (Dhanmondi)
  assert.equal(isWithinDhaka(23.7461, 90.3742), true);
  // Inside Dhaka (Uttara)
  assert.equal(isWithinDhaka(23.8688, 90.3995), true);
  // Outside Dhaka (Chittagong)
  assert.equal(isWithinDhaka(22.3569, 91.7832), false);
  // Outside Dhaka (London)
  assert.equal(isWithinDhaka(51.5074, -0.1278), false);
});

test('7. Geolocation: Reverse neighborhood matching', () => {
  const result = getClosestNeighborhood(23.7460, 90.3740);
  assert.equal(result.area, 'Dhanmondi');
});

test('8. Provider Matching: Enforces approval requirement and service radius', () => {
  const mockProviders = [
    {
      id: 'p-approved',
      name: 'Approved Pro',
      approvalStatus: 'approved',
      categories: ['AC Repair'],
      serviceRadiusKm: 10,
      location: { lat: 23.7925, lng: 90.4167, area: 'Gulshan' }
    },
    {
      id: 'p-pending',
      name: 'Pending Pro',
      approvalStatus: 'pending', // Must NOT receive customer bookings
      categories: ['AC Repair'],
      serviceRadiusKm: 10,
      location: { lat: 23.7925, lng: 90.4167, area: 'Gulshan' }
    },
    {
      id: 'p-far',
      name: 'Far Pro',
      approvalStatus: 'approved',
      categories: ['AC Repair'],
      serviceRadiusKm: 2, // Too small radius
      location: { lat: 23.7196, lng: 90.3879, area: 'Lalbagh' } // ~10km away from Gulshan
    }
  ];

  const eligible = filterEligibleProviders(mockProviders, 23.7925, 90.4167, 'AC Repair');
  const eligibleIds = eligible.map(p => p.id);

  assert.equal(eligibleIds.includes('p-approved'), true);
  assert.equal(eligibleIds.includes('p-pending'), false, 'Pending provider must not be eligible');
  assert.equal(eligibleIds.includes('p-far'), false, 'Provider outside radius must not be eligible');
});
