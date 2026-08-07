import ApiError from '../utils/api-error.js';

export const validateVerifyEmail = (req, res, next) => {
  const token = req.body.token || req.query.token;
  if (!token || typeof token !== 'string') {
    return next(ApiError.badRequest('Verification token is required'));
  }
  next();
};

export default validateVerifyEmail;
