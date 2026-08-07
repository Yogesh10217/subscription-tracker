import { jest } from '@jest/globals';
import workflowService from '#services/workflow.service.js';
import subscriptionRepository from '#repositories/subscription.repository.js';
import ApiError from '#utils/api-error.js';

describe('WorkflowService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('processSubscriptionReminder should throw badRequest if missing subscriptionId', async () => {
    await expect(workflowService.processSubscriptionReminder({})).rejects.toThrow(ApiError);
  });

  test('processSubscriptionReminder should return inactive message if status not Active', async () => {
    jest.spyOn(subscriptionRepository, 'findByIdWithUser').mockResolvedValue({
      _id: 'sub1',
      status: 'Cancelled',
      user: { email: 'user@example.com' }
    });

    const result = await workflowService.processSubscriptionReminder({ subscriptionId: 'sub1' });
    expect(result.message).toBe('Inactive subscription');
  });
});
