/**
 * @file summary.contract.js
 * @module analytics/contracts/summary.contract
 * @description Standardized API response contract for Dashboard Summary API.
 */

export const formatSummaryContract = (data = {}) => {
  return {
    metrics: {
      subscriptions: data.subscriptionMetrics?.lifecycle || {},
      flags: data.subscriptionMetrics?.flags || {},
      projectedSpend: data.spendingAnalytics?.projectedSpendByCurrency || {},
      historicalSpend: data.spendingAnalytics?.historicalSpendByCurrency || {},
      renewals: {
        upcoming7DaysCount: data.renewalAnalytics?.upcoming7DaysCount || 0,
        upcoming30DaysCount: data.renewalAnalytics?.upcoming30DaysCount || 0,
        upcoming30DaysCostsByCurrency: data.renewalAnalytics?.upcoming30DaysCostsByCurrency || {},
        upcomingSubscriptions: data.renewalAnalytics?.upcomingSubscriptions || []
      },
      trials: {
        activeTrialsCount: data.trialAnalytics?.activeTrialsCount || 0,
        conversionRatePercentage: data.trialAnalytics?.conversionRatePercentage || 0
      }
    },
    topCategoryByCurrency: data.categoryAnalytics || {},
    topProviderByCurrency: data.providerAnalytics || {},
    recentPriceChanges: data.priceAnalytics?.recentPriceChanges || [],
    insights: data.insights || []
  };
};

export default formatSummaryContract;
