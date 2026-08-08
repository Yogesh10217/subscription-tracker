/**
 * @file idempotency.util.js
 * @module notifications/utils/idempotency.util
 * @description Generates deterministic SHA-256 idempotency keys.
 */

import crypto from 'crypto';

export class IdempotencyUtil {
  /**
   * Generates a deterministic SHA-256 idempotency key.
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} [params.subscriptionId]
   * @param {string} [params.reminderRuleId]
   * @param {string} params.notificationType
   * @param {string|Date} params.scheduledDate
   * @param {string} params.channel
   * @returns {string} SHA-256 hex string
   */
  static generateKey({
    userId,
    subscriptionId = '',
    reminderRuleId = '',
    notificationType,
    scheduledDate,
    channel
  }) {
    const formattedDate = new Date(scheduledDate).toISOString().split('T')[0];
    const raw = `${userId}:${subscriptionId}:${reminderRuleId}:${notificationType}:${formattedDate}:${channel}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }
}

export default IdempotencyUtil;
