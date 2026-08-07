/**
 * @file verification.service.js
 * @module services/verification.service
 * @description Manages SHA-256 hashed verification tokens for email verification and password resets.
 */

import crypto from 'crypto';
import securityRepository from '../repositories/security.repository.js';
import SECURITY_CONFIG from '../config/security.js';
import ApiError from '../utils/api-error.js';

export const verificationService = {
  /**
   * Hashes a raw token using SHA-256.
   * @param {string} token
   * @returns {string}
   */
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  },

  /**
   * Generates a random unhashed token and stores its SHA-256 hash in database.
   * @param {string} userId
   * @param {string} type - 'email_verification' | 'password_reset'
   * @param {number} [ttlSeconds]
   * @returns {Promise<{ rawToken: string, hashedToken: string }>}
   */
  async createVerificationToken(
    userId,
    type,
    ttlSeconds = SECURITY_CONFIG.VERIFICATION_TOKEN_TTL_SEC
  ) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    await securityRepository.saveVerificationToken({
      user: userId,
      tokenHash: hashedToken,
      type,
      expiresAt
    });

    return { rawToken, hashedToken };
  },

  /**
   * Validates an incoming unhashed token against database SHA-256 hashes.
   * @param {string} rawToken
   * @param {string} type
   * @returns {Promise<Object>} VerificationToken document
   * @throws {ApiError} If invalid or expired
   */
  async verifyToken(rawToken, type) {
    if (!rawToken) {
      throw ApiError.badRequest('Verification token is required');
    }

    const hashedToken = this.hashToken(rawToken);
    const tokenDoc = await securityRepository.findVerificationToken(hashedToken, type);

    if (!tokenDoc) {
      throw ApiError.badRequest('Invalid or expired verification token');
    }

    return tokenDoc;
  },

  /**
   * Consumes and deletes a verification token after successful use.
   * @param {string} tokenId
   */
  async consumeToken(tokenId) {
    await securityRepository.deleteVerificationToken(tokenId);
  }
};

export default verificationService;
