/**
 * @file provider-analytics.query.js
 * @module analytics/queries/provider-analytics.query
 * @description Aggregates provider spending and counts per currency.
 */

import Subscription from '../../models/subscription.model.js';
import FrequencyNormalizer from '../calculators/frequency-normalizer.js';

export const providerAnalyticsQuery = {
  async execute(context) {
    const matchFilter = context.getBaseSubscriptionMatch();
    const subscriptions = await Subscription.find({
      ...matchFilter,
      status: { $in: ['Active', 'Trial'] }
    })
      .populate('provider')
      .lean();

    const providersByCurrency = {};

    subscriptions.forEach((sub) => {
      const currency = (sub.currency || 'USD').toUpperCase();
      const providerName = sub.provider?.name || sub.name;

      const { monthlyEquivalent } = FrequencyNormalizer.normalize(
        sub.price,
        sub.frequency,
        sub.customIntervalUnit,
        sub.customIntervalValue
      );

      if (!providersByCurrency[currency]) {
        providersByCurrency[currency] = { currency, totalMonthly: 0, providers: {} };
      }

      const pGroup = providersByCurrency[currency];
      pGroup.totalMonthly += monthlyEquivalent;

      if (!pGroup.providers[providerName]) {
        pGroup.providers[providerName] = {
          name: providerName,
          monthlySpend: 0,
          subscriptionCount: 0
        };
      }

      pGroup.providers[providerName].monthlySpend += monthlyEquivalent;
      pGroup.providers[providerName].subscriptionCount += 1;
    });

    const result = {};
    Object.keys(providersByCurrency).forEach((curr) => {
      const group = providersByCurrency[curr];
      const list = Object.values(group.providers).map((p) => ({
        name: p.name,
        monthlySpend: Math.round(p.monthlySpend * 100) / 100,
        subscriptionCount: p.subscriptionCount,
        averageCost: Math.round((p.monthlySpend / p.subscriptionCount) * 100) / 100
      }));

      list.sort((a, b) => b.monthlySpend - a.monthlySpend);

      result[curr] = {
        currency: curr,
        totalMonthlySpend: Math.round(group.totalMonthly * 100) / 100,
        providers: list
      };
    });

    return result;
  }
};

export default providerAnalyticsQuery;
