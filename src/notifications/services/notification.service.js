/**
 * @file notification.service.js
 * @module notifications/services/notification.service
 * @description Facade service orchestrating in-app notifications, lifecycle event triggers, and read states.
 */

import notificationRepository from '../repositories/notification.repository.js';
import notificationPreferenceRepository from '../repositories/notification-preference.repository.js';
import NotificationRules from '../rules/notification.rules.js';
import NotificationChannel from '../constants/notification-channels.js';
import NotificationDeliveryStatus from '../constants/notification-status.js';
import TemplateService from '../templates/template.service.js';
import IdempotencyUtil from '../utils/idempotency.util.js';
import auditService from '../../services/audit.service.js';
import ApiError from '../../utils/api-error.js';

export const notificationService = {
  async getUserNotifications(userId, options) {
    return notificationRepository.findByUser(userId, options);
  },

  async getUnreadCount(userId) {
    return notificationRepository.countUnread(userId);
  },

  async markRead(notificationId, userId) {
    const updated = await notificationRepository.markRead(notificationId, userId);
    if (!updated) {
      throw ApiError.notFound('Notification not found or access denied');
    }

    await auditService.logEvent({
      user: userId,
      eventType: 'NOTIFICATION_READ',
      metadata: { notificationId }
    });

    return updated;
  },

  async markAllRead(userId) {
    await notificationRepository.markAllRead(userId);
    return { success: true };
  },

  async deleteNotification(notificationId, userId) {
    const deleted = await notificationRepository.delete(notificationId, userId);
    if (!deleted) {
      throw ApiError.notFound('Notification not found or access denied');
    }
    return { success: true };
  },

  /**
   * Triggers direct lifecycle event notification (e.g. SUBSCRIPTION_CREATED, PRICE_CHANGE).
   */
  async notifyLifecycleEvent({ userId, type, subscription, oldPrice, newPrice, currency }) {
    const preferences = await notificationPreferenceRepository.findByUserId(userId);

    const rendered = TemplateService.render(type, {
      subscriptionName: subscription.name,
      price: subscription.price,
      currency: currency || subscription.currency,
      frequency: subscription.frequency,
      oldPrice,
      newPrice
    });

    // In-App Notification
    const inAppEval = NotificationRules.evaluate({
      type,
      channel: NotificationChannel.IN_APP,
      preferences
    });

    if (inAppEval.allowed) {
      const idempotencyKey = IdempotencyUtil.generateKey({
        userId,
        subscriptionId: subscription._id,
        notificationType: type,
        scheduledDate: new Date(),
        channel: NotificationChannel.IN_APP
      });

      try {
        await notificationRepository.create({
          user: userId,
          type,
          channel: NotificationChannel.IN_APP,
          title: rendered.title,
          body: rendered.text,
          subscription: subscription._id,
          deliveryStatus: NotificationDeliveryStatus.DELIVERED,
          deliveredAt: new Date(),
          idempotencyKey
        });
      } catch (err) {
        // Duplicate key ignored safely
      }
    }
  }
};

export default notificationService;
