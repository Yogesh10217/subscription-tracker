/**
 * @file time-range.constants.js
 * @module analytics/constants/time-range.constants
 * @description Time range enums for analytics date calculations.
 */

export const TimeRangePeriod = Object.freeze({
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_QUARTER: 'this_quarter',
  LAST_QUARTER: 'last_quarter',
  THIS_YEAR: 'this_year',
  LAST_YEAR: 'last_year',
  CUSTOM: 'custom'
});

export default TimeRangePeriod;
