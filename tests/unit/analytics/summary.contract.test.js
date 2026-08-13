import { formatSummaryContract } from '#analytics/contracts/summary.contract.js';

describe('SummaryContract Unit Tests', () => {
  test('should format contract with empty inputs using default fallbacks', () => {
    const emptyResult = formatSummaryContract();
    expect(emptyResult).toBeDefined();
    expect(emptyResult.metrics.renewals.upcomingSubscriptions).toEqual([]);
    expect(emptyResult.insights).toEqual([]);

    const emptyObjResult = formatSummaryContract({});
    expect(emptyObjResult).toBeDefined();
    expect(emptyObjResult.recentPriceChanges).toEqual([]);
  });

  test('should format contract with populated inputs correctly', () => {
    const fullData = {
      subscriptionMetrics: { lifecycle: { activeCount: 5 }, flags: { favoritesCount: 2 } },
      spendingAnalytics: { projectedSpendByCurrency: { USD: 100 }, historicalSpendByCurrency: { USD: 50 } },
      renewalAnalytics: {
        upcoming7DaysCount: 1,
        upcoming30DaysCount: 3,
        upcoming30DaysCostsByCurrency: { USD: 30 },
        upcomingSubscriptions: [{ _id: 's1' }]
      },
      trialAnalytics: { activeTrialsCount: 2, conversionRatePercentage: 50 },
      categoryAnalytics: { USD: [] },
      providerAnalytics: { USD: [] },
      priceAnalytics: { recentPriceChanges: [{ _id: 'p1' }] },
      insights: [{ id: 'ins1' }]
    };

    const result = formatSummaryContract(fullData);
    expect(result.metrics.subscriptions.activeCount).toBe(5);
    expect(result.insights).toHaveLength(1);
  });
});
