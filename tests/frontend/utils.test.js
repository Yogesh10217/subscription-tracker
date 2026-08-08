/**
 * @jest-environment jsdom
 */

import { domUtils } from '../../public/js/utils/dom.util.js';
import { currencyUtils } from '../../public/js/utils/currency.util.js';

describe('Frontend Utils', () => {
  describe('domUtils.escapeHTML', () => {
    it('escapes script tags to prevent XSS', () => {
      const malicious = '<script>alert("xss")</script>';
      const safe = domUtils.escapeHTML(malicious);
      expect(safe).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    it('handles empty strings gracefully', () => {
      expect(domUtils.escapeHTML(null)).toBe('');
      expect(domUtils.escapeHTML('')).toBe('');
    });
  });

  describe('currencyUtils.format', () => {
    it('formats USD correctly', () => {
      const result = currencyUtils.format(10.5, 'USD');
      expect(result).toMatch(/\$10\.50/);
    });

    it('formats INR correctly', () => {
      const result = currencyUtils.format(999, 'INR');
      // Depending on Node version, it might be ₹999.00 or similar
      expect(result).toMatch(/999\.00/);
    });

    it('returns N/A for invalid numbers', () => {
      expect(currencyUtils.format(null, 'USD')).toBe('N/A');
    });
  });
});
