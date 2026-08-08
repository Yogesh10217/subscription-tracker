/**
 * @file price-analytics.query.js
 * @module analytics/queries/price-analytics.query
 * @description Queries price increases/decreases from recorded TimelineEvent records.
 */

import TimelineEvent from '../../models/timeline-event.model.js';

export const priceAnalyticsQuery = {
  async execute(context) {
    const priceEvents = await TimelineEvent.find({
      user: context.userId,
      eventType: 'PRICE_CHANGE',
      timestamp: { $gte: context.startDate, $lte: context.endDate }
    })
      .sort({ timestamp: -1 })
      .lean();

    let priceIncreasesCount = 0;
    let priceDecreasesCount = 0;
    let largestIncrease = null;
    let largestDecrease = null;

    priceEvents.forEach((event) => {
      const oldPrice = Number(event.oldValues?.price || 0);
      const newPrice = Number(event.newValues?.price || 0);
      const diff = newPrice - oldPrice;
      const currency = event.newValues?.currency || event.oldValues?.currency || 'USD';

      if (diff > 0) {
        priceIncreasesCount += 1;
        if (!largestIncrease || diff > largestIncrease.diff) {
          largestIncrease = { entityId: event.entityId, oldPrice, newPrice, diff, currency };
        }
      } else if (diff < 0) {
        priceDecreasesCount += 1;
        const absDiff = Math.abs(diff);
        if (!largestDecrease || absDiff > largestDecrease.absDiff) {
          largestDecrease = {
            entityId: event.entityId,
            oldPrice,
            newPrice,
            diff,
            absDiff,
            currency
          };
        }
      }
    });

    return {
      totalPriceChangeEvents: priceEvents.length,
      priceIncreasesCount,
      priceDecreasesCount,
      largestIncrease,
      largestDecrease,
      recentPriceChanges: priceEvents.slice(0, 10).map((e) => ({
        id: e._id,
        entityId: e.entityId,
        oldPrice: e.oldValues?.price,
        newPrice: e.newValues?.price,
        currency: e.newValues?.currency || 'USD',
        timestamp: e.timestamp
      }))
    };
  }
};

export default priceAnalyticsQuery;
