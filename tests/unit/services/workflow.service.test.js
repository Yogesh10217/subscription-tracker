import { jest } from '@jest/globals';
import dayjs from 'dayjs';
import workflowService from '#services/workflow.service.js';
import subscriptionRepository from '#repositories/subscription.repository.js';
import ApiError from '#utils/api-error.js';

describe('WorkflowService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('processSubscriptionReminder should throw badRequest if missing subscriptionId', async () => {
    await expect(workflowService.processSubscriptionReminder({})).rejects.toThrow(ApiError);
  });

  test('processSubscriptionReminder handles base64 encoded QStash body array', async () => {
    const encodedPayload = Buffer.from(JSON.stringify({ subscriptionId: 'sub123' })).toString('base64');
    jest.spyOn(subscriptionRepository, 'findByIdWithUser').mockResolvedValue(null);

    await expect(
      workflowService.processSubscriptionReminder([{ body: encodedPayload }])
    ).rejects.toThrow(ApiError);
  });

  test('processSubscriptionReminder throws notFound if subscription missing', async () => {
    jest.spyOn(subscriptionRepository, 'findByIdWithUser').mockResolvedValue(null);
    await expect(workflowService.processSubscriptionReminder({ subscriptionId: 'missing' })).rejects.toThrow(ApiError);
  });

  test('processSubscriptionReminder returns inactive message if status not Active', async () => {
    jest.spyOn(subscriptionRepository, 'findByIdWithUser').mockResolvedValue({
      _id: 'sub1',
      status: 'Cancelled',
      user: { email: 'user@example.com' }
    });

    const result = await workflowService.processSubscriptionReminder({ subscriptionId: 'sub1' });
    expect(result.message).toBe('Inactive subscription');
  });

  test('processSubscriptionReminder throws badRequest if user email is missing', async () => {
    jest.spyOn(subscriptionRepository, 'findByIdWithUser').mockResolvedValue({
      _id: 'sub1',
      status: 'Active',
      user: {}
    });

    await expect(workflowService.processSubscriptionReminder({ subscriptionId: 'sub1' })).rejects.toThrow(ApiError);
  });

  test('processSubscriptionReminder handles past renewal date and active reminders', async () => {
    // Past renewal date
    jest.spyOn(subscriptionRepository, 'findByIdWithUser').mockResolvedValueOnce({
      _id: 'sub1',
      status: 'Active',
      renewalDate: dayjs().subtract(5, 'day').toDate(),
      user: { email: 'user@example.com' }
    });

    const pastRes = await workflowService.processSubscriptionReminder({ subscriptionId: 'sub1' });
    expect(pastRes.message).toBe('Renewal date passed');

    // Successful reminder send
    jest.spyOn(subscriptionRepository, 'findByIdWithUser').mockResolvedValueOnce({
      _id: 'sub1',
      status: 'Active',
      renewalDate: dayjs().add(7, 'day').toDate(),
      user: { email: 'user@example.com' }
    });

    const successRes = await workflowService.processSubscriptionReminder({ subscriptionId: 'sub1' });
    expect(successRes.message).toBe('Reminder email sent successfully');
  });
});
