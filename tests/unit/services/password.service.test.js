import { jest } from '@jest/globals';
import passwordService from '#services/password.service.js';
import ApiError from '#utils/api-error.js';

describe('PasswordService Unit Tests', () => {
  test('validatePasswordPolicy should throw for weak passwords', () => {
    expect(() => passwordService.validatePasswordPolicy('short')).toThrow(ApiError);
    expect(() => passwordService.validatePasswordPolicy('nouppercase123!')).toThrow(ApiError);
    expect(() => passwordService.validatePasswordPolicy('NOLOWERCASE123!')).toThrow(ApiError);
    expect(() => passwordService.validatePasswordPolicy('NoSpecial1234')).toThrow(ApiError);
    expect(() => passwordService.validatePasswordPolicy('Password123!')).toThrow(ApiError);
  });

  test('validatePasswordPolicy should pass strong unique password', () => {
    expect(() => passwordService.validatePasswordPolicy('Str0ngP@ssw0rd!2026')).not.toThrow();
  });
});
