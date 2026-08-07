/**
 * @file session.repository.js
 * @module repositories/session.repository
 * @description Mongoose data access operations for user sessions and refresh token rotation.
 */

import Session from '../models/session.model.js';

export const sessionRepository = {
  /**
   * Creates a new user session document.
   * @param {Object} sessionData
   * @returns {Promise<Object>}
   */
  async create(sessionData) {
    return Session.create(sessionData);
  },

  /**
   * Finds an active, non-revoked session by refresh token hash.
   * @param {string} refreshTokenHash
   * @returns {Promise<Object|null>}
   */
  async findByRefreshToken(refreshTokenHash) {
    return Session.findOne({ refreshTokenHash, isRevoked: false });
  },

  /**
   * Finds any session (even revoked) by refresh token hash for replay detection.
   * @param {string} refreshTokenHash
   * @returns {Promise<Object|null>}
   */
  async findAnyByRefreshToken(refreshTokenHash) {
    return Session.findOne({ refreshTokenHash });
  },

  /**
   * Rotates a session refresh token hash.
   * @param {string} sessionId
   * @param {string} newRefreshTokenHash
   * @param {Date} newExpiresAt
   * @returns {Promise<Object|null>}
   */
  async rotate(sessionId, newRefreshTokenHash, newExpiresAt) {
    return Session.findByIdAndUpdate(
      sessionId,
      {
        parentTokenHash: '$refreshTokenHash',
        refreshTokenHash: newRefreshTokenHash,
        currentTokenHash: newRefreshTokenHash,
        lastSeen: new Date(),
        expiresAt: newExpiresAt
      },
      { new: true }
    );
  },

  /**
   * Revokes a specific session by ID.
   * @param {string} sessionId
   * @param {string} [reason='User Logout']
   * @returns {Promise<Object|null>}
   */
  async revoke(sessionId, reason = 'User Logout') {
    return Session.findByIdAndUpdate(
      sessionId,
      { isRevoked: true, revokedReason: reason, isCurrent: false },
      { new: true }
    );
  },

  /**
   * Revokes all active sessions for a user family or token family.
   * @param {string} familyId
   * @param {string} [reason='Replay Detection Revocation']
   * @returns {Promise<Object>}
   */
  async revokeFamily(familyId, reason = 'Replay Detection Revocation') {
    return Session.updateMany(
      { familyId, isRevoked: false },
      { isRevoked: true, revokedReason: reason, isCurrent: false }
    );
  },

  /**
   * Revokes all active sessions for a specific user ID.
   * @param {string} userId
   * @param {string} [reason='User Logout All']
   * @returns {Promise<Object>}
   */
  async revokeAll(userId, reason = 'User Logout All') {
    return Session.updateMany(
      { user: userId, isRevoked: false },
      { isRevoked: true, revokedReason: reason, isCurrent: false }
    );
  },

  /**
   * Retrieves active, non-revoked sessions for a user ID.
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async findUserSessions(userId) {
    return Session.find({ user: userId, isRevoked: false }).sort({ lastSeen: -1 });
  },

  /**
   * Cleans up expired sessions from database.
   * @returns {Promise<Object>}
   */
  async cleanupExpired() {
    return Session.deleteMany({ expiresAt: { $lt: new Date() } });
  }
};

export default sessionRepository;
