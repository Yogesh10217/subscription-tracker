# SubPulse Observability & Telemetry Architecture

## Overview
SubPulse implements a production-grade observability stack featuring **structured JSON logging**, **distributed request tracing**, and **Prometheus-compatible system metrics**.

---

## 1. Structured Logging (`src/utils/logger.js`)
Powered by `pino` with Node.js `AsyncLocalStorage` context propagation.

### Features
- **JSON Format**: High-performance zero-cost serialization
- **Context Injection**: Automatically logs `requestId`, `correlationId`, `userId`, `method`, `path` without explicit parameter passing
- **Sensitive Field Redaction**: Redacts `password`, `token`, `secret`, `authorization`, `cookie`, `jwt`, `refreshToken`, `signingKey`, `apiKey`
- **LogLevel Thresholds**: Configurable via `LOG_LEVEL` (`debug`, `info`, `warn`, `error`)

### Example Log Entry
```json
{
  "level": "INFO",
  "time": "2026-08-12T15:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "path": "/api/v1/subscriptions",
  "message": "Subscription created successfully",
  "subscriptionId": "60d5ecb8b3b3b3b3b3b3b3b3"
}
```

---

## 2. Request & Correlation Context (`src/middleware/request-context.middleware.js`)
Every incoming HTTP request is assigned a unique `X-Request-ID` and `X-Correlation-ID`.
- Incoming `X-Request-ID` is validated against alphanumeric/UUID patterns; generated if missing
- Headers `X-Request-ID` and `X-Correlation-ID` are returned on every HTTP response
- `AsyncLocalStorage.run()` wraps the request execution tree

---

## 3. Metrics & `/metrics` Endpoint (`src/observability/`)
Lightweight, zero-dependency in-process metrics collector supporting Counters, Histograms, and Process Gauges.

### Tracked Metrics
| Metric Name | Type | Description |
|:---|:---|:---|
| `http_requests_total` | Counter | Total HTTP requests (labels: `method`, `route`, `status_code`) |
| `http_request_duration_seconds` | Histogram | HTTP request duration in seconds (labels: `method`, `route`) |
| `auth_login_total` | Counter | Total login attempts |
| `auth_login_failure_total` | Counter | Failed login attempts |
| `auth_lockout_total` | Counter | Account lockouts |
| `notification_claimed_total` | Counter | Worker notification claims |
| `notification_cas_conflict_total` | Counter | Worker CAS conflicts |
| `notification_stale_recovered_total` | Counter | Recovered stale PROCESSING notifications |
| `process_uptime_seconds` | Gauge | Process uptime in seconds |
| `process_heap_used_bytes` | Gauge | Heap memory used |

### Accessing Metrics
`GET /metrics` returns text in Prometheus format:
```bash
curl http://localhost:5500/metrics
```
