import ApiError from '../utils/api-error.js';

export const validateFileAsset = (req, res, next) => {
  const { fileName, originalName, mimeType, fileSize, storageKey } = req.body;
  if (!fileName || !originalName || !mimeType || !fileSize || !storageKey) {
    return next(ApiError.badRequest('Missing required file asset metadata parameters'));
  }
  next();
};

export default validateFileAsset;
