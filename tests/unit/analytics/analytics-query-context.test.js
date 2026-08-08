import AnalyticsQueryContext from '#analytics/context/analytics-query-context.js';

describe('AnalyticsQueryContext Unit Tests', () => {
  test('should throw error if userId missing', () => {
    expect(() => new AnalyticsQueryContext({})).toThrow();
  });

  test('should build base match filter with defaults', () => {
    const ctx = new AnalyticsQueryContext({ userId: '507f1f77bcf86cd799439011' });
    const match = ctx.getBaseSubscriptionMatch();

    expect(match.user).toBe('507f1f77bcf86cd799439011');
    expect(match.isDeleted).toBe(false);
    expect(match.isArchived).toBe(false);
  });
});
