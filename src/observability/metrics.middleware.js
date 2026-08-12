/**
 * @file metrics.middleware.js
 * @description Express middleware for recording HTTP request metrics.
 */
import { httpRequestsTotal, httpRequestDuration } from './metrics.js';

function normalizeRoute(url) {
  return url
    .replace(/\/[0-9a-fA-F]{24}/g, '/:id')
    .replace(
      /\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g,
      '/:uuid'
    )
    .split('?')[0];
}

export const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationNs = Number(process.hrtime.bigint() - start);
    const durationSec = durationNs / 1e9;
    const route = normalizeRoute(req.originalUrl || req.url);
    const method = req.method;
    const statusCode = res.statusCode.toString();

    httpRequestsTotal.inc({ method, route, status_code: statusCode });
    httpRequestDuration.observe(durationSec, { method, route });
  });

  next();
};

export default metricsMiddleware;
