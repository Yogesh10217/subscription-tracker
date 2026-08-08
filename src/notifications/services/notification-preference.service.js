/**
 * @file notification-preference.service.js
 * @module notifications/services/notification-preference.service
 * @description Service managing user notification preferences.
 */

import notificationPreferenceRepository from '../repositories/notification-preference.repository.js';

export const notificationPreferenceService = {
  async getPreferences(userId) {
    return notificationPreferenceRepository.findByUserId(userId);
  },

  async updatePreferences(userId, updateData) {
    return notificationPreferenceRepository.updateByUserId(userId, updateData);
  }
};

export default notificationPreferenceService;
