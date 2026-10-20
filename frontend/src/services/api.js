// Shebora Unified API Client
const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('shebora_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  demoLogin: (role) => request(`/auth/demo/${role}`, { method: 'POST' }),
  getCurrentUser: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: profileData }),

  // Services
  getServices: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.append(key, val);
    });
    return request(`/services?${query.toString()}`);
  },
  getServiceById: (id) => request(`/services/${id}`),
  createService: (serviceData) => request('/services', { method: 'POST', body: serviceData }),
  updateService: (id, serviceData) => request(`/services/${id}`, { method: 'PUT', body: serviceData }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE' }),

  // Providers
  getApprovedProviders: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.append(key, val);
    });
    return request(`/providers?${query.toString()}`);
  },
  getProviderById: (id) => request(`/providers/profile/${id}`),
  getMyProviderProfile: () => request('/providers/me'),
  getProviderJobs: (status) => request(`/providers/jobs${status ? `?status=${status}` : ''}`),
  updateJobStatus: (bookingId, status, note) =>
    request(`/providers/jobs/${bookingId}/status`, {
      method: 'PATCH',
      body: { status, note }
    }),
  updateProviderSettings: (settings) => request('/providers/settings', { method: 'PUT', body: settings }),

  // Bookings
  createBooking: (bookingData) => request('/bookings', { method: 'POST', body: bookingData }),
  getMyBookings: (status) => request(`/bookings/my-bookings${status ? `?status=${status}` : ''}`),
  getBookingDetails: (id) => request(`/bookings/${id}`),
  cancelBooking: (id, reason) => request(`/bookings/${id}/cancel`, { method: 'PATCH', body: { reason } }),
  submitReview: (reviewData) => request('/bookings/review', { method: 'POST', body: reviewData }),
  submitComplaint: (complaintData) => request('/bookings/complaint', { method: 'POST', body: complaintData }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAllProviders: (status) => request(`/admin/providers${status ? `?status=${status}` : ''}`),
  updateProviderApproval: (id, status, adminNotes) =>
    request(`/admin/providers/${id}/approval`, {
      method: 'PATCH',
      body: { status, adminNotes }
    }),
  getAllUsers: () => request('/admin/users'),
  updateUserRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } }),
  getAllComplaints: () => request('/admin/complaints'),
  resolveComplaint: (id, status, adminResolution) =>
    request(`/admin/complaints/${id}/resolve`, {
      method: 'PATCH',
      body: { status, adminResolution }
    }),
  getAllBookings: (status) => request(`/admin/bookings${status ? `?status=${status}` : ''}`),
  getAuditLogs: () => request('/admin/audit-logs'),

  // Payments
  initiatePayment: (paymentData) => request('/payments/initiate', { method: 'POST', body: paymentData }),
  verifyPayment: (verifyData) => request('/payments/verify', { method: 'POST', body: verifyData }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationsRead: () => request('/notifications/mark-read', { method: 'POST' })
};
