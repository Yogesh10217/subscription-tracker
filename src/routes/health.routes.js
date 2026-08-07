import { Router } from 'express';
import mongoose from 'mongoose';
import { NODE_ENV } from '../config/env.js';

const healthRouter = Router();

// GET /health - Complete status check
healthRouter.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    database: {
      status: states[dbState] || 'unknown',
      connected: dbState === 1
    }
  });
});

// GET /ready - Readiness probe
healthRouter.get('/ready', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  if (dbConnected) {
    return res.status(200).json({ status: 'READY' });
  }
  return res.status(503).json({ status: 'NOT_READY', reason: 'Database not connected' });
});

// GET /live - Liveness probe
healthRouter.get('/live', (req, res) => {
  res.status(200).json({ status: 'ALIVE' });
});

export default healthRouter;
