import Subscription from '../models/subscription.model.js';

export class SubscriptionRepository {
  async create(subscriptionData) {
    return Subscription.create(subscriptionData);
  }

  async findById(id) {
    return Subscription.findById(id);
  }

  async findByIdWithUser(id) {
    return Subscription.findById(id).populate('user', 'email name');
  }

  async findByUserId(userId) {
    return Subscription.find({ user: userId }).sort({ renewalDate: 1 });
  }

  async findAll(filter = {}) {
    return Subscription.find(filter).sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return Subscription.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async delete(id) {
    return Subscription.findByIdAndDelete(id);
  }

  async findUpcomingRenewals(filter = {}) {
    return Subscription.find(filter).sort({ renewalDate: 1 });
  }
}

export default new SubscriptionRepository();
