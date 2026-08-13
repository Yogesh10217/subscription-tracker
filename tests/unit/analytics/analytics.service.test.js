import { jest } from '@jest/globals';
import analyticsService from '#analytics/analytics.service.js';
import AnalyticsQueryContext from '#analytics/context/analytics-query-context.js';

describe('AnalyticsService Unit Tests', () => {
  const dummyContext = new AnalyticsQueryContext({ userId: '507f1f77bcf86cd799439011' });

  test('should execute getSummary and return structured contract', async () => {
    const summary = await analyticsService.getSummary(dummyContext);
    expect(summary).toBeDefined();
    expect(summary.metrics).toBeDefined();
    expect(summary.insights).toBeDefined();
  });

  test('should execute individual analytics queries cleanly', async () => {
    const spending = await analyticsService.getSpending(dummyContext);
    const subscriptions = await analyticsService.getSubscriptions(dummyContext);
    const categories = await analyticsService.getCategories(dummyContext);
    const providers = await analyticsService.getProviders(dummyContext);
    const renewals = await analyticsService.getRenewals(dummyContext);
    const trials = await analyticsService.getTrials(dummyContext);
    const trends = await analyticsService.getTrends(dummyContext);
    const priceChanges = await analyticsService.getPriceChanges(dummyContext);
    const insights = await analyticsService.getInsights(dummyContext);

    expect(spending).toBeDefined();
    expect(subscriptions).toBeDefined();
    expect(categories).toBeDefined();
    expect(providers).toBeDefined();
    expect(renewals).toBeDefined();
    expect(trials).toBeDefined();
    expect(trends).toBeDefined();
    expect(priceChanges).toBeDefined();
    expect(insights).toBeDefined();
  });
});
