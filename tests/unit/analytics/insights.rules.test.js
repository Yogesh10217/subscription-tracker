import InsightEngine from '#analytics/insights/insight-engine.js';

describe('InsightEngine Unit Tests', () => {
  test('should generate category concentration insight when top category percentage >= 40%', () => {
    const mockMetrics = {
      categoryAnalytics: {
        USD: {
          currency: 'USD',
          totalMonthlySpend: 100,
          categories: [{ name: 'Software', monthlySpend: 50, percentage: 50 }]
        }
      }
    };

    const insights = InsightEngine.generateInsights(mockMetrics);
    expect(insights.length).toBeGreaterThan(0);
    const catInsight = insights.find((i) => i.type === 'CATEGORY_CONCENTRATION');
    expect(catInsight).toBeDefined();
    expect(catInsight.severity).toBe('WARNING');
  });

  test('should generate upcoming renewal insight when renewals exist', () => {
    const mockMetrics = {
      renewalAnalytics: {
        upcoming30DaysCount: 3,
        upcoming30DaysCostsByCurrency: { USD: 45 }
      }
    };

    const insights = InsightEngine.generateInsights(mockMetrics);
    const renewalInsight = insights.find((i) => i.type === 'UPCOMING_RENEWAL');
    expect(renewalInsight).toBeDefined();
    expect(renewalInsight.severity).toBe('IMPORTANT');
  });
});
