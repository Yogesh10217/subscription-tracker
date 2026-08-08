import ApiError from '../utils/api-error.js';

export const validateReminderRule = (req, res, next) => {
  const { ruleType, daysBefore } = req.body;
  if (!ruleType && daysBefore === undefined) {
    return next(ApiError.badRequest('Must specify ruleType or daysBefore'));
  }
  next();
};

export default validateReminderRule;
