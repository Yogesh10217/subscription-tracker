# Local Production Environment Setup Guide — SubPulse

## Quick Start (Production Mode)

Follow these steps to run SubPulse in full production containerized mode on your local workstation:

### 1. Prerequisites
- Docker Desktop or Docker Engine installed with Docker Compose v2+.

### 2. Launch Local Production Stack
```bash
# Using Makefile
make docker-up

# OR using npm
npm run docker:up

# OR using cross-platform scripts
./scripts/prod.sh       # Unix / macOS
./scripts/prod.ps1      # Windows PowerShell
```

### 3. Verify Health & Execute Smoke Tests
```bash
# Run automated container smoke test suite
npm run smoke
```

### 4. View Application & Logs
- Application Dashboard: **http://localhost:5500**
- Health Probe: **http://localhost:5500/health**
- Stream Logs: `npm run docker:logs`

### 5. Tear Down Production Stack
```bash
npm run docker:down
```
