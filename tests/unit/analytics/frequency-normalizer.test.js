import FrequencyNormalizer from '#analytics/calculators/frequency-normalizer.js';

describe('FrequencyNormalizer Unit Tests', () => {
  test('should normalize Monthly frequency correctly', () => {
    const res = FrequencyNormalizer.normalize(100, 'Monthly');
    expect(res.monthlyEquivalent).toBe(100);
    expect(res.yearlyEquivalent).toBe(1200);
  });

  test('should normalize Yearly frequency correctly', () => {
    const res = FrequencyNormalizer.normalize(1200, 'Yearly');
    expect(res.monthlyEquivalent).toBe(100);
    expect(res.yearlyEquivalent).toBe(1200);
  });

  test('should normalize Weekly frequency correctly', () => {
    const res = FrequencyNormalizer.normalize(10, 'Weekly');
    expect(res.yearlyEquivalent).toBe(520);
    expect(res.monthlyEquivalent).toBe(43.33);
  });

  test('should normalize Quarterly frequency correctly', () => {
    const res = FrequencyNormalizer.normalize(300, 'Quarterly');
    expect(res.monthlyEquivalent).toBe(100);
    expect(res.yearlyEquivalent).toBe(1200);
  });

  test('should normalize Custom frequency (every 2 months) correctly', () => {
    const res = FrequencyNormalizer.normalize(200, 'Custom', 'month', 2);
    expect(res.monthlyEquivalent).toBe(100);
    expect(res.yearlyEquivalent).toBe(1200);
  });

  test('should handle zero or negative prices cleanly', () => {
    const res = FrequencyNormalizer.normalize(0, 'Monthly');
    expect(res.monthlyEquivalent).toBe(0);
    expect(res.yearlyEquivalent).toBe(0);
  });
});
