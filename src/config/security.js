/**
 * @file security.js
 * @module config/security
 * @description Centralized security configuration parameters and thresholds.
 */

export const SECURITY_CONFIG = {
  // Account Lockout Thresholds
  ACCOUNT_LOCK_ATTEMPTS: parseInt(process.env.ACCOUNT_LOCK_ATTEMPTS || '5', 10),
  ACCOUNT_LOCK_DURATION_SEC: parseInt(process.env.ACCOUNT_LOCK_DURATION_SEC || '900', 10), // 15 mins

  // Token Validity Durations
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || '15m',
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || '7d',
  PASSWORD_RESET_TTL_SEC: parseInt(process.env.PASSWORD_RESET_TTL_SEC || '3600', 10), // 1 hour
  VERIFICATION_TOKEN_TTL_SEC: parseInt(process.env.VERIFICATION_TOKEN_TTL_SEC || '86400', 10), // 24 hours

  // Password Policy Requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  PASSWORD_HISTORY_LIMIT: 3,

  // Common Weak Passwords Dictionary
  COMMON_PASSWORDS: [
    'password',
    'password123',
    '123456',
    '123456789',
    'qwerty',
    'admin123',
    'subpulse123',
    'letmein'
  ],

  // Default Granular Role-to-Permissions Mapping
  ROLE_PERMISSIONS: {
    user: [
      'subscription:create',
      'subscription:read',
      'subscription:update',
      'subscription:delete',
      'profile:read',
      'profile:update'
    ],
    admin: [
      'subscription:create',
      'subscription:read',
      'subscription:update',
      'subscription:delete',
      'profile:read',
      'profile:update',
      'admin:users',
      'admin:logs',
      'admin:sessions',
      'billing:view'
    ]
  }
};

export default SECURITY_CONFIG;
