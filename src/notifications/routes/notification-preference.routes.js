import { Router } from 'express';
import {
  getPreferences,
  updatePreferences
} from '../controllers/notification-preference.controller.js';
import validateUpdatePreferences from '../validators/notification-preference.validator.js';
import authMiddleware from '../../middleware/auth.middleware.js';

const notificationPreferenceRouter = Router();

notificationPreferenceRouter.use(authMiddleware);

notificationPreferenceRouter.get('/', getPreferences);
notificationPreferenceRouter.put('/', validateUpdatePreferences, updatePreferences);

export default notificationPreferenceRouter;
