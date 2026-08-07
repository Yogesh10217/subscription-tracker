import { NODE_ENV } from '../config/env.js';

// In-memory rate limiting map for auth endpoints
const rateLimitMap = new Map();

/**
 * Endpoint-specific rate limiter middleware.
 * @param {number} windowMs - Window duration in milliseconds
 * @param {number} max - Maximum requests per window
 * @param {string} message - Error message on limit exceeded
 */
export const createRateLimiter = (windowMs = 60000, max = 10, message = 'Too many requests') => {
  return (req, res, next) => {
    if (NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const key = `${req.path}:${ip}`;
    const now = Date.now();

    const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    rateLimitMap.set(key, record);

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      });
    }

    next();
  };
};

export const authRateLimiter = createRateLimiter(
  60000,
  5,
  'Too many login/auth attempts. Please wait 1 minute.'
);
export const passwordResetRateLimiter = createRateLimiter(
  300000,
  3,
  'Too many password reset attempts. Please wait 5 minutes.'
);

export default authRateLimiter;
