import ApiError from '../utils/api-error.js';

export const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || typeof currentPassword !== 'string') {
    return next(ApiError.badRequest('Current password is required'));
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    return next(ApiError.badRequest('New password must be at least 8 characters long'));
  }
  next();
};

export default validateChangePassword;
