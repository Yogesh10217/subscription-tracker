import { jest } from '@jest/globals';
import sendReminderEmail, { sendEmail } from '#utils/send-email.js';
import { emailTemplates } from '#templates/email.template.js';
import transporter from '#config/nodemailer.js';
import ApiError from '#utils/api-error.js';
import ApiResponse from '#utils/api-response.js';
import Roles from '#constants/roles.js';
import SubscriptionStatus from '#constants/subscription-status.js';
import AppConstants from '#constants/app.js';

describe('Email & Utility & Constants Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('sendReminderEmail throws badRequest if params missing', async () => {
    await expect(sendReminderEmail(null, null, null)).rejects.toThrow(ApiError);
  });

  test('sendReminderEmail sends email via nodemailer transporter with template and fallback', async () => {
    jest.spyOn(transporter, 'sendMail').mockImplementation((opts, callback) => {
      callback(null, { messageId: 'msg123' });
    });

    const info = await sendEmail({ to: 'test@example.com', subject: 'Hi', message: 'Hello' });
    expect(info.messageId).toBe('msg123');

    const sub = {
      name: 'Netflix',
      price: 15,
      currency: 'USD',
      renewalDate: new Date('2026-09-01'),
      user: { name: 'John' }
    };

    const reminderInfo = await sendReminderEmail('test@example.com', '7 days before reminder', sub);
    expect(reminderInfo.messageId).toBe('msg123');

    const fallbackInfo = await sendReminderEmail(
      'test@example.com',
      'Custom Unregistered Type',
      sub
    );
    expect(fallbackInfo.messageId).toBe('msg123');
  });

  test('sendReminderEmail catches transporter error', async () => {
    jest.spyOn(transporter, 'sendMail').mockImplementation((opts, callback) => {
      callback(new Error('SMTP Error'));
    });

    const res = await sendEmail({ to: 'test@example.com', subject: 'Hi', message: 'Hello' });
    expect(res).toBeNull();
  });

  test('emailTemplates generates subject and body for all threshold days', () => {
    const data = {
      userName: 'John',
      subscriptionName: 'Netflix',
      renewalDate: '2026-09-01',
      planName: 'Standard',
      price: '$15.99',
      paymentMethod: 'Card'
    };

    emailTemplates.forEach((template) => {
      const subject = template.generateSubject(data);
      const body = template.generateBody(data);
      expect(subject).toContain('Netflix');
      expect(body).toContain('John');
    });
  });

  test('ApiError static factory methods', () => {
    const errStack = new ApiError(500, 'Custom', [], false, 'custom stack');
    expect(errStack.stack).toBe('custom stack');

    expect(ApiError.forbidden().statusCode).toBe(403);
    expect(ApiError.conflict().statusCode).toBe(409);
    expect(ApiError.internal().statusCode).toBe(500);
  });

  test('ApiResponse created and error methods', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    ApiResponse.created(res, { id: 1 });
    expect(res.status).toHaveBeenCalledWith(201);

    ApiResponse.error(res, 'Failed', 400, ['err1']);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('Constants definitions', () => {
    expect(Roles.USER).toBe('user');
    expect(SubscriptionStatus.ACTIVE).toBe('Active');
    expect(AppConstants.APP_NAME).toBe('SubPulse');
  });
});
