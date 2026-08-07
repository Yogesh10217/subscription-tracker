# Environment Variables & Secrets Management Guide — SubPulse

## Overview
SubPulse enforces strict environment profile separation and validation. Configuration values are loaded via `src/config/env.js` with fail-fast validation on application boot.

---

## 📋 Environment Variable Reference Catalog

| Variable Name | Required | Default / Format | Description |
|---|---|---|---|
| `PORT` | No | `5500` | HTTP Server Port |
| `NODE_ENV` | Yes | `development` / `production` / `test` | Runtime Environment Profile |
| `SERVER_URL` | No | `http://localhost:5500` | Public Application Base URL |
| `DB_URI` | Yes | `mongodb://...` | MongoDB Connection String |
| `JWT_SECRET` | Yes | String ($\ge 32$ chars) | Cryptographic Secret for Signing JWT Tokens |
| `JWT_EXPIRES_IN` | No | `7d` | JWT Token Validity Duration |
| `LOG_LEVEL` | No | `info` / `debug` / `warn` / `error` | Winston/Console Logging Level |

---

## 🔒 Secrets Management Strategy

### 1. Local Development (`.env` & `.env.local`)
- NEVER commit `.env`, `.env.local`, or secrets to Git repository.
- Use `.env.example` as a template for team onboarding.

### 2. CI/CD Pipeline (GitHub Secrets)
- Store `DB_URI`, `JWT_SECRET`, and API credentials in **GitHub Repository Secrets**.
- In workflows (`.github/workflows/*.yml`), reference secrets via `${{ secrets.JWT_SECRET }}`.

### 3. Production Containers (Docker Secrets & Cloud Key Vaults)
- AWS Secrets Manager / Parameter Store: Injected via ECS Task Definition environment.
- GCP Secret Manager: Bound directly to Cloud Run environment variables.
- HashiCorp Vault / Docker Secrets: Mounted into container filesystem.
