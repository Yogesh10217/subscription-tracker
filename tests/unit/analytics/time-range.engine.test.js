import TimeRangeEngine from '#analytics/time-range.engine.js';
import { TimeRangePeriod } from '#analytics/constants/time-range.constants.js';

describe('TimeRangeEngine Unit Tests', () => {
  test('should resolve valid start and end dates for all time periods', () => {
    const periods = [
      TimeRangePeriod.TODAY,
      TimeRangePeriod.THIS_WEEK,
      TimeRangePeriod.THIS_MONTH,
      TimeRangePeriod.LAST_MONTH,
      TimeRangePeriod.THIS_QUARTER,
      TimeRangePeriod.LAST_QUARTER,
      TimeRangePeriod.THIS_YEAR,
      TimeRangePeriod.LAST_YEAR,
      TimeRangePeriod.CUSTOM,
      'UNKNOWN_PERIOD'
    ];

    for (const period of periods) {
      const range = TimeRangeEngine.resolveRange(period);
      expect(range.startDate).toBeInstanceOf(Date);
      expect(range.endDate).toBeInstanceOf(Date);
      expect(range.startDate.getTime()).toBeLessThanOrEqual(range.endDate.getTime());
    }
  });

  test('should resolve custom date range with and without dates correctly', () => {
    const from = '2026-01-01T00:00:00.000Z';
    const to = '2026-01-31T23:59:59.999Z';
    const rangeWithDates = TimeRangeEngine.resolveRange(TimeRangePeriod.CUSTOM, from, to, 'UTC');
    expect(rangeWithDates.startDate).toBeInstanceOf(Date);
    expect(rangeWithDates.endDate).toBeInstanceOf(Date);
    expect(rangeWithDates.startDate.getUTCFullYear()).toBe(2026);
    expect(rangeWithDates.startDate.getUTCMonth()).toBe(0);
    expect(rangeWithDates.startDate.getUTCDate()).toBe(1);

    const rangeWithoutDates = TimeRangeEngine.resolveRange(TimeRangePeriod.CUSTOM);
    expect(rangeWithoutDates.startDate).toBeInstanceOf(Date);
    expect(rangeWithoutDates.endDate).toBeInstanceOf(Date);
  });
});
