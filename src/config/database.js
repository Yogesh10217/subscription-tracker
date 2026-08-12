import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from './env.js';
import logger from '../utils/logger.js';

let isConnected = false;

/**
 * Connects to MongoDB with exponential backoff and jitter.
 * @param {number} maxRetries - Maximum connection attempts
 * @param {number} baseDelayMs - Base delay in milliseconds
 * @returns {Promise<mongoose.Connection|null>}
 */
export const connectToDatabase = async (maxRetries = 3, baseDelayMs = 1000) => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

  const MAX_DELAY_MS = 30000;

  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      attempts++;
      logger.info(`Connecting to MongoDB (Attempt ${attempts}/${maxRetries})...`);

      const conn = await mongoose.connect(DB_URI, {
        serverSelectionTimeoutMS: 5000
      });

      isConnected = true;
      logger.info(`✅ Connected to MongoDB in ${NODE_ENV} mode [Host: ${conn.connection.host}]`);

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection runtime error', { error: err.message });
        isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB connection disconnected');
        isConnected = false;
      });

      return conn;
    } catch (error) {
      logger.warn(
        `MongoDB connection failed (Attempt ${attempts}/${maxRetries}): ${error.message}`
      );
      if (attempts >= maxRetries) {
        logger.error(
          'MongoDB connection failed after all retries. Application may not function correctly.',
          { maxRetries, lastError: error.message }
        );
        return null;
      }
      // Exponential backoff with jitter: min(baseDelay * 2^attempt + jitter, maxDelay)
      const exponentialDelay = baseDelayMs * Math.pow(2, attempts - 1);
      const jitter = Math.floor(Math.random() * 1000);
      const delay = Math.min(exponentialDelay + jitter, MAX_DELAY_MS);
      logger.info(`Retrying MongoDB connection in ${delay}ms...`, { delay, attempt: attempts });
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

/**
 * Closes the MongoDB connection gracefully.
 */
export const closeDatabaseConnection = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('MongoDB connection closed gracefully');
  }
};

/**
 * Returns whether the database is currently connected.
 * @returns {boolean}
 */
export const isDatabaseConnected = () => isConnected;

export default connectToDatabase;
