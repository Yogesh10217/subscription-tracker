/**
 * @file email.provider.js
 * @module notifications/providers/email.provider
 * @description Production Email delivery provider utilizing Nodemailer.
 */

import NotificationProviderInterface from './notification-provider.interface.js';
import sendReminderEmail from '../../utils/send-email.js';

export class EmailProvider extends NotificationProviderInterface {
  async send({ recipientEmail, subject, html, text }) {
    if (!recipientEmail) {
      throw new Error('Invalid email: recipient address is required');
    }

    const info = await sendReminderEmail({
      to: recipientEmail,
      subject,
      html,
      text
    });

    return {
      success: true,
      messageId: info?.messageId || `msg_${Date.now()}`
    };
  }

  async validate({ recipientEmail }) {
    return Boolean(recipientEmail && recipientEmail.includes('@'));
  }

  async healthCheck() {
    return true;
  }
}

export default new EmailProvider();
