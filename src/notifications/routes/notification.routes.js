import { Router } from 'express';
import {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  processWorkerJob
} from '../controllers/notification.controller.js';
import {
  validateNotificationIdParam,
  validateWorkerPayload
} from '../validators/notification.validator.js';
import authMiddleware from '../../middleware/auth.middleware.js';

const notificationRouter = Router();

// Worker endpoint (QStash signature verified in controller)
notificationRouter.post('/worker', validateWorkerPayload, processWorkerJob);

// Authenticated user endpoints
notificationRouter.use(authMiddleware);

notificationRouter.get('/', getNotifications);
notificationRouter.get('/unread', getUnreadNotifications);
notificationRouter.get('/unread/count', getUnreadCount);
notificationRouter.patch('/read-all', markAllNotificationsRead);
notificationRouter.patch('/:id/read', validateNotificationIdParam, markNotificationRead);
notificationRouter.delete('/:id', validateNotificationIdParam, deleteNotification);

export default notificationRouter;
