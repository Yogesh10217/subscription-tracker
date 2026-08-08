import { apiClient } from './apiClient.js';

export const notificationsApi = {
  async getAll(params = {}, signal) {
    const qs = new URLSearchParams(params).toString();
    const url = `/notifications${qs ? `?${qs}` : ''}`;
    return await apiClient.get(url, { signal });
  },

  async getUnread(params = {}, signal) {
    const qs = new URLSearchParams(params).toString();
    const url = `/notifications/unread${qs ? `?${qs}` : ''}`;
    return await apiClient.get(url, { signal });
  },

  async getUnreadCount(signal) {
    return await apiClient.get('/notifications/unread/count', { signal });
  },

  async markAsRead(id, signal) {
    return await apiClient.patch(`/notifications/${id}/read`, {}, { signal });
  },

  async markAllAsRead(signal) {
    return await apiClient.patch('/notifications/read-all', {}, { signal });
  },

  async delete(id, signal) {
    return await apiClient.delete(`/notifications/${id}`, { signal });
  }
};
