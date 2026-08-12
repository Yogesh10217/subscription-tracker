/**
 * @file logger.js
 * @module utils/logger
 * @description Production structured JSON logger with AsyncLocalStorage context propagation.
 * Preserves existing API: logger.info(), .warn(), .error(), .debug()
 */

import pino from 'pino';
import { AsyncLocalStorage } from 'node:async_hooks';

// ── AsyncLocalStorage for request context ──
export const requestContext = new AsyncLocalStorage();

/**
 * Returns the current request context from AsyncLocalStorage.
 * @returns {{ requestId?: string, correlationId?: string, userId?: string, method?: string, path?: string } | {}}
 */
export function getRequestContext() {
  return requestContext.getStore() || {};
}

// ── Sensitive field redaction ──
const REDACTED_PATHS = [
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'jwt',
  'refreshToken',
  'signingKey',
  'apiKey',
  'QSTASH_TOKEN',
  'QSTASH_CURRENT_SIGNING_KEY',
  'QSTASH_NEXT_SIGNING_KEY',
  'JWT_SECRET',
  'EMAIL_PASSWORD',
  'accessToken',
  'req.headers.authorization',
  'req.headers.cookie'
];

// ── Logger configuration ──
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_TEST = process.env.NODE_ENV === 'test';

const pinoOptions = {
  level: LOG_LEVEL,
  redact: {
    paths: REDACTED_PATHS,
    censor: '[REDACTED]'
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(IS_TEST ? { level: 'error' } : {}),
  ...(!IS_PRODUCTION && !IS_TEST
    ? {
        transport: {
          target: 'pino/file',
          options: { destination: 1 }
        },
        formatters: {
          level(label) {
            return { level: label.toUpperCase() };
          }
        }
      }
    : {
        formatters: {
          level(label) {
            return { level: label.toUpperCase() };
          }
        }
      })
};

const pinoLogger = pino(pinoOptions);

/**
 * Merges AsyncLocalStorage context into log metadata.
 * @param {Object} meta - Additional metadata
 * @returns {Object} Merged metadata with context
 */
function withContext(meta = {}) {
  const ctx = getRequestContext();
  const merged = {};
  if (ctx.requestId) merged.requestId = ctx.requestId;
  if (ctx.correlationId) merged.correlationId = ctx.correlationId;
  if (ctx.userId) merged.userId = ctx.userId;
  if (ctx.method) merged.method = ctx.method;
  if (ctx.path) merged.path = ctx.path;

  if (typeof meta === 'object' && meta !== null && !(meta instanceof Error)) {
    Object.assign(merged, meta);
  } else if (meta instanceof Error) {
    merged.err = { message: meta.message, stack: meta.stack, code: meta.code };
  }

  return merged;
}

/**
 * Structured logger preserving existing API.
 * Supports: logger.info(message, meta?, requestId?)
 * The requestId parameter is kept for backward compatibility but
 * AsyncLocalStorage context is preferred.
 */
export const logger = {
  info(message, meta = {}, requestId = null) {
    const ctx = withContext(meta);
    if (requestId && !ctx.requestId) ctx.requestId = requestId;
    pinoLogger.info(ctx, message);
  },

  warn(message, meta = {}, requestId = null) {
    const ctx = withContext(meta);
    if (requestId && !ctx.requestId) ctx.requestId = requestId;
    pinoLogger.warn(ctx, message);
  },

  error(message, meta = {}, requestId = null) {
    const ctx = withContext(meta);
    if (requestId && !ctx.requestId) ctx.requestId = requestId;
    pinoLogger.error(ctx, message);
  },

  debug(message, meta = {}, requestId = null) {
    const ctx = withContext(meta);
    if (requestId && !ctx.requestId) ctx.requestId = requestId;
    pinoLogger.debug(ctx, message);
  },

  /**
   * Creates a child logger with component context.
   * @param {{ component: string }} bindings
   * @returns {Object} Child logger with same API
   */
  child(bindings = {}) {
    const childPino = pinoLogger.child(bindings);
    return {
      info(message, meta = {}, requestId = null) {
        const ctx = withContext(meta);
        if (requestId && !ctx.requestId) ctx.requestId = requestId;
        childPino.info(ctx, message);
      },
      warn(message, meta = {}, requestId = null) {
        const ctx = withContext(meta);
        if (requestId && !ctx.requestId) ctx.requestId = requestId;
        childPino.warn(ctx, message);
      },
      error(message, meta = {}, requestId = null) {
        const ctx = withContext(meta);
        if (requestId && !ctx.requestId) ctx.requestId = requestId;
        childPino.error(ctx, message);
      },
      debug(message, meta = {}, requestId = null) {
        const ctx = withContext(meta);
        if (requestId && !ctx.requestId) ctx.requestId = requestId;
        childPino.debug(ctx, message);
      }
    };
  }
};

export default logger;
