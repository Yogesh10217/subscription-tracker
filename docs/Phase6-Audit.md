# Phase 6 — Full Repository Audit

**Date:** 2026-08-12
**Auditor Role:** Senior Staff Platform Engineer / SRE
**Audit Method:** 4 parallel automated audit tracks covering every `src/`, `tests/`, `docs/`, Docker, CI/CD, and environment file.

---

## 1. QStash Architecture Finding

### Answer: QStash is Upstash Cloud (NOT a local server)

The project uses the `@upstash/workflow` npm package (version `^0.2.20`) which is a client SDK for the **Upstash QStash cloud service** hosted at `https://qstash.upstash.io`.

**`localhost:8090` is NOT a running QStash server.** It is a hardcoded fallback URL in every `.env` file and `src/config/env.js`. No local QStash emulator, mock server, or compatible service exists anywhere in the project. Every attempt to reach `localhost:8090` results in `ECONNREFUSED`, which is caught by `triggerWorkflowSafely()` and the system silently falls back to the in-process `node-cron` scheduler.

**No local QStash service is defined in `docker-compose.yml`.** The compose file contains only: `mongodb`, `app` (production), `app-dev` (development), and `mongo-express`.

---

## 2. Audit Questions — Explicit Answers

### Q1: Is QStash cloud-based or local?
**Cloud-based.** `@upstash/workflow` is the Upstash QStash cloud SDK. The `localhost:8090` references are non-functional fallback defaults.

### Q2: Where is QStash configured?
- `src/config/upstash.js` — instantiates `WorkflowClient` from `@upstash/workflow`
- `src/config/env.js` — loads `QSTASH_URL`, `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY` from environment
- `.env`, `.env.development`, `.env.production`, `.env.test`, `.env.example` — all contain QStash variables

### Q3: Which environment variables are required?
| Variable | Default | Purpose |
|:---|:---|:---|
| `QSTASH_URL` | `http://127.0.0.1:8090` | QStash endpoint base URL |
| `QSTASH_TOKEN` | `development` | QStash authentication bearer token |
| `QSTASH_CURRENT_SIGNING_KEY` | `""` (empty) | Active webhook signature verification key |
| `QSTASH_NEXT_SIGNING_KEY` | `""` (empty) | Next rotated signature verification key |
| `QSTASH_CALLBACK_URL` | `http://localhost:5500/api/v1/workflow/subscription/reminder` | Webhook callback target URL |

### Q4: What endpoint publishes jobs?
`src/services/subscription.service.js` → `createSubscription()` calls `triggerWorkflowSafely()` from `src/config/upstash.js`, which calls `workflowClient.trigger({ url, body })`.

### Q5: What endpoint receives worker callbacks?
Two endpoints:
1. `POST /api/v1/workflows/subscription/reminder` — workflow reminder processing
2. `POST /api/v1/notifications/worker` — notification delivery worker

### Q6: How are callbacks authenticated?
`src/notifications/controllers/notification.controller.js` checks for `req.headers.authorization` or `req.headers['upstash-signature']` when `NODE_ENV === 'production'`. **No actual cryptographic signature verification is performed** — only header presence is checked.

### Q7: Is localhost:8090 referenced?
**Yes**, in 8 locations:
- `.env:23` — `QSTASH_URL="http://127.0.0.1:8090"`
- `.env.development:9` — `QSTASH_URL=http://127.0.0.1:8090`
- `.env.example:26` — `QSTASH_URL=http://127.0.0.1:8090`
- `.env.production:9` — `QSTASH_URL=http://127.0.0.1:8090`
- `.env.test:9` — `QSTASH_URL=http://127.0.0.1:8090`
- `src/config/env.js:33` — fallback default
- `src/config/upstash.js:6` — WorkflowClient baseUrl
- `src/config/upstash.js:11` — log output

### Q8: Is port 8090 actually expected?
**No.** Port 8090 is unreachable in every environment. Every connection attempt fails with `ECONNREFUSED`. The system treats this as expected and falls back to `node-cron`.

### Q9: Is any local QStash-compatible server configured?
**No.** `docker-compose.yml` does not define a QStash service. No QStash emulator is installed.

### Q10: What happens if QStash is unreachable?
`triggerWorkflowSafely()` in `src/config/upstash.js`:
1. First checks `isQStashConfigured()` — if URL is localhost or token is mock, returns `{ success: false, skipped: true }`
2. On `ECONNREFUSED`/`ENOTFOUND`/`fetch failed`, catches error and returns `{ success: false, skipped: true }`
3. Application continues operating using `node-cron` in-process scheduler (daily at 09:00 AM)

### Q11: What happens if MongoDB is unreachable?
`connectToDatabase()` in `src/config/database.js`:
1. Retries 3 times with fixed 2000ms delay (no exponential backoff, no jitter)
2. If all retries fail, logs "Continuing in offline/demo mode..." and returns `null`
3. **Critical:** No middleware checks DB state — subsequent API requests crash with unhandled Mongoose errors

### Q12: How are notification duplicates prevented?
SHA-256 idempotency key: `SHA256(userId:subscriptionId:reminderRuleId:notificationType:YYYY-MM-DD:channel)` with MongoDB unique index on `idempotencyKey` field. `E11000` duplicate key errors caught gracefully in `ReminderEngineService.evaluateRenewals()`.

### Q13: How are retries performed?
- `FailureClassifier.classify(error)` categorizes as `PERMANENT` or `TRANSIENT`
- TRANSIENT: increment `retryCount`, mark `RETRYING`
- If `retryCount > maxRetries` (default 5): mark `FAILED`
- `BackoffUtil.getDelaySeconds(attempt)` defines delays `[60, 300, 900, 1800, 3600]` seconds
- **Critical:** Backoff delays are defined but NEVER actually used to schedule retry execution times

### Q14: What happens after worker crash?
Notifications in `PROCESSING` state remain **stuck indefinitely**. No stale recovery mechanism, no timeout sweeper, no periodic cleanup job.

### Q15: What happens after process restart?
- `SCHEDULED` notifications: re-processed on next scheduler run ✅
- `RETRYING` notifications: **NOT re-queried** — scheduler only queries `{ deliveryStatus: 'SCHEDULED' }` ❌
- `PROCESSING` notifications: remain stuck indefinitely ❌

---

## 3. Infrastructure Audit

### Logger (`src/utils/logger.js` — 44 lines)
- Plain-text `console.*` wrapper (log, warn, error, debug)
- Format: `[ISO Timestamp] [LEVEL] [ReqID: <id>]: <message> <meta_json>`
- Manual `requestId` parameter passing (no `AsyncLocalStorage`)
- No JSON structured output
- No sensitive data redaction (`JSON.stringify(meta)` outputs raw values)
- No `correlationId` concept

### Request ID (`src/middleware/request-id.middleware.js`)
- Reads `x-request-id` from incoming header or generates `crypto.randomUUID()`
- Sets `req.id` and response header
- Context lost in async operations without explicit passing

### Health Checks (`src/routes/health.routes.js` — 39 lines)
- `GET /health`: Returns HTTP **200** regardless of DB state (false positive)
- `GET /ready`: Returns 200 or 503 based on `mongoose.connection.readyState`
- `GET /live`: Returns 200 always
- No version info, no requestId in response

### Error Handling (`src/middleware/error.middleware.js` — 48 lines)
- Global Express error handler normalizing Mongoose errors
- Handles: `CastError` → 404, duplicate key `11000` → 409, `ValidationError` → 422
- Logs with `req.id` and suppresses stack in production
- **Missing:** No 404 catch-all for unmatched routes (returns Express default HTML)
- **Missing:** No `process.on('unhandledRejection')` or `process.on('uncaughtException')`

### Graceful Shutdown
- `tini` as PID 1 in Docker (signal forwarding) ✅
- `process.on('SIGINT/SIGTERM')` in `database.js` calls `closeDatabaseConnection()` then `process.exit(0)` ❌
- `server.close()` is **NEVER called** — in-flight requests terminated abruptly ❌
- `node-cron` task not stopped before exit ❌
- Signal handlers declared in wrong module (`database.js` instead of `server.js`) ❌

### Database (`src/config/database.js` — 71 lines)
- 3 retries with fixed 2000ms delay
- `serverSelectionTimeoutMS: 5000`
- No exponential backoff, no jitter
- No background auto-reconnect
- "Offline mode" log but no actual offline handling

### Docker
- Multi-stage build: `deps` → `builder` → `runner` ✅
- Non-root `node` user ✅
- `tini` init process ✅
- Resource limits in compose (0.50 CPU, 512MB RAM) ✅
- `HEALTHCHECK` targets `/health` instead of `/ready` ❌
- No healthcheck on production `app` service in compose ❌

### CI/CD (`.github/workflows/`)
- `lint.yml`: ESLint + Prettier
- `test.yml`: Jest with coverage artifact upload
- `docker.yml`: Multi-arch build + smoke test
- `release.yml`: Full verification + Docker build
- No deployment automation

### Metrics
- Zero system/APM metrics
- No Prometheus endpoint
- No HTTP latency tracking
- Rich domain analytics in `src/analytics/` (business metrics only)

---

## 4. Notification Subsystem Audit

### States (8 defined)
`PENDING` → `SCHEDULED` → `PROCESSING` → `SENT` → `DELIVERED`
                                        → `RETRYING`
                                        → `FAILED`
`CANCELLED` (defined but unused)

### State Machine Gaps
| Issue | Severity | Detail |
|:---|:---:|:---|
| No atomic CAS on `markProcessing()` | 🔴 Critical | Uses `findByIdAndUpdate(id, ...)` without status precondition — concurrent workers both succeed |
| No stale PROCESSING recovery | 🔴 Critical | Crashed worker leaves notification stuck forever |
| RETRYING not re-queried | 🟠 High | Scheduler only queries `SCHEDULED`, misses `RETRYING` |
| Backoff delays unused | 🟡 Medium | `BackoffUtil` defines delays but they're never applied to `scheduledFor` |

### Worker (`notification.worker.js` — 108 lines)
- Validates `notificationId` presence
- Checks status is `SCHEDULED` or `RETRYING` before processing
- Marks `PROCESSING` then delivers via `emailProvider.send()` or marks `DELIVERED` for IN_APP
- Classifies failures as PERMANENT/TRANSIENT
- Audit logs: `NOTIFICATION_SENT`, `NOTIFICATION_FAILED`, `NOTIFICATION_RETRIED`

### Delivery Semantics
**AT-LEAST-ONCE delivery.** The system cannot guarantee exactly-once because:
1. Worker sends email successfully
2. Worker crashes before `markSent()` database update
3. Notification reverts to retryable state on recovery
4. Another worker sends the email again

Nodemailer/SMTP does not support provider-level idempotency keys.

---

## 5. Test Suite Audit

| Metric | Value |
|:---|:---|
| Total test files | 52 |
| Total test cases | ~203 (needs verification via `npm test`) |
| Setup/helper/fixture files | 5 |
| Skipped tests | 0 |
| Coverage thresholds | Branches: 70%, Functions: 85%, Lines: 85%, Statements: 85% |

### Missing Test Coverage
- No tests for graceful shutdown
- No tests for process error handlers
- No tests for stale PROCESSING recovery
- No tests for concurrent worker CAS
- No tests for RETRYING scheduler drain
- No tests for system metrics
- No tests for request context propagation

---

## 6. Environment Variable Inventory

| Variable | File | Production Safe |
|:---|:---|:---:|
| `PORT` | `env.js` | ✅ |
| `NODE_ENV` | `env.js` | ✅ |
| `SERVER_URL` | `env.js` | ✅ |
| `DB_URI` | `env.js` | ⚠️ (fallback to localhost) |
| `JWT_SECRET` | `env.js` | ❌ (fallback: `'fallback-secret-key-change-in-prod'`) |
| `JWT_EXPIRES_IN` | `env.js` | ✅ |
| `ARCJET_KEY` | `env.js` | ✅ |
| `ARCJET_ENV` | `env.js` | ✅ |
| `QSTASH_URL` | `env.js` | ❌ (fallback to `localhost:8090`) |
| `QSTASH_TOKEN` | `env.js` | ❌ (fallback: `'development'`) |
| `QSTASH_CURRENT_SIGNING_KEY` | `env.js` | ⚠️ (empty default) |
| `QSTASH_NEXT_SIGNING_KEY` | `env.js` | ⚠️ (empty default) |
| `EMAIL_PASSWORD` | `env.js` | ⚠️ (empty default) |
