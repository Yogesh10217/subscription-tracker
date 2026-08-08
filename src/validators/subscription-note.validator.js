import ApiError from '../utils/api-error.js';

export const validateSubscriptionNote = (req, res, next) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return next(ApiError.badRequest('Note text is required'));
  }
  next();
};

export default validateSubscriptionNote;
