import ApiError from '../utils/api-error.js';

export const validateTag = (req, res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return next(ApiError.badRequest('Tag name is required'));
  }
  next();
};

export default validateTag;
