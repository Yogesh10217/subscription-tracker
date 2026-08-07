import express from 'express';
import cookieParser from 'cookie-parser';

import requestIdMiddleware from './middleware/request-id.middleware.js';
import arcjetMiddleware from './middleware/arcjet.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';

import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

// Core Middleware
app.use(requestIdMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

// Arcjet Security Guard
app.use(arcjetMiddleware);

// Routes
app.use('/', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

// Global Error Handler
app.use(errorMiddleware);

export default app;
