import { httpRequestsTotal, httpRequestDuration } from '../../src/observability/metrics.js';
import { logger } from '../../src/utils/logger.js';

describe('Observability Performance Benchmark Tests', () => {
  it('should process 1,000 structured logger operations in under 500ms', () => {
    const start = Date.now();

    for (let i = 0; i < 1000; i++) {
      logger.info('Benchmark log entry', { index: i, tag: 'perf' });
    }

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(500);
  });

  it('should process 10,000 metric recordings in under 200ms', () => {
    const start = Date.now();

    for (let i = 0; i < 10000; i++) {
      httpRequestsTotal.inc({ method: 'GET', route: '/api/v1/subscriptions', status_code: '200' });
      httpRequestDuration.observe(0.015, { method: 'GET', route: '/api/v1/subscriptions' });
    }

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(200);
  });
});
