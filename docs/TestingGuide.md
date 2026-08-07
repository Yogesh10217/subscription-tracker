# Testing Guide — Subscription Tracker

## Overview
SubPulse enforces high testing standards to prevent regressions and maintain production readiness.

---

## 🧪 Testing Architecture (`tests/`)

```
tests/
├── setup.js                   # Global test environment configuration
├── helpers/
│   ├── test-db.js             # Test database isolation helpers
│   └── auth-helper.js         # JWT token generator helpers
├── fixtures/                  # Shared test data payloads
├── unit/                      # Isolated unit tests
│   ├── repositories/
│   ├── services/
│   ├── utilities/
│   └── validators/
└── integration/               # Supertest API HTTP integration tests
```

---

## 📊 Coverage Requirements

| Layer | Coverage Threshold Target |
|---|---|
| Services | $\ge 95\%$ |
| Repositories | $\ge 95\%$ |
| Utilities | $\ge 95\%$ |
| Middleware | $\ge 90\%$ |
| Validators | $100\%$ |
| Overall Global | $\ge 90\%$ |

---

## 💻 Running Tests
```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode for TDD
npm run test:coverage  # Generate coverage report
```
