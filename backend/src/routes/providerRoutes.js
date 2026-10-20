import { Router } from 'express';
import {
  getApprovedProviders,
  getProviderById,
  getMyProviderProfile,
  getProviderJobs,
  updateJobStatus,
  updateProviderSettings
} from '../controllers/providerController.js';
import { verifyAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Public / Customer facing
router.get('/', getApprovedProviders);
router.get('/profile/:id', getProviderById);

// Provider authenticated routes
router.get('/me', verifyAuth, requireRole(['provider']), getMyProviderProfile);
router.get('/jobs', verifyAuth, requireRole(['provider']), getProviderJobs);
router.patch('/jobs/:bookingId/status', verifyAuth, requireRole(['provider']), updateJobStatus);
router.put('/settings', verifyAuth, requireRole(['provider']), updateProviderSettings);

export default router;
