import ApiError from '../utils/api-error.js';

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return next(ApiError.badRequest('Valid email address is required'));
  }
  next();
};

export default validateForgotPassword;
