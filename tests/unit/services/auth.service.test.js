import { jest } from '@jest/globals';
import authService from '#services/auth.service.js';
import userRepository from '#repositories/user.repository.js';
import sessionRepository from '#repositories/session.repository.js';
import securityRepository from '#repositories/security.repository.js';
import ApiError from '#utils/api-error.js';
import bcrypt from 'bcryptjs';

describe('AuthService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('signUp should throw conflict error if email exists', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({ email: 'john@example.com' });

    await expect(
      authService.signUp({ name: 'John', email: 'john@example.com', password: 'password' })
    ).rejects.toThrow(ApiError);
  });

  test('signIn should throw notFound error if user does not exist', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

    await expect(
      authService.signIn({ email: 'missing@example.com', password: 'password' })
    ).rejects.toThrow(ApiError);
  });

  test('signIn should return token and user object when password is valid', async () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: 'user',
      permissions: [],
      toObject: () => ({ _id: '507f1f77bcf86cd799439011', email: 'john@example.com' })
    };

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(sessionRepository, 'create').mockResolvedValue({ _id: '507f1f77bcf86cd799439022' });
    jest
      .spyOn(securityRepository, 'createAuditLog')
      .mockResolvedValue({ _id: '507f1f77bcf86cd799439033' });

    const result = await authService.signIn({ email: 'john@example.com', password: 'password' });
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe('john@example.com');
  });
});
