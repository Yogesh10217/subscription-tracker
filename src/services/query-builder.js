/**
 * @file query-builder.js
 * @module services/query-builder
 * @description Decoupled MongoDB filter, sort, search, and pagination query builder.
 */

export class QueryBuilder {
  /**
   * Constructs MongoDB filter criteria from query parameters.
   * @param {Object} queryParams
   * @param {string} userId
   * @returns {Object} MongoDB filter object
   */
  static buildFilter(queryParams = {}, userId) {
    const filter = { user: userId };

    // Search query across name and notes
    if (queryParams.search) {
      const searchRegex = new RegExp(queryParams.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { category: searchRegex },
        { paymentMethod: searchRegex }
      ];
    }

    // Status filter
    if (queryParams.status) {
      filter.status = queryParams.status;
    }

    // Category filter
    if (queryParams.category) {
      filter.category = queryParams.category;
    }

    // Payment method filter
    if (queryParams.paymentMethod) {
      filter.paymentMethod = queryParams.paymentMethod;
    }

    // Currency filter
    if (queryParams.currency) {
      filter.currency = queryParams.currency;
    }

    // Favorites & Pinned
    if (queryParams.isFavorite !== undefined) {
      filter.isFavorite = queryParams.isFavorite === 'true' || queryParams.isFavorite === true;
    }

    if (queryParams.isPinned !== undefined) {
      filter.isPinned = queryParams.isPinned === 'true' || queryParams.isPinned === true;
    }

    // Archived & Soft Deleted
    if (queryParams.isArchived !== undefined) {
      filter.isArchived = queryParams.isArchived === 'true' || queryParams.isArchived === true;
    } else {
      filter.isArchived = false; // Default exclude archived unless requested
    }

    // Trial filter
    if (queryParams.isTrial !== undefined) {
      filter.isTrial = queryParams.isTrial === 'true' || queryParams.isTrial === true;
    }

    // Price Range
    if (queryParams.minPrice !== undefined || queryParams.maxPrice !== undefined) {
      filter.price = {};
      if (queryParams.minPrice !== undefined) filter.price.$gte = Number(queryParams.minPrice);
      if (queryParams.maxPrice !== undefined) filter.price.$lte = Number(queryParams.maxPrice);
    }

    // Renewal Date Range
    if (queryParams.startDate || queryParams.endDate) {
      filter.renewalDate = {};
      if (queryParams.startDate) filter.renewalDate.$gte = new Date(queryParams.startDate);
      if (queryParams.endDate) filter.renewalDate.$lte = new Date(queryParams.endDate);
    }

    return filter;
  }

  /**
   * Constructs MongoDB sort criteria.
   * @param {string} sortBy
   * @param {string} order - 'asc' | 'desc'
   * @returns {Object}
   */
  static buildSort(sortBy = 'createdAt', order = 'desc') {
    const sortOrder = order === 'asc' ? 1 : -1;
    const allowedSortFields = [
      'name',
      'price',
      'renewalDate',
      'createdAt',
      'updatedAt',
      'category',
      'status'
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    return { [sortField]: sortOrder };
  }

  /**
   * Parses pagination offset and limit.
   * @param {number|string} page
   * @param {number|string} limit
   * @returns {{ page: number, limit: number, skip: number }}
   */
  static buildPagination(page = 1, limit = 10) {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (parsedPage - 1) * parsedLimit;

    return { page: parsedPage, limit: parsedLimit, skip };
  }
}

export default QueryBuilder;
