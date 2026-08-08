import { jest } from '@jest/globals';
import InsightEngine from '#analytics/insights/insight-engine.js';

describe('InsightEngine Unit Tests', () => {
  test('generateInsights evaluates all rules against aggregated metrics data', () => {
    const data = {
      categoryAnalytics: {
        USD: {
          categories: [
            { name: 'Streaming', percentage: 65, monthlySpend: 100 }
          ]
        }
      },
      renewalAnalytics: {
        upcoming30DaysCount: 3,
        upcoming30DaysCostsByCurrency: { USD: 50 }
      },
      priceAnalytics: {
        priceIncreasesCount: 2,
        largestIncrease: { diff: 5, currency: 'USD' }
      },
      trialAnalytics: {
        activeTrialsCount: 1,
        potentialConversionCostByCurrency: { USD: 15 }
      },
      spendingAnalytics: {
        projectedSpendByCurrency: {
          USD: {
            largestSubscription: { name: 'Netflix', monthlyEquivalent: 20 }
          }
        }
      }
    };

    const insights = InsightEngine.generateInsights(data);
    expect(insights.length).toBeGreaterThan(0);

    const categoryInsight = insights.find(i => i.type === 'CATEGORY_CONCENTRATION');
    expect(categoryInsight.severity).toBe('IMPORTANT');
  });

  test('generateInsights handles empty metrics data safely', () => {
    const insights = InsightEngine.generateInsights({});
    expect(insights).toEqual([]);
  });
});
