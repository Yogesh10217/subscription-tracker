/**
 * @file audit.service.js
 * @module services/audit.service
 * @description Decoupled security audit logging service with non-blocking error handling.
 */

import mongoose from 'mongoose';
import securityRepository from '../repositories/security.repository.js';
import logger from '../utils/logger.js';

export const auditService = {
  /**
   * Records a security audit log entry.
   * Parameter normalization handles action/eventType and actor/user synonyms.
   * Never throws or blocks main execution thread if database is disconnected or buffering times out.
   * @param {Object} params
   * @returns {Promise<Object|null>}
   */
  async logEvent({
    action,
    eventType,
    actor = null,
    user = null,
    target = null,
    ipAddress = '127.0.0.1',
    userAgent = 'Unknown',
    correlationId = null,
    result = 'SUCCESS',
    metadata = {}
  } = {}) {
    const finalAction = action || eventType || 'SYSTEM_EVENT';
    const finalActor = actor || user || null;

    logger.info(
      `[AUDIT] ${finalAction} - ${result}`,
      { actor: finalActor, target, ipAddress },
      correlationId
    );

    // Skip Mongoose write if MongoDB is disconnected and not in test environment
    if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'test') {
      return null;
    }

    let timeoutId;

    try {
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Audit log write timeout')), 3000);
      });

      const logEntry = await Promise.race([
        securityRepository.createAuditLog({
          action: finalAction,
          actor: finalActor,
          target,
          ipAddress,
          userAgent,
          correlationId,
          result,
          metadata,
          timestamp: new Date()
        }),
        timeoutPromise
      ]);

      return logEntry;
    } catch (error) {
      logger.error('Failed to persist audit log', { error: error.message }, correlationId);
      return null;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
};

export default auditService;
