import express from 'express';
import cookieParser from 'cookie-parser';

import requestIdMiddleware from './middleware/request-id.middleware.js';
import securityHeadersMiddleware from './middleware/security-headers.middleware.js';
import arcjetMiddleware from './middleware/arcjet.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';
import ApiError from './utils/api-error.js';

import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import providerRouter from './routes/provider.routes.js';
import categoryRouter from './routes/category.routes.js';
import tagRouter from './routes/tag.routes.js';
import analyticsRouter from './routes/analytics.routes.js';
import notificationRouter from './notifications/routes/notification.routes.js';
import notificationPreferenceRouter from './notifications/routes/notification-preference.routes.js';
import workflowRouter from './routes/workflow.routes.js';
import metricsMiddleware from './observability/metrics.middleware.js';
import metricsRouter from './observability/metrics.routes.js';

const app = express();

// Security Headers & Core Middleware
app.use(securityHeadersMiddleware);
app.use(requestIdMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(metricsMiddleware);

// Arcjet Security Guard
app.use(arcjetMiddleware);

// Routes
app.use('/', healthRouter);
app.use('/', metricsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/providers', providerRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/tags', tagRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/notification-preferences', notificationPreferenceRouter);
app.use('/api/v1/workflows', workflowRouter);

// 404 Catch-All Middleware
app.use((req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
});

// Global Error Handler
app.use(errorMiddleware);

export default app;
