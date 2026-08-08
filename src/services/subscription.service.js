import subscriptionRepository from '../repositories/subscription.repository.js';
import timelineService from './timeline.service.js';
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

    // Record Timeline Event
    await timelineService.recordEvent({
      entityId: subscription._id,
      user: userId,
      eventType: 'CREATED',
      actor: userId,
      newValues: subscription.toObject ? subscription.toObject() : subscription
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

  async updateSubscription(id, updateData, userId = null) {
    const existing = await subscriptionRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Subscription not found');
    }

    const updated = await subscriptionRepository.update(id, updateData);

    // Automatic Timeline Event triggers
    if (userId) {
      if (updateData.price !== undefined && Number(updateData.price) !== Number(existing.price)) {
        await timelineService.recordEvent({
          entityId: id,
          user: existing.user,
          eventType: 'PRICE_CHANGE',
          actor: userId,
          oldValues: { price: existing.price, currency: existing.currency },
          newValues: { price: updated.price, currency: updated.currency }
        });
      }

      if (
        updateData.renewalDate &&
        new Date(updateData.renewalDate).getTime() !== new Date(existing.renewalDate).getTime()
      ) {
        await timelineService.recordEvent({
          entityId: id,
          user: existing.user,
          eventType: 'RENEWAL',
          actor: userId,
          oldValues: { renewalDate: existing.renewalDate },
          newValues: { renewalDate: updated.renewalDate }
        });
      }

      await timelineService.recordEvent({
        entityId: id,
        user: existing.user,
        eventType: 'EDITED',
        actor: userId,
        oldValues: existing.toObject ? existing.toObject() : existing,
        newValues: updated.toObject ? updated.toObject() : updated
      });
    }

    return updated;
  }

  async toggleFavorite(id, userId) {
    const existing = await subscriptionRepository.findById(id);
    if (!existing || existing.user.toString() !== userId) {
      throw ApiError.notFound('Subscription not found');
    }
    return subscriptionRepository.update(id, { isFavorite: !existing.isFavorite });
  }

  async togglePin(id, userId) {
    const existing = await subscriptionRepository.findById(id);
    if (!existing || existing.user.toString() !== userId) {
      throw ApiError.notFound('Subscription not found');
    }
    return subscriptionRepository.update(id, { isPinned: !existing.isPinned });
  }

  async archiveSubscription(id, userId) {
    const archived = await subscriptionRepository.archive(id, userId);
    if (!archived) {
      throw ApiError.notFound('Subscription not found');
    }
    await timelineService.recordEvent({
      entityId: id,
      user: userId,
      eventType: 'ARCHIVED',
      actor: userId
    });
    return archived;
  }

  async restoreSubscription(id, userId) {
    const restored = await subscriptionRepository.restore(id, userId);
    if (!restored) {
      throw ApiError.notFound('Subscription not found');
    }
    await timelineService.recordEvent({
      entityId: id,
      user: userId,
      eventType: 'RESTORED',
      actor: userId
    });
    return restored;
  }

  async deleteSubscription(id, userId = null) {
    if (userId) {
      const softDeleted = await subscriptionRepository.softDelete(id, userId);
      if (!softDeleted) {
        throw ApiError.notFound('Subscription not found');
      }
      return { message: 'Subscription soft deleted successfully' };
    }

    const subscription = await subscriptionRepository.delete(id);
    if (!subscription) {
      throw ApiError.notFound('Subscription not found');
    }
    return { message: 'Subscription deleted successfully' };
  }

  async cancelSubscription(id, userId = null) {
    const subscription = await subscriptionRepository.update(id, { status: 'Cancelled' });
    if (!subscription) {
      throw ApiError.notFound('Subscription not found');
    }
    if (userId) {
      await timelineService.recordEvent({
        entityId: id,
        user: subscription.user,
        eventType: 'CANCELLED',
        actor: userId
      });
    }
    return subscription;
  }

  async bulkOperation(action, ids, userId, payload = {}) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw ApiError.badRequest('Must provide an array of subscription IDs');
    }

    let result;
    switch (action) {
      case 'archive':
        result = await subscriptionRepository.bulkArchive(ids, userId);
        break;
      case 'restore':
        result = await subscriptionRepository.bulkRestore(ids, userId);
        break;
      case 'delete':
        result = await subscriptionRepository.bulkDelete(ids, userId);
        break;
      case 'updateCategory':
        result = await subscriptionRepository.bulkUpdateCategory(
          ids,
          userId,
          payload.categoryRef,
          payload.categoryName
        );
        break;
      case 'updateTags':
        result = await subscriptionRepository.bulkUpdateTags(ids, userId, payload.tags);
        break;
      default:
        throw ApiError.badRequest('Invalid bulk action specified');
    }

    return {
      action,
      modifiedCount: result.modifiedCount || result.nModified || ids.length,
      subscriptionIds: ids
    };
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
