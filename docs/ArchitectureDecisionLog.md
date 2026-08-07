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
