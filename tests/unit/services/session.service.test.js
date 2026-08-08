import { jest } from '@jest/globals';
import sessionService from '#services/session.service.js';
import sessionRepository from '#repositories/session.repository.js';
import auditService from '#services/audit.service.js';
import ApiError from '#utils/api-error.js';

describe('SessionService Unit Tests', () => {
  const mockSession = {
    _id: 'session123',
    user: 'user123',
    familyId: 'fam123',
    refreshTokenHash: sessionService.hashToken('valid-token'),
    isRevoked: false
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('hashToken produces sha256 hex string', () => {
    const hash = sessionService.hashToken('test');
    expect(hash).toHaveLength(64);
  });

  test('createSession handles Mobile, Chrome, Windows userAgent parsing and audit logging', async () => {
    jest.spyOn(sessionRepository, 'create').mockResolvedValue(mockSession);
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    const session = await sessionService.createSession({
      userId: 'user123',
      refreshToken: 'valid-token',
      userAgent: 'Mozilla/5.0 (iPhone; Mobile) AppleWebKit Chrome Windows',
      ipAddress: '127.0.0.1'
    });

    expect(session._id).toBe('session123');
    expect(sessionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        device: 'Mobile Device',
        browser: 'Chrome',
        os: 'Windows'
      })
    );
  });

  test('rotateSession handles normal rotation', async () => {
    jest.spyOn(sessionRepository, 'findAnyByRefreshToken').mockResolvedValue(mockSession);
    jest
      .spyOn(sessionRepository, 'rotate')
      .mockResolvedValue({ ...mockSession, refreshTokenHash: 'newhash' });
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    const rotated = await sessionService.rotateSession('valid-token', 'new-token');
    expect(rotated).toBeDefined();
  });

  test('rotateSession detects replay attack when session is revoked or hash mismatch', async () => {
    const revokedSession = { ...mockSession, isRevoked: true };
    jest.spyOn(sessionRepository, 'findAnyByRefreshToken').mockResolvedValue(revokedSession);
    jest.spyOn(sessionRepository, 'revokeFamily').mockResolvedValue({});
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    await expect(sessionService.rotateSession('valid-token', 'new-token')).rejects.toThrow(
      ApiError
    );
    expect(sessionRepository.revokeFamily).toHaveBeenCalledWith('fam123', expect.any(String));
  });

  test('rotateSession throws unauthorized when session not found', async () => {
    jest.spyOn(sessionRepository, 'findAnyByRefreshToken').mockResolvedValue(null);
    await expect(sessionService.rotateSession('unknown', 'new')).rejects.toThrow(ApiError);
  });

  test('revokeSession, revokeAllSessions, and getUserSessions execute properly', async () => {
    jest.spyOn(sessionRepository, 'revoke').mockResolvedValue(mockSession);
    jest.spyOn(sessionRepository, 'revokeAll').mockResolvedValue({ modifiedCount: 2 });
    jest.spyOn(sessionRepository, 'findUserSessions').mockResolvedValue([mockSession]);
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    const s = await sessionService.revokeSession('session123', 'user123');
    expect(s._id).toBe('session123');

    jest.spyOn(sessionRepository, 'revoke').mockResolvedValue(null);
    await sessionService.revokeSession('missing', 'user123');

    await sessionService.revokeAllSessions('user123');
    expect(auditService.logEvent).toHaveBeenCalled();

    const list = await sessionService.getUserSessions('user123');
    expect(list).toHaveLength(1);
  });
});
