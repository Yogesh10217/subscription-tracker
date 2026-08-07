import { jest } from '@jest/globals';
import { validateSignUp, validateSignIn } from '#validators/auth.validator.js';

describe('AuthValidator Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
  });

  test('validateSignUp should call next with error when payload is invalid', () => {
    req.body = { email: 'invalid-email', password: '123' };
    validateSignUp(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.anything());
  });

  test('validateSignUp should call next with no args when payload is valid', () => {
    req.body = { name: 'John Doe', email: 'john@example.com', password: 'Password123!' };
    validateSignUp(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateSignIn should validate email and password presence', () => {
    req.body = { email: 'john@example.com' };
    validateSignIn(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.anything());
  });
});
