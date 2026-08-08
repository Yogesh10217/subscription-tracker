export const currencyUtils = {
  /**
   * Format an amount into a localized currency string
   * @param {number} amount - The numeric amount
   * @param {string} currency - The currency code (e.g., 'USD', 'INR', 'EUR')
   * @returns {string} Formatted string
   */
  format(amount, currency = 'USD') {
    if (typeof amount !== 'number') return 'N/A';
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      // Fallback if currency code is invalid
      return `${currency} ${amount.toFixed(2)}`;
    }
  }
};
