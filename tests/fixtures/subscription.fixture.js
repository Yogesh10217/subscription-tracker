export const validSubscriptionPayload = {
  name: 'Netflix Premium',
  price: 19.99,
  currency: 'USD',
  frequency: 'Monthly',
  category: 'Entertainment',
  paymentMethod: 'Credit Card',
  status: 'Active',
  startDate: '2026-01-01'
};

export const sampleSubscriptionDoc = {
  _id: '507f1f77bcf86cd799439022',
  name: 'Spotify Premium',
  price: 9.99,
  currency: 'USD',
  frequency: 'Monthly',
  category: 'Entertainment',
  paymentMethod: 'PayPal',
  status: 'Active',
  startDate: new Date('2026-01-01'),
  renewalDate: new Date('2026-02-01'),
  user: '507f1f77bcf86cd799439011'
};
