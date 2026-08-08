/**
 * @file notification-preference.repository.js
 * @module notifications/repositories/notification-preference.repository
 * @description Repository operations for user notification preferences.
 */

import NotificationPreference from '../models/notification-preference.model.js';

export const notificationPreferenceRepository = {
  async findByUserId(userId) {
    let pref = await NotificationPreference.findOne({ user: userId });
    if (!pref) {
      pref = await NotificationPreference.create({ user: userId });
    }
    return pref;
  },

  async updateByUserId(userId, updateData) {
    return NotificationPreference.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );
  }
};

export default notificationPreferenceRepository;
