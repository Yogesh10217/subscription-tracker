/**
 * @file notification-preference.model.js
 * @module notifications/models/notification-preference.model
 * @description Mongoose schema for user-level notification preferences.
 */

import mongoose from 'mongoose';

const notificationPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    emailEnabled: {
      type: Boolean,
      default: true
    },
    inAppEnabled: {
      type: Boolean,
      default: true
    },
    renewalReminders: {
      type: Boolean,
      default: true
    },
    trialReminders: {
      type: Boolean,
      default: true
    },
    priceChangeAlerts: {
      type: Boolean,
      default: true
    },
    subscriptionLifecycleAlerts: {
      type: Boolean,
      default: true
    },
    importExportAlerts: {
      type: Boolean,
      default: true
    },
    defaultReminderDays: {
      type: Number,
      default: 3
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    quietHoursEnabled: {
      type: Boolean,
      default: false
    },
    quietHoursStart: {
      type: String,
      default: '22:00'
    },
    quietHoursEnd: {
      type: String,
      default: '07:00'
    },
    digestEnabled: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const NotificationPreference =
  mongoose.models.NotificationPreference ||
  mongoose.model('NotificationPreference', notificationPreferenceSchema);

export default NotificationPreference;
