# Production Cloud Deployment Guide — SubPulse

## Overview
SubPulse is packaged as a standard 12-Factor, multi-arch Docker container compatible with any cloud container platform.

---

## 🌐 Cloud Platform Deployment Targets

### 1. Render (`render.yaml`)
- Select **Web Service** -> Connect GitHub Repo -> Choose **Docker** environment.
- Set environment variables (`NODE_ENV=production`, `DB_URI`, `JWT_SECRET`).
- Health Check Path: `/health`.

### 2. Railway
- New Project -> Deploy from GitHub repo -> Railway auto-detects `Dockerfile`.
- Set variables in Railway Dashboard variables tab.

### 3. Fly.io (`fly.toml`)
```toml
app = "subpulse-app"
primary_region = "iad"

[http_service]
  internal_port = 5500
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true

[[checks]]
  type = "http"
  port = 5500
  path = "/health"
  interval = "15s"
  timeout = "5s"
```

### 4. DigitalOcean App Platform
- Create App -> Select GitHub -> Select Dockerfile component -> Set HTTP Port to `5500`.
- Health check route: `/health`.

### 5. AWS ECS (Fargate)
- Push image to AWS ECR: `docker tag subpulse:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/subpulse:latest`.
- Create Task Definition with Fargate (`0.5 vCPU`, `512MB RAM`), container port `5500`.

### 6. Azure App Service (Linux Web App for Containers)
- Deploy container image from Docker Hub or Azure Container Registry (ACR).
- Configure App Settings with environment variables and set `WEBSITES_PORT=5500`.

### 7. Google Cloud Run
```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/subpulse
gcloud run deploy subpulse --image gcr.io/$PROJECT_ID/subpulse --port 5500 --platform managed
```
