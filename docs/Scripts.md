# Package Scripts Reference

| Script Command | Description |
|---|---|
| `npm run start` | Runs the production HTTP server (`node app.js`) |
| `npm run dev` | Runs the development server with live reload (`nodemon app.js`) |
| `npm run lint` | Runs ESLint check across `src/` files |
| `npm run lint:fix` | Automatically fixes ESLint errors |
| `npm run format` | Auto-formats code using Prettier |
| `npm run format:check` | Verifies Prettier formatting without writing changes |
| `npm run check` | Runs linting and format verification |
| `npm run test` | Runs Jest unit and integration test suites |
| `npm run test:watch` | Runs Jest in watch mode for active development |
| `npm run test:coverage` | Generates HTML and LCOV test coverage report |
| `npm run verify` | Full quality gate check (lint, format:check, test) |
| `npm run docs` | Verifies project documentation formatting |
