/**
 * @file time-range.engine.js
 * @module analytics/time-range.engine
 * @description Centralized timezone-aware date range calculation engine.
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezonePlugin from 'dayjs/plugin/timezone.js';
import { TimeRangePeriod } from './constants/time-range.constants.js';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

export class TimeRangeEngine {
  /**
   * Resolves start and end Date objects for any time period.
   * @param {string} period
   * @param {string|Date} [customFrom]
   * @param {string|Date} [customTo]
   * @param {string} [tz='UTC']
   * @returns {{ startDate: Date, endDate: Date }}
   */
  static resolveRange(
    period = TimeRangePeriod.THIS_MONTH,
    customFrom = null,
    customTo = null,
    tz = 'UTC'
  ) {
    const validTz = dayjs.tz ? tz : 'UTC';
    const now = dayjs().tz(validTz);

    let startDate;
    let endDate;

    switch (period) {
      case TimeRangePeriod.TODAY:
        startDate = now.startOf('day');
        endDate = now.endOf('day');
        break;

      case TimeRangePeriod.THIS_WEEK:
        startDate = now.startOf('week');
        endDate = now.endOf('week');
        break;

      case TimeRangePeriod.THIS_MONTH:
        startDate = now.startOf('month');
        endDate = now.endOf('month');
        break;

      case TimeRangePeriod.LAST_MONTH: {
        const lastMonth = now.subtract(1, 'month');
        startDate = lastMonth.startOf('month');
        endDate = lastMonth.endOf('month');
        break;
      }

      case TimeRangePeriod.THIS_QUARTER:
        startDate = now.startOf('quarter');
        endDate = now.endOf('quarter');
        break;

      case TimeRangePeriod.LAST_QUARTER: {
        const lastQuarter = now.subtract(1, 'quarter');
        startDate = lastQuarter.startOf('quarter');
        endDate = lastQuarter.endOf('quarter');
        break;
      }

      case TimeRangePeriod.THIS_YEAR:
        startDate = now.startOf('year');
        endDate = now.endOf('year');
        break;

      case TimeRangePeriod.LAST_YEAR: {
        const lastYear = now.subtract(1, 'year');
        startDate = lastYear.startOf('year');
        endDate = lastYear.endOf('year');
        break;
      }

      case TimeRangePeriod.CUSTOM:
        if (!customFrom || !customTo) {
          startDate = now.startOf('month');
          endDate = now.endOf('month');
        } else {
          startDate = dayjs(customFrom).tz(validTz).startOf('day');
          endDate = dayjs(customTo).tz(validTz).endOf('day');
        }
        break;

      default:
        startDate = now.startOf('month');
        endDate = now.endOf('month');
        break;
    }

    return {
      startDate: startDate.toDate(),
      endDate: endDate.toDate()
    };
  }
}

export default TimeRangeEngine;
