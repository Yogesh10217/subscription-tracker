/**
 * @file reminder-rule.repository.js
 * @module repositories/reminder-rule.repository
 * @description Data access operations for subscription reminder rules.
 */

import ReminderRule from '../models/reminder-rule.model.js';

export const reminderRuleRepository = {
  async create(ruleData) {
    return ReminderRule.create(ruleData);
  },

  async findBySubscription(subscriptionId, userId) {
    return ReminderRule.find({ subscription: subscriptionId, user: userId }).sort({
      createdAt: -1
    });
  },

  async findById(id) {
    return ReminderRule.findById(id);
  },

  async update(id, userId, updateData) {
    return ReminderRule.findOneAndUpdate({ _id: id, user: userId }, updateData, { new: true });
  },

  async delete(id, userId) {
    return ReminderRule.findOneAndDelete({ _id: id, user: userId });
  }
};

export default reminderRuleRepository;
