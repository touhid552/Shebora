import { Router } from 'express';
import { initiatePayment, verifyPaymentCallback } from '../controllers/paymentController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

router.post('/initiate', verifyAuth, initiatePayment);
router.post('/verify', verifyAuth, verifyPaymentCallback);

export default router;
