import aj from '../config/arcjet.js';
import ApiError from '../utils/api-error.js';
import logger from '../utils/logger.js';
import { NODE_ENV } from '../config/env.js';

const arcjetMiddleware = async (req, res, next) => {
  if (NODE_ENV === 'test') {
    return next();
  }

  try {
    if (!req.headers['user-agent']) {
      req.headers['user-agent'] = 'SubPulseApp/1.0';
    }

    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return next(new ApiError(429, 'Rate limit exceeded'));
      }
      if (decision.reason.isBot()) {
        return next(ApiError.forbidden('Bot detected'));
      }
      return next(ApiError.forbidden('Access denied'));
    }
    next();
  } catch (error) {
    logger.warn('Arcjet Security Pass', { error: error.message }, req.id);
    next();
  }
};

export default arcjetMiddleware;
