import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import getNotificationController from '../controllers/notification/getNotifications.controller';
import markNotificationReadController from '../controllers/notification/markNotificationRead.controller';
import markNotificationsReadController from '../controllers/notification/markNotificationsRead.controller';

const router: Router = Router();

router.get('/', authMiddleware, getNotificationController);
router.patch('/:notificationId/read', authMiddleware, markNotificationReadController);
router.patch('/read-all', authMiddleware, markNotificationsReadController);

export default router;