import { jest } from '@jest/globals';
import auditService from '#services/audit.service.js';
import securityRepository from '#repositories/security.repository.js';

describe('AuditService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('logEvent should persist audit log entry', async () => {
    const spy = jest.spyOn(securityRepository, 'createAuditLog').mockResolvedValue({ _id: 'a1' });
    const res = await auditService.logEvent({ action: 'USER_REGISTERED', actor: 'u1' });
    expect(spy).toHaveBeenCalled();
    expect(res._id).toBe('a1');
  });
});
