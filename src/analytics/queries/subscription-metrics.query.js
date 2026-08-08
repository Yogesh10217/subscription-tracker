/**
 * @file subscription-metrics.query.js
 * @module analytics/queries/subscription-metrics.query
 * @description Aggregates subscription lifecycle counts and state flags.
 */

import mongoose from 'mongoose';
import Subscription from '../../models/subscription.model.js';

export const subscriptionMetricsQuery = {
  /**
   * Executes subscription count breakdown by status and state flags.
   * @param {Object} context - AnalyticsQueryContext
   * @returns {Promise<Object>}
   */
  async execute(context) {
    const userObjectId = new mongoose.Types.ObjectId(context.userId);

    const pipeline = [
      {
        $match: {
          user: userObjectId,
          ...(context.includeDeleted ? {} : { isDeleted: false }),
          ...(context.includeArchived ? {} : { isArchived: false })
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          favorites: { $sum: { $cond: [{ $eq: ['$isFavorite', true] }, 1, 0] } },
          pinned: { $sum: { $cond: [{ $eq: ['$isPinned', true] }, 1, 0] } },
          trials: { $sum: { $cond: [{ $eq: ['$isTrial', true] }, 1, 0] } }
        }
      }
    ];

    const results = await Subscription.aggregate(pipeline);

    const lifecycle = {
      Draft: 0,
      Trial: 0,
      Active: 0,
      Paused: 0,
      Cancelled: 0,
      Expired: 0,
      Archived: 0,
      total: 0
    };

    let totalFavorites = 0;
    let totalPinned = 0;
    let totalTrials = 0;

    results.forEach((row) => {
      const statusKey = row._id || 'Active';
      if (lifecycle[statusKey] !== undefined) {
        lifecycle[statusKey] = row.count;
      }
      lifecycle.total += row.count;
      totalFavorites += row.favorites || 0;
      totalPinned += row.pinned || 0;
      totalTrials += row.trials || 0;
    });

    const softDeletedCount = await Subscription.countDocuments({
      user: context.userId,
      isDeleted: true
    });

    return {
      lifecycle,
      flags: {
        favorites: totalFavorites,
        pinned: totalPinned,
        trials: totalTrials,
        deleted: softDeletedCount
      }
    };
  }
};

export default subscriptionMetricsQuery;
