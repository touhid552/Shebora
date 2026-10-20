import { Router } from 'express';
import {
  createBooking,
  getCustomerBookings,
  getBookingDetails,
  cancelBooking,
  createReview,
  createComplaint
} from '../controllers/bookingController.js';
import { verifyAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Customer booking routes
router.post('/', verifyAuth, requireRole(['customer', 'admin']), createBooking);
router.get('/my-bookings', verifyAuth, getCustomerBookings);
router.get('/:id', verifyAuth, getBookingDetails);
router.patch('/:id/cancel', verifyAuth, cancelBooking);

// Review & Complaint routes
router.post('/review', verifyAuth, createReview);
router.post('/complaint', verifyAuth, createComplaint);

export default router;
