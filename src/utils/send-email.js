import dayjs from 'dayjs';
import transporter, { accountEmail } from '../config/nodemailer.js';
import { emailTemplates } from '../templates/email.template.js';
import logger from './logger.js';
import ApiError from './api-error.js';

export const sendReminderEmail = async (to, type, subscription) => {
  logger.info('Attempting to send email', { to, type });

  if (!to || !type || !subscription) {
    logger.error('Missing required email parameters', {
      to,
      type,
      hasSubscription: !!subscription
    });
    throw ApiError.badRequest('Missing required email parameters');
  }

  try {
    const template = emailTemplates.find((t) => t.label === type);

    if (!template) {
      throw ApiError.badRequest('Invalid email type');
    }

    const mailInfo = {
      userName: subscription.user?.name || 'Customer',
      subscriptionName: subscription.name,
      renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
      planName: subscription.planName || subscription.name,
      price: `${subscription.currency} ${subscription.price} per ${subscription.frequency}`,
      paymentMethod: subscription.paymentMethod
    };

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
      from: accountEmail,
      to,
      subject,
      html: message
    };

    logger.info('Sending reminder email', { from: accountEmail, to, subject });

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
    logger.error('Failed to send reminder email', { error: error.message });
    throw error;
  }
};

export default sendReminderEmail;
