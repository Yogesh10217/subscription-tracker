# SubPulse Health Probes & Container Readiness

## Probe Overview

SubPulse implements Kubernetes / ECS-style probe separation across three endpoints in `src/routes/health.routes.js`.

---

## 1. Liveness Probe (`GET /live`)
- **Purpose**: Verifies that the Node.js process is alive and responding to HTTP requests.
- **HTTP Status**: Always `200 OK`.
- **Use Case**: Container orchestrator liveness checks (restart container if dead).

```json
{
  "status": "ALIVE",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 2. Readiness Probe (`GET /ready`)
- **Purpose**: Verifies that all required infrastructure dependencies (MongoDB connection) are available to serve traffic.
- **HTTP Status**:
  - `200 OK`: Database connected (`readyState === 1`)
  - `503 Service Unavailable`: Database disconnected
- **Use Case**: Load balancer / ingress router traffic routing decisions.
- **Docker Integration**: Used by Dockerfile `HEALTHCHECK` and `docker-compose.yml`.

```json
{
  "status": "READY",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 3. Operational Health Summary (`GET /health`)
- **Purpose**: Comprehensive status summary for monitoring dashboards.
- **HTTP Status**:
  - `200 OK`: Database connected (`status: "UP"`)
  - `503 Service Unavailable`: Database disconnected (`status: "DEGRADED"`)

```json
{
  "status": "UP",
  "timestamp": "2026-08-12T15:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "version": "1.0.0",
  "uptime": 124.5,
  "environment": "production",
  "database": {
    "status": "connected",
    "connected": true
  }
}
```
