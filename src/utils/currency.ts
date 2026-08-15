export interface CurrencyDetails {
  code: string;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = X Currency
}

export const CURRENCIES: Record<string, CurrencyDetails> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToUSD: 83.5 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.79 },
};

/**
 * Converts an amount from one currency to another using exchange rates.
 * @param amount Raw monetary amount
 * @param from Source currency code (e.g. 'USD', 'INR')
 * @param to Target currency code (e.g. 'INR', 'USD')
 */
export function convertCurrency(amount: number, from: string = 'USD', to: string = 'USD'): number {
  if (!amount || isNaN(amount)) return 0;
  const fromCode = (from || 'USD').toUpperCase();
  const toCode = (to || 'USD').toUpperCase();

  if (fromCode === toCode) return amount;

  const fromRate = CURRENCIES[fromCode]?.rateToUSD || 1.0;
  const toRate = CURRENCIES[toCode]?.rateToUSD || 1.0;

  // Convert amount to USD base, then to target currency
  const inUSD = amount / fromRate;
  return inUSD * toRate;
}

/**
 * Formats a monetary amount into a clean currency string.
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const symbol = CURRENCIES[currencyCode]?.symbol || '$';
  const formattedVal = (amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formattedVal}`;
}
