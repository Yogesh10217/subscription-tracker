import { jest } from '@jest/globals';
import subscriptionRepository from '#repositories/subscription.repository.js';
import Subscription from '#models/subscription.model.js';

describe('SubscriptionRepository Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create should create subscription document', async () => {
    const mockSub = { _id: '507f1f77bcf86cd799439022', name: 'Netflix', price: 15.99 };
    jest.spyOn(Subscription, 'create').mockResolvedValue(mockSub);

    const result = await subscriptionRepository.create({ name: 'Netflix', price: 15.99 });
    expect(result.name).toBe('Netflix');
  });

  test('findByUserId should query by user ID', async () => {
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([{ _id: '507f1f77bcf86cd799439022', name: 'Netflix' }])
    };
    jest.spyOn(Subscription, 'find').mockReturnValue(mockQuery);

    const result = await subscriptionRepository.findByUserId('507f1f77bcf86cd799439011');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Netflix');
  });

  test('update should update subscription document', async () => {
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      exec: jest
        .fn()
        .mockResolvedValue({ _id: '507f1f77bcf86cd799439022', name: 'Netflix Updated' })
    };
    mockQuery.then = (resolve) =>
      resolve({ _id: '507f1f77bcf86cd799439022', name: 'Netflix Updated' });
    jest.spyOn(Subscription, 'findOneAndUpdate').mockReturnValue(mockQuery);

    const result = await subscriptionRepository.update('507f1f77bcf86cd799439022', {
      name: 'Netflix Updated'
    });
    expect(result.name).toBe('Netflix Updated');
  });

  test('delete should delete subscription document', async () => {
    jest
      .spyOn(Subscription, 'findByIdAndDelete')
      .mockResolvedValue({ _id: '507f1f77bcf86cd799439022' });
    const result = await subscriptionRepository.delete('507f1f77bcf86cd799439022');
    expect(result._id).toBe('507f1f77bcf86cd799439022');
  });
});
