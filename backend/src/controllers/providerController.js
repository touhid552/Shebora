// Provider Controller - Service Provider Workflows & Geolocation
import { dbStore } from '../config/db.js';
import { filterEligibleProviders, calculateDistanceKm } from '../services/geoService.js';
import { isValidStatusTransition } from '../services/pricingService.js';

/**
 * Public/Customer: Get approved providers eligible for map and booking
 */
export function getApprovedProviders(req, res) {
  try {
    const { lat, lng, category, radiusKm } = req.query;
    const allProviders = dbStore.getProviders("approved");

    if (lat && lng) {
      const customerLat = Number(lat);
      const customerLng = Number(lng);
      const radius = radiusKm ? Number(radiusKm) : null;

      const eligible = filterEligibleProviders(allProviders, customerLat, customerLng, category, radius);

      // Sanitize: never expose private home addresses or personal identity docs
      const sanitized = eligible.map(p => ({
        id: p.id,
        name: p.name,
        nameBn: p.nameBn,
        photo: p.photo,
        categories: p.categories,
        experienceYears: p.experienceYears,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        serviceRadiusKm: p.serviceRadiusKm,
        workingHours: p.workingHours,
        isAvailable: p.isAvailable,
        area: p.location.area,
        lat: p.location.lat,
        lng: p.location.lng,
        distanceKm: p.distanceKm
      }));

      return res.status(200).json({
        success: true,
        count: sanitized.length,
        data: sanitized
      });
    }

    // Unfiltered approved providers
    const sanitized = allProviders.map(p => ({
      id: p.id,
      name: p.name,
      nameBn: p.nameBn,
      photo: p.photo,
      categories: p.categories,
      experienceYears: p.experienceYears,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      serviceRadiusKm: p.serviceRadiusKm,
      workingHours: p.workingHours,
      isAvailable: p.isAvailable,
      area: p.location?.area || "Dhaka",
      lat: p.location?.lat,
      lng: p.location?.lng
    }));

    return res.status(200).json({
      success: true,
      count: sanitized.length,
      data: sanitized
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch providers.' });
  }
}

/**
 * Public: Get single provider details and public reviews
 */
export function getProviderById(req, res) {
  try {
    const { id } = req.params;
    const provider = dbStore.getProviderById(id);
    if (!provider || provider.approvalStatus !== 'approved') {
      return res.status(404).json({ success: false, message: 'Provider not found or not approved.' });
    }

    const reviews = dbStore.getReviews().filter(r => r.providerId === id);

    return res.status(200).json({
      success: true,
      data: {
        id: provider.id,
        name: provider.name,
        nameBn: provider.nameBn,
        photo: provider.photo,
        categories: provider.categories,
        experienceYears: provider.experienceYears,
        rating: provider.rating,
        reviewsCount: provider.reviewsCount,
        serviceRadiusKm: provider.serviceRadiusKm,
        workingHours: provider.workingHours,
        isAvailable: provider.isAvailable,
        area: provider.location?.area,
        lat: provider.location?.lat,
        lng: provider.location?.lng,
        completedJobs: provider.completedJobs,
        reviews
      }
    });
  } catch (error) {
    console.error('Error fetching provider detail:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch provider.' });
  }
}

/**
 * Provider Only: Get own profile and dashboard stats
 */
export function getMyProviderProfile(req, res) {
  try {
    const provider = dbStore.getProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'No provider profile linked to this account. Please submit verification.'
      });
    }

    const jobs = dbStore.getBookings({ providerId: provider.id });
    const pendingJobs = jobs.filter(j => j.status === 'requested');
    const activeJobs = jobs.filter(j => ['accepted', 'on_the_way', 'arrived', 'in_progress'].includes(j.status));
    const completedJobs = jobs.filter(j => j.status === 'completed');

    return res.status(200).json({
      success: true,
      data: {
        profile: provider,
        stats: {
          totalEarnings: provider.totalEarnings,
          completedCount: completedJobs.length,
          activeCount: activeJobs.length,
          pendingCount: pendingJobs.length,
          rating: provider.rating,
          reviewsCount: provider.reviewsCount
        }
      }
    });
  } catch (error) {
    console.error('Error fetching provider profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to get provider dashboard.' });
  }
}

/**
 * Provider Only: Get assigned booking requests
 */
export function getProviderJobs(req, res) {
  try {
    const provider = dbStore.getProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found.' });
    }

    const { status } = req.query;
    let jobs = dbStore.getBookings({ providerId: provider.id });

    if (status && status !== 'all') {
      jobs = jobs.filter(j => j.status === status);
    }

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching provider jobs:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve jobs.' });
  }
}

/**
 * Provider: Update status of assigned booking request
 * Lifecycle: requested -> accepted -> on_the_way -> arrived -> in_progress -> completed
 */
export function updateJobStatus(req, res) {
  try {
    const provider = dbStore.getProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(403).json({ success: false, message: 'Provider profile required.' });
    }

    const { bookingId } = req.params;
    const { status, note } = req.body;

    const booking = dbStore.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.providerId !== provider.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not the designated provider for this booking.'
      });
    }

    // Validate legal state transition on server
    if (!isValidStatusTransition(booking.status, status)) {
      return res.status(400).json({
        success: false,
        message: `Illegal state transition from "${booking.status}" to "${status}".`
      });
    }

    booking.status = status;
    booking.timeline.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status} by technician`
    });

    // If completed, update provider completedJobs & totalEarnings
    if (status === 'completed') {
      provider.completedJobs = (provider.completedJobs || 0) + 1;
      const earnings = booking.pricing?.providerEarnings || (booking.pricing?.totalAmount ? booking.pricing.totalAmount * 0.9 : 0);
      provider.totalEarnings = (provider.totalEarnings || 0) + earnings;
    }

    // Notify customer
    dbStore.addNotification({
      userId: booking.customerId,
      title: `Job Update: ${status.replace('_', ' ').toUpperCase()}`,
      titleBn: `কাজের আপডেট: ${status}`,
      message: `Technician ${provider.name} updated your ${booking.serviceName} status to: ${status.replace(/_/g, ' ')}.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    dbStore.addAuditLog({
      action: "JOB_STATUS_UPDATED",
      performedBy: provider.email,
      targetId: booking.id,
      details: `Provider changed booking ${booking.id} status to ${status}`
    });

    return res.status(200).json({
      success: true,
      message: `Job status updated to ${status}.`,
      data: booking
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update job status.' });
  }
}

/**
 * Provider: Update availability, coverage radius and working hours
 */
export function updateProviderSettings(req, res) {
  try {
    const provider = dbStore.getProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found.' });
    }

    const { isAvailable, serviceRadiusKm, workingHours, area, lat, lng } = req.body;

    if (isAvailable !== undefined) {
      // Must be approved to set availability to true
      if (isAvailable && provider.approvalStatus !== 'approved') {
        return res.status(400).json({
          success: false,
          message: 'Account must be approved by admin before enabling availability.'
        });
      }
      provider.isAvailable = Boolean(isAvailable);
    }

    if (serviceRadiusKm !== undefined) {
      const radius = Number(serviceRadiusKm);
      if (radius >= 1 && radius <= 30) {
        provider.serviceRadiusKm = radius;
      }
    }

    if (workingHours) {
      provider.workingHours = workingHours.trim();
    }

    if (area || (lat && lng)) {
      provider.location = {
        ...provider.location,
        area: area || provider.location.area,
        lat: lat ? Number(lat) : provider.location.lat,
        lng: lng ? Number(lng) : provider.location.lng
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Provider settings updated successfully.',
      data: provider
    });
  } catch (error) {
    console.error('Error updating provider settings:', error);
    return res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
}
