/**
 * @file analytics.service.js
 * @module analytics/analytics.service
 * @description Bounded analytics subsystem service orchestrating metric queries and insight evaluations.
 */

import spendingQuery from './queries/spending.query.js';
import subscriptionMetricsQuery from './queries/subscription-metrics.query.js';
import categoryAnalyticsQuery from './queries/category-analytics.query.js';
import providerAnalyticsQuery from './queries/provider-analytics.query.js';
import renewalAnalyticsQuery from './queries/renewal-analytics.query.js';
import trialAnalyticsQuery from './queries/trial-analytics.query.js';
import priceAnalyticsQuery from './queries/price-analytics.query.js';
import trendAnalyticsQuery from './queries/trend-analytics.query.js';
import InsightEngine from './insights/insight-engine.js';
import formatSummaryContract from './contracts/summary.contract.js';

export const analyticsService = {
  /**
   * Executes single optimized summary dashboard query.
   * @param {Object} context - AnalyticsQueryContext
   * @returns {Promise<Object>}
   */
  async getSummary(context) {
    const [spending, subscriptions, categories, providers, renewals, trials, priceChanges] =
      await Promise.all([
        spendingQuery.execute(context),
        subscriptionMetricsQuery.execute(context),
        categoryAnalyticsQuery.execute(context),
        providerAnalyticsQuery.execute(context),
        renewalAnalyticsQuery.execute(context),
        trialAnalyticsQuery.execute(context),
        priceAnalyticsQuery.execute(context)
      ]);

    const aggregated = {
      spendingAnalytics: spending,
      subscriptionMetrics: subscriptions,
      categoryAnalytics: categories,
      providerAnalytics: providers,
      renewalAnalytics: renewals,
      trialAnalytics: trials,
      priceAnalytics: priceChanges
    };

    const insights = InsightEngine.generateInsights(aggregated);
    aggregated.insights = insights;

    return formatSummaryContract(aggregated);
  },

  async getSpending(context) {
    return spendingQuery.execute(context);
  },

  async getSubscriptions(context) {
    return subscriptionMetricsQuery.execute(context);
  },

  async getCategories(context) {
    return categoryAnalyticsQuery.execute(context);
  },

  async getProviders(context) {
    return providerAnalyticsQuery.execute(context);
  },

  async getRenewals(context) {
    return renewalAnalyticsQuery.execute(context);
  },

  async getTrials(context) {
    return trialAnalyticsQuery.execute(context);
  },

  async getTrends(context) {
    return trendAnalyticsQuery.execute(context);
  },

  async getPriceChanges(context) {
    return priceAnalyticsQuery.execute(context);
  },

  async getInsights(context) {
    const summary = await this.getSummary(context);
    return summary.insights;
  }
};

export default analyticsService;
