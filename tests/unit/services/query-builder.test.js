import { jest } from '@jest/globals';
import QueryBuilder from '#services/query-builder.js';

describe('QueryBuilder Unit Tests', () => {
  test('buildFilter constructs full filter object for all queryParams options', () => {
    // Test empty params
    const emptyFilter = QueryBuilder.buildFilter(undefined, 'user123');
    expect(emptyFilter.user).toBe('user123');
    expect(emptyFilter.isArchived).toBe(false);

    // Test all branches active
    const fullParams = {
      search: 'netflix',
      status: 'Active',
      category: 'Entertainment',
      paymentMethod: 'Credit Card',
      currency: 'USD',
      isFavorite: 'true',
      isPinned: true,
      isArchived: 'false',
      isTrial: 'true',
      minPrice: '10',
      maxPrice: '50',
      startDate: '2026-01-01',
      endDate: '2026-12-31'
    };

    const filter = QueryBuilder.buildFilter(fullParams, 'user123');
    expect(filter.$or).toBeDefined();
    expect(filter.status).toBe('Active');
    expect(filter.category).toBe('Entertainment');
    expect(filter.paymentMethod).toBe('Credit Card');
    expect(filter.currency).toBe('USD');
    expect(filter.isFavorite).toBe(true);
    expect(filter.isPinned).toBe(true);
    expect(filter.isArchived).toBe(false);
    expect(filter.isTrial).toBe(true);
    expect(filter.price.$gte).toBe(10);
    expect(filter.price.$lte).toBe(50);
    expect(filter.renewalDate.$gte).toBeDefined();
    expect(filter.renewalDate.$lte).toBeDefined();
  });

  test('buildFilter handles partial boolean and range options', () => {
    const filter = QueryBuilder.buildFilter(
      {
        isFavorite: false,
        isPinned: false,
        isArchived: true,
        isTrial: false,
        minPrice: 5,
        startDate: '2026-05-01'
      },
      'user123'
    );

    expect(filter.isFavorite).toBe(false);
    expect(filter.isPinned).toBe(false);
    expect(filter.isArchived).toBe(true);
    expect(filter.isTrial).toBe(false);
    expect(filter.price.$gte).toBe(5);
    expect(filter.price.$lte).toBeUndefined();
  });

  test('buildSort handles valid fields, invalid field fallback, asc and desc orders', () => {
    expect(QueryBuilder.buildSort('price', 'asc')).toEqual({ price: 1 });
    expect(QueryBuilder.buildSort('name', 'desc')).toEqual({ name: -1 });
    expect(QueryBuilder.buildSort('invalid_field', 'asc')).toEqual({ createdAt: 1 });
    expect(QueryBuilder.buildSort()).toEqual({ createdAt: -1 });
  });

  test('buildPagination handles default values, string values, invalid values, min/max bounds', () => {
    expect(QueryBuilder.buildPagination()).toEqual({ page: 1, limit: 10, skip: 0 });
    expect(QueryBuilder.buildPagination('2', '20')).toEqual({ page: 2, limit: 20, skip: 20 });
    expect(QueryBuilder.buildPagination(-5, 500)).toEqual({ page: 1, limit: 100, skip: 0 });
    expect(QueryBuilder.buildPagination('abc', 'xyz')).toEqual({ page: 1, limit: 10, skip: 0 });
  });
});
