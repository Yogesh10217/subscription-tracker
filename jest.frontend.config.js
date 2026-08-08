export default {
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/tests/frontend/**/*.test.js'],
  verbose: true,
  moduleNameMapper: {
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#utils/(.*)$': '<rootDir>/src/utils/$1'
  }
};
