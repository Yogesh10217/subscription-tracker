/**
 * @file notification.model.js
 * @module notifications/models/notification.model
 * @description Mongoose schema for persistent notification records.
 */

import mongoose from 'mongoose';
import NotificationType from '../constants/notification-types.js';
import NotificationChannel from '../constants/notification-channels.js';
import NotificationDeliveryStatus from '../constants/notification-status.js';
import NotificationPriority from '../constants/notification-priority.js';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true
    },
    channel: {
      type: String,
      enum: Object.values(NotificationChannel),
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    },
    templateId: {
      type: String,
      default: null
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null
    },
    reminderRule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReminderRule',
      default: null
    },
    deliveryStatus: {
      type: String,
      enum: Object.values(NotificationDeliveryStatus),
      default: NotificationDeliveryStatus.PENDING,
      index: true
    },
    readAt: {
      type: Date,
      default: null,
      index: true
    },
    priority: {
      type: String,
      enum: Object.values(NotificationPriority),
      default: NotificationPriority.NORMAL
    },
    scheduledFor: {
      type: Date,
      default: Date.now,
      index: true
    },
    sentAt: {
      type: Date,
      default: null
    },
    deliveredAt: {
      type: Date,
      default: null
    },
    failedAt: {
      type: Date,
      default: null
    },
    failureReason: {
      type: String,
      default: null
    },
    retryCount: {
      type: Number,
      default: 0
    },
    maxRetries: {
      type: Number,
      default: 5
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    providerMessageId: {
      type: String,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, deliveryStatus: 1 });
notificationSchema.index({ user: 1, readAt: 1 });
notificationSchema.index({ user: 1, scheduledFor: 1 });
notificationSchema.index({ deliveryStatus: 1, scheduledFor: 1 });

const Notification =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
