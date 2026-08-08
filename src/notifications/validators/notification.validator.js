import mongoose from 'mongoose';
import ApiError from '../../utils/api-error.js';

export const validateNotificationIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(ApiError.badRequest('Invalid notification ID format'));
  }
  next();
};

export const validateWorkerPayload = (req, res, next) => {
  const { notificationId } = req.body || {};
  if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
    return next(ApiError.badRequest('Worker payload requires valid notificationId'));
  }
  next();
};

export default { validateNotificationIdParam, validateWorkerPayload };
