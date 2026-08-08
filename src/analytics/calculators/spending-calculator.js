/**
 * @file spending-calculator.js
 * @module analytics/calculators/spending-calculator
 * @description Safe multi-currency spending calculator isolating projected recurring spend and historical spend.
 */

import FrequencyNormalizer from './frequency-normalizer.js';

export class SpendingCalculator {
  /**
   * Calculates multi-currency projected recurring costs from raw subscription records.
   * @param {Array<Object>} subscriptions
   * @returns {Object} Grouped by ISO currency code
   */
  static calculateProjectedSpend(subscriptions = []) {
    const currencies = {};

    subscriptions.forEach((sub) => {
      if (sub.status !== 'Active' && sub.status !== 'Trial') return;

      const currency = (sub.currency || 'USD').toUpperCase();
      if (!currencies[currency]) {
        currencies[currency] = {
          currency,
          projectedMonthlySpend: 0,
          projectedYearlySpend: 0,
          activeCount: 0,
          totalRawPrice: 0,
          minPrice: Infinity,
          maxPrice: -Infinity,
          largestSubscription: null
        };
      }

      const { monthlyEquivalent, yearlyEquivalent } = FrequencyNormalizer.normalize(
        sub.price,
        sub.frequency,
        sub.customIntervalUnit,
        sub.customIntervalValue
      );

      const target = currencies[currency];
      target.projectedMonthlySpend += monthlyEquivalent;
      target.projectedYearlySpend += yearlyEquivalent;
      target.activeCount += 1;
      target.totalRawPrice += Number(sub.price) || 0;

      if (monthlyEquivalent < target.minPrice) target.minPrice = monthlyEquivalent;
      if (monthlyEquivalent > target.maxPrice) {
        target.maxPrice = monthlyEquivalent;
        target.largestSubscription = {
          id: sub._id,
          name: sub.name,
          price: sub.price,
          monthlyEquivalent,
          currency
        };
      }
    });

    // Finalize rounding and averages per currency
    Object.keys(currencies).forEach((code) => {
      const c = currencies[code];
      c.projectedMonthlySpend = Math.round(c.projectedMonthlySpend * 100) / 100;
      c.projectedYearlySpend = Math.round(c.projectedYearlySpend * 100) / 100;
      c.averageCost =
        c.activeCount > 0 ? Math.round((c.projectedMonthlySpend / c.activeCount) * 100) / 100 : 0;
      if (c.minPrice === Infinity) c.minPrice = 0;
      if (c.maxPrice === -Infinity) c.maxPrice = 0;
    });

    return currencies;
  }

  /**
   * Calculates historical actual spend from recorded renewal timeline events.
   * @param {Array<Object>} renewalEvents
   * @returns {Object} Grouped by ISO currency code
   */
  static calculateHistoricalSpend(renewalEvents = []) {
    const currencies = {};

    renewalEvents.forEach((event) => {
      const currency = (
        event.newValues?.currency ||
        event.oldValues?.currency ||
        'USD'
      ).toUpperCase();
      const amount = Number(
        event.newValues?.price || event.oldValues?.price || event.metadata?.amount || 0
      );

      if (!currencies[currency]) {
        currencies[currency] = {
          currency,
          historicalSpend: 0,
          renewalEventCount: 0
        };
      }

      currencies[currency].historicalSpend += amount;
      currencies[currency].renewalEventCount += 1;
    });

    Object.keys(currencies).forEach((code) => {
      currencies[code].historicalSpend = Math.round(currencies[code].historicalSpend * 100) / 100;
    });

    return currencies;
  }
}

export default SpendingCalculator;
