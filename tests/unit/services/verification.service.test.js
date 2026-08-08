import { jest } from '@jest/globals';
import verificationService from '#services/verification.service.js';
import securityRepository from '#repositories/security.repository.js';
import ApiError from '#utils/api-error.js';

describe('VerificationService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('createVerificationToken should hash token and save to repository', async () => {
    jest.spyOn(securityRepository, 'saveVerificationToken').mockResolvedValue({});
    const res = await verificationService.createVerificationToken('user123', 'email_verification');
    expect(res.rawToken).toBeDefined();
    expect(res.hashedToken).toBeDefined();
  });

  test('verifyToken should throw error if token missing or not found', async () => {
    await expect(verificationService.verifyToken(null, 'email_verification')).rejects.toThrow(ApiError);

    jest.spyOn(securityRepository, 'findVerificationToken').mockResolvedValue(null);
    await expect(
      verificationService.verifyToken('invalidtoken', 'email_verification')
    ).rejects.toThrow(ApiError);
  });

  test('verifyToken returns token document when valid', async () => {
    const mockTokenDoc = { _id: 'tok1', user: 'user123', type: 'email_verification' };
    jest.spyOn(securityRepository, 'findVerificationToken').mockResolvedValue(mockTokenDoc);

    const doc = await verificationService.verifyToken('validtoken', 'email_verification');
    expect(doc._id).toBe('tok1');
  });

  test('consumeToken deletes token via repository', async () => {
    jest.spyOn(securityRepository, 'deleteVerificationToken').mockResolvedValue({});
    await verificationService.consumeToken('tok1');
    expect(securityRepository.deleteVerificationToken).toHaveBeenCalledWith('tok1');
  });
});
