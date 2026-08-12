/**
 * @file request-context.middleware.js
 * @module middleware/request-context
 * @description Express middleware wrapping each request in AsyncLocalStorage for
 * automatic requestId / correlationId propagation throughout the call stack.
 */

import { randomUUID } from 'node:crypto';
import { requestContext } from '../utils/logger.js';

// Validate incoming request ID: alphanumeric, hyphens, underscores, max 128 chars
const VALID_REQUEST_ID = /^[a-zA-Z0-9_-]{1,128}$/;

/**
 * Express middleware that establishes AsyncLocalStorage context for each request.
 * - Validates and re-uses incoming X-Request-ID or generates a new UUID v4
 * - Stores { requestId, correlationId, method, path } in context
 * - Sets req.id for backward compatibility
 * - Sets X-Request-ID response header
 */
export const requestContextMiddleware = (req, res, next) => {
  const incomingId = req.headers['x-request-id'];
  const requestId = incomingId && VALID_REQUEST_ID.test(incomingId) ? incomingId : randomUUID();

  const correlationId = req.headers['x-correlation-id'] || requestId;

  // Backward compatibility
  req.id = requestId;

  // Set response headers
  res.setHeader('x-request-id', requestId);
  res.setHeader('x-correlation-id', correlationId);

  // Run the rest of the middleware chain inside AsyncLocalStorage context
  const context = {
    requestId,
    correlationId,
    method: req.method,
    path: req.originalUrl || req.url
  };

  requestContext.run(context, () => {
    next();
  });
};

/**
 * Adds authenticated userId to the current request context.
 * Call this after authentication middleware establishes identity.
 * @param {string} userId
 */
export function setContextUserId(userId) {
  const store = requestContext.getStore();
  if (store && userId) {
    store.userId = userId.toString();
  }
}

export default requestContextMiddleware;
