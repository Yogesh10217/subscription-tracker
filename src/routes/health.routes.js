import { Router } from 'express';
import mongoose from 'mongoose';
import { NODE_ENV } from '../config/env.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

const healthRouter = Router();

// GET /health - Lightweight operational status summary
healthRouter.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const dbConnected = dbState === 1;

  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    requestId: req.id || null,
    version,
    uptime: process.uptime(),
    environment: NODE_ENV,
    database: {
      status: states[dbState] || 'unknown',
      connected: dbConnected
    }
  });
});

// GET /ready - Readiness probe (required dependencies available)
healthRouter.get('/ready', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  if (dbConnected) {
    return res.status(200).json({
      status: 'READY',
      requestId: req.id || null
    });
  }
  return res.status(503).json({
    status: 'NOT_READY',
    reason: 'Database not connected',
    requestId: req.id || null
  });
});

// GET /live - Liveness probe (process is alive)
healthRouter.get('/live', (req, res) => {
  res.status(200).json({
    status: 'ALIVE',
    requestId: req.id || null
  });
});

export default healthRouter;
