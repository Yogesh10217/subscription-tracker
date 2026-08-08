import ApiError from '../utils/api-error.js';

export const validateImportPayload = (req, res, next) => {
  const { records } = req.body;
  if (!Array.isArray(records) || records.length === 0) {
    return next(ApiError.badRequest('Import payload must contain a non-empty records array'));
  }
  next();
};

export default validateImportPayload;
