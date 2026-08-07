import { jest } from '@jest/globals';
import subscriptionService from '#services/subscription.service.js';
import subscriptionRepository from '#repositories/subscription.repository.js';
import ApiError from '#utils/api-error.js';

describe('SubscriptionService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getUserSubscriptions should throw unauthorized if user does not match requesting user', async () => {
    await expect(
      subscriptionService.getUserSubscriptions('user123', 'otherUser456')
    ).rejects.toThrow(ApiError);
  });

  test('getSubscriptionDetails should return subscription if found', async () => {
    jest
      .spyOn(subscriptionRepository, 'findById')
      .mockResolvedValue({ _id: 'sub1', name: 'Netflix' });
    const res = await subscriptionService.getSubscriptionDetails('sub1');
    expect(res.name).toBe('Netflix');
  });

  test('deleteSubscription should throw notFound if subscription does not exist', async () => {
    jest.spyOn(subscriptionRepository, 'delete').mockResolvedValue(null);
    await expect(subscriptionService.deleteSubscription('missing')).rejects.toThrow(ApiError);
  });
});
