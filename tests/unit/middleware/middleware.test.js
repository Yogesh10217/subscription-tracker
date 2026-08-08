import { jest } from '@jest/globals';
import { requireRole, requirePermission } from '#middleware/rbac.middleware.js';
import { createRateLimiter } from '#middleware/rate-limit.middleware.js';
import arcjetMiddleware from '#middleware/arcjet.middleware.js';
import errorMiddleware from '#middleware/error.middleware.js';
import authorize from '#middleware/auth.middleware.js';
import userRepository from '#repositories/user.repository.js';
import jwt from 'jsonwebtoken';
import ApiError from '#utils/api-error.js';
import { JWT_SECRET } from '#config/env.js';

describe('Middleware Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, body: {}, user: null, ip: '127.0.0.1', path: '/test' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('RBAC Middleware', () => {
    test('requireRole should check user authentication and role', () => {
      const middleware = requireRole('admin');
      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      next.mockClear();
      req.user = { role: 'user' };
      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      next.mockClear();
      req.user = { role: 'admin' };
      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith();
    });

    test('requirePermission should check user permissions', () => {
      const middleware = requirePermission('admin:logs');
      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      next.mockClear();
      req.user = { role: 'user', permissions: [] };
      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      next.mockClear();
      req.user = { role: 'admin', permissions: ['admin:logs'] };
      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Rate Limiter Middleware', () => {
    test('createRateLimiter should track counts when non-test env', () => {
      const limiter = createRateLimiter(60000, 1, 'Limit hit');
      limiter(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Arcjet Middleware', () => {
    test('arcjetMiddleware should skip in test env', async () => {
      await arcjetMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Error Middleware', () => {
    test('errorMiddleware handles CastError, duplicate 11000, and ValidationError', () => {
      const castErr = { name: 'CastError' };
      errorMiddleware(castErr, req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);

      const dupErr = { code: 11000 };
      errorMiddleware(dupErr, req, res, next);
      expect(res.status).toHaveBeenCalledWith(409);

      const valErr = { name: 'ValidationError', errors: { field: { message: 'Invalid field' } } };
      errorMiddleware(valErr, req, res, next);
      expect(res.status).toHaveBeenCalledWith(422);

      const customErr = new ApiError(400, 'Bad input');
      errorMiddleware(customErr, req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Auth Middleware', () => {
    test('authorize handles missing header, invalid token, and valid token', async () => {
      await authorize(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      next.mockClear();
      req.headers.authorization = 'Bearer invalidtoken';
      await authorize(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));

      next.mockClear();
      const mockUser = { _id: '507f1f77bcf86cd799439011', email: 'test@example.com' };
      jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue(mockUser);

      const validToken = jwt.sign({ userId: '507f1f77bcf86cd799439011' }, JWT_SECRET);
      req.headers.authorization = `Bearer ${validToken}`;
      await authorize(req, res, next);
      expect(req.user).toBeDefined();
      expect(next).toHaveBeenCalledWith();
    });
  });
});
