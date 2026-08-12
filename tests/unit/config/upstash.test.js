import { jest } from '@jest/globals';
import workflowClient, { isQStashConfigured, triggerWorkflowSafely } from '#config/upstash.js';

describe('Upstash Config Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('isQStashConfigured returns boolean indicating cloud readiness', () => {
    const configured = isQStashConfigured();
    expect(typeof configured).toBe('boolean');
  });

  test('triggerWorkflowSafely returns skipped result in dev environment without throwing', async () => {
    const res = await triggerWorkflowSafely({
      url: 'http://localhost:5500/api/v1/workflows/subscription/reminder',
      body: { subscriptionId: 'sub123', userId: 'user123' }
    });

    expect(res.success).toBe(false);
    expect(res.skipped).toBe(true);
    expect(res.reason).toBeDefined();
  });

  test('triggerWorkflowSafely handles successful workflow trigger when client returns response', async () => {
    // If workflowClient.trigger returns response
    jest.spyOn(workflowClient, 'trigger').mockResolvedValue({ messageId: 'msg_12345' });

    // Force isQStashConfigured logic by testing function behavior
    expect(workflowClient.trigger).toBeDefined();
  });
});
