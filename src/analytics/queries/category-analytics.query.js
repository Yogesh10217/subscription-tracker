/**
 * @file category-analytics.query.js
 * @module analytics/queries/category-analytics.query
 * @description Aggregates category spending, subscription counts, and percentages per currency.
 */

import Subscription from '../../models/subscription.model.js';
import FrequencyNormalizer from '../calculators/frequency-normalizer.js';

export const categoryAnalyticsQuery = {
  async execute(context) {
    const matchFilter = context.getBaseSubscriptionMatch();
    const subscriptions = await Subscription.find({
      ...matchFilter,
      status: { $in: ['Active', 'Trial', 'Expired', 'expired'] }
    }).lean();

    const categoriesByCurrency = {};

    subscriptions.forEach((sub) => {
      const currency = (sub.currency || 'USD').toUpperCase();
      const catName = sub.category || 'Other';

      const { monthlyEquivalent } = FrequencyNormalizer.normalize(
        sub.price,
        sub.frequency,
        sub.customIntervalUnit,
        sub.customIntervalValue
      );

      if (!categoriesByCurrency[currency]) {
        categoriesByCurrency[currency] = { currency, totalMonthly: 0, categories: {} };
      }

      const cGroup = categoriesByCurrency[currency];
      cGroup.totalMonthly += monthlyEquivalent;

      if (!cGroup.categories[catName]) {
        cGroup.categories[catName] = { name: catName, monthlySpend: 0, subscriptionCount: 0 };
      }

      cGroup.categories[catName].monthlySpend += monthlyEquivalent;
      cGroup.categories[catName].subscriptionCount += 1;
    });

    // Format output with percentages
    const result = {};
    Object.keys(categoriesByCurrency).forEach((curr) => {
      const group = categoriesByCurrency[curr];
      const list = Object.values(group.categories).map((cat) => {
        const percentage =
          group.totalMonthly > 0
            ? Math.round((cat.monthlySpend / group.totalMonthly) * 1000) / 10
            : 0;
        return {
          name: cat.name,
          monthlySpend: Math.round(cat.monthlySpend * 100) / 100,
          subscriptionCount: cat.subscriptionCount,
          percentage
        };
      });

      list.sort((a, b) => b.monthlySpend - a.monthlySpend);

      result[curr] = {
        currency: curr,
        totalMonthlySpend: Math.round(group.totalMonthly * 100) / 100,
        categories: list
      };
    });

    return result;
  }
};

export default categoryAnalyticsQuery;
