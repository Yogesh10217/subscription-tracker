/**
 * @file insights.rules.js
 * @module analytics/insights/insights.rules
 * @description Deterministic rule definitions evaluating raw metrics to produce explainable user insights.
 */

export const INSIGHT_RULES = Object.freeze([
  {
    id: 'TOP_CATEGORY_CONCENTRATION',
    name: 'Top Category Spend Concentration',
    evaluate: (data) => {
      const insights = [];
      const categoryData = data.categoryAnalytics || {};

      Object.keys(categoryData).forEach((currency) => {
        const catGroup = categoryData[currency];
        if (catGroup && catGroup.categories && catGroup.categories.length > 0) {
          const topCat = catGroup.categories[0];
          if (topCat.percentage >= 40) {
            insights.push({
              type: 'CATEGORY_CONCENTRATION',
              title: `High Spending in ${topCat.name}`,
              description: `Your ${topCat.name} category represents ${topCat.percentage}% of your monthly recurring spend in ${currency}.`,
              metric: 'category_percentage',
              value: topCat.percentage,
              severity: topCat.percentage >= 60 ? 'IMPORTANT' : 'WARNING',
              supportingData: { category: topCat.name, monthlySpend: topCat.monthlySpend, currency }
            });
          }
        }
      });

      return insights;
    }
  },

  {
    id: 'UPCOMING_RENEWALS_NOTICE',
    name: 'Upcoming Renewals Schedule Alert',
    evaluate: (data) => {
      const renewalData = data.renewalAnalytics || {};
      if (renewalData.upcoming30DaysCount > 0) {
        return [
          {
            type: 'UPCOMING_RENEWAL',
            title: `${renewalData.upcoming30DaysCount} Subscriptions Renewing Soon`,
            description: `You have ${renewalData.upcoming30DaysCount} subscription(s) scheduled to renew within the next 30 days.`,
            metric: 'upcoming_renewal_count',
            value: renewalData.upcoming30DaysCount,
            severity: 'IMPORTANT',
            supportingData: {
              count30Days: renewalData.upcoming30DaysCount,
              costsByCurrency: renewalData.upcoming30DaysCostsByCurrency
            }
          }
        ];
      }
      return [];
    }
  },

  {
    id: 'RECENT_PRICE_HIKE_ALERT',
    name: 'Recent Price Increase Alert',
    evaluate: (data) => {
      const priceData = data.priceAnalytics || {};
      if (priceData.priceIncreasesCount > 0 && priceData.largestIncrease) {
        const inc = priceData.largestIncrease;
        return [
          {
            type: 'PRICE_INCREASE',
            title: 'Subscription Price Increase Detected',
            description: `Recent price increases detected across ${priceData.priceIncreasesCount} subscription(s). Largest increase was +${inc.diff} ${inc.currency}.`,
            metric: 'price_increase_count',
            value: priceData.priceIncreasesCount,
            severity: 'WARNING',
            supportingData: {
              increaseCount: priceData.priceIncreasesCount,
              largestIncrease: priceData.largestIncrease
            }
          }
        ];
      }
      return [];
    }
  },

  {
    id: 'ACTIVE_TRIAL_EXPIRATION',
    name: 'Active Trial Expiration Opportunity',
    evaluate: (data) => {
      const trialData = data.trialAnalytics || {};
      if (trialData.activeTrialsCount > 0) {
        return [
          {
            type: 'TRIAL_EXPIRATION',
            title: `${trialData.activeTrialsCount} Active Trial(s) Running`,
            description: `You have ${trialData.activeTrialsCount} active trial subscription(s). Review before automatic paid conversion.`,
            metric: 'active_trial_count',
            value: trialData.activeTrialsCount,
            severity: 'INFO',
            supportingData: {
              activeTrials: trialData.activeTrialsCount,
              potentialCost: trialData.potentialConversionCostByCurrency
            }
          }
        ];
      }
      return [];
    }
  },

  {
    id: 'LARGEST_RECURRING_EXPENSE',
    name: 'Largest Recurring Expense Highlight',
    evaluate: (data) => {
      const spendData = data.spendingAnalytics || {};
      const insights = [];

      if (spendData.projectedSpendByCurrency) {
        Object.keys(spendData.projectedSpendByCurrency).forEach((curr) => {
          const item = spendData.projectedSpendByCurrency[curr];
          if (item && item.largestSubscription) {
            const top = item.largestSubscription;
            insights.push({
              type: 'LARGEST_EXPENSE',
              title: `Top Expense: ${top.name}`,
              description: `Your highest recurring subscription is ${top.name} at ${top.monthlyEquivalent} ${curr}/month.`,
              metric: 'largest_subscription_cost',
              value: top.monthlyEquivalent,
              severity: 'INFO',
              supportingData: top
            });
          }
        });
      }

      return insights;
    }
  }
]);

export default INSIGHT_RULES;
