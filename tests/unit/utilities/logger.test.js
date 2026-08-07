import { jest } from '@jest/globals';
import logger from '#utils/logger.js';
import ApiError from '#utils/api-error.js';
import asyncHandler from '#utils/async-handler.js';

describe('Utility Unit Tests', () => {
  test('logger should format and output logs without throwing', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('Test log message', { key: 'val' }, 'req-123');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('ApiError badRequest should construct 400 error', () => {
    const err = ApiError.badRequest('Invalid payload');
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Invalid payload');
    expect(err.success).toBe(false);
  });

  test('asyncHandler should catch rejected promises and call next', async () => {
    const nextMock = jest.fn();
    const handler = asyncHandler(async () => {
      throw new Error('Async failure');
    });

    await handler({}, {}, nextMock);
    expect(nextMock).toHaveBeenCalledWith(expect.any(Error));
  });
});
