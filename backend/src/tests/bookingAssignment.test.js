import test from 'node:test';
import assert from 'node:assert/strict';
import { signToken } from '../middleware/auth.js';
import { dbStore } from '../config/db.js';
import app from '../../app.js';

const server = app.listen(0, '127.0.0.1');
const baseUrl = new Promise(resolve => server.once('listening', () => {
  resolve(`http://127.0.0.1:${server.address().port}`);
}));

async function apiRequest(path, { token, method = 'GET', body } = {}) {
  const url = `${await baseUrl}${path}`;
  const response = await fetch(url, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  return { status: response.status, data: await response.json() };
}

function addTestProvider({ suffix, categories, approvalStatus = 'approved', isAvailable = true, area = 'Uttara', lat = 23.8688, lng = 90.3995, radius = 30 }) {
  const user = {
    id: `test-user-${suffix}`,
    name: `Test Technician ${suffix}`,
    email: `test-${suffix}@shebora.test`,
    passwordHash: 'unused-in-this-test',
    role: 'provider',
    phone: '01700000001',
    createdAt: new Date().toISOString()
  };
  const provider = {
    id: `test-provider-${suffix}`,
    userId: user.id,
    name: user.name,
    nameBn: user.name,
    phone: user.phone,
    email: user.email,
    categories,
    experienceYears: 3,
    rating: 0,
    reviewsCount: 0,
    approvalStatus,
    serviceRadiusKm: radius,
    location: { address: area, area, lat, lng },
    verificationDoc: { type: 'Test document', status: 'verified', submittedAt: new Date().toISOString() },
    workingHours: '08:00 AM - 08:00 PM',
    isAvailable,
    totalEarnings: 0,
    completedJobs: 0
  };

  dbStore.addUser(user);
  dbStore.addProvider(provider);
  return { user, provider, token: signToken(user) };
}

function bookingRequest(area, lat, lng) {
  return {
    serviceId: 'srv-ac-repair',
    scheduledDate: '2027-01-15',
    scheduledTime: '10:00 AM',
    address: { area, road: 'Test Road', building: 'Test House', lat, lng },
    notes: 'Booking assignment integration test'
  };
}

test('unassigned AC bookings are broadcast safely and accepted by one eligible technician', async (t) => {
  t.after(() => new Promise(resolve => server.close(resolve)));

  const customer = dbStore.getUserById('usr-customer');
  const admin = dbStore.getUserById('usr-admin');
  const primaryProvider = dbStore.getProviderById('prv-1');
  const originalAvailability = primaryProvider.isAvailable;
  const customerLogin = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email: customer.email, password: 'password123', expectedRole: 'customer' }
  });
  const adminLogin = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email: admin.email, password: 'password123', expectedRole: 'admin' }
  });

  assert.equal(customerLogin.status, 200, 'seeded customer can authenticate');
  assert.equal(adminLogin.status, 200, 'seeded admin can authenticate');

  const customerToken = customerLogin.data.token;
  const adminToken = adminLogin.data.token;
  const secondEligible = addTestProvider({ suffix: 'second', categories: ['AC Repair'], isAvailable: false });
  const categoryMismatch = addTestProvider({ suffix: 'category', categories: ['Plumbing'] });
  const outOfServiceArea = addTestProvider({
    suffix: 'area',
    categories: ['AC Repair'],
    isAvailable: false,
    area: 'Malibagh',
    lat: 23.7490,
    lng: 90.4160
  });
  const unavailable = addTestProvider({ suffix: 'offline', categories: ['AC Repair'], isAvailable: false });
  const pending = addTestProvider({ suffix: 'pending', categories: ['AC Repair'], approvalStatus: 'pending' });
  const providerWithoutProfileUser = {
    id: 'test-user-no-profile', name: 'No Profile', email: 'no-profile@shebora.test',
    passwordHash: 'unused-in-this-test', role: 'provider', createdAt: new Date().toISOString()
  };
  dbStore.addUser(providerWithoutProfileUser);
  const noProfileToken = signToken(providerWithoutProfileUser);

  try {
    primaryProvider.isAvailable = false;

    const createResponse = await apiRequest('/api/bookings', {
      token: customerToken,
      method: 'POST',
      body: bookingRequest('Uttara', 23.8688, 90.3995)
    });
    assert.equal(createResponse.status, 201);
    const booking = createResponse.data.data;
    assert.equal(booking.status, 'requested');
    assert.equal(booking.providerId, null);

    const areaMismatchBookingResponse = await apiRequest('/api/bookings', {
      token: customerToken,
      method: 'POST',
      body: bookingRequest('Malibagh', 23.7490, 90.4160)
    });
    assert.equal(areaMismatchBookingResponse.status, 201);
    const areaMismatchBooking = areaMismatchBookingResponse.data.data;
    assert.equal(areaMismatchBooking.providerId, null);

    primaryProvider.isAvailable = true;
    secondEligible.provider.isAvailable = true;
    outOfServiceArea.provider.isAvailable = true;

    const unauthenticatedJobs = await apiRequest('/api/providers/jobs');
    assert.equal(unauthenticatedJobs.status, 401);
    const customerJobs = await apiRequest('/api/providers/jobs', { token: customerToken });
    assert.equal(customerJobs.status, 403);
    const noProfileJobs = await apiRequest('/api/providers/jobs', { token: noProfileToken });
    assert.equal(noProfileJobs.status, 404);

    for (const provider of [categoryMismatch, unavailable, pending]) {
      const jobsResponse = await apiRequest('/api/providers/jobs', { token: provider.token });
      assert.equal(jobsResponse.status, 200);
      assert.equal(jobsResponse.data.data.some(job => job.id === booking.id), false, `${provider.provider.id} must not see the broadcast`);

      const acceptResponse = await apiRequest(`/api/providers/jobs/${booking.id}/status`, {
        token: provider.token,
        method: 'PATCH',
        body: { status: 'accepted' }
      });
      assert.equal(acceptResponse.status, 403, `${provider.provider.id} must not accept the booking`);
    }

    const areaProviderJobs = await apiRequest('/api/providers/jobs', { token: outOfServiceArea.token });
    assert.equal(areaProviderJobs.data.data.some(job => job.id === areaMismatchBooking.id), false);
    const areaProviderAccept = await apiRequest(`/api/providers/jobs/${areaMismatchBooking.id}/status`, {
      token: outOfServiceArea.token,
      method: 'PATCH',
      body: { status: 'accepted' }
    });
    assert.equal(areaProviderAccept.status, 403, 'service areas outside the AC catalog are not eligible');

    const providerJobs = await apiRequest('/api/providers/jobs', { token: signToken(dbStore.getUserById('usr-p1')) });
    assert.equal(providerJobs.status, 200);
    assert.ok(providerJobs.data.data.some(job => job.id === booking.id), 'eligible technician sees unassigned request');
    assert.equal(providerJobs.data.data.some(job => job.id === areaMismatchBooking.id), false, 'service area is enforced');

    const acceptResponse = await apiRequest(`/api/providers/jobs/${booking.id}/status`, {
      token: signToken(dbStore.getUserById('usr-p1')),
      method: 'PATCH',
      body: { status: 'accepted' }
    });
    assert.equal(acceptResponse.status, 200);
    assert.equal(acceptResponse.data.data.providerId, primaryProvider.id);
    assert.equal(acceptResponse.data.data.providerName, primaryProvider.name);
    assert.equal(acceptResponse.data.data.status, 'accepted');
    assert.equal(acceptResponse.data.data.timeline.at(-1).status, 'accepted');

    const secondClaim = await apiRequest(`/api/providers/jobs/${booking.id}/status`, {
      token: secondEligible.token,
      method: 'PATCH',
      body: { status: 'accepted' }
    });
    assert.equal(secondClaim.status, 409, 'another technician cannot take an assigned booking');

    const customerBookings = await apiRequest('/api/bookings/my-bookings', { token: customerToken });
    const customerView = customerBookings.data.data.find(item => item.id === booking.id);
    assert.equal(customerView.status, 'accepted');
    assert.equal(customerView.providerName, primaryProvider.name);

    const adminBookings = await apiRequest('/api/admin/bookings', { token: adminToken });
    const adminView = adminBookings.data.data.find(item => item.id === booking.id);
    assert.equal(adminView.status, 'accepted');
    assert.equal(adminView.providerName, primaryProvider.name);

    // Race two eligible providers for a second broadcast booking.
    primaryProvider.isAvailable = false;
    secondEligible.provider.isAvailable = false;
    outOfServiceArea.provider.isAvailable = false;
    const raceBookingResponse = await apiRequest('/api/bookings', {
      token: customerToken,
      method: 'POST',
      body: bookingRequest('Uttara', 23.8688, 90.3995)
    });
    assert.equal(raceBookingResponse.status, 201);
    const raceBooking = raceBookingResponse.data.data;
    primaryProvider.isAvailable = true;
    secondEligible.provider.isAvailable = true;

    const raceResults = await Promise.all([
      apiRequest(`/api/providers/jobs/${raceBooking.id}/status`, {
        token: signToken(dbStore.getUserById('usr-p1')),
        method: 'PATCH', body: { status: 'accepted' }
      }),
      apiRequest(`/api/providers/jobs/${raceBooking.id}/status`, {
        token: secondEligible.token,
        method: 'PATCH', body: { status: 'accepted' }
      })
    ]);
    assert.deepEqual(raceResults.map(result => result.status).sort(), [200, 409]);
  } finally {
    primaryProvider.isAvailable = originalAvailability;
  }
});
