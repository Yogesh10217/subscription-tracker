import { apiClient } from './apiClient.js';

export const subscriptionsApi = {
  /**
   * Fetch all subscriptions (can pass search/filter/sort parameters)
   */
  async getAll(params = {}, signal) {
    const qs = new URLSearchParams(params).toString();
    const url = `/subscriptions${qs ? `?${qs}` : ''}`;
    return await apiClient.get(url, { signal });
  },

  /**
   * Fetch a single subscription by ID
   */
  async getById(id, signal) {
    return await apiClient.get(`/subscriptions/${id}`, { signal });
  },

  /**
   * Create a new subscription
   */
  async create(data, signal) {
    return await apiClient.post('/subscriptions', data, { signal });
  },

  /**
   * Update an existing subscription
   */
  async update(id, data, signal) {
    return await apiClient.put(`/subscriptions/${id}`, data, { signal });
  },

  /**
   * Cancel a subscription
   */
  async cancel(id, signal) {
    return await apiClient.put(`/subscriptions/${id}/cancel`, {}, { signal });
  },

  /**
   * Delete a subscription entirely
   */
  async delete(id, signal) {
    return await apiClient.delete(`/subscriptions/${id}`, { signal });
  }
};
