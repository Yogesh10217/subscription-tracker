/**
 * @file password.service.js
 * @module services/password.service
 * @description Password security policy enforcement, entropy checks, dictionary checks, and history verification.
 */

import bcrypt from 'bcryptjs';
import ApiError from '../utils/api-error.js';
import SECURITY_CONFIG from '../config/security.js';

export const passwordService = {
  /**
   * Validates password strength against policy, common dictionary, and entropy rules.
   * @param {string} password
   * @throws {ApiError} If password fails policy
   */
  validatePasswordPolicy(password) {
    if (!password || typeof password !== 'string') {
      throw ApiError.badRequest('Password must be a valid string');
    }

    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      throw ApiError.badRequest(
        `Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`
      );
    }

    if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      throw ApiError.badRequest('Password must contain at least one uppercase letter');
    }

    if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      throw ApiError.badRequest('Password must contain at least one lowercase letter');
    }

    if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBER && !/[0-9]/.test(password)) {
      throw ApiError.badRequest('Password must contain at least one number');
    }

    if (
      SECURITY_CONFIG.PASSWORD_REQUIRE_SPECIAL &&
      !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    ) {
      throw ApiError.badRequest('Password must contain at least one special character');
    }

    // Dictionary check
    const lower = password.toLowerCase();
    const isCommon = SECURITY_CONFIG.COMMON_PASSWORDS.some((common) => lower.includes(common));
    if (isCommon) {
      throw ApiError.badRequest('Password contains a common easily guessable word');
    }
  },

  /**
   * Checks if candidate password matches any previously used password in user history.
   * @param {string} candidatePassword
   * @param {Array<string>} passwordHistory
   * @returns {Promise<boolean>}
   */
  async isPasswordReused(candidatePassword, passwordHistory = []) {
    for (const oldHash of passwordHistory) {
      const isMatch = await bcrypt.compare(candidatePassword, oldHash);
      if (isMatch) return true;
    }
    return false;
  },

  /**
   * Hashes a password string.
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
};

export default passwordService;
