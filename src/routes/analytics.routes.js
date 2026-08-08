import { Router } from 'express';
import {
  getSummary,
  getSpending,
  getSubscriptions,
  getCategories,
  getProviders,
  getRenewals,
  getTrials,
  getTrends,
  getPriceChanges,
  getInsights
} from '../controllers/analytics.controller.js';
import validateAnalyticsQuery from '../validators/analytics.validator.js';
import authMiddleware from '../middleware/auth.middleware.js';

const analyticsRouter = Router();

analyticsRouter.use(authMiddleware);
analyticsRouter.use(validateAnalyticsQuery);

analyticsRouter.get('/summary', getSummary);
analyticsRouter.get('/spending', getSpending);
analyticsRouter.get('/subscriptions', getSubscriptions);
analyticsRouter.get('/categories', getCategories);
analyticsRouter.get('/providers', getProviders);
analyticsRouter.get('/renewals', getRenewals);
analyticsRouter.get('/trials', getTrials);
analyticsRouter.get('/trends', getTrends);
analyticsRouter.get('/price-changes', getPriceChanges);
analyticsRouter.get('/insights', getInsights);

export default analyticsRouter;
