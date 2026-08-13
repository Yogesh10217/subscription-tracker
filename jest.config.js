export default {
  testEnvironment: 'node',
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true,
  transform: {},
  moduleNameMapper: {
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^#services/(.*)$': '<rootDir>/src/services/$1',
    '^#repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^#middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^#models/(.*)$': '<rootDir>/src/models/$1',
    '^#routes/(.*)$': '<rootDir>/src/routes/$1',
    '^#validators/(.*)$': '<rootDir>/src/validators/$1',
    '^#constants/(.*)$': '<rootDir>/src/constants/$1',
    '^#utils/(.*)$': '<rootDir>/src/utils/$1',
    '^#templates/(.*)$': '<rootDir>/src/templates/$1',
    '^#analytics/(.*)$': '<rootDir>/src/analytics/$1',
    '^#notifications/(.*)$': '<rootDir>/src/notifications/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/docs/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true
};
