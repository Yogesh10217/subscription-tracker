import TimeRangeEngine from '#analytics/time-range.engine.js';
import { TimeRangePeriod } from '#analytics/constants/time-range.constants.js';

describe('TimeRangeEngine Unit Tests', () => {
  test('should resolve valid start and end dates for this_month', () => {
    const range = TimeRangeEngine.resolveRange(TimeRangePeriod.THIS_MONTH);
    expect(range.startDate).toBeInstanceOf(Date);
    expect(range.endDate).toBeInstanceOf(Date);
    expect(range.startDate.getTime()).toBeLessThan(range.endDate.getTime());
  });

  test('should resolve custom date range correctly', () => {
    const from = '2026-01-01T00:00:00.000Z';
    const to = '2026-01-31T23:59:59.999Z';
    const range = TimeRangeEngine.resolveRange(TimeRangePeriod.CUSTOM, from, to, 'UTC');
    expect(range.startDate).toBeInstanceOf(Date);
    expect(range.endDate).toBeInstanceOf(Date);
    expect(range.startDate.getUTCFullYear()).toBe(2026);
    expect(range.startDate.getUTCMonth()).toBe(0);
    expect(range.startDate.getUTCDate()).toBe(1);
  });
});
