/**
 * @file api-error.js
 * @module utils/api-error
 * @description Custom operational error hierarchy for standardized API error responses.
 * @dependencies constants/http-status
 */

import { HttpStatus } from '../constants/http-status.js';

export class ApiError extends Error {
  /**
   * Constructs an instance of ApiError.
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error description
   * @param {Array} [errors=[]] - Detailed field validation errors
   * @param {boolean} [isOperational=true] - Flag indicating operational vs programming error
   * @param {string} [stack=''] - Stack trace
   */
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

  /**
   * Creates a 400 Bad Request error.
   * @param {string} [message='Bad Request']
   * @param {Array} [errors=[]]
   * @returns {ApiError}
   */
  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(HttpStatus.BAD_REQUEST, message, errors);
  }

  /**
   * Creates a 401 Unauthorized error.
   * @param {string} [message='Unauthorized']
   * @returns {ApiError}
   */
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(HttpStatus.UNAUTHORIZED, message);
  }

  /**
   * Creates a 403 Forbidden error.
   * @param {string} [message='Forbidden']
   * @returns {ApiError}
   */
  static forbidden(message = 'Forbidden') {
    return new ApiError(HttpStatus.FORBIDDEN, message);
  }

  /**
   * Creates a 404 Not Found error.
   * @param {string} [message='Resource Not Found']
   * @returns {ApiError}
   */
  static notFound(message = 'Resource Not Found') {
    return new ApiError(HttpStatus.NOT_FOUND, message);
  }

  /**
   * Creates a 409 Conflict error.
   * @param {string} [message='Conflict']
   * @returns {ApiError}
   */
  static conflict(message = 'Conflict') {
    return new ApiError(HttpStatus.CONFLICT, message);
  }

  /**
   * Creates a 422 Validation Error.
   * @param {string} [message='Validation Error']
   * @param {Array} [errors=[]]
   * @returns {ApiError}
   */
  static validation(message = 'Validation Error', errors = []) {
    return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message, errors);
  }

  /**
   * Creates a 500 Internal Server Error.
   * @param {string} [message='Internal Server Error']
   * @returns {ApiError}
   */
  static internal(message = 'Internal Server Error') {
    return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message, [], false);
  }
}

export default ApiError;
