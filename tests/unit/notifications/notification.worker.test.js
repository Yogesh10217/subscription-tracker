import { jest } from '@jest/globals';
import NotificationWorker from '#notifications/workers/notification.worker.js';
import notificationRepository from '#notifications/repositories/notification.repository.js';
import userRepository from '#repositories/user.repository.js';
import emailProvider from '#notifications/providers/email.provider.js';
import NotificationDeliveryStatus from '#notifications/constants/notification-status.js';

describe('NotificationWorker Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('processJob throws if notificationId is missing or record not found', async () => {
    await expect(NotificationWorker.processJob({})).rejects.toThrow('notificationId is required');

    jest.spyOn(notificationRepository, 'findById').mockResolvedValue(null);
    await expect(NotificationWorker.processJob({ notificationId: 'n1' })).rejects.toThrow(
      'record not found'
    );
  });

  test('processJob skips if invalid status transition', async () => {
    jest.spyOn(notificationRepository, 'findById').mockResolvedValue({
      deliveryStatus: NotificationDeliveryStatus.SENT
    });

    const res = await NotificationWorker.processJob({ notificationId: 'n1' });
    expect(res).toEqual({ skipped: true, status: NotificationDeliveryStatus.SENT });
  });

  test('processJob fails if recipient user email is missing', async () => {
    jest.spyOn(notificationRepository, 'findById').mockResolvedValue({
      _id: 'n1',
      user: 'u1',
      deliveryStatus: NotificationDeliveryStatus.SCHEDULED
    });
    jest.spyOn(notificationRepository, 'markProcessing').mockResolvedValue();
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue(null);
    jest.spyOn(notificationRepository, 'markFailed').mockResolvedValue();

    const res = await NotificationWorker.processJob({ notificationId: 'n1' });
    expect(res).toEqual({ success: false, reason: 'Recipient user email missing or deleted' });
  });

  test('processJob sends EMAIL successfully', async () => {
    jest.spyOn(notificationRepository, 'findById').mockResolvedValue({
      _id: 'n1',
      user: 'u1',
      channel: 'EMAIL',
      title: 'Subject',
      body: 'Body',
      deliveryStatus: NotificationDeliveryStatus.SCHEDULED
    });
    jest.spyOn(notificationRepository, 'markProcessing').mockResolvedValue();
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue({ email: 'user@example.com' });
    jest.spyOn(emailProvider, 'send').mockResolvedValue({ messageId: 'm123' });
    jest.spyOn(notificationRepository, 'markSent').mockResolvedValue();

    const res = await NotificationWorker.processJob({ notificationId: 'n1' });
    expect(res).toEqual({ success: true, messageId: 'm123' });
  });

  test('processJob handles IN_APP channel', async () => {
    jest.spyOn(notificationRepository, 'findById').mockResolvedValue({
      _id: 'n1',
      user: 'u1',
      channel: 'IN_APP',
      deliveryStatus: NotificationDeliveryStatus.SCHEDULED
    });
    jest.spyOn(notificationRepository, 'markProcessing').mockResolvedValue();
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue({ email: 'user@example.com' });
    jest.spyOn(notificationRepository, 'markDelivered').mockResolvedValue();

    const res = await NotificationWorker.processJob({ notificationId: 'n1' });
    expect(res).toEqual({ success: true, delivered: true });
  });

  test('processJob handles transient retry and permanent failure', async () => {
    jest.spyOn(notificationRepository, 'findById').mockResolvedValue({
      _id: 'n1',
      user: 'u1',
      channel: 'EMAIL',
      retryCount: 0,
      maxRetries: 3,
      deliveryStatus: NotificationDeliveryStatus.SCHEDULED
    });
    jest.spyOn(notificationRepository, 'markProcessing').mockResolvedValue();
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue({ email: 'user@example.com' });
    jest.spyOn(emailProvider, 'send').mockRejectedValue(new Error('Network error'));
    jest.spyOn(notificationRepository, 'markRetrying').mockResolvedValue();

    const retryRes = await NotificationWorker.processJob({ notificationId: 'n1' });
    expect(retryRes.retrying).toBe(true);

    // Max retries exceeded
    jest.spyOn(notificationRepository, 'findById').mockResolvedValue({
      _id: 'n1',
      user: 'u1',
      channel: 'EMAIL',
      retryCount: 4,
      maxRetries: 3,
      deliveryStatus: NotificationDeliveryStatus.SCHEDULED
    });
    jest.spyOn(notificationRepository, 'markFailed').mockResolvedValue();

    const failRes = await NotificationWorker.processJob({ notificationId: 'n1' });
    expect(failRes.failed).toBe(true);
  });
});
