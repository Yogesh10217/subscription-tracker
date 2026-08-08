/**
 * @file notification.repository.js
 * @module notifications/repositories/notification.repository
 * @description Encapsulates database operations for notifications.
 */

import Notification from '../models/notification.model.js';
import NotificationDeliveryStatus from '../constants/notification-status.js';

export const notificationRepository = {
  async create(data) {
    return Notification.create(data);
  },

  async findById(id) {
    return Notification.findById(id).populate('subscription').lean();
  },

  async findByUser(userId, { channel, unreadOnly = false, skip = 0, limit = 20 } = {}) {
    const query = { user: userId };
    if (channel) query.channel = channel;
    if (unreadOnly) query.readAt = null;

    const [items, total] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(query)
    ]);

    return { items, total };
  },

  async findUnread(userId) {
    return Notification.find({ user: userId, readAt: null }).sort({ createdAt: -1 }).lean();
  },

  async countUnread(userId) {
    return Notification.countDocuments({ user: userId, readAt: null });
  },

  async findByIdempotencyKey(key) {
    return Notification.findOne({ idempotencyKey: key }).lean();
  },

  async markProcessing(id) {
    return Notification.findByIdAndUpdate(
      id,
      { deliveryStatus: NotificationDeliveryStatus.PROCESSING },
      { new: true }
    );
  },

  async markSent(id, providerMessageId = null) {
    return Notification.findByIdAndUpdate(
      id,
      {
        deliveryStatus: NotificationDeliveryStatus.SENT,
        sentAt: new Date(),
        providerMessageId
      },
      { new: true }
    );
  },

  async markDelivered(id) {
    return Notification.findByIdAndUpdate(
      id,
      {
        deliveryStatus: NotificationDeliveryStatus.DELIVERED,
        deliveredAt: new Date()
      },
      { new: true }
    );
  },

  async markRead(id, userId) {
    return Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { readAt: new Date() },
      { new: true }
    );
  },

  async markAllRead(userId) {
    return Notification.updateMany({ user: userId, readAt: null }, { readAt: new Date() });
  },

  async markFailed(id, failureReason) {
    return Notification.findByIdAndUpdate(
      id,
      {
        deliveryStatus: NotificationDeliveryStatus.FAILED,
        failedAt: new Date(),
        failureReason
      },
      { new: true }
    );
  },

  async markRetrying(id, retryCount) {
    return Notification.findByIdAndUpdate(
      id,
      {
        deliveryStatus: NotificationDeliveryStatus.RETRYING,
        retryCount
      },
      { new: true }
    );
  },

  async delete(id, userId) {
    return Notification.findOneAndDelete({ _id: id, user: userId });
  }
};

export default notificationRepository;
