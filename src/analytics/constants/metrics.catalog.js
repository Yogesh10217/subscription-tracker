/**
 * @file metrics.catalog.js
 * @module analytics/constants/metrics.catalog
 * @description Centralized metric catalog defining calculation rules, source data, currency behavior, and edge cases.
 */

export const METRICS_CATALOG = Object.freeze({
  PROJECTED_MONTHLY_SPEND: {
    name: 'projected_monthly_spend',
    description: 'Sum of normalized monthly equivalent costs for active subscriptions',
    calculation: 'Sum(price * monthly_multiplier)',
    sourceData: 'Subscription collection (status = Active)',
    currencyBehavior: 'Grouped per ISO 4217 currency',
    edgeCases: 'Excludes archived and soft-deleted subscriptions unless explicitly requested'
  },
  PROJECTED_YEARLY_SPEND: {
    name: 'projected_yearly_spend',
    description: 'Sum of normalized yearly equivalent costs for active subscriptions',
    calculation: 'Sum(price * yearly_multiplier)',
    sourceData: 'Subscription collection (status = Active)',
    currencyBehavior: 'Grouped per ISO 4217 currency',
    edgeCases: 'Excludes archived and soft-deleted subscriptions unless explicitly requested'
  },
  HISTORICAL_SPEND: {
    name: 'historical_spend',
    description: 'Sum of actual recorded renewal payment events within a date range',
    calculation: 'Sum(TimelineEvent.oldValues.price or newValues.price)',
    sourceData: 'TimelineEvent collection (eventType = RENEWAL)',
    currencyBehavior: 'Grouped per ISO 4217 currency',
    edgeCases: 'Returns 0 if no renewal events exist in date range'
  },
  ACTIVE_SUBSCRIPTION_COUNT: {
    name: 'active_subscription_count',
    description: 'Count of subscriptions with status Active',
    calculation: 'Count(Subscription where status = Active)',
    sourceData: 'Subscription collection',
    currencyBehavior: 'Currency independent',
    edgeCases: 'Excludes soft-deleted'
  },
  TRIAL_SUBSCRIPTION_COUNT: {
    name: 'trial_subscription_count',
    description: 'Count of subscriptions currently in trial period',
    calculation: 'Count(Subscription where isTrial = true or status = Trial)',
    sourceData: 'Subscription collection',
    currencyBehavior: 'Currency independent',
    edgeCases: 'Includes active trials'
  },
  TRIAL_CONVERSION_RATE: {
    name: 'trial_conversion_rate',
    description: 'Percentage of trials that converted to active paid subscriptions',
    calculation: '(Converted Trials / Total Trials) * 100',
    sourceData: 'TimelineEvent collection (eventType = TRIAL_CONVERSION)',
    currencyBehavior: 'Currency independent',
    edgeCases: 'Returns 0% if total trials = 0'
  },
  UPCOMING_RENEWAL_COUNT: {
    name: 'upcoming_renewal_count',
    description: 'Count of active subscriptions renewing within specified window',
    calculation: 'Count(Subscription where renewalDate between startDate and endDate)',
    sourceData: 'Subscription collection',
    currencyBehavior: 'Currency independent',
    edgeCases: 'Respects timezone boundary'
  },
  UPCOMING_RENEWAL_AMOUNT: {
    name: 'upcoming_renewal_amount',
    description: 'Sum of costs for upcoming renewals grouped by currency',
    calculation: 'Sum(price)',
    sourceData: 'Subscription collection',
    currencyBehavior: 'Grouped per ISO 4217 currency',
    edgeCases: 'Respects date range'
  }
});

export default METRICS_CATALOG;
