import { Router } from 'express';
import { recommendService } from '../controllers/aiController.js';

const router = Router();

router.post('/recommend', recommendService);

export default router;
