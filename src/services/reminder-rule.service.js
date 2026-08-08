import reminderRuleRepository from '../repositories/reminder-rule.repository.js';
import subscriptionRepository from '../repositories/subscription.repository.js';
import ApiError from '../utils/api-error.js';

export const reminderRuleService = {
  async addRule(subscriptionId, userId, ruleData) {
    const sub = await subscriptionRepository.findById(subscriptionId);
    if (!sub || sub.user.toString() !== userId) {
      throw ApiError.notFound('Subscription not found');
    }
    return reminderRuleRepository.create({
      ...ruleData,
      subscription: subscriptionId,
      user: userId
    });
  },

  async getRules(subscriptionId, userId) {
    return reminderRuleRepository.findBySubscription(subscriptionId, userId);
  },

  async updateRule(ruleId, userId, updateData) {
    const rule = await reminderRuleRepository.update(ruleId, userId, updateData);
    if (!rule) {
      throw ApiError.notFound('Reminder rule not found');
    }
    return rule;
  },

  async deleteRule(ruleId, userId) {
    const deleted = await reminderRuleRepository.delete(ruleId, userId);
    if (!deleted) {
      throw ApiError.notFound('Reminder rule not found');
    }
    return deleted;
  }
};

export default reminderRuleService;
