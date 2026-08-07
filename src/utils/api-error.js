import { HttpStatus } from '../constants/http-status.js';

export class ApiError extends Error {
  constructor(statusCode, message, errors = [], isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(HttpStatus.BAD_REQUEST, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(HttpStatus.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(HttpStatus.FORBIDDEN, message);
  }

  static notFound(message = 'Resource Not Found') {
    return new ApiError(HttpStatus.NOT_FOUND, message);
  }

  static conflict(message = 'Conflict') {
    return new ApiError(HttpStatus.CONFLICT, message);
  }

  static validation(message = 'Validation Error', errors = []) {
    return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message, errors);
  }

  static internal(message = 'Internal Server Error') {
    return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message, [], false);
  }
}

export default ApiError;
