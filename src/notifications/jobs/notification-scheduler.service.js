/**
 * @file notification-scheduler.service.js
 * @module notifications/jobs/notification-scheduler.service
 * @description Scheduler orchestrating reminder evaluations and due notification processing.
 */

import ReminderEngineService from './reminder-engine.service.js';
import Notification from '../models/notification.model.js';
import NotificationDeliveryStatus from '../constants/notification-status.js';
import notificationWorker from '../workers/notification.worker.js';
import notificationRepository from '../repositories/notification.repository.js';
import logger from '../../utils/logger.js';

export class NotificationSchedulerService {
  /**
   * Executes scheduler cycle evaluating rules and processing due notifications.
   * @returns {Promise<{ evaluations: Object, processedCount: number }>}
   */
  static async runScheduler() {
    // 0. Recover stale processing
    const recoveryResult = await notificationRepository.recoverStaleProcessing(15);
    logger.info('Stale notification recovery complete', recoveryResult);

    // 1. Evaluate renewals & trials
    const evaluations = await ReminderEngineService.evaluateRenewals();

    // 2. Query due scheduled EMAIL notifications
    const dueNotifications = await Notification.find({
      deliveryStatus: {
        $in: [NotificationDeliveryStatus.SCHEDULED, NotificationDeliveryStatus.RETRYING]
      },
      channel: 'EMAIL',
      scheduledFor: { $lte: new Date() }
    }).lean();

    let processedCount = 0;

    for (const notif of dueNotifications) {
      await notificationWorker.processJob({ notificationId: notif._id.toString() });
      processedCount += 1;
    }

    return { evaluations, processedCount };
  }
}

export default NotificationSchedulerService;
