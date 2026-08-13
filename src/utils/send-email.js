import dayjs from 'dayjs';
import transporter, { accountEmail } from '../config/nodemailer.js';
import { emailTemplates } from '../templates/email.template.js';
import logger from './logger.js';
import ApiError from './api-error.js';

export const sendReminderEmail = async (to, type, subscription) => {
  logger.info('Attempting to send email', { to, type });

  if (!to || (!type && !subscription)) {
    logger.error('Missing required email parameters', {
      to,
      type,
      hasSubscription: !!subscription
    });
    throw ApiError.badRequest('Missing required email parameters');
  }

  try {
    const template = emailTemplates.find((t) => t.label === type) || {
      generateSubject: (info) => info.subject || 'SubPulse Notification',
      generateBody: (info) => info.message || 'Notification from SubPulse'
    };

    const mailInfo = {
      userName: subscription?.user?.name || 'Customer',
      subscriptionName: subscription?.name || 'Subscription',
      renewalDate: subscription?.renewalDate
        ? dayjs(subscription.renewalDate).format('MMM D, YYYY')
        : '',
      planName: subscription?.planName || subscription?.name || 'Plan',
      price: subscription?.price ? `${subscription.currency} ${subscription.price}` : '',
      paymentMethod: subscription?.paymentMethod || '',
      subject: type?.subject,
      message: type?.message
    };

    const message = typeof type === 'object' ? type.message : template.generateBody(mailInfo);
    const subject = typeof type === 'object' ? type.subject : template.generateSubject(mailInfo);

    const mailOptions = {
      from: accountEmail,
      to,
      subject,
      html: message
    };

    logger.info('Sending email', { from: accountEmail, to, subject });

    // Guard against real SMTP network connection attempts during un-mocked test execution
    if (process.env.NODE_ENV === 'test' && !transporter.sendMail._isMockFunction) {
      logger.info('Test mode: stubbing un-mocked SMTP socket delivery', { to, subject });
      return { messageId: `test_msg_${Date.now()}` };
    }

    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error('Error in transporter.sendMail', { error: error.message, code: error.code });
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    logger.info('Email sent successfully', { messageId: info.messageId });
    return info;
  } catch (error) {
    logger.error('Failed to send email', { error: error.message });
    return null;
  }
};

export const sendEmail = async ({ to, subject, message }) => {
  return sendReminderEmail(to, { subject, message }, null);
};

export default sendReminderEmail;
