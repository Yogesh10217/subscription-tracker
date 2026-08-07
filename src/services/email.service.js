import sendReminderEmail from '../utils/send-email.js';

export class EmailService {
  async sendReminder(to, type, subscription) {
    return sendReminderEmail(to, type, subscription);
  }
}

export default new EmailService();
