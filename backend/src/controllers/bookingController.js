// Booking Controller - Complete Booking Lifecycle, Review Eligibility & Complaints
import { dbStore } from '../config/db.js';
import { calculateBookingPrice, isValidStatusTransition } from '../services/pricingService.js';
import { filterEligibleProviders, calculateDistanceKm, isWithinDhaka } from '../services/geoService.js';

export function createBooking(req, res) {
  try {
    const {
      serviceId,
      providerId,
      scheduledDate,
      scheduledTime,
      address,
      notes,
      paymentMethod = "cash_on_delivery"
    } = req.body;

    if (!serviceId) {
      return res.status(400).json({ success: false, message: 'Please select a service.' });
    }

    const service = dbStore.getServiceById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Requested service not found.' });
    }

    if (!scheduledDate || !scheduledTime) {
      return res.status(400).json({ success: false, message: 'Scheduled date and time are required.' });
    }

    if (!address || !address.area) {
      return res.status(400).json({ success: false, message: 'Service address and area in Dhaka are required.' });
    }

    const customerLat = Number(address.lat) || 23.8103;
    const customerLng = Number(address.lng) || 90.4125;

    // Check Dhaka boundaries
    if (!isWithinDhaka(customerLat, customerLng)) {
      return res.status(400).json({
        success: false,
        message: 'Selected address is outside Dhaka service coverage.'
      });
    }

    let assignedProvider = null;
    let distanceKm = 0;

    if (providerId) {
      const p = dbStore.getProviderById(providerId);
      if (!p || p.approvalStatus !== 'approved') {
        return res.status(400).json({
          success: false,
          message: 'Selected provider is not available or approved.'
        });
      }
      assignedProvider = p;
      distanceKm = calculateDistanceKm(customerLat, customerLng, p.location.lat, p.location.lng);
    } else {
      // Auto-match closest approved provider covering this category and area
      const approvedProviders = dbStore.getProviders('approved');
      const eligible = filterEligibleProviders(approvedProviders, customerLat, customerLng, service.category);
      if (eligible.length > 0) {
        assignedProvider = eligible[0];
        distanceKm = assignedProvider.distanceKm;
      }
    }

    // Check emergency night fee
    const isNight = scheduledTime.includes('PM') && (scheduledTime.startsWith('10') || scheduledTime.startsWith('11'));
    
    // Server-side price calculation
    const pricing = calculateBookingPrice({
      basePrice: service.basePrice,
      materialsCost: 0,
      isNightEmergency: isNight,
      distanceKm
    });

    const bookingId = 'bk-' + Date.now();
    const bookingNumber = 'SHB-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const newBooking = {
      id: bookingId,
      bookingNumber,
      customerId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || address.phone || '01700000000',
      serviceId: service.id,
      serviceName: service.name,
      providerId: assignedProvider ? assignedProvider.id : null,
      providerName: assignedProvider ? assignedProvider.name : 'Unassigned (Broadcast to nearby technicians)',
      providerPhone: assignedProvider ? assignedProvider.phone : '',
      scheduledDate,
      scheduledTime,
      status: 'requested', // initial state
      address: {
        area: address.area,
        road: address.road || '',
        building: address.building || '',
        apartment: address.apartment || '',
        landmarks: address.landmarks || '',
        lat: customerLat,
        lng: customerLng
      },
      pricing,
      payment: {
        method: paymentMethod, // cash_on_delivery | online_gateway
        status: 'pending',
        transactionId: null,
        paidAt: null
      },
      notes: notes || '',
      timeline: [
        {
          status: 'requested',
          timestamp: new Date().toISOString(),
          note: 'Booking requested by customer.'
        }
      ],
      createdAt: new Date().toISOString(),
      hasReview: false
    };

    dbStore.addBooking(newBooking);

    // Notify customer
    dbStore.addNotification({
      userId: req.user.id,
      title: 'Booking Placed',
      titleBn: 'বুকিং জমা হয়েছে',
      message: `Your booking ${bookingNumber} for ${service.name} has been placed. Total: ৳${pricing.totalAmount}.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Booking request created successfully.',
      data: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: 'Server error creating booking.' });
  }
}

export function getCustomerBookings(req, res) {
  try {
    const { status } = req.query;
    let bookings = dbStore.getBookings({ customerId: req.user.id });

    if (status && status !== 'all') {
      bookings = bookings.filter(b => b.status === status);
    }

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
}

export function getBookingDetails(req, res) {
  try {
    const { id } = req.params;
    const booking = dbStore.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Role check: Only customer owner, assigned provider, or admin can view
    const isOwner = booking.customerId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isAssignedProvider = req.user.role === 'provider' && req.user.id === dbStore.getProviderById(booking.providerId)?.userId;

    if (!isOwner && !isAdmin && !isAssignedProvider) {
      return res.status(403).json({ success: false, message: 'Access denied to this booking.' });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking detail:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve booking.' });
  }
}

export function cancelBooking(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const booking = dbStore.getBookingById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Only owner or admin can cancel
    if (booking.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking.' });
    }

    // State transition check
    if (!isValidStatusTransition(booking.status, 'cancelled')) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking that is already "${booking.status}".`
      });
    }

    booking.status = 'cancelled';
    booking.timeline.push({
      status: 'cancelled',
      timestamp: new Date().toISOString(),
      note: reason || 'Cancelled by customer'
    });

    // Notify provider if assigned
    if (booking.providerId) {
      const p = dbStore.getProviderById(booking.providerId);
      if (p) {
        dbStore.addNotification({
          userId: p.userId,
          title: 'Booking Cancelled',
          titleBn: 'বুকিং বাতিল করা হয়েছে',
          message: `Booking ${booking.bookingNumber} was cancelled by customer.`,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
  }
}

/**
 * Customer: Submit review for a completed booking
 * Strict rule: Must be completed, must be owner, cannot review twice.
 */
export function createReview(req, res) {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({ success: false, message: 'Booking ID and star rating (1-5) are required.' });
    }

    const booking = dbStore.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.customerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only review your own bookings.' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted after the service has been completed.'
      });
    }

    if (booking.hasReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this booking.'
      });
    }

    const numRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const newReview = {
      id: 'rev-' + Date.now(),
      bookingId: booking.id,
      serviceId: booking.serviceId,
      providerId: booking.providerId,
      customerId: req.user.id,
      customerName: req.user.name,
      rating: numRating,
      comment: (comment || '').trim(),
      createdAt: new Date().toISOString()
    };

    dbStore.addReview(newReview);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published.',
      data: newReview
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
}

/**
 * Customer: Submit complaint regarding a booking
 */
export function createComplaint(req, res) {
  try {
    const { bookingId, issueType, description } = req.body;

    if (!bookingId || !issueType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID, issue type, and description are required.'
      });
    }

    const booking = dbStore.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.customerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only lodge complaints on your own bookings.' });
    }

    const newComplaint = {
      id: 'cmp-' + Date.now(),
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      customerId: req.user.id,
      customerName: req.user.name,
      customerPhone: req.user.phone || '',
      providerId: booking.providerId,
      providerName: booking.providerName,
      issueType: issueType.trim(),
      description: description.trim(),
      status: 'open', // open, under_investigation, resolved, dismissed
      adminResolution: '',
      createdAt: new Date().toISOString()
    };

    dbStore.addComplaint(newComplaint);

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted. Shebora Support is reviewing your case within 24 hours.',
      data: newComplaint
    });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit complaint.' });
  }
}
