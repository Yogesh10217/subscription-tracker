# ==============================================================================
# SUBPULSE — MAKEFILE AUTOMATION
# ==============================================================================

.PHONY: help dev test lint format check verify docker-build docker-up docker-down docker-logs docker-shell smoke clean

help:
	@echo "SubPulse Automation Commands:"
	@echo "  make dev          Start local development server"
	@echo "  make test         Run Jest unit and integration tests"
	@echo "  make lint         Run ESLint code quality check"
	@echo "  make format       Auto-format code with Prettier"
	@echo "  make verify       Run full quality gate (lint + format + test)"
	@echo "  make docker-build Build multi-stage production Docker image"
	@echo "  make docker-up    Start production stack with Docker Compose"
	@echo "  make docker-down  Stop production Docker Compose stack"
	@echo "  make smoke        Execute automated container smoke tests"
	@echo "  make clean        Prune containers, volumes, and build caches"

dev:
	npm run dev

test:
	npm run test

lint:
	npm run lint

format:
	npm run format

check:
	npm run check

verify:
	npm run verify

docker-build:
	docker build -t subpulse:latest .

docker-up:
	docker compose --profile production up -d

docker-down:
	docker compose --profile production down

docker-logs:
	docker compose --profile production logs -f

docker-shell:
	docker exec -it subpulse-app-prod /bin/sh

smoke:
	node scripts/smoke-test.js

clean:
	docker compose down -v --remove-orphans
	docker system prune -f
