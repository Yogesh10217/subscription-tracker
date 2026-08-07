import express from "express";

import { PORT } from './config/env.js';

import userRouter from "./routes/user.routes.js";  
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from "./Database/mongodb.js";
import errorMiddleware from "./Middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`🚀 Subscription-tracker running on http://localhost:${PORT}`);
  try {
    await connectToDatabase();
  } catch (err) {
    console.warn("⚠️ MongoDB connection warning (interactive demo mode ready):", err.message);
  }
});

export default app;