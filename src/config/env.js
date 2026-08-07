import { config } from 'dotenv';

const nodeEnv = process.env.NODE_ENV || 'development';
config({ path: `.env.${nodeEnv}.local` });
config({ path: '.env.local' });
config({ path: '.env' });

export function validateEnv() {
  const required = ['DB_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ FATAL CONFIGURATION ERROR: Missing required environment variables: ${missing.join(', ')}`
    );
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

validateEnv();

export const env = Object.freeze({
  PORT: process.env.PORT || 5500,
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
