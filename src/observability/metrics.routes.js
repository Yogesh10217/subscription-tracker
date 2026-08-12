/**
 * @file metrics.routes.js
 * @description Prometheus-compatible metrics endpoint.
 */
import { Router } from 'express';
import { metricsRegistry } from './metrics.js';

const metricsRouter = Router();

metricsRouter.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.send(metricsRegistry.toPrometheus());
});

export default metricsRouter;
