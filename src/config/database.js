import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from './env.js';
import logger from '../utils/logger.js';

let isConnected = false;

export const connectToDatabase = async (maxRetries = 3, retryDelayMs = 2000) => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

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
      logger.warn(`MongoDB connection failed (Attempt ${attempts}/${maxRetries}): ${error.message}`);
      if (attempts >= maxRetries) {
        logger.error('Max database connection retries reached. Continuing in offline/demo mode...');
        return null;
      }
      await new Promise((res) => setTimeout(res, retryDelayMs));
    }
  }
};

export const closeDatabaseConnection = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('MongoDB connection closed gracefully');
  }
};

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Closing database connection...');
  await closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing database connection...');
  await closeDatabaseConnection();
  process.exit(0);
});

export default connectToDatabase;
