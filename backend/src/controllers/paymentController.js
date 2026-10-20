// Payment Controller - Cash on Delivery & SSLCommerz / bKash Gateway Integration
import { dbStore } from '../config/db.js';

export function initiatePayment(req, res) {
  try {
    const { bookingId, paymentMethod = 'cash_on_delivery', provider = 'sslcommerz' } = req.body;

    const booking = dbStore.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (booking.payment?.status === 'paid') {
      return res.status(400).json({ success: false, message: 'This booking has already been paid.' });
    }

    const amount = booking.pricing?.totalAmount || 1000;
    const tran_id = 'TXN-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);

    // If Cash on Service
    if (paymentMethod === 'cash_on_delivery') {
      booking.payment.method = 'cash_on_delivery';
      booking.payment.status = 'pending';
      return res.status(200).json({
        success: true,
        message: 'Cash on Service selected. You will pay the technician upon job completion.',
        paymentMethod: 'cash_on_delivery',
        amount,
        currency: 'BDT'
      });
    }

    // Digital Gateway Flow (SSLCommerz / bKash sandbox interface)
    booking.payment.method = provider; // 'sslcommerz' | 'bkash'
    booking.payment.transactionId = tran_id;

    const host = req.get('host');
    const protocol = req.protocol;
    const baseUrl = `${protocol}://${host}`;

    // Return redirect URL or direct checkout simulator endpoint
    return res.status(200).json({
      success: true,
      message: 'Payment session initiated.',
      gateway: provider,
      tran_id,
      amount,
      currency: 'BDT',
      redirectUrl: `${baseUrl}/payment-gateway?tran_id=${tran_id}&bookingId=${booking.id}&amount=${amount}`
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    return res.status(500).json({ success: false, message: 'Payment initiation failed.' });
  }
}

/**
 * Server-side payment verification callback (safe & idempotent)
 */
export function verifyPaymentCallback(req, res) {
  try {
    const { tran_id, bookingId, status } = req.body;

    const booking = dbStore.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record not found.' });
    }

    // Idempotent check
    if (booking.payment.status === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Payment already recorded as successful.',
        data: booking
      });
    }

    if (status === 'success') {
      booking.payment.status = 'paid';
      booking.payment.transactionId = tran_id || booking.payment.transactionId || 'TXN-' + Date.now();
      booking.payment.paidAt = new Date().toISOString();

      booking.timeline.push({
        status: 'payment_verified',
        timestamp: new Date().toISOString(),
        note: `Digital payment verified via ${booking.payment.method.toUpperCase()} (${booking.payment.transactionId})`
      });

      dbStore.addAuditLog({
        action: "PAYMENT_SUCCESS",
        performedBy: booking.customerEmail,
        targetId: booking.id,
        details: `Verified payment ৳${booking.pricing.totalAmount} via ${booking.payment.method} (${booking.payment.transactionId})`
      });

      // Notify customer
      dbStore.addNotification({
        userId: booking.customerId,
        title: "Payment Received",
        titleBn: "পেমেন্ট সফল হয়েছে",
        message: `Payment of ৳${booking.pricing.totalAmount} for ${booking.bookingNumber} confirmed.`,
        read: false,
        createdAt: new Date().toISOString()
      });

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully.',
        data: booking
      });
    } else {
      booking.payment.status = 'failed';
      return res.status(400).json({
        success: false,
        message: 'Payment was not successful or was cancelled.'
      });
    }
  } catch (error) {
    console.error('Error processing payment callback:', error);
    return res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
}
