import { jest } from '@jest/globals';
import validateCategory from '#validators/category.validator.js';
import validateProvider from '#validators/provider.validator.js';
import validateTag from '#validators/tag.validator.js';
import validateReminderRule from '#validators/reminder-rule.validator.js';
import validateSubscriptionNote from '#validators/subscription-note.validator.js';
import validateFileAsset from '#validators/file-asset.validator.js';
import validateChangePassword from '#validators/change-password.validator.js';
import validateResetPassword from '#validators/reset-password.validator.js';
import validateBulkOperation from '#validators/bulk.validator.js';
import validateSessionIdParam from '#validators/session.validator.js';
import validateForgotPassword from '#validators/forgot-password.validator.js';
import validateImportExport from '#validators/import-export.validator.js';
import validateVerifyEmail from '#validators/verify-email.validator.js';
import validateAnalyticsQuery from '#validators/analytics.validator.js';
import ApiError from '#utils/api-error.js';

describe('All Validators Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('validateCategory', () => {
    validateCategory(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body.name = 'Streaming';
    validateCategory(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateProvider', () => {
    validateProvider(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body.name = 'Netflix';
    validateProvider(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateTag', () => {
    validateTag(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body.name = 'Work';
    validateTag(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateReminderRule', () => {
    validateReminderRule(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body.daysBefore = 7;
    validateReminderRule(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateSubscriptionNote', () => {
    validateSubscriptionNote(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body.text = 'Important note';
    validateSubscriptionNote(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateFileAsset', () => {
    validateFileAsset(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body = {
      fileName: 'receipt.pdf',
      originalName: 'receipt.pdf',
      mimeType: 'application/pdf',
      fileSize: 1024,
      storageKey: 'keys/123'
    };
    validateFileAsset(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateChangePassword', () => {
    validateChangePassword(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body = { currentPassword: 'OldPass123!', newPassword: 'short' };
    validateChangePassword(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body = { currentPassword: 'OldPass123!', newPassword: 'NewPass123!' };
    validateChangePassword(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateResetPassword', () => {
    validateResetPassword(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body = { token: 'tok123', newPassword: 'short' };
    validateResetPassword(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body = { token: 'tok123', newPassword: 'NewPass123!' };
    validateResetPassword(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateBulkOperation', () => {
    validateBulkOperation(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body = { action: 'archive', ids: ['id1', 'id2'] };
    validateBulkOperation(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateSessionIdParam', () => {
    req.params.id = 'invalid';
    validateSessionIdParam(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.params.id = '507f1f77bcf86cd799439011';
    validateSessionIdParam(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateForgotPassword', () => {
    validateForgotPassword(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body.email = 'test@example.com';
    validateForgotPassword(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateImportExport', () => {
    validateImportExport(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body = {
      records: [
        {
          name: 'Netflix',
          price: 10,
          category: 'Other',
          paymentMethod: 'Card',
          startDate: '2026-01-01'
        }
      ]
    };
    validateImportExport(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateVerifyEmail', () => {
    validateVerifyEmail(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.body.token = 'validtok';
    validateVerifyEmail(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('validateAnalyticsQuery', () => {
    req.query = { period: 'invalid_period' };
    validateAnalyticsQuery(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    next.mockClear();
    req.query = { period: 'this_month', granularity: 'day', currency: 'USD' };
    validateAnalyticsQuery(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});
