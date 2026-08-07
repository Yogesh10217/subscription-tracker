import { HttpStatus } from '../constants/http-status.js';

export class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  static success(res, data, message = 'Operation successful', statusCode = HttpStatus.OK) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }

  static created(res, data, message = 'Resource created successfully') {
    return res.status(HttpStatus.CREATED).json(new ApiResponse(HttpStatus.CREATED, data, message));
  }

  static error(res, message = 'An error occurred', statusCode = HttpStatus.BAD_REQUEST, errors = []) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors
    });
  }
}

export default ApiResponse;
