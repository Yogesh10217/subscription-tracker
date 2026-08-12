import { logger, requestContext, getRequestContext } from '../../../src/utils/logger.js';

describe('Structured Logger Unit Tests', () => {
  it('should preserve logger API methods (info, warn, error, debug)', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.child).toBe('function');
  });

  it('should log messages without throwing errors', () => {
    expect(() => {
      logger.info('Test info message', { key: 'value' });
      logger.warn('Test warn message');
      logger.error('Test error message', new Error('Test error'));
      logger.debug('Test debug message');
    }).not.toThrow();
  });

  it('should support child logger creation', () => {
    const childLogger = logger.child({ component: 'TestComponent' });
    expect(typeof childLogger.info).toBe('function');
    expect(() => {
      childLogger.info('Child log message');
    }).not.toThrow();
  });

  it('should return context from AsyncLocalStorage', (done) => {
    const contextData = { requestId: 'req-12345', correlationId: 'corr-67890' };

    requestContext.run(contextData, () => {
      const currentCtx = getRequestContext();
      expect(currentCtx.requestId).toBe('req-12345');
      expect(currentCtx.correlationId).toBe('corr-67890');
      done();
    });
  });
});
