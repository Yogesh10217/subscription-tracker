/**
 * @file security.repository.js
 * @module repositories/security.repository
 * @description Data access operations for verification tokens and security audit logs.
 */

import VerificationToken from '../models/verification-token.model.js';
import AuditLog from '../models/audit-log.model.js';

export const securityRepository = {
  /**
   * Saves a new verification token document.
   * @param {Object} tokenData
   * @returns {Promise<Object>}
   */
  async saveVerificationToken(tokenData) {
    // Invalidate prior active tokens of same type for user
    await VerificationToken.deleteMany({ user: tokenData.user, type: tokenData.type });
    return VerificationToken.create(tokenData);
  },

  /**
   * Finds a verification token by SHA-256 hash and type.
   * @param {string} tokenHash
   * @param {string} type
   * @returns {Promise<Object|null>}
   */
  async findVerificationToken(tokenHash, type) {
    return VerificationToken.findOne({
      tokenHash,
      type,
      expiresAt: { $gt: new Date() }
    });
  },

  /**
   * Deletes a verification token by ID.
   * @param {string} tokenId
   * @returns {Promise<Object|null>}
   */
  async deleteVerificationToken(tokenId) {
    return VerificationToken.findByIdAndDelete(tokenId);
  },

  /**
   * Persists a security audit log entry.
   * @param {Object} auditData
   * @returns {Promise<Object>}
   */
  async createAuditLog(auditData) {
    return AuditLog.create(auditData);
  },

  /**
   * Queries audit logs with pagination.
   * @param {Object} filter
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async findAuditLogs(filter = {}, limit = 50) {
    return AuditLog.find(filter).sort({ timestamp: -1 }).limit(limit);
  }
};

export default securityRepository;
