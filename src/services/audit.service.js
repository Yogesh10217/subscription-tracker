/**
 * @file audit.service.js
 * @module services/audit.service
 * @description Decoupled security audit logging service.
 */

import securityRepository from '../repositories/security.repository.js';
import logger from '../utils/logger.js';

export const auditService = {
  /**
   * Records a security audit log entry.
   * Parameter normalization handles action/eventType and actor/user synonyms.
   * @param {Object} params
   * @param {string} [params.action] - Event action (e.g. LOGIN_SUCCESS, ACCOUNT_LOCKED)
   * @param {string} [params.eventType] - Synonym for action
   * @param {string} [params.actor] - User ID who performed action
   * @param {string} [params.user] - Synonym for actor
   * @param {string} [params.target] - Target resource or user ID
   * @param {string} [params.ipAddress='127.0.0.1']
   * @param {string} [params.userAgent='Unknown']
   * @param {string} [params.correlationId] - Request ID
   * @param {string} [params.result='SUCCESS'] - SUCCESS | FAILURE | DENIED
   * @param {Object} [params.metadata={}]
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
  }) {
    const finalAction = action || eventType || 'SYSTEM_EVENT';
    const finalActor = actor || user || null;

    try {
      const logEntry = await securityRepository.createAuditLog({
        action: finalAction,
        actor: finalActor,
        target,
        ipAddress,
        userAgent,
        correlationId,
        result,
        metadata,
        timestamp: new Date()
      });

      logger.info(
        `[AUDIT] ${finalAction} - ${result}`,
        { actor: finalActor, target, ipAddress },
        correlationId
      );
      return logEntry;
    } catch (error) {
      logger.error('Failed to persist audit log', { error: error.message }, correlationId);
      return null;
    }
  }
};

export default auditService;
