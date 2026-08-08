import IdempotencyUtil from '#notifications/utils/idempotency.util.js';

describe('IdempotencyUtil Unit Tests', () => {
  test('should generate deterministic SHA-256 idempotency key', () => {
    const key1 = IdempotencyUtil.generateKey({
      userId: '507f1f77bcf86cd799439011',
      subscriptionId: 'sub_123',
      reminderRuleId: 'rule_456',
      notificationType: 'RENEWAL_REMINDER',
      scheduledDate: '2026-08-10T00:00:00.000Z',
      channel: 'EMAIL'
    });

    const key2 = IdempotencyUtil.generateKey({
      userId: '507f1f77bcf86cd799439011',
      subscriptionId: 'sub_123',
      reminderRuleId: 'rule_456',
      notificationType: 'RENEWAL_REMINDER',
      scheduledDate: '2026-08-10T12:00:00.000Z', // Different time, same date string
      channel: 'EMAIL'
    });

    expect(key1).toBe(key2);
    expect(key1.length).toBe(64); // SHA-256 hex length
  });
});
