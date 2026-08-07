import ApiError from '../utils/api-error.js';
import logger from '../utils/logger.js';
import { HttpStatus } from '../constants/http-status.js';

export const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = ApiError.notFound('Resource not found');
  }

  // Handle Mongoose duplicate key
  if (err.code === 11000) {
    error = ApiError.conflict('Duplicate field value entered');
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = ApiError.validation(message);
  }

  const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal Server Error';
  const errors = error.errors || [];

  logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode} ${message}`, {
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    errors
  }, req.id);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export default errorMiddleware;
