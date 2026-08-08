# Analytics Performance Benchmarks Guide — SubPulse

## Latency Benchmark Targets
- **p50 Latency**: Target < 300ms
- **p95 Latency**: Target < 500ms
- **p99 Latency**: Target < 1,000ms

## Benchmark Testing Suite
Performance benchmarks are executed in `tests/performance/analytics.performance.test.js` against representative datasets (1,000 subscriptions, 1,000 timeline events).
