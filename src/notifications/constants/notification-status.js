/**
 * @file notification-status.js
 * @module notifications/constants/notification-status
 * @description Constants for delivery status lifecycle.
 */

export const NotificationDeliveryStatus = Object.freeze({
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  PROCESSING: 'PROCESSING',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  RETRYING: 'RETRYING'
});

export default NotificationDeliveryStatus;
