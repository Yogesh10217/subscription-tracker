import { apiClient } from './apiClient.js';

export const analyticsApi = {
  /**
   * Fetch the top-level summary metrics (spending, active counts)
   */
  async getSummary(params = {}, signal) {
    const qs = new URLSearchParams(params).toString();
    const url = `/analytics/summary${qs ? `?${qs}` : ''}`;
    return await apiClient.get(url, { signal });
  },

  /**
   * Fetch category allocation data
   */
  async getCategories(params = {}, signal) {
    const qs = new URLSearchParams(params).toString();
    const url = `/analytics/categories${qs ? `?${qs}` : ''}`;
    return await apiClient.get(url, { signal });
  },

  /**
   * Fetch spending trends over time
   */
  async getTrends(params = {}, signal) {
    const qs = new URLSearchParams(params).toString();
    const url = `/analytics/trends${qs ? `?${qs}` : ''}`;
    return await apiClient.get(url, { signal });
  }
};
