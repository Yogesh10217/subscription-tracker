/**
 * @file reminder-engine.service.js
 * @module notifications/jobs/reminder-engine.service
 * @description Evaluates active subscription renewal rules and trial expirations to create scheduled notifications.
 */

import dayjs from 'dayjs';
import ReminderRule from '../../models/reminder-rule.model.js';
import notificationRepository from '../repositories/notification.repository.js';
import notificationPreferenceRepository from '../repositories/notification-preference.repository.js';
import NotificationType from '../constants/notification-types.js';
import NotificationChannel from '../constants/notification-channels.js';
import NotificationDeliveryStatus from '../constants/notification-status.js';
import IdempotencyUtil from '../utils/idempotency.util.js';
import TemplateService from '../templates/template.service.js';
import NotificationRules from '../rules/notification.rules.js';
import logger from '../../utils/logger.js';

export class ReminderEngineService {
  /**
   * Processes all due subscription renewals and creates atomic scheduled notification records.
   * @returns {Promise<{ createdCount: number, skippedCount: number }>}
   */
  static async evaluateRenewals() {
    let createdCount = 0;
    let skippedCount = 0;

    // 1. Fetch active enabled reminder rules
    const rules = await ReminderRule.find({ isEnabled: true }).populate('subscription').lean();

    for (const rule of rules) {
      const sub = rule.subscription;
      if (!sub || sub.isDeleted || sub.isArchived || sub.status !== 'Active') {
        continue;
      }

      const renewalDate = dayjs(sub.renewalDate);
      const daysBefore = rule.daysBefore || 3;
      const targetDate = renewalDate.subtract(daysBefore, 'day');
      const today = dayjs().startOf('day');

      // Check if reminder is due
      if (today.isSame(targetDate, 'day') || today.isAfter(targetDate, 'day')) {
        const preferences = await notificationPreferenceRepository.findByUserId(sub.user);

        // Check rules for EMAIL channel
        const emailEval = NotificationRules.evaluate({
          type: NotificationType.RENEWAL_REMINDER,
          channel: NotificationChannel.EMAIL,
          preferences
        });

        if (emailEval.allowed) {
          const idempotencyKey = IdempotencyUtil.generateKey({
            userId: sub.user,
            subscriptionId: sub._id,
            reminderRuleId: rule._id,
            notificationType: NotificationType.RENEWAL_REMINDER,
            scheduledDate: targetDate.toDate(),
            channel: NotificationChannel.EMAIL
          });

          const rendered = TemplateService.render(NotificationType.RENEWAL_REMINDER, {
            subscriptionName: sub.name,
            price: sub.price,
            currency: sub.currency,
            renewalDate: sub.renewalDate,
            daysBefore
          });

          try {
            await notificationRepository.create({
              user: sub.user,
              type: NotificationType.RENEWAL_REMINDER,
              channel: NotificationChannel.EMAIL,
              title: rendered.title,
              body: rendered.text,
              subscription: sub._id,
              reminderRule: rule._id,
              deliveryStatus: NotificationDeliveryStatus.SCHEDULED,
              scheduledFor: targetDate.toDate(),
              idempotencyKey,
              metadata: { renderedHtml: rendered.html, daysBefore }
            });
            createdCount += 1;
          } catch (err) {
            // E11000 duplicate key error is caught gracefully (concurrency protected)
            if (err.code === 11000) {
              skippedCount += 1;
            } else {
              logger.error('Failed to insert renewal notification', { error: err.message });
            }
          }
        }

        // Also create IN_APP notification if allowed
        const inAppEval = NotificationRules.evaluate({
          type: NotificationType.RENEWAL_REMINDER,
          channel: NotificationChannel.IN_APP,
          preferences
        });

        if (inAppEval.allowed) {
          const idempotencyKey = IdempotencyUtil.generateKey({
            userId: sub.user,
            subscriptionId: sub._id,
            reminderRuleId: rule._id,
            notificationType: NotificationType.RENEWAL_REMINDER,
            scheduledDate: targetDate.toDate(),
            channel: NotificationChannel.IN_APP
          });

          const rendered = TemplateService.render(NotificationType.RENEWAL_REMINDER, {
            subscriptionName: sub.name,
            price: sub.price,
            currency: sub.currency,
            renewalDate: sub.renewalDate,
            daysBefore
          });

          try {
            await notificationRepository.create({
              user: sub.user,
              type: NotificationType.RENEWAL_REMINDER,
              channel: NotificationChannel.IN_APP,
              title: rendered.title,
              body: rendered.text,
              subscription: sub._id,
              reminderRule: rule._id,
              deliveryStatus: NotificationDeliveryStatus.DELIVERED, // In-app delivered immediately
              deliveredAt: new Date(),
              scheduledFor: targetDate.toDate(),
              idempotencyKey,
              metadata: { daysBefore }
            });
            createdCount += 1;
          } catch (err) {
            if (err.code === 11000) {
              skippedCount += 1;
            }
          }
        }
      }
    }

    return { createdCount, skippedCount };
  }
}

export default ReminderEngineService;
