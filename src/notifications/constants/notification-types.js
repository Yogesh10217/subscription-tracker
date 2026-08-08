/**
 * @file notification-types.js
 * @module notifications/constants/notification-types
 * @description Constants for supported notification types.
 */

export const NotificationType = Object.freeze({
  RENEWAL_REMINDER: 'RENEWAL_REMINDER',
  TRIAL_EXPIRING: 'TRIAL_EXPIRING',
  PRICE_CHANGE: 'PRICE_CHANGE',
  SUBSCRIPTION_CREATED: 'SUBSCRIPTION_CREATED',
  SUBSCRIPTION_UPDATED: 'SUBSCRIPTION_UPDATED',
  SUBSCRIPTION_CANCELLED: 'SUBSCRIPTION_CANCELLED',
  SUBSCRIPTION_RESTORED: 'SUBSCRIPTION_RESTORED',
  REMINDER_UPDATED: 'REMINDER_UPDATED',
  IMPORT_COMPLETED: 'IMPORT_COMPLETED',
  SYSTEM: 'SYSTEM'
});

export default NotificationType;
