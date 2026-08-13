/**
 * @file renewal-analytics.query.js
 * @module analytics/queries/renewal-analytics.query
 * @description Aggregates upcoming renewals for 7, 30, and 90 days.
 */

import Subscription from '../../models/subscription.model.js';

export const renewalAnalyticsQuery = {
  async execute(context) {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const baseFilter = {
      ...context.getBaseSubscriptionMatch(),
      status: 'Active'
    };

    const renewals30 = await Subscription.find({
      ...baseFilter,
      renewalDate: { $gte: now, $lte: in30Days }
    })
      .sort({ renewalDate: 1 })
      .lean();

    const renewals90Count = await Subscription.countDocuments({
      ...baseFilter,
      renewalDate: { $gte: now, $lte: in90Days }
    });

    const renewals7Count = renewals30.filter((s) => new Date(s.renewalDate) <= in7Days).length;

    const costsByCurrency = {};
    renewals30.forEach((sub) => {
      const currency = (sub.currency || 'USD').toUpperCase();
      if (!costsByCurrency[currency]) {
        costsByCurrency[currency] = 0;
      }
      costsByCurrency[currency] += Number(sub.price) || 0;
    });

    Object.keys(costsByCurrency).forEach((curr) => {
      costsByCurrency[curr] = Math.round(costsByCurrency[curr] * 100) / 100;
    });

    return {
      upcoming7DaysCount: renewals7Count,
      upcoming30DaysCount: renewals30.length,
      upcoming90DaysCount: renewals90Count,
      upcoming30DaysCostsByCurrency: costsByCurrency,
      upcomingSubscriptions: renewals30.map((s) => ({
        id: s._id,
        name: s.name,
        price: s.price,
        currency: s.currency,
        renewalDate: s.renewalDate,
        category: s.category
      }))
    };
  }
};

export default renewalAnalyticsQuery;
