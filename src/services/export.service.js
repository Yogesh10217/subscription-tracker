/**
 * @file export.service.js
 * @module services/export.service
 * @description Flexible JSON and CSV data export engine.
 */

import subscriptionRepository from '../repositories/subscription.repository.js';

export const exportService = {
  /**
   * Exports user subscriptions to structured JSON.
   * @param {string} userId
   * @param {Object} [filter={}]
   * @returns {Promise<Array<Object>>}
   */
  async exportJSON(userId, filter = {}) {
    const items = await subscriptionRepository.findAll({ user: userId, ...filter });
    return items.map((sub) => {
      const obj = sub.toObject ? sub.toObject() : sub;
      return {
        id: obj._id,
        name: obj.name,
        price: obj.price,
        currency: obj.currency,
        frequency: obj.frequency,
        category: obj.category,
        paymentMethod: obj.paymentMethod,
        status: obj.status,
        startDate: obj.startDate,
        renewalDate: obj.renewalDate,
        isTrial: obj.isTrial,
        isFavorite: obj.isFavorite,
        isPinned: obj.isPinned,
        createdAt: obj.createdAt
      };
    });
  },

  /**
   * Exports user subscriptions to CSV string.
   * @param {string} userId
   * @param {Object} [filter={}]
   * @returns {Promise<string>} CSV text
   */
  async exportCSV(userId, filter = {}) {
    const data = await this.exportJSON(userId, filter);
    if (data.length === 0) {
      return 'Name,Price,Currency,Frequency,Category,PaymentMethod,Status,StartDate,RenewalDate\n';
    }

    const headers = [
      'Name',
      'Price',
      'Currency',
      'Frequency',
      'Category',
      'PaymentMethod',
      'Status',
      'StartDate',
      'RenewalDate'
    ];
    const rows = data.map((item) => [
      `"${item.name.replace(/"/g, '""')}"`,
      item.price,
      item.currency,
      item.frequency,
      `"${item.category}"`,
      `"${item.paymentMethod}"`,
      item.status,
      item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
      item.renewalDate ? new Date(item.renewalDate).toISOString().split('T')[0] : ''
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
};

export default exportService;
