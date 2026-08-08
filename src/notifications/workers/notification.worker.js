/**
 * @file notification.worker.js
 * @module notifications/workers/notification.worker
 * @description Asynchronous worker handling notification delivery, status transitions, retries, and audit logging.
 */

import notificationRepository from '../repositories/notification.repository.js';
import userRepository from '../../repositories/user.repository.js';
import emailProvider from '../providers/email.provider.js';
import NotificationDeliveryStatus from '../constants/notification-status.js';
import FailureClassifier, { FailureType } from '../utils/failure-classifier.util.js';
import auditService from '../../services/audit.service.js';
import logger from '../../utils/logger.js';

export class NotificationWorker {
  /**
   * Processes an asynchronous notification delivery job payload.
   * @param {Object} payload
   * @param {string} payload.notificationId
   * @returns {Promise<Object>} Delivery result
   */
  static async processJob({ notificationId }) {
    if (!notificationId) {
      throw new Error('Worker execution error: notificationId is required');
    }

    const notif = await notificationRepository.findById(notificationId);
    if (!notif) {
      throw new Error(`Notification record not found: ${notificationId}`);
    }

    // Idempotency check: only process if status is SCHEDULED or RETRYING
    if (
      notif.deliveryStatus !== NotificationDeliveryStatus.SCHEDULED &&
      notif.deliveryStatus !== NotificationDeliveryStatus.RETRYING
    ) {
      logger.info('Notification skipped by worker: invalid status transition', {
        id: notificationId,
        status: notif.deliveryStatus
      });
      return { skipped: true, status: notif.deliveryStatus };
    }

    // Mark status PROCESSING
    await notificationRepository.markProcessing(notificationId);

    const user = await userRepository.findByIdRaw(notif.user);
    if (!user || !user.email) {
      const reason = 'Recipient user email missing or deleted';
      await notificationRepository.markFailed(notificationId, reason);
      await auditService.logEvent({
        user: notif.user,
        eventType: 'NOTIFICATION_FAILED',
        metadata: { notificationId, reason }
      });
      return { success: false, reason };
    }

    try {
      if (notif.channel === 'EMAIL') {
        const result = await emailProvider.send({
          recipientEmail: user.email,
          subject: notif.title,
          html: notif.metadata?.renderedHtml || `<p>${notif.body}</p>`,
          text: notif.body
        });

        await notificationRepository.markSent(notificationId, result.messageId);

        await auditService.logEvent({
          user: notif.user,
          eventType: 'NOTIFICATION_SENT',
          metadata: { notificationId, messageId: result.messageId, channel: 'EMAIL' }
        });

        return { success: true, messageId: result.messageId };
      } else {
        // IN_APP delivery
        await notificationRepository.markDelivered(notificationId);
        return { success: true, delivered: true };
      }
    } catch (err) {
      const failureType = FailureClassifier.classify(err);
      const newRetryCount = (notif.retryCount || 0) + 1;

      if (failureType === FailureType.PERMANENT || newRetryCount > (notif.maxRetries || 5)) {
        await notificationRepository.markFailed(notificationId, err.message);
        await auditService.logEvent({
          user: notif.user,
          eventType: 'NOTIFICATION_FAILED',
          metadata: { notificationId, reason: err.message, retryCount: newRetryCount }
        });
        return { success: false, failed: true, reason: err.message };
      } else {
        await notificationRepository.markRetrying(notificationId, newRetryCount);
        await auditService.logEvent({
          user: notif.user,
          eventType: 'NOTIFICATION_RETRIED',
          metadata: { notificationId, retryCount: newRetryCount, error: err.message }
        });
        return { success: false, retrying: true, retryCount: newRetryCount };
      }
    }
  }
}

export default NotificationWorker;
