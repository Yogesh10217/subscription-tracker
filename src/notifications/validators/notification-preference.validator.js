import ApiError from '../../utils/api-error.js';

export const validateUpdatePreferences = (req, res, next) => {
  const { emailEnabled, inAppEnabled, renewalReminders, quietHoursStart, quietHoursEnd } = req.body;

  if (emailEnabled !== undefined && typeof emailEnabled !== 'boolean') {
    return next(ApiError.badRequest('emailEnabled must be a boolean'));
  }
  if (inAppEnabled !== undefined && typeof inAppEnabled !== 'boolean') {
    return next(ApiError.badRequest('inAppEnabled must be a boolean'));
  }
  if (renewalReminders !== undefined && typeof renewalReminders !== 'boolean') {
    return next(ApiError.badRequest('renewalReminders must be a boolean'));
  }
  if (quietHoursStart && !/^\d{2}:\d{2}$/.test(quietHoursStart)) {
    return next(ApiError.badRequest('quietHoursStart must be in HH:MM format'));
  }
  if (quietHoursEnd && !/^\d{2}:\d{2}$/.test(quietHoursEnd)) {
    return next(ApiError.badRequest('quietHoursEnd must be in HH:MM format'));
  }

  next();
};

export default validateUpdatePreferences;
