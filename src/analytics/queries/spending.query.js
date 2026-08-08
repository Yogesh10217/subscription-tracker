/**
 * @file spending.query.js
 * @module analytics/queries/spending.query
 * @description Aggregation queries for projected recurring costs and historical spend.
 */

import Subscription from '../../models/subscription.model.js';
import TimelineEvent from '../../models/timeline-event.model.js';
import SpendingCalculator from '../calculators/spending-calculator.js';

export const spendingQuery = {
  /**
   * Executes spending analytics for a given query context.
   * @param {Object} context - AnalyticsQueryContext
   * @returns {Promise<Object>}
   */
  async execute(context) {
    const matchFilter = context.getBaseSubscriptionMatch();

    // 1. Fetch active subscriptions for projected spend
    const subscriptions = await Subscription.find(matchFilter).lean();
    const projectedSpend = SpendingCalculator.calculateProjectedSpend(subscriptions);

    // 2. Query historical renewal events from TimelineEvent collection
    const renewalEvents = await TimelineEvent.find({
      user: context.userId,
      eventType: 'RENEWAL',
      timestamp: { $gte: context.startDate, $lte: context.endDate }
    }).lean();

    const historicalSpend = SpendingCalculator.calculateHistoricalSpend(renewalEvents);

    return {
      period: {
        from: context.startDate.toISOString(),
        to: context.endDate.toISOString(),
        name: context.period
      },
      projectedSpendByCurrency: projectedSpend,
      historicalSpendByCurrency: historicalSpend
    };
  }
};

export default spendingQuery;
