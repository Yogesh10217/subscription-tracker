import { jest } from '@jest/globals';
import verificationService from '#services/verification.service.js';
import securityRepository from '#repositories/security.repository.js';

describe('VerificationService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createVerificationToken should hash token and save to repository', async () => {
    jest.spyOn(securityRepository, 'saveVerificationToken').mockResolvedValue({});
    const res = await verificationService.createVerificationToken('user123', 'email_verification');
    expect(res.rawToken).toBeDefined();
    expect(res.hashedToken).toBeDefined();
  });

  test('verifyToken should throw error if token not found', async () => {
    jest.spyOn(securityRepository, 'findVerificationToken').mockResolvedValue(null);
    await expect(
      verificationService.verifyToken('invalidtoken', 'email_verification')
    ).rejects.toThrow();
  });
});
