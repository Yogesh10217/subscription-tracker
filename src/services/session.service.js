/**
 * @file session.service.js
 * @module services/session.service
 * @description Manages device sessions, refresh token family rotation, and replay detection.
 */

import crypto from 'crypto';
import sessionRepository from '../repositories/session.repository.js';
import auditService from './audit.service.js';
import ApiError from '../utils/api-error.js';

export const sessionService = {
  /**
   * Hashes a refresh token using SHA-256.
   * @param {string} token
   * @returns {string}
   */
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  },

  /**
   * Creates a new user session and initial refresh token family.
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.refreshToken
   * @param {string} [params.userAgent]
   * @param {string} [params.ipAddress]
   * @returns {Promise<Object>}
   */
  async createSession({ userId, refreshToken, userAgent = 'Unknown', ipAddress = '127.0.0.1' }) {
    const familyId = crypto.randomUUID();
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await sessionRepository.create({
      user: userId,
      familyId,
      refreshTokenHash: tokenHash,
      parentTokenHash: null,
      currentTokenHash: tokenHash,
      device: userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Workstation',
      browser: userAgent.includes('Chrome') ? 'Chrome' : 'Standard Browser',
      os: userAgent.includes('Windows') ? 'Windows' : 'Linux/macOS',
      ipAddress,
      expiresAt
    });

    await auditService.logEvent({
      action: 'SESSION_CREATED',
      actor: userId,
      ipAddress,
      userAgent,
      metadata: { sessionId: session._id, familyId }
    });

    return session;
  },

  /**
   * Rotates a session refresh token. Detects replay attacks and revokes token family if replayed.
   * @param {string} refreshToken
   * @param {string} newRefreshToken
   * @param {string} [ipAddress]
   * @param {string} [userAgent]
   * @returns {Promise<Object>} Updated session document
   * @throws {ApiError} If token invalid or replayed
   */
  async rotateSession(
    refreshToken,
    newRefreshToken,
    ipAddress = '127.0.0.1',
    userAgent = 'Unknown'
  ) {
    const tokenHash = this.hashToken(refreshToken);
    const existingSession = await sessionRepository.findAnyByRefreshToken(tokenHash);

    if (!existingSession) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    // Replay Attack Detection: If token is revoked or not current, breach detected!
    if (existingSession.isRevoked || existingSession.refreshTokenHash !== tokenHash) {
      await sessionRepository.revokeFamily(
        existingSession.familyId,
        'Replay Attack Breach Detected'
      );

      await auditService.logEvent({
        action: 'TOKEN_REPLAY_BREACH_DETECTED',
        actor: existingSession.user,
        ipAddress,
        userAgent,
        result: 'DENIED',
        metadata: { familyId: existingSession.familyId }
      });

      throw ApiError.unauthorized('Security alert: Token reuse detected. All sessions revoked.');
    }

    const newHash = this.hashToken(newRefreshToken);
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const updated = await sessionRepository.rotate(existingSession._id, newHash, newExpiresAt);

    await auditService.logEvent({
      action: 'SESSION_ROTATED',
      actor: existingSession.user,
      ipAddress,
      userAgent,
      metadata: { sessionId: existingSession._id }
    });

    return updated;
  },

  /**
   * Revokes a single active session.
   * @param {string} sessionId
   * @param {string} userId
   * @param {string} [reason='User Logout']
   */
  async revokeSession(sessionId, userId, reason = 'User Logout') {
    const session = await sessionRepository.revoke(sessionId, reason);
    if (session) {
      await auditService.logEvent({
        action: 'SESSION_REVOKED',
        actor: userId,
        metadata: { sessionId, reason }
      });
    }
    return session;
  },

  /**
   * Revokes all sessions for a user.
   * @param {string} userId
   * @param {string} [reason='User Logout All']
   */
  async revokeAllSessions(userId, reason = 'User Logout All') {
    await sessionRepository.revokeAll(userId, reason);
    await auditService.logEvent({
      action: 'ALL_SESSIONS_REVOKED',
      actor: userId,
      metadata: { reason }
    });
  },

  /**
   * Fetches all active sessions for user.
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getUserSessions(userId) {
    return sessionRepository.findUserSessions(userId);
  }
};

export default sessionService;
