import { jest } from '@jest/globals';
import { validateUserIdParam } from '#validators/user.validator.js';

describe('UserValidator Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {} };
    res = {};
    next = jest.fn();
  });

  test('validateUserIdParam should reject invalid MongoDB ObjectId string length', () => {
    req.params.id = '123';
    validateUserIdParam(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.anything());
  });

  test('validateUserIdParam should pass valid 24 hex char ID', () => {
    req.params.id = '507f1f77bcf86cd799439011';
    validateUserIdParam(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});
