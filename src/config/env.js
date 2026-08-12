import { config } from 'dotenv';

const nodeEnv = process.env.NODE_ENV || 'development';
config({ path: `.env.${nodeEnv}.local` });
config({ path: '.env.local' });
config({ path: '.env' });

export function validateEnv() {
  const errors = [];

  // Required checks
  const required = ['DB_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    errors.push(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate DB_URI format
  const dbUri = process.env.DB_URI || '';
  if (dbUri && !dbUri.startsWith('mongodb://') && !dbUri.startsWith('mongodb+srv://')) {
    errors.push(`Invalid DB_URI format. Must start with 'mongodb://' or 'mongodb+srv://'`);
  }

  // Validate PORT
  if (process.env.PORT) {
    const port = Number(process.env.PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.push(`Invalid PORT: must be an integer between 1 and 65535`);
    }
  }

  // Validate JWT_SECRET length and enforce no fallback in production
  const jwtSecret = process.env.JWT_SECRET || '';
  if (process.env.NODE_ENV === 'production') {
    if (!jwtSecret || jwtSecret === 'fallback-secret-key-change-in-prod') {
      errors.push(
        `JWT_SECRET must be explicitly set and cannot use default fallback in production`
      );
    } else if (jwtSecret.length < 32) {
      errors.push(
        `JWT_SECRET must be at least 32 characters long in production (current length: ${jwtSecret.length})`
      );
    }
  }

  // Validate JWT_EXPIRES_IN format
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
  if (jwtExpiresIn && !/^\d+[smhdw]$/i.test(jwtExpiresIn) && isNaN(Number(jwtExpiresIn))) {
    errors.push(
      `Invalid JWT_EXPIRES_IN format: '${jwtExpiresIn}'. Must be like '1d', '7d', '1h', '30m'`
    );
  }

  if (errors.length > 0) {
    console.error('❌ FATAL ENVIRONMENT CONFIGURATION ERRORS:');
    errors.forEach((err) => console.error(`  - ${err}`));

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

validateEnv();

export const env = Object.freeze({
  PORT: parseInt(process.env.PORT || '5500', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:5500',
  DB_URI: process.env.DB_URI || 'mongodb://127.0.0.1:27017/subscription-tracker',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key-change-in-prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  ARCJET_KEY: process.env.ARCJET_KEY || '',
  ARCJET_ENV: process.env.ARCJET_ENV || 'development',
  QSTASH_URL: process.env.QSTASH_URL || 'http://127.0.0.1:8090',
  QSTASH_TOKEN: process.env.QSTASH_TOKEN || 'development',
  QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY || '',
  QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || ''
});

export const {
  PORT,
  NODE_ENV,
  SERVER_URL,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_KEY,
  ARCJET_ENV,
  QSTASH_URL,
  QSTASH_TOKEN,
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
  EMAIL_PASSWORD
} = env;

export default env;
