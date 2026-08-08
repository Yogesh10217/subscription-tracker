import { jest } from '@jest/globals';
import subscriptionService from '#services/subscription.service.js';
import subscriptionRepository from '#repositories/subscription.repository.js';
import timelineService from '#services/timeline.service.js';
import ApiError from '#utils/api-error.js';

describe('SubscriptionService Extended Unit Tests', () => {
  const mockSub = {
    _id: 'sub123',
    id: 'sub123',
    name: 'Netflix',
    price: 15,
    currency: 'USD',
    renewalDate: new Date('2026-09-01'),
    user: 'user123',
    isFavorite: false,
    isPinned: false,
    toObject: () => ({ _id: 'sub123', name: 'Netflix', price: 15 })
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('createSubscription should store sub and record timeline event', async () => {
    jest.spyOn(subscriptionRepository, 'create').mockResolvedValue(mockSub);
    jest.spyOn(timelineService, 'recordEvent').mockResolvedValue({});

    const res = await subscriptionService.createSubscription({ name: 'Netflix' }, 'user123');
    expect(res.subscription).toBeDefined();
    expect(timelineService.recordEvent).toHaveBeenCalled();
  });

  test('getAllSubscriptions and getSubscriptionDetails error paths', async () => {
    jest.spyOn(subscriptionRepository, 'findAll').mockResolvedValue([mockSub]);
    const res = await subscriptionService.getAllSubscriptions({ _id: 'user123' });
    expect(res).toHaveLength(1);

    jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue(null);
    await expect(subscriptionService.getSubscriptionDetails('missing')).rejects.toThrow(ApiError);
  });

  test('updateSubscription should throw notFound if sub missing', async () => {
    jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue(null);
    await expect(subscriptionService.updateSubscription('sub123', { price: 20 })).rejects.toThrow(ApiError);
  });

  test('updateSubscription should record PRICE_CHANGE and RENEWAL timeline events when fields change', async () => {
    jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue(mockSub);
    const updatedSub = { ...mockSub, price: 20, renewalDate: new Date('2026-10-01') };
    jest.spyOn(subscriptionRepository, 'update').mockResolvedValue(updatedSub);
    jest.spyOn(timelineService, 'recordEvent').mockResolvedValue({});

    await subscriptionService.updateSubscription('sub123', { price: 20, renewalDate: new Date('2026-10-01') }, 'user123');
    expect(timelineService.recordEvent).toHaveBeenCalled();
  });

  test('toggleFavorite and togglePin should modify flags or throw on mismatch', async () => {
    jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue(mockSub);
    jest.spyOn(subscriptionRepository, 'update').mockResolvedValue({ ...mockSub, isFavorite: true });

    const fav = await subscriptionService.toggleFavorite('sub123', 'user123');
    expect(fav.isFavorite).toBe(true);

    const pin = await subscriptionService.togglePin('sub123', 'user123');
    expect(pin).toBeDefined();

    jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue(null);
    await expect(subscriptionService.toggleFavorite('sub123', 'other')).rejects.toThrow(ApiError);
    await expect(subscriptionService.togglePin('sub123', 'other')).rejects.toThrow(ApiError);
  });

  test('archiveSubscription and restoreSubscription should handle timeline events or throw', async () => {
    jest.spyOn(subscriptionRepository, 'archive').mockResolvedValue(mockSub);
    jest.spyOn(subscriptionRepository, 'restore').mockResolvedValue(mockSub);
    jest.spyOn(timelineService, 'recordEvent').mockResolvedValue({});

    await subscriptionService.archiveSubscription('sub123', 'user123');
    expect(timelineService.recordEvent).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'ARCHIVED' }));

    await subscriptionService.restoreSubscription('sub123', 'user123');
    expect(timelineService.recordEvent).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'RESTORED' }));

    jest.spyOn(subscriptionRepository, 'archive').mockResolvedValue(null);
    await expect(subscriptionService.archiveSubscription('sub123', 'user123')).rejects.toThrow(ApiError);

    jest.spyOn(subscriptionRepository, 'restore').mockResolvedValue(null);
    await expect(subscriptionService.restoreSubscription('sub123', 'user123')).rejects.toThrow(ApiError);
  });

  test('deleteSubscription soft delete vs hard delete', async () => {
    jest.spyOn(subscriptionRepository, 'softDelete').mockResolvedValue(mockSub);
    const softRes = await subscriptionService.deleteSubscription('sub123', 'user123');
    expect(softRes.message).toBe('Subscription soft deleted successfully');

    jest.spyOn(subscriptionRepository, 'softDelete').mockResolvedValue(null);
    await expect(subscriptionService.deleteSubscription('sub123', 'user123')).rejects.toThrow(ApiError);

    jest.spyOn(subscriptionRepository, 'delete').mockResolvedValue(mockSub);
    const hardRes = await subscriptionService.deleteSubscription('sub123');
    expect(hardRes.message).toBe('Subscription deleted successfully');
  });

  test('cancelSubscription should mark status as Cancelled or throw if missing', async () => {
    jest.spyOn(subscriptionRepository, 'update').mockResolvedValue({ ...mockSub, status: 'Cancelled' });
    jest.spyOn(timelineService, 'recordEvent').mockResolvedValue({});

    const res = await subscriptionService.cancelSubscription('sub123', 'user123');
    expect(res.status).toBe('Cancelled');

    jest.spyOn(subscriptionRepository, 'update').mockResolvedValue(null);
    await expect(subscriptionService.cancelSubscription('sub123', 'user123')).rejects.toThrow(ApiError);
  });

  test('bulkOperation should handle archive, restore, delete, updateCategory, updateTags', async () => {
    jest.spyOn(subscriptionRepository, 'bulkArchive').mockResolvedValue({ modifiedCount: 2 });
    jest.spyOn(subscriptionRepository, 'bulkRestore').mockResolvedValue({ modifiedCount: 2 });
    jest.spyOn(subscriptionRepository, 'bulkDelete').mockResolvedValue({ modifiedCount: 2 });
    jest.spyOn(subscriptionRepository, 'bulkUpdateCategory').mockResolvedValue({ modifiedCount: 2 });
    jest.spyOn(subscriptionRepository, 'bulkUpdateTags').mockResolvedValue({ modifiedCount: 2 });

    await expect(subscriptionService.bulkOperation('invalid', ['id1'], 'user123')).rejects.toThrow(ApiError);
    await expect(subscriptionService.bulkOperation('archive', [], 'user123')).rejects.toThrow(ApiError);

    const archiveRes = await subscriptionService.bulkOperation('archive', ['id1', 'id2'], 'user123');
    expect(archiveRes.modifiedCount).toBe(2);

    const restoreRes = await subscriptionService.bulkOperation('restore', ['id1', 'id2'], 'user123');
    expect(restoreRes.modifiedCount).toBe(2);

    const deleteRes = await subscriptionService.bulkOperation('delete', ['id1', 'id2'], 'user123');
    expect(deleteRes.modifiedCount).toBe(2);

    const categoryRes = await subscriptionService.bulkOperation('updateCategory', ['id1', 'id2'], 'user123', { categoryRef: 'cat1', categoryName: 'Streaming' });
    expect(categoryRes.modifiedCount).toBe(2);

    const tagsRes = await subscriptionService.bulkOperation('updateTags', ['id1', 'id2'], 'user123', { tags: ['tag1'] });
    expect(tagsRes.modifiedCount).toBe(2);
  });

  test('getUpcomingRenewals should call findUpcomingRenewals repository method', async () => {
    jest.spyOn(subscriptionRepository, 'findUpcomingRenewals').mockResolvedValue([mockSub]);
    const res = await subscriptionService.getUpcomingRenewals({ _id: 'user123' });
    expect(res).toHaveLength(1);
  });
});
