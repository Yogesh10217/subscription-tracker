import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  getSubscriptionDetails,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals
} from '../controllers/subscription.controller.js';
import { validateCreateSubscription } from '../validators/subscription.validator.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions);
subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);
subscriptionRouter.get('/user/:id', authMiddleware, getUserSubscriptions);
subscriptionRouter.get('/:id', getSubscriptionDetails);
subscriptionRouter.post('/', authMiddleware, validateCreateSubscription, createSubscription);
subscriptionRouter.put('/:id/cancel', authMiddleware, cancelSubscription);
subscriptionRouter.put('/:id', authMiddleware, updateSubscription);
subscriptionRouter.delete('/:id', authMiddleware, deleteSubscription);

export default subscriptionRouter;
