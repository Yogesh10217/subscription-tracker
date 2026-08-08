/**
 * @file search.service.js
 * @module services/search.service
 * @description High-level search & query engine facade.
 */

import QueryBuilder from './query-builder.js';
import subscriptionRepository from '../repositories/subscription.repository.js';

export const searchService = {
  /**
   * Executes advanced search, filtering, sorting, and pagination across subscriptions.
   * @param {Object} queryParams
   * @param {string} userId
   * @returns {Promise<Object>} Paginated result envelope
   */
  async searchSubscriptions(queryParams, userId) {
    const filter = QueryBuilder.buildFilter(queryParams, userId);
    const sort = QueryBuilder.buildSort(queryParams.sortBy, queryParams.order);
    const { page, limit, skip } = QueryBuilder.buildPagination(queryParams.page, queryParams.limit);

    const { items, total } = await subscriptionRepository.findWithQuery(filter, sort, skip, limit);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      subscriptions: items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }
};

export default searchService;
