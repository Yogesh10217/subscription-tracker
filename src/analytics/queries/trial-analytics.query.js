/**
 * @file trial-analytics.query.js
 * @module analytics/queries/trial-analytics.query
 * @description Aggregates trial counts, conversions, and conversion rates.
 */

import Subscription from '../../models/subscription.model.js';
import TimelineEvent from '../../models/timeline-event.model.js';

export const trialAnalyticsQuery = {
  async execute(context) {
    const baseFilter = {
      user: context.userId,
      isDeleted: false
    };

    const activeTrials = await Subscription.find({
      ...baseFilter,
      $or: [{ isTrial: true }, { status: 'Trial' }]
    }).lean();

    const conversionsCount = await TimelineEvent.countDocuments({
      user: context.userId,
      eventType: 'TRIAL_CONVERSION'
    });

    const totalTrialsHistorical = activeTrials.length + conversionsCount;
    const conversionRate =
      totalTrialsHistorical > 0
        ? Math.round((conversionsCount / totalTrialsHistorical) * 10000) / 100
        : 0;

    const potentialConversionCostByCurrency = {};
    activeTrials.forEach((sub) => {
      const currency = (sub.currency || 'USD').toUpperCase();
      if (!potentialConversionCostByCurrency[currency]) {
        potentialConversionCostByCurrency[currency] = 0;
      }
      potentialConversionCostByCurrency[currency] += Number(sub.price) || 0;
    });

    return {
      activeTrialsCount: activeTrials.length,
      convertedTrialsCount: conversionsCount,
      totalHistoricalTrials: totalTrialsHistorical,
      conversionRatePercentage: conversionRate,
      potentialConversionCostByCurrency,
      activeTrialSubscriptions: activeTrials.map((s) => ({
        id: s._id,
        name: s.name,
        price: s.price,
        currency: s.currency,
        trialEndDate: s.trialEndDate || s.renewalDate
      }))
    };
  }
};

export default trialAnalyticsQuery;
