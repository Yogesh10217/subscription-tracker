import ApiError from '../utils/api-error.js';

export const validateResetPassword = (req, res, next) => {
  const { token, newPassword } = req.body;
  if (!token || typeof token !== 'string') {
    return next(ApiError.badRequest('Reset token is required'));
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    return next(ApiError.badRequest('New password must be at least 8 characters long'));
  }
  next();
};

export default validateResetPassword;
