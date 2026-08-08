import { apiClient } from './apiClient.js';

export const notificationPreferencesApi = {
  async get(signal) {
    return await apiClient.get('/notification-preferences', { signal });
  },

  async update(preferencesData, signal) {
    return await apiClient.put('/notification-preferences', preferencesData, { signal });
  }
};
