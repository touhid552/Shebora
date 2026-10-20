import { Router } from 'express';
import {
  getAdminStats,
  getAllProviders,
  updateProviderApproval,
  getAllUsers,
  updateUserRole,
  getAllComplaints,
  resolveComplaint,
  getAuditLogs
} from '../controllers/adminController.js';
import { dbStore } from '../config/db.js';
import { verifyAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// All admin routes strictly protected
router.use(verifyAuth, requireRole(['admin']));

router.get('/stats', getAdminStats);
router.get('/providers', getAllProviders);
router.patch('/providers/:id/approval', updateProviderApproval);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/complaints', getAllComplaints);
router.patch('/complaints/:id/resolve', resolveComplaint);
router.get('/audit-logs', getAuditLogs);
router.get('/bookings', (req, res) => {
  const { status } = req.query;
  let bookings = dbStore.getBookings();
  if (status && status !== 'all') {
    bookings = bookings.filter(b => b.status === status);
  }
  res.json({ success: true, count: bookings.length, data: bookings });
});

export default router;
