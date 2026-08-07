import ApiError from '../utils/api-error.js';
import { PaymentFrequency } from '../constants/payment-frequency.js';

const ALLOWED_CATEGORIES = ['Entertainment', 'Productivity', 'Education', 'Health', 'Other'];
const ALLOWED_FREQUENCIES = Object.values(PaymentFrequency);

export const validateCreateSubscription = (req, res, next) => {
  const { name, price, category, frequency, paymentMethod, startDate } = req.body || {};
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name is required (min 2 chars)' });
  }

  if (price === undefined || typeof price !== 'number' || price < 0 || price > 1000) {
    errors.push({ field: 'price', message: 'Price must be a number between 0 and 1000' });
  }

  if (!category || !ALLOWED_CATEGORIES.includes(category)) {
    errors.push({
      field: 'category',
      message: `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`
    });
  }

  if (frequency && !ALLOWED_FREQUENCIES.includes(frequency)) {
    errors.push({
      field: 'frequency',
      message: `Frequency must be one of: ${ALLOWED_FREQUENCIES.join(', ')}`
    });
  }

  if (!paymentMethod || typeof paymentMethod !== 'string') {
    errors.push({ field: 'paymentMethod', message: 'Payment Method is required' });
  }

  if (!startDate || isNaN(new Date(startDate).getTime())) {
    errors.push({ field: 'startDate', message: 'Valid Start Date is required' });
  }

  if (errors.length > 0) {
    return next(ApiError.validation('Invalid subscription payload', errors));
  }

  next();
};
