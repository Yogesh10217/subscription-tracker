# Docker Architecture & Containerization Guide — SubPulse

## Overview
SubPulse utilizes a security-hardened, multi-stage Docker build process based on `node:20-alpine` designed for high security, fast layer caching, and minimal footprint (<200MB target image size).

---

## 🏗️ Multi-Stage Build Architecture (`Dockerfile`)

```
┌──────────────────────────────────────────────────────────┐
│ STAGE 1: deps                                            │
│ - Base: node:20-alpine                                   │
│ - Installs production node_modules ONLY (npm ci --only=prod)│
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│ STAGE 2: builder                                         │
│ - Installs dev & production dependencies                 │
│ - Runs quality gate checks (npm run verify)               │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│ STAGE 3: runner (Production Image)                       │
│ - Base: node:20-alpine + tini process supervisor         │
│ - User: Non-root node user (UID:GID 1000:1000)           │
│ - Copies node_modules from deps stage                    │
│ - CMD: ["node", "app.js"] wrapped with tini              │
└──────────────────────────────────────────────────────────┘
```

---

## 🛡️ Container Security Hardening Rules

1. **Non-Root Execution**: Container process executes as unprivileged user `node` (`USER node`).
2. **Signal Supervision (`tini`)**: Uses `tini` as PID 1 init process to trap `SIGTERM`/`SIGINT` signals and initiate graceful shutdowns.
3. **Resource Quotas**:
   - `cpus: '0.50'`
   - `memory: 512M` (reservation `128M`)
4. **Least Privilege Capabilities**: `cap_drop: [ALL]` drops all Linux kernel capabilities.
5. **No New Privileges**: `security_opt: ["no-new-privileges:true"]`.
6. **Healthcheck Probe**: `HEALTHCHECK` command queries `http://localhost:5500/health` every 15s.

---

## 🚀 Commands Reference
```bash
# Build production Docker image
npm run docker:build

# Launch production stack
npm run docker:up

# Stream container logs
npm run docker:logs

# Tear down container stack and volumes
npm run docker:clean
```
