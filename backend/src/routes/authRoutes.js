import { Router } from 'express';
import { register, login, demoLogin, getCurrentUser, updateProfile } from '../controllers/authController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo/:role', demoLogin);
router.get('/me', verifyAuth, getCurrentUser);
router.put('/profile', verifyAuth, updateProfile);

export default router;
