# GitHub Actions CI/CD Workflows Guide — SubPulse

## Modular Pipeline Architecture

SubPulse uses 4 specialized, decoupled GitHub Actions workflows under `.github/workflows/`:

```
.github/workflows/
├── lint.yml       # ESLint & Prettier static code quality verification
├── test.yml       # Jest unit/integration tests & coverage artifact upload
├── docker.yml     # Multi-arch Docker buildx & container smoke testing
└── release.yml    # Tag-driven release validation & build artifact archiving
```

---

## 🚦 Quality Gate Verification Steps

1. **Linting Job (`lint.yml`)**: Fails if any ESLint error or Prettier formatting mismatch exists.
2. **Testing Job (`test.yml`)**: Executes Jest test suites. Archives `coverage/` as a workflow artifact.
3. **Docker Job (`docker.yml`)**: Builds `linux/amd64` and `linux/arm64` images using Docker Buildx, launches `docker compose --profile production up -d`, and executes `scripts/smoke-test.js`.
4. **Release Job (`release.yml`)**: Runs on release tags (`v*.*.*`) to validate production build readiness.
