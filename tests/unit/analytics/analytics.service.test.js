import { jest } from '@jest/globals';
import analyticsService from '#analytics/analytics.service.js';
import AnalyticsQueryContext from '#analytics/context/analytics-query-context.js';
import Subscription from '#models/subscription.model.js';

describe('AnalyticsService Unit Tests', () => {
  const dummyContext = new AnalyticsQueryContext({ userId: '507f1f77bcf86cd799439011' });

  beforeEach(() => {
    const mockQueryChain = {
      lean: jest.fn().mockResolvedValue([
        {
          _id: 'sub1',
          name: 'Netflix',
          price: 15.99,
          currency: 'USD',
          frequency: 'Monthly',
          category: 'Entertainment',
          status: 'Active',
          startDate: new Date('2026-01-01'),
          renewalDate: new Date('2026-09-01'),
          user: '507f1f77bcf86cd799439011',
          isTrial: false,
          isArchived: false,
          isDeleted: false
        }
      ]),
      sort: jest.fn().mockReturnThis()
    };

    jest.spyOn(Subscription, 'find').mockReturnValue(mockQueryChain);
    jest.spyOn(Subscription, 'aggregate').mockResolvedValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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
