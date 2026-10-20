import { Router } from 'express';
import { dbStore } from '../config/db.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyAuth, (req, res) => {
  const notifs = dbStore.getNotifications(req.user.id);
  res.json({ success: true, count: notifs.length, data: notifs });
});

router.post('/mark-read', verifyAuth, (req, res) => {
  dbStore.markNotificationsRead(req.user.id);
  res.json({ success: true, message: 'All notifications marked as read.' });
});

export default router;
