import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { verifyAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Admin-only management routes
router.post('/', verifyAuth, requireRole(['admin']), createService);
router.put('/:id', verifyAuth, requireRole(['admin']), updateService);
router.delete('/:id', verifyAuth, requireRole(['admin']), deleteService);

export default router;
