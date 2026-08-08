/**
 * @file trend-analytics.query.js
 * @module analytics/queries/trend-analytics.query
 * @description Generates time-series trend data for historical spend and subscription counts.
 */

import dayjs from 'dayjs';
import TimelineEvent from '../../models/timeline-event.model.js';
import Subscription from '../../models/subscription.model.js';

export const trendAnalyticsQuery = {
  async execute(context) {
    // Generate period buckets (last 6 months by default)
    const buckets = [];
    let current = dayjs(context.startDate).startOf('month');
    const end = dayjs(context.endDate).endOf('month');

    while (current.isBefore(end) || current.isSame(end, 'month')) {
      buckets.push(current.format('YYYY-MM'));
      current = current.add(1, 'month');
    }

    const renewalEvents = await TimelineEvent.find({
      user: context.userId,
      eventType: 'RENEWAL',
      timestamp: { $gte: context.startDate, $lte: context.endDate }
    }).lean();

    const spendTrendByCurrency = {};

    renewalEvents.forEach((event) => {
      const monthKey = dayjs(event.timestamp).format('YYYY-MM');
      const currency = (event.newValues?.currency || 'USD').toUpperCase();
      const amount = Number(event.newValues?.price || event.oldValues?.price || 0);

      if (!spendTrendByCurrency[currency]) {
        spendTrendByCurrency[currency] = buckets.map((b) => ({ period: b, amount: 0 }));
      }

      const bucketItem = spendTrendByCurrency[currency].find((b) => b.period === monthKey);
      if (bucketItem) {
        bucketItem.amount += amount;
      }
    });

    Object.keys(spendTrendByCurrency).forEach((curr) => {
      spendTrendByCurrency[curr].forEach((item) => {
        item.amount = Math.round(item.amount * 100) / 100;
      });
    });

    const activeCount = await Subscription.countDocuments({
      user: context.userId,
      isDeleted: false,
      status: 'Active'
    });

    return {
      periods: buckets,
      historicalSpendTrendsByCurrency: spendTrendByCurrency,
      currentActiveSubscriptionsCount: activeCount
    };
  }
};

export default trendAnalyticsQuery;
