/**
 * @file template.service.js
 * @module notifications/templates/template.service
 * @description Centralized template resolver and sanitization engine.
 */

import renderRenewalReminder from './renewal-reminder.template.js';
import renderTrialExpiration from './trial-expiration.template.js';
import renderPriceChange from './price-change.template.js';
import renderSubscriptionCreated from './subscription-created.template.js';
import renderSubscriptionCancelled from './subscription-cancelled.template.js';
import NotificationType from '../constants/notification-types.js';

export class TemplateService {
  /**
   * Resolves and renders title, HTML, and text for a given notification type and payload.
   * @param {string} type - NotificationType
   * @param {Object} data - Payload parameters
   * @returns {{ title: string, html: string, text: string }}
   */
  static render(type, data = {}) {
    switch (type) {
      case NotificationType.RENEWAL_REMINDER:
        return renderRenewalReminder(data);

      case NotificationType.TRIAL_EXPIRING:
        return renderTrialExpiration(data);

      case NotificationType.PRICE_CHANGE:
        return renderPriceChange(data);

      case NotificationType.SUBSCRIPTION_CREATED:
        return renderSubscriptionCreated(data);

      case NotificationType.SUBSCRIPTION_CANCELLED:
        return renderSubscriptionCancelled(data);

      default: {
        const safeTitle = String(data.title || 'SubPulse Notification')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        const safeBody = String(data.body || '')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return {
          title: safeTitle,
          html: `<p>${safeBody}</p>`,
          text: safeBody
        };
      }
    }
  }
}

export default TemplateService;
