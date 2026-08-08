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
- **Decision**:
  - Implemented `Provider`, `Category`, and `Tag` models.
  - Decoupled search via `SearchService` -> `QueryBuilder` -> `Repository`.
  - Replaced single-purpose history with generic `TimelineEvent` audit logs.
  - Implemented reusable `FileAsset` and scalable `SubscriptionNote` models.
  - Built multi-stage CSV/JSON import pipeline (`Preview` -> `Dry Run` -> `Execution`).
  - Formalized full ISO 4217 currencies and frequencies (`Daily`, `Weekly`, `Monthly`, `Quarterly`, `Yearly`, `Custom`).
- **Consequences**: 100% backward compatible, future-ready architecture, zero structural rework required for future phases.
