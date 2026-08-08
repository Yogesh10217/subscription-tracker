import { jest } from '@jest/globals';
import passwordService from '#services/password.service.js';
import bcrypt from 'bcryptjs';
import ApiError from '#utils/api-error.js';

describe('PasswordService Unit Tests', () => {
  test('validatePasswordPolicy should throw for weak or invalid passwords', () => {
    expect(() => passwordService.validatePasswordPolicy(null)).toThrow(ApiError);
    expect(() => passwordService.validatePasswordPolicy(123)).toThrow(ApiError);
    expect(() => passwordService.validatePasswordPolicy('short')).toThrow(ApiError);
    expect(() => passwordService.validatePasswordPolicy('nouppercase123!')).toThrow(ApiError);
    expect(() => passwordService.validatePasswordPolicy('NOLOWERCASE123!')).toThrow(ApiError);
    expect(() => passwordService.validatePasswordPolicy('NoNumberHere!@')).toThrow(ApiError);
    expect(() => passwordService.validatePasswordPolicy('NoSpecial1234')).toThrow(ApiError);
    expect(() => passwordService.validatePasswordPolicy('Password123!')).toThrow(ApiError);
  });

  test('validatePasswordPolicy should pass strong unique password', () => {
    expect(() => passwordService.validatePasswordPolicy('Str0ngP@ssw0rd!2026')).not.toThrow();
  });

  test('isPasswordReused checks against password history', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
    const reused = await passwordService.isPasswordReused('Pass123!', ['oldhash']);
    expect(reused).toBe(true);

    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
    const notReused = await passwordService.isPasswordReused('Pass123!', ['oldhash']);
    expect(notReused).toBe(false);
  });

  test('hashPassword hashes input password', async () => {
    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpass');

    const hash = await passwordService.hashPassword('Pass123!');
    expect(hash).toBe('hashedpass');
  });
});
