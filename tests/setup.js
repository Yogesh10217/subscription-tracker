import { jest, afterAll } from '@jest/globals';

process.env.NODE_ENV = 'test';
process.env.PORT = '5501';
process.env.JWT_SECRET = 'test-jwt-secret-key-12345';
process.env.JWT_EXPIRES_IN = '1d';
process.env.DB_URI = 'mongodb://127.0.0.1:27017/subscription-tracker-test';
process.env.LOG_LEVEL = 'error';

jest.setTimeout(15000);

afterAll(async () => {
  try {
    const mongoose = (await import('mongoose')).default;
    if (mongoose && mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  } catch (e) {
    // Ignore if mongoose not initialized
  }
});
