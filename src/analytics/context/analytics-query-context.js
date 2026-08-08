/**
 * @file analytics-query-context.js
 * @module analytics/context/analytics-query-context
 * @description Unified query context constructor governing all analytics endpoints.
 */

import TimeRangeEngine from '../time-range.engine.js';

export class AnalyticsQueryContext {
  /**
   * Constructs a standardized analytics query context.
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} [params.period='this_month']
   * @param {string|Date} [params.from]
   * @param {string|Date} [params.to]
   * @param {string} [params.currency]
   * @param {boolean} [params.includeArchived=false]
   * @param {boolean} [params.includeDeleted=false]
   * @param {string} [params.timezone='UTC']
   * @param {string} [params.granularity='month']
   */
  constructor({
    userId,
    period = 'this_month',
    from = null,
    to = null,
    currency = null,
    includeArchived = false,
    includeDeleted = false,
    timezone = 'UTC',
    granularity = 'month'
  }) {
    if (!userId) {
      throw new Error('AnalyticsQueryContext requires a valid userId');
    }

    this.userId = userId.toString();
    this.period = period;
    this.currency = currency ? currency.toUpperCase() : null;
    this.includeArchived = includeArchived === 'true' || includeArchived === true;
    this.includeDeleted = includeDeleted === 'true' || includeDeleted === true;
    this.timezone = timezone || 'UTC';
    this.granularity = granularity || 'month';

    const range = TimeRangeEngine.resolveRange(period, from, to, this.timezone);
    this.startDate = range.startDate;
    this.endDate = range.endDate;
  }

  /**
   * Returns base Mongoose match query scoping user and deletion/archive flags.
   * @returns {Object}
   */
  getBaseSubscriptionMatch() {
    const match = { user: this.userId, isDeleted: this.includeDeleted };
    if (!this.includeArchived) {
      match.isArchived = false;
    }
    if (this.currency) {
      match.currency = this.currency;
    }
    return match;
  }
}

export default AnalyticsQueryContext;
