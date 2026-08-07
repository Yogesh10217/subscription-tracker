import aj from "../config/arcjet.js";
import ApiError from "../utils/api-error.js";
import logger from "../utils/logger.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
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
    logger.error('Arcjet Middleware Error', { error: error.message }, req.id);
    next(error);
  }
};

export default arcjetMiddleware;
