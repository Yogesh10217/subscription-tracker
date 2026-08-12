import {
  Counter,
  Histogram,
  MetricsRegistry,
  metricsRegistry
} from '../../../src/observability/metrics.js';

describe('Metrics Collector Unit Tests', () => {
  beforeEach(() => {
    metricsRegistry.reset();
  });

  it('Counter should increment and output Prometheus text format', () => {
    const counter = new Counter('test_counter_total', 'A test counter');
    counter.inc({ method: 'GET', status: '200' }, 1);
    counter.inc({ method: 'GET', status: '200' }, 2);

    expect(counter.get({ method: 'GET', status: '200' })).toBe(3);

    const promOutput = counter.toPrometheus();
    expect(promOutput).toContain('# HELP test_counter_total A test counter');
    expect(promOutput).toContain('# TYPE test_counter_total counter');
    expect(promOutput).toContain('test_counter_total{method="GET",status="200"} 3');
  });

  it('Histogram should observe values and generate buckets', () => {
    const histogram = new Histogram('test_duration_seconds', 'A test histogram', [0.1, 0.5, 1.0]);
    histogram.observe(0.05, { route: '/health' });
    histogram.observe(0.3, { route: '/health' });

    const promOutput = histogram.toPrometheus();
    expect(promOutput).toContain('# HELP test_duration_seconds A test histogram');
    expect(promOutput).toContain('# TYPE test_duration_seconds histogram');
    expect(promOutput).toContain('test_duration_seconds_bucket{route="/health",le="0.1"} 1');
    expect(promOutput).toContain('test_duration_seconds_bucket{route="/health",le="0.5"} 2');
    expect(promOutput).toContain('test_duration_seconds_count{route="/health"} 2');
  });

  it('MetricsRegistry should collect and export all pre-registered metrics', () => {
    const output = metricsRegistry.toPrometheus();
    expect(output).toContain('process_uptime_seconds');
    expect(output).toContain('process_heap_used_bytes');
  });
});
