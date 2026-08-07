import subscriptionRepository from '../repositories/subscription.repository.js';
import workflowClient from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';
import ApiError from '../utils/api-error.js';
import logger from '../utils/logger.js';

export class SubscriptionService {
  async createSubscription(data, userId) {
    const subscription = await subscriptionRepository.create({
      ...data,
      user: userId
    });

    let qstashResponse = null;
    let workflowId = null;

    try {
      if (workflowClient && SERVER_URL) {
        const webhookUrl = `${SERVER_URL}/api/v1/workflows/subscription/reminder`;
        logger.info('Triggering QStash workflow for subscription', {
          subscriptionId: subscription.id,
          webhookUrl
        });

        qstashResponse = await workflowClient.trigger({
          url: webhookUrl,
          body: {
            subscriptionId: subscription.id,
            userId
          },
          headers: {
            'Content-Type': 'application/json'
          },
          retries: 3,
          cron: '0 12 * * *'
        });

        workflowId = qstashResponse?.scheduleId || qstashResponse?.messageId || qstashResponse?.id;
      }
    } catch (workflowErr) {
      logger.warn('QStash workflow trigger warning (continuing creation)', {
        error: workflowErr.message
      });
    }

    return {
      subscription,
      workflowId,
      qstashResponse
    };
  }

  async getUserSubscriptions(userId, requestingUserId) {
    if (requestingUserId && userId.toString() !== requestingUserId.toString()) {
      throw ApiError.unauthorized('You are not the owner of this account');
    }
    return subscriptionRepository.findByUserId(userId);
  }

  async getAllSubscriptions(user) {
    const filter = user ? { user: user._id } : {};
    return subscriptionRepository.findAll(filter);
  }

  async getSubscriptionDetails(id) {
    const subscription = await subscriptionRepository.findById(id);
    if (!subscription) {
      throw ApiError.notFound('Subscription not found');
    }
    return subscription;
  }

  async updateSubscription(id, updateData) {
    const subscription = await subscriptionRepository.update(id, updateData);
    if (!subscription) {
      throw ApiError.notFound('Subscription not found');
    }
    return subscription;
  }

  async deleteSubscription(id) {
    const subscription = await subscriptionRepository.delete(id);
    if (!subscription) {
      throw ApiError.notFound('Subscription not found');
    }
    return { message: 'Subscription deleted successfully' };
  }

  async cancelSubscription(id) {
    const subscription = await subscriptionRepository.update(id, { status: 'Cancelled' });
    if (!subscription) {
      throw ApiError.notFound('Subscription not found');
    }
    return subscription;
  }

  async getUpcomingRenewals(user) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 30);

    const filter = {
      renewalDate: { $gte: now, $lte: futureDate },
      status: 'Active'
    };
    if (user) filter.user = user._id;

    return subscriptionRepository.findUpcomingRenewals(filter);
  }
}

export default new SubscriptionService();
