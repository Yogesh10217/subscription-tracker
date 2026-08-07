import ApiError from '../utils/api-error.js';

export const validateUserIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!id || id.length !== 24) {
    return next(ApiError.badRequest('Invalid User ID format'));
  }
  next();
};
