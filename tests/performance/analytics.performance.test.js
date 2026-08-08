import { jest } from '@jest/globals';
import analyticsService from '#analytics/analytics.service.js';
import AnalyticsQueryContext from '#analytics/context/analytics-query-context.js';
import Subscription from '#models/subscription.model.js';
import TimelineEvent from '#models/timeline-event.model.js';

describe('Analytics Engine Performance Benchmark Tests', () => {
  let mockSubscriptions;
  let mockTimelineEvents;

  beforeAll(() => {
    // Generate representative dataset: 1,000 subscriptions
    mockSubscriptions = Array.from({ length: 1000 }, (_, i) => ({
      _id: `507f1f77bcf86cd79943${i.toString().padStart(4, '0')}`,
      user: '507f1f77bcf86cd799439011',
      name: `Subscription ${i}`,
      price: Math.floor(Math.random() * 100) + 5,
      currency: i % 2 === 0 ? 'USD' : 'INR',
      frequency: ['Monthly', 'Yearly', 'Weekly'][i % 3],
      category: ['Streaming', 'Software', 'Cloud', 'Gaming'][i % 4],
      status: 'Active',
      isDeleted: false,
      isArchived: false,
      renewalDate: new Date(Date.now() + (i % 30) * 24 * 60 * 60 * 1000)
    }));

    // Generate 1,000 timeline events
    mockTimelineEvents = Array.from({ length: 1000 }, (_, i) => ({
      _id: `507f1f77bcf86cd79944${i.toString().padStart(4, '0')}`,
      entityId: `507f1f77bcf86cd79943${i.toString().padStart(4, '0')}`,
      user: '507f1f77bcf86cd799439011',
      eventType: 'RENEWAL',
      timestamp: new Date(),
      newValues: { price: 15.99, currency: 'USD' }
    }));
  });

  test('Dashboard Summary latency should be within benchmark target (<500ms for unit mock execution)', async () => {
    jest.spyOn(Subscription, 'find').mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockSubscriptions)
    });
    jest
      .spyOn(Subscription, 'aggregate')
      .mockResolvedValue([{ _id: 'Active', count: 1000, favorites: 50, pinned: 20, trials: 10 }]);
    jest.spyOn(Subscription, 'countDocuments').mockResolvedValue(0);

    jest.spyOn(TimelineEvent, 'find').mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockTimelineEvents)
    });
    jest.spyOn(TimelineEvent, 'countDocuments').mockResolvedValue(0);

    const context = new AnalyticsQueryContext({ userId: '507f1f77bcf86cd799439011' });

    const startTime = performance.now();
    const summary = await analyticsService.getSummary(context);
    const duration = performance.now() - startTime;

    expect(summary).toBeDefined();
    expect(summary.metrics).toBeDefined();
    // Benchmark latency check
    expect(duration).toBeLessThan(500);
  });
});
