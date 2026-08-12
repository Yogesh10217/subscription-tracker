# SubPulse Production Operational Runbook

## Overview
This runbook contains operational guidance, troubleshooting procedures, diagnostics, and disaster recovery steps for SREs and Platform Engineers operating SubPulse in production.

---

## 1. Diagnostics & Health Verification

### Quick Health Checks
```bash
# Check process liveness
curl http://localhost:5500/live

# Check database readiness
curl http://localhost:5500/ready

# Complete operational summary
curl http://localhost:5500/health

# Prometheus metrics text export
curl http://localhost:5500/metrics
```

### QStash Connectivity Diagnostics
Run the diagnostic tool to analyze Upstash QStash configuration and connectivity:
```bash
node scripts/qstash-diagnostics.js
```

---

## 2. Common Operational Issues & Remediation

### Issue 1: MongoDB Disconnected (`GET /ready` returns HTTP 503)
- **Symptom**: `/ready` probe returns 503; error logs contain `MongoDB connection disconnected`.
- **Cause**: Database instance unreachable, network partition, or primary failover.
- **Behavior**: Connection layer retries with exponential backoff + jitter (`min(1s * 2^attempt + jitter, 30s)`).
- **Remediation**:
  1. Verify MongoDB container status: `docker compose ps mongodb`
  2. Inspect DB logs: `docker compose logs -f mongodb`
  3. Verify connection string `DB_URI` in `.env`

### Issue 2: QStash Server Offline / Connection Refused
- **Symptom**: Logs report `QStash server offline/unreachable; continuing with local scheduler fallback`.
- **Cause**: QStash unconfigured, running in local dev mode, or external network issue.
- **Behavior**: System automatically falls back to in-process `node-cron` daily scheduler (09:00 AM). API calls continue operating without throwing errors.
- **Remediation**:
  1. Run `node scripts/qstash-diagnostics.js` to inspect environment settings.
  2. For cloud deployment: ensure `QSTASH_URL`, `QSTASH_TOKEN`, and signing keys are set.

### Issue 3: Stale Notifications Recovery
- **Symptom**: Notifications stuck in `PROCESSING` status after worker process crash.
- **Behavior**: `NotificationSchedulerService.runScheduler()` executes `recoverStaleProcessing(15)` at the start of every daily cycle, resetting notifications stuck > 15 minutes back to `SCHEDULED` or marking `FAILED` if max retries exceeded.
- **Manual Trigger**: Can be manually triggered via `NotificationSchedulerService.runScheduler()`.

---

## 3. Production Deployment Commands

```bash
# Quality Verification
npm run verify

# Build Production Docker Image
docker build -t subpulse:latest .

# Run Production Stack via Compose
docker compose --profile production up -d

# View Container Logs
docker compose --profile production logs -f app
```
