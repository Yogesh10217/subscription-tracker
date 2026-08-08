import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import connectToDatabase, { closeDatabaseConnection } from '#config/database.js';

describe('Database Config Unit Tests', () => {
  beforeEach(async () => {
    await closeDatabaseConnection();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await closeDatabaseConnection();
  });

  test('connectToDatabase should reuse existing connection if already connected', async () => {
    jest.spyOn(mongoose, 'connect').mockResolvedValue({ connection: { host: '127.0.0.1' } });
    await connectToDatabase(1, 10);
    // Second call should return early
    const conn = await connectToDatabase(1, 10);
    expect(conn).toBeUndefined();
  });

  test('connectToDatabase handles retry and failure cleanly', async () => {
    jest.spyOn(mongoose, 'connect').mockRejectedValue(new Error('Connection failed'));
    const result = await connectToDatabase(2, 5);
    expect(result).toBeNull();
  });

  test('closeDatabaseConnection closes connection when connected', async () => {
    jest.spyOn(mongoose, 'connect').mockResolvedValue({ connection: { host: '127.0.0.1' } });
    await connectToDatabase(1, 10);
    const closeSpy = jest.spyOn(mongoose.connection, 'close').mockResolvedValue(true);
    await closeDatabaseConnection();
    expect(closeSpy).toHaveBeenCalled();
  });
});
