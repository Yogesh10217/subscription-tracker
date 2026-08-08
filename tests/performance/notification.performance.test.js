import { jest } from '@jest/globals';
import NotificationSchedulerService from '#notifications/jobs/notification-scheduler.service.js';
import Notification from '#notifications/models/notification.model.js';
import ReminderRule from '#models/reminder-rule.model.js';
import notificationPreferenceRepository from '#notifications/repositories/notification-preference.repository.js';
import notificationRepository from '#notifications/repositories/notification.repository.js';

describe('Notification Platform Performance Benchmark Tests', () => {
  let mockRules;

  beforeAll(() => {
    // Generate representative dataset: 1,000 reminder rules
    mockRules = Array.from({ length: 1000 }, (_, i) => ({
      _id: `507f1f77bcf86cd79943${i.toString().padStart(4, '0')}`,
      isEnabled: true,
      daysBefore: 3,
      subscription: {
        _id: `507f1f77bcf86cd79944${i.toString().padStart(4, '0')}`,
        user: '507f1f77bcf86cd799439011',
        name: `Sub ${i}`,
        price: 10,
        currency: 'USD',
        status: 'Active',
        renewalDate: new Date()
      }
    }));
  });

  test('Notification Scheduler execution should complete within benchmark target (<500ms for unit mock execution)', async () => {
    jest.spyOn(ReminderRule, 'find').mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockRules)
    });

    jest.spyOn(notificationPreferenceRepository, 'findByUserId').mockResolvedValue({
      emailEnabled: true,
      inAppEnabled: true,
      renewalReminders: true
    });

    jest.spyOn(notificationRepository, 'create').mockResolvedValue({
      _id: 'notif_created'
    });

    jest.spyOn(Notification, 'find').mockReturnValue({
      lean: jest.fn().mockResolvedValue([])
    });

    const startTime = performance.now();
    const result = await NotificationSchedulerService.runScheduler();
    const duration = performance.now() - startTime;

    expect(result).toBeDefined();
    expect(duration).toBeLessThan(500);
  });
});
