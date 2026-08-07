import { jest } from '@jest/globals';
import { validateCreateSubscription } from '#validators/subscription.validator.js';

describe('SubscriptionValidator Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
  });

  test('validateCreateSubscription should reject invalid price or category', () => {
    req.body = { name: 'Netflix', price: -5, category: 'InvalidCategory' };
    validateCreateSubscription(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.anything());
  });

  test('validateCreateSubscription should pass valid payload', () => {
    req.body = {
      name: 'Netflix',
      price: 15.99,
      category: 'Entertainment',
      frequency: 'Monthly',
      paymentMethod: 'Credit Card',
      startDate: '2026-01-01'
    };
    validateCreateSubscription(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});
