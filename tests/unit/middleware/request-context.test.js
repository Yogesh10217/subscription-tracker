import {
  requestContextMiddleware,
  setContextUserId
} from '../../../src/middleware/request-context.middleware.js';
import { getRequestContext } from '../../../src/utils/logger.js';

describe('Request Context Middleware Unit Tests', () => {
  it('should generate requestId and set response headers when x-request-id is missing', (done) => {
    const req = {
      headers: {},
      method: 'GET',
      originalUrl: '/api/v1/test'
    };
    const setHeaderMap = {};
    const res = {
      setHeader: (key, val) => {
        setHeaderMap[key] = val;
      }
    };

    requestContextMiddleware(req, res, () => {
      expect(req.id).toBeDefined();
      expect(typeof req.id).toBe('string');
      expect(setHeaderMap['x-request-id']).toBe(req.id);
      expect(setHeaderMap['x-correlation-id']).toBe(req.id);

      const ctx = getRequestContext();
      expect(ctx.requestId).toBe(req.id);
      expect(ctx.method).toBe('GET');
      expect(ctx.path).toBe('/api/v1/test');
      done();
    });
  });

  it('should reuse valid incoming x-request-id header', (done) => {
    const customId = 'custom-uuid-1234567890';
    const req = {
      headers: { 'x-request-id': customId },
      method: 'POST',
      originalUrl: '/api/v1/subscriptions'
    };
    const setHeaderMap = {};
    const res = {
      setHeader: (key, val) => {
        setHeaderMap[key] = val;
      }
    };

    requestContextMiddleware(req, res, () => {
      expect(req.id).toBe(customId);
      expect(setHeaderMap['x-request-id']).toBe(customId);

      const ctx = getRequestContext();
      expect(ctx.requestId).toBe(customId);
      done();
    });
  });

  it('should update context with userId when setContextUserId is called', (done) => {
    const req = { headers: {}, method: 'GET', url: '/test' };
    const res = { setHeader: () => {} };

    requestContextMiddleware(req, res, () => {
      setContextUserId('user-id-999');
      const ctx = getRequestContext();
      expect(ctx.userId).toBe('user-id-999');
      done();
    });
  });
});
