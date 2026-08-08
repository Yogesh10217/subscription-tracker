import ApiError from '../utils/api-error.js';

export const validateProvider = (req, res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(ApiError.badRequest('Provider name must be at least 2 characters long'));
  }
  next();
};

export default validateProvider;
