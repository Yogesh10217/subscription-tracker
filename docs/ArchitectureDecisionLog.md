# Architecture Decision Log (ADR)

## ADR-001: Migration to N-Tier Layered Architecture (`src/`)
- **Status**: Approved & Executed (Phase 0)
- **Context**: Monolithic architecture with mixed DB and business logic.
- **Decision**: Separated concerns into Routes, Controllers, Services, Repositories, Validators, and Utilities.
- **Consequences**: High testability and clean unit test isolation.

## ADR-002: Adoption of ESLint, Prettier, Husky, and Jest (Phase 0.1)
- **Status**: Approved & Executed (Phase 0.1)
- **Context**: Lack of automated code style and quality enforcement.
- **Decision**: Standardized tools (`.eslintrc.json`, `.prettierrc`, `.husky/`, `jest.config.js`).
- **Consequences**: Guaranteed style consistency and pre-commit regression checks.

## ADR-003: Enterprise Authentication Architecture & Token Family Rotation (Phase 1)
- **Status**: Approved & Executed (Phase 1)
- **Context**: Simple JWT authentication without revocation or session tracking.
- **Decision**: Access Tokens (15m) + Refresh Token Family Rotation (7d), session device tracking, account lockout, hashed verification tokens, Helmet headers, and audit logging.
- **Consequences**: Production security and multi-device session governance.

## ADR-004: Subscription Management 2.0 Domain Model & Decoupled Architecture (Phase 2)
- **Status**: Approved & Executed (Phase 2)
- **Context**: Basic CRUD subscription model lacked categorization taxonomies, audit timelines, multi-stage import validation, and search abstractions needed for future Billing (Phase 5) and AI scaling.
- **Decision**: Implemented `Provider`, `Category`, and `Tag` models, generic `TimelineEvent` audit logs, `FileAsset`, `SubscriptionNote`, multi-stage import pipeline, and search query builder.
- **Consequences**: 100% backward compatible, future-ready architecture, zero structural rework required.

## ADR-005: Bounded Analytics & Insights Subsystem Architecture (Phase 3)
- **Status**: Approved & Executed (Phase 3)
- **Context**: Need for deterministic, explainable, read-only analytics separating projected recurring spend from historical actual spend.
- **Decision**: Encapsulated analytics subsystem inside `src/analytics/` with `AnalyticsQueryContext`, `FrequencyNormalizer`, safe multi-currency isolation, and `InsightEngine`.
- **Consequences**: High performance, zero business logic mutations, explainable data, and zero AI dependencies.

## ADR-006: Notification Platform & Asynchronous Delivery Subsystem Architecture (Phase 4)
- **Status**: Approved & Executed (Phase 4)
- **Context**: Need for asynchronous, idempotent, and retryable email/in-app notifications for renewals, trials, price changes, and lifecycle events.
- **Decision**:
  - Built bounded `src/notifications/` subsystem with provider abstraction (`NotificationProviderInterface`, `EmailProvider`).
  - Separated `deliveryStatus` (`PENDING`, `SCHEDULED`, `PROCESSING`, `SENT`, `DELIVERED`, `FAILED`, `CANCELLED`, `RETRYING`) from user read timestamp (`readAt`).
  - Enforced atomic concurrency protection using SHA-256 `idempotencyKey` unique MongoDB index (`E11000 duplicate key` handled gracefully).
  - Classifies delivery failures into `TRANSIENT` (exponential backoff retry: 1m, 5m, 15m, 30m, 60m) vs `PERMANENT`.
  - QStash worker endpoint signature verification guard.
- **Consequences**: Production-ready, asynchronous, auditable, and idempotent notification platform.
