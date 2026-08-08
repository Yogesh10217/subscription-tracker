import NotificationRules from '#notifications/rules/notification.rules.js';

describe('NotificationRules Unit Tests', () => {
  test('should disallow notification if email channel disabled in preferences', () => {
    const preferences = { emailEnabled: false, inAppEnabled: true };
    const res = NotificationRules.evaluate({
      type: 'RENEWAL_REMINDER',
      channel: 'EMAIL',
      preferences
    });

    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('disabled');
  });

  test('should allow notification if preferences enable channel and type', () => {
    const preferences = { emailEnabled: true, renewalReminders: true };
    const res = NotificationRules.evaluate({
      type: 'RENEWAL_REMINDER',
      channel: 'EMAIL',
      preferences
    });

    expect(res.allowed).toBe(true);
  });
});
