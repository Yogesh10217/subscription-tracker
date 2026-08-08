/**
 * @file notification.rules.js
 * @module notifications/rules/notification.rules
 * @description Evaluates user preferences, channel flags, timezone semantics, and quiet hours.
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezonePlugin from 'dayjs/plugin/timezone.js';
import NotificationType from '../constants/notification-types.js';
import NotificationChannel from '../constants/notification-channels.js';
import NotificationPriority from '../constants/notification-priority.js';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

export class NotificationRules {
  /**
   * Evaluates if a notification is allowed to be sent for a user based on preferences and quiet hours.
   * @param {Object} params
   * @param {string} params.type - NotificationType
   * @param {string} params.channel - NotificationChannel
   * @param {string} [params.priority='NORMAL'] - NotificationPriority
   * @param {Object} params.preferences - NotificationPreference record
   * @returns {{ allowed: boolean, reason?: string, deferUntil?: Date }}
   */
  static evaluate({ type, channel, priority = NotificationPriority.NORMAL, preferences }) {
    if (!preferences) {
      return { allowed: true };
    }

    // 1. Channel level checks
    if (channel === NotificationChannel.EMAIL && preferences.emailEnabled === false) {
      return { allowed: false, reason: 'Email notifications disabled by user' };
    }

    if (channel === NotificationChannel.IN_APP && preferences.inAppEnabled === false) {
      return { allowed: false, reason: 'In-app notifications disabled by user' };
    }

    // 2. Type level checks
    if (type === NotificationType.RENEWAL_REMINDER && preferences.renewalReminders === false) {
      return { allowed: false, reason: 'Renewal reminders disabled by user' };
    }

    if (type === NotificationType.TRIAL_EXPIRING && preferences.trialReminders === false) {
      return { allowed: false, reason: 'Trial reminders disabled by user' };
    }

    if (type === NotificationType.PRICE_CHANGE && preferences.priceChangeAlerts === false) {
      return { allowed: false, reason: 'Price change alerts disabled by user' };
    }

    if (
      [
        NotificationType.SUBSCRIPTION_CREATED,
        NotificationType.SUBSCRIPTION_CANCELLED,
        NotificationType.SUBSCRIPTION_RESTORED,
        NotificationType.REMINDER_UPDATED
      ].includes(type) &&
      preferences.subscriptionLifecycleAlerts === false
    ) {
      return { allowed: false, reason: 'Lifecycle alerts disabled by user' };
    }

    // 3. Quiet Hours Check (CRITICAL priority bypasses quiet hours)
    if (preferences.quietHoursEnabled && priority !== NotificationPriority.CRITICAL) {
      const userTz = preferences.timezone || 'UTC';
      const nowUser = dayjs().tz(userTz);
      const [startHour, startMin] = (preferences.quietHoursStart || '22:00').split(':').map(Number);
      const [endHour, endMin] = (preferences.quietHoursEnd || '07:00').split(':').map(Number);

      const quietStart = nowUser.hour(startHour).minute(startMin).second(0);
      let quietEnd = nowUser.hour(endHour).minute(endMin).second(0);

      if (quietEnd.isBefore(quietStart)) {
        quietEnd = quietEnd.add(1, 'day');
      }

      if (nowUser.isAfter(quietStart) && nowUser.isBefore(quietEnd)) {
        return {
          allowed: false,
          reason: 'Quiet hours active',
          deferUntil: quietEnd.toDate()
        };
      }
    }

    return { allowed: true };
  }
}

export default NotificationRules;
