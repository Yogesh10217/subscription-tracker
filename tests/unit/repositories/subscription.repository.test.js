import { jest } from '@jest/globals';
import subscriptionRepository from '#repositories/subscription.repository.js';
import Subscription from '#models/subscription.model.js';

describe('SubscriptionRepository Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create should create subscription document', async () => {
    const mockSub = { _id: 'sub1', name: 'Netflix', price: 15.99 };
    jest.spyOn(Subscription, 'create').mockResolvedValue(mockSub);

    const result = await subscriptionRepository.create({ name: 'Netflix', price: 15.99 });
    expect(result.name).toBe('Netflix');
  });

  test('findByUserId should query by user ID', async () => {
    jest.spyOn(Subscription, 'find').mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ _id: 'sub1', name: 'Netflix' }])
    });

    const result = await subscriptionRepository.findByUserId('user123');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Netflix');
  });

  test('update should update subscription document', async () => {
    const mockUpdated = { _id: 'sub1', name: 'Netflix Updated' };
    jest.spyOn(Subscription, 'findByIdAndUpdate').mockResolvedValue(mockUpdated);

    const result = await subscriptionRepository.update('sub1', { name: 'Netflix Updated' });
    expect(result.name).toBe('Netflix Updated');
  });

  test('delete should delete subscription document', async () => {
    jest.spyOn(Subscription, 'findByIdAndDelete').mockResolvedValue({ _id: 'sub1' });
    const result = await subscriptionRepository.delete('sub1');
    expect(result._id).toBe('sub1');
  });
});
