import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authService from '#services/auth.service.js';
import userRepository from '#repositories/user.repository.js';
import sessionService from '#services/session.service.js';
import passwordService from '#services/password.service.js';
import verificationService from '#services/verification.service.js';
import auditService from '#services/audit.service.js';
import ApiError from '#utils/api-error.js';
import { JWT_SECRET } from '#config/env.js';

describe('AuthService Extended Unit Tests', () => {
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'john@example.com',
    password: 'hashedpassword123',
    role: 'user',
    permissions: [],
    failedLoginAttempts: 0,
    lockUntil: null,
    passwordHistory: [],
    toObject: () => ({
      _id: '507f1f77bcf86cd799439011',
      email: 'john@example.com',
      password: 'hashedpassword123'
    })
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('signUp should throw conflict error if email exists', async () => {
    jest.spyOn(passwordService, 'validatePasswordPolicy').mockReturnValue(true);
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    await expect(
      authService.signUp({ name: 'John', email: 'john@example.com', password: 'Password123!' })
    ).rejects.toThrow(ApiError);
  });

  test('signUp should successfully create user and return user object, tokens, and session', async () => {
    jest.spyOn(passwordService, 'validatePasswordPolicy').mockReturnValue(true);
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(userRepository, 'create').mockResolvedValue(mockUser);
    jest
      .spyOn(verificationService, 'createVerificationToken')
      .mockResolvedValue({ rawToken: 'raw123' });
    jest.spyOn(sessionService, 'createSession').mockResolvedValue({ _id: 'session123' });
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    const res = await authService.signUp({
      name: 'John',
      email: 'john@example.com',
      password: 'Password123!'
    });
    expect(res.user.email).toBe('john@example.com');
    expect(res.tokens.accessToken).toBeDefined();
    expect(res.session._id).toBe('session123');
  });

  test('signIn should throw if user not found', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    await expect(
      authService.signIn({ email: 'john@example.com', password: 'pass' })
    ).rejects.toThrow(ApiError);
  });

  test('signIn should reject locked account', async () => {
    const lockedUser = {
      ...mockUser,
      lockUntil: new Date(Date.now() + 100000)
    };
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(lockedUser);
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    await expect(
      authService.signIn({ email: 'john@example.com', password: 'pass' })
    ).rejects.toThrow(ApiError);
  });

  test('signIn should increment failedLoginAttempts and lock account on max attempts', async () => {
    const failingUser = {
      ...mockUser,
      failedLoginAttempts: 4
    };
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(failingUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    jest.spyOn(userRepository, 'update').mockResolvedValue({});
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    await expect(
      authService.signIn({ email: 'john@example.com', password: 'wrong' })
    ).rejects.toThrow(ApiError);
    expect(userRepository.update).toHaveBeenCalledWith(
      failingUser._id,
      expect.objectContaining({ failedLoginAttempts: 5 })
    );
  });

  test('refreshTokens should validate and rotate tokens', async () => {
    const token = jwt.sign({ userId: mockUser._id }, JWT_SECRET, { expiresIn: '1h' });
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue(mockUser);
    jest.spyOn(sessionService, 'rotateSession').mockResolvedValue({});

    const result = await authService.refreshTokens(token);
    expect(result.accessToken).toBeDefined();
  });

  test('refreshTokens should throw if token is missing, invalid, or user missing', async () => {
    await expect(authService.refreshTokens(null)).rejects.toThrow(ApiError);
    await expect(authService.refreshTokens('invalid-token')).rejects.toThrow(ApiError);

    const token = jwt.sign({ userId: mockUser._id }, JWT_SECRET, { expiresIn: '1h' });
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue(null);
    await expect(authService.refreshTokens(token)).rejects.toThrow(ApiError);
  });

  test('forgotPassword should handle existing and non-existing users', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
    await authService.forgotPassword('nonexistent@example.com');

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(mockUser);
    jest
      .spyOn(verificationService, 'createVerificationToken')
      .mockResolvedValue({ rawToken: 'reset123' });
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    await authService.forgotPassword('john@example.com');
    expect(verificationService.createVerificationToken).toHaveBeenCalled();
  });

  test('resetPassword should successfully update password or throw if user missing', async () => {
    jest.spyOn(passwordService, 'validatePasswordPolicy').mockReturnValue(true);
    jest
      .spyOn(verificationService, 'verifyToken')
      .mockResolvedValue({ _id: 'tok1', user: mockUser._id });
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue(null);

    await expect(authService.resetPassword('raw123', 'NewPass123!')).rejects.toThrow(ApiError);

    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue(mockUser);
    jest.spyOn(passwordService, 'isPasswordReused').mockResolvedValue(false);
    jest.spyOn(passwordService, 'hashPassword').mockResolvedValue('newhash');
    jest.spyOn(userRepository, 'update').mockResolvedValue({});
    jest.spyOn(verificationService, 'consumeToken').mockResolvedValue({});
    jest.spyOn(sessionService, 'revokeAllSessions').mockResolvedValue({});
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    await authService.resetPassword('raw123', 'NewPass123!');
    expect(userRepository.update).toHaveBeenCalled();
  });

  test('resetPassword should throw error if password is reused', async () => {
    jest.spyOn(passwordService, 'validatePasswordPolicy').mockReturnValue(true);
    jest
      .spyOn(verificationService, 'verifyToken')
      .mockResolvedValue({ _id: 'tok1', user: mockUser._id });
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue(mockUser);
    jest.spyOn(passwordService, 'isPasswordReused').mockResolvedValue(true);

    await expect(authService.resetPassword('raw123', 'ReusedPass123!')).rejects.toThrow(ApiError);
  });

  test('changePassword should handle user missing, wrong password, and reuse', async () => {
    jest.spyOn(passwordService, 'validatePasswordPolicy').mockReturnValue(true);
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue(null);

    await expect(authService.changePassword(mockUser._id, 'current', 'New123!')).rejects.toThrow(
      ApiError
    );

    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    await expect(authService.changePassword(mockUser._id, 'wrong', 'New123!')).rejects.toThrow(
      ApiError
    );

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(passwordService, 'isPasswordReused').mockResolvedValue(true);
    await expect(authService.changePassword(mockUser._id, 'current', 'New123!')).rejects.toThrow(
      ApiError
    );

    jest.spyOn(passwordService, 'isPasswordReused').mockResolvedValue(false);
    jest.spyOn(passwordService, 'hashPassword').mockResolvedValue('hash');
    jest.spyOn(userRepository, 'update').mockResolvedValue({});
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    await authService.changePassword(mockUser._id, 'currentPass', 'New123!');
    expect(userRepository.update).toHaveBeenCalled();
  });

  test('verifyEmail should update user and consume token', async () => {
    jest
      .spyOn(verificationService, 'verifyToken')
      .mockResolvedValue({ _id: 'tok1', user: mockUser._id });
    jest.spyOn(userRepository, 'update').mockResolvedValue({});
    jest.spyOn(verificationService, 'consumeToken').mockResolvedValue({});
    jest.spyOn(auditService, 'logEvent').mockResolvedValue({});

    await authService.verifyEmail('tok123');
    expect(userRepository.update).toHaveBeenCalledWith(mockUser._id, { isVerified: true });
  });
});
