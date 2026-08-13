import dayjs from 'dayjs';
import subscriptionRepository from '../repositories/subscription.repository.js';
import emailService from './email.service.js';
import logger from '../utils/logger.js';
import ApiError from '../utils/api-error.js';

export class WorkflowService {
  async processSubscriptionReminder(body) {
    logger.info('Received workflow webhook payload', { body });

    let subscriptionId;
    if (Array.isArray(body) && body[0]?.body) {
      const decodedBody = Buffer.from(body[0].body, 'base64').toString();
      logger.info('Decoded webhook body', { decodedBody });
      const payload = JSON.parse(decodedBody);
      subscriptionId = payload.subscriptionId;
    } else {
      subscriptionId = body.subscriptionId;
    }

    if (!subscriptionId) {
      throw ApiError.badRequest('Missing subscriptionId in payload');
    }

    const subscription = await subscriptionRepository.findByIdWithUser(subscriptionId);
    if (!subscription) {
      throw ApiError.notFound(`Subscription not found: ${subscriptionId}`);
    }

    if (subscription.status !== 'Active') {
      logger.info(`Subscription is not active: ${subscriptionId}, status: ${subscription.status}`);
      return { message: 'Inactive subscription' };
    }

    if (!subscription.user?.email) {
      throw ApiError.badRequest('No user email found for subscription');
    }

    const renewalDate = dayjs(subscription.renewalDate);
    if (renewalDate.isBefore(dayjs())) {
      logger.info(`Renewal date has passed for subscription ${subscriptionId}`);
      return { message: 'Renewal date passed' };
    }

    const daysUntilRenewal = renewalDate.diff(dayjs(), 'day');
    const reminderThresholds = [30, 7, 5, 2, 1];

    const reminderDay = reminderThresholds.find((days) => daysUntilRenewal >= days);
    if (!reminderDay) {
      logger.info('No appropriate reminder threshold found', { daysUntilRenewal });
      return { message: 'No reminder needed' };
    }

    const reminderType = `${reminderDay} days before reminder`;
    subscription.daysLeft = daysUntilRenewal;

    await emailService.sendReminder(subscription.user.email, reminderType, subscription);

    return {
      message: 'Reminder email sent successfully',
      details: {
        email: subscription.user.email,
        reminderType,
        subscriptionId: subscription._id
      }
    };
  }
}

export default new WorkflowService();
