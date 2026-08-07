import ApiError from '../utils/api-error.js';

export const validateSessionIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!id || id.length !== 24) {
    return next(ApiError.badRequest('Invalid session ID format'));
  }
  next();
};

export default validateSessionIdParam;
