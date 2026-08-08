import QueryBuilder from '#services/query-builder.js';

describe('QueryBuilder Unit Tests', () => {
  test('buildFilter should build correct MongoDB query from parameters', () => {
    const filter = QueryBuilder.buildFilter(
      { search: 'netflix', status: 'Active', category: 'Streaming', minPrice: 10, maxPrice: 50 },
      'u123'
    );

    expect(filter.user).toBe('u123');
    expect(filter.status).toBe('Active');
    expect(filter.category).toBe('Streaming');
    expect(filter.price.$gte).toBe(10);
    expect(filter.price.$lte).toBe(50);
    expect(filter.$or).toBeDefined();
  });

  test('buildPagination should compute correct skip offset', () => {
    const page1 = QueryBuilder.buildPagination(1, 10);
    expect(page1.skip).toBe(0);

    const page2 = QueryBuilder.buildPagination(2, 10);
    expect(page2.skip).toBe(10);
  });
});
