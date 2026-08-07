export default {
  testEnvironment: 'node',
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
    '^#templates/(.*)$': '<rootDir>/src/templates/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/docs/**'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true
};
