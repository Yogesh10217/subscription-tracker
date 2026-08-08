export const PaymentFrequency = Object.freeze({
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  YEARLY: 'Yearly',
  CUSTOM: 'Custom'
});

export const RENEWAL_PERIODS = Object.freeze({
  Daily: 1,
  Weekly: 7,
  Monthly: 30,
  Quarterly: 90,
  Yearly: 365,
  Custom: 30
});

export default PaymentFrequency;
