# Architecture Decision Log (ADR)

## ADR-001: Migration to N-Tier Layered Architecture (`src/`)
- **Status**: Approved & Executed (Phase 0)
- **Context**: The codebase previously contained monolithic controllers executing direct Mongoose DB calls, managing transactions, password hashing, and formatting responses in single functions.
- **Decision**: Separated concerns into Routes, Controllers, Services, Repositories, Validators, and Utilities under `src/`.
- **Consequences**: Enhanced testability, clean unit test mocking capability, and eliminated cross-layer pollution.

## ADR-002: Adoption of ESLint, Prettier, Husky, and Jest (Phase 0.1)
- **Status**: Approved & Executed (Phase 0.1)
- **Context**: Project lacked standardized linting, formatting enforcement, pre-commit validation, and automated unit/integration test suites.
- **Decision**: Configured ESLint (`.eslintrc.json`), Prettier (`.prettierrc`), Husky pre-commit hooks (`.husky/`), and Jest/Supertest (`jest.config.js`).
- **Consequences**: Guaranteed code style consistency, zero untested logic, and pre-commit regression safety.

## ADR-003: Enterprise Authentication Architecture & Token Family Rotation (Phase 1)
- **Status**: Approved & Executed (Phase 1)
- **Context**: JWT authentication relied solely on single access tokens without revocation, refresh token family rotation, device session tracking, account lockout, or permission-based RBAC.
- **Decision**:
  - Implemented short-lived Access Tokens (15m) + Refresh Token Family Rotation (7d).
  - Adopted `Session` model tracking device metadata and token hashes.
  - Implemented token replay attack detection revoking entire token families upon token reuse.
  - Stored verification tokens as SHA-256 hashes (`verification-token.model.js`).
  - Adopted permission-based RBAC (`requirePermission`, `requireRole`) and Helmet security headers.
  - Decoupled auth services into `auth.service`, `session.service`, `password.service`, `verification.service`, `audit.service`.
- **Consequences**: Enterprise production security, complete session visibility, replay protection, and zero-redesign extension points for future MFA, SSO, and Organizations.
