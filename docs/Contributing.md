# Contributing Guidelines — Subscription Tracker

## Git Workflow
1. Create a feature branch from `main` (`git checkout -b feature/short-description`).
2. Make commits following Conventional Commits format (`feat: ...`, `fix: ...`, `refactor: ...`, `test: ...`).
3. Ensure pre-commit hook runs successfully (`npm run verify`).
4. Submit a Pull Request targeting `main`.

## Code Review Quality Gates
PRs will only be approved if:
- All unit and integration tests pass.
- Code coverage thresholds are satisfied.
- ESLint and Prettier report zero warnings.
- Documentation is updated for new exports or APIs.
