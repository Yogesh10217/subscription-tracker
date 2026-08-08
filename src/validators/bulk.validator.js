import ApiError from '../utils/api-error.js';

export const validateBulkOperation = (req, res, next) => {
  const { action, ids } = req.body;
  if (!action || typeof action !== 'string') {
    return next(ApiError.badRequest('Bulk action is required'));
  }
  if (!Array.isArray(ids) || ids.length === 0) {
    return next(ApiError.badRequest('Must provide a non-empty array of subscription IDs'));
  }
  next();
};

export default validateBulkOperation;
