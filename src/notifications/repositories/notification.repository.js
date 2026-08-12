/**
 * @file notification.repository.js
 * @module notifications/repositories/notification.repository
 * @description Encapsulates database operations for notifications.
 */

import mongoose from 'mongoose';
import Notification from '../models/notification.model.js';
import NotificationDeliveryStatus from '../constants/notification-status.js';

export const notificationRepository = {
  async create(data) {
    return Notification.create(data);
  },

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { _id: id, deliveryStatus: NotificationDeliveryStatus.PROCESSING };
    }
    return Notification.findOneAndUpdate(
      {
        _id: id,
        deliveryStatus: {
          $in: [NotificationDeliveryStatus.SCHEDULED, NotificationDeliveryStatus.RETRYING]
        }
      },
      {
        $set: {
          deliveryStatus: NotificationDeliveryStatus.PROCESSING,
          processingStartedAt: new Date()
        }
      },
      { new: true }
    );
  },

  async markSent(id, providerMessageId = null) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { _id: id, deliveryStatus: NotificationDeliveryStatus.SENT };
    }
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { _id: id, deliveryStatus: NotificationDeliveryStatus.DELIVERED };
    }
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { _id: id, deliveryStatus: NotificationDeliveryStatus.FAILED };
    }
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

  async markRetrying(id, retryCount, scheduledFor = null) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { _id: id, deliveryStatus: NotificationDeliveryStatus.RETRYING, retryCount };
    }
    const update = {
      deliveryStatus: NotificationDeliveryStatus.RETRYING,
      retryCount
    };
    if (scheduledFor) update.scheduledFor = scheduledFor;
    return Notification.findByIdAndUpdate(id, update, { new: true });
  },

  async delete(id, userId) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Notification.findOneAndDelete({ _id: id, user: userId });
  },

  async recoverStaleProcessing(timeoutMinutes = 15) {
    if (mongoose.connection.readyState !== 1) {
      return { recoveredCount: 0, failedCount: 0 };
    }
    const threshold = new Date(Date.now() - timeoutMinutes * 60 * 1000);

    const recoverable = await Notification.updateMany(
      {
        deliveryStatus: NotificationDeliveryStatus.PROCESSING,
        processingStartedAt: { $lt: threshold },
        $expr: { $lt: ['$retryCount', '$maxRetries'] }
      },
      {
        $set: { deliveryStatus: NotificationDeliveryStatus.SCHEDULED },
        $inc: { retryCount: 1 }
      }
    );

    const failed = await Notification.updateMany(
      {
        deliveryStatus: NotificationDeliveryStatus.PROCESSING,
        processingStartedAt: { $lt: threshold },
        $expr: { $gte: ['$retryCount', '$maxRetries'] }
      },
      {
        $set: {
          deliveryStatus: NotificationDeliveryStatus.FAILED,
          failedAt: new Date(),
          failureReason: 'Stale processing timeout - max retries exceeded'
        }
      }
    );

    return { recoveredCount: recoverable.modifiedCount, failedCount: failed.modifiedCount };
  }
};

export default notificationRepository;
