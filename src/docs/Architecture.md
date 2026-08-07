# Architectural Overview — Subscription Tracker

## Design Paradigm: N-Tier Layered Architecture

SubPulse is structured around strict separation of concerns, eliminating cross-layer pollution and ensuring predictability and scalability.

```
[ HTTP Client / Frontend ]
          │
          ▼
┌──────────────────────────┐
│  Routes Layer            │  Maps endpoints & middleware
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Validators Layer        │  Validates request body/params
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Controllers Layer       │  Thin HTTP handlers, calls services
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Services Layer          │  Pure business logic (NO Express dependencies)
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Repositories Layer      │  Pure database operations (Mongoose queries ONLY)
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Models / Database Layer │  Mongoose schemas & Mongo connection
└──────────────────────────┘
```

## Layer Rules & Contracts

1. **Routes (`src/routes/`)**: Define URLs, HTTP methods, attach validators and authentication middleware.
2. **Controllers (`src/controllers/`)**: Thin functions that extract parameters from `req`, call the appropriate service method, and format the response via `ApiResponse`.
3. **Services (`src/services/`)**: Encapsulate all business rules (e.g. hashing passwords, computing renewal intervals, triggering QStash workflows). Have ZERO awareness of Express `req`/`res`.
4. **Repositories (`src/repositories/`)**: Abstract database queries. Contain no business logic and no HTTP code.
5. **Config & Environment (`src/config/`)**: Centralized configuration management with runtime validation (`validateEnv()`).
6. **Logging (`src/utils/logger.js`)**: Structured logging supporting ISO timestamps, log levels, and `x-request-id` tracing.
