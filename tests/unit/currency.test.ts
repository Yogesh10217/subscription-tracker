import { convertCurrency, formatCurrency } from '../../src/utils/currency';

describe('currency utilities', () => {
  describe('convertCurrency', () => {
    it('returns 0 for invalid or falsy amounts', () => {
      expect(convertCurrency(0)).toBe(0);
      expect(convertCurrency(NaN)).toBe(0);
    });

    it('returns the same amount when from and to currencies are identical', () => {
      expect(convertCurrency(100, 'USD', 'USD')).toBe(100);
      expect(convertCurrency(5000, 'INR', 'inr')).toBe(5000);
    });

    it('converts correctly between currencies using exchange rates', () => {
      // 100 USD to INR: 100 / 1.0 * 83.5 = 8350
      expect(convertCurrency(100, 'USD', 'INR')).toBe(8350);

      // 8350 INR to USD: 8350 / 83.5 * 1.0 = 100
      expect(convertCurrency(8350, 'INR', 'USD')).toBe(100);
    });

    it('handles unknown currencies by falling back to 1.0 rate', () => {
      expect(convertCurrency(50, 'XYZ', 'USD')).toBe(50);
    });
  });

  describe('formatCurrency', () => {
    it('formats amounts with appropriate currency symbols and 2 decimals', () => {
      expect(formatCurrency(100, 'USD')).toBe('$100.00');
      expect(formatCurrency(5000.5, 'INR')).toBe('₹5,000.50');
      expect(formatCurrency(25.99, 'EUR')).toBe('€25.99');
      expect(formatCurrency(12.5, 'GBP')).toBe('£12.50');
    });

    it('defaults to USD symbol if currency is unknown or amount is 0', () => {
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
      expect(formatCurrency(100, 'UNKNOWN')).toBe('$100.00');
    });
  });
});
