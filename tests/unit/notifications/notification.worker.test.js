import { jest } from '@jest/globals';
import NotificationWorker from '#notifications/workers/notification.worker.js';
import notificationRepository from '#notifications/repositories/notification.repository.js';
import userRepository from '#repositories/user.repository.js';
import emailProvider from '#notifications/providers/email.provider.js';

describe('NotificationWorker Unit Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('should skip worker execution if notification status is not SCHEDULED or RETRYING', async () => {
    jest.spyOn(notificationRepository, 'findById').mockResolvedValue({
      _id: 'notif_123',
      deliveryStatus: 'SENT'
    });

    const res = await NotificationWorker.processJob({ notificationId: 'notif_123' });
    expect(res.skipped).toBe(true);
  });

  test('should process EMAIL notification delivery successfully', async () => {
    jest.spyOn(notificationRepository, 'findById').mockResolvedValue({
      _id: 'notif_123',
      user: 'user_123',
      channel: 'EMAIL',
      title: 'Test',
      body: 'Test body',
      deliveryStatus: 'SCHEDULED'
    });
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue({ email: 'user@example.com' });
    jest.spyOn(notificationRepository, 'markProcessing').mockResolvedValue({});
    jest.spyOn(notificationRepository, 'markSent').mockResolvedValue({});
    jest.spyOn(emailProvider, 'send').mockResolvedValue({ success: true, messageId: 'msg_99' });

    const res = await NotificationWorker.processJob({ notificationId: 'notif_123' });
    expect(res.success).toBe(true);
    expect(res.messageId).toBe('msg_99');
  });
});
