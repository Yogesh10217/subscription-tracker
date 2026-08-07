# Coding Standards — Subscription Tracker

## 1. Architectural Layer Isolation Rules
- **Controllers (`src/controllers/`)**: Thin functions that extract parameters from `req`, call service methods, and return `ApiResponse`. Controllers NEVER execute database queries.
- **Services (`src/services/`)**: Framework-independent business logic. Services NEVER import Express (`req`, `res`, `next`).
- **Repositories (`src/repositories/`)**: Mongoose data access operations ONLY. Repositories NEVER contain business rules or Express logic.
- **Middleware (`src/middleware/`)**: Isolated cross-cutting concerns (Auth, Tracing, Error Handling).

## 2. JSDoc Annotation Standard
Every exported function must include JSDoc comments:
```javascript
/**
 * @description Short description of function purpose
 * @param {Type} paramName - Description
 * @returns {ReturnType} Description
 * @throws {ApiError} Description
 * @example
 * myFunction('arg');
 */
```

## 3. Error Handling Rules
- Throw structured `ApiError` instances rather than raw `Error` objects.
- All HTTP endpoints must be wrapped in `asyncHandler`.
- Never swallow errors silently or suppress log output.
