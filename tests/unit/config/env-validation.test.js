import { validateEnv, env } from '../../../src/config/env.js';

describe('Environment Validation Unit Tests', () => {
  it('validateEnv should run without throwing errors in test environment', () => {
    expect(() => validateEnv()).not.toThrow();
  });

  it('env frozen object should export required variables', () => {
    expect(env.PORT).toBeDefined();
    expect(env.NODE_ENV).toBeDefined();
    expect(env.DB_URI).toBeDefined();
    expect(env.JWT_SECRET).toBeDefined();
    expect(Object.isFrozen(env)).toBe(true);
  });
});
