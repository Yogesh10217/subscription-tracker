/**
 * @file subscription.repository.js
 * @module repositories/subscription.repository
 * @description Data access operations for Subscription management with query engine and bulk operations.
 */

import Subscription from '../models/subscription.model.js';

export class SubscriptionRepository {
  async create(subscriptionData) {
    return Subscription.create(subscriptionData);
  }

  async findById(id) {
    return Subscription.findOne({ _id: id, isDeleted: false })
      .populate('categoryRef')
      .populate('tags')
      .populate('provider');
  }

  async findByIdWithUser(id) {
    return Subscription.findOne({ _id: id, isDeleted: false })
      .populate('user', 'email name')
      .populate('categoryRef')
      .populate('tags')
      .populate('provider');
  }

  async findByUserId(userId) {
    return Subscription.find({ user: userId, isDeleted: false, isArchived: false })
      .populate('categoryRef')
      .populate('tags')
      .populate('provider')
      .sort({ renewalDate: 1 });
  }

  async findAll(filter = {}) {
    const finalFilter = { isDeleted: false, ...filter };
    return Subscription.find(finalFilter)
      .populate('categoryRef')
      .populate('tags')
      .populate('provider')
      .sort({ createdAt: -1 });
  }

  async findWithQuery(filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 10) {
    const finalFilter = { isDeleted: false, ...filter };
    const items = await Subscription.find(finalFilter)
      .populate('categoryRef')
      .populate('tags')
      .populate('provider')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Subscription.countDocuments(finalFilter);
    return { items, total };
  }

  async update(id, updateData) {
    return Subscription.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, {
      new: true,
      runValidators: true
    })
      .populate('categoryRef')
      .populate('tags')
      .populate('provider');
  }

  async softDelete(id, userId) {
    return Subscription.findOneAndUpdate(
      { _id: id, user: userId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  }

  async archive(id, userId) {
    return Subscription.findOneAndUpdate(
      { _id: id, user: userId },
      { isArchived: true, archivedAt: new Date(), status: 'Archived' },
      { new: true }
    );
  }

  async restore(id, userId) {
    return Subscription.findOneAndUpdate(
      { _id: id, user: userId },
      { isArchived: false, archivedAt: null, isDeleted: false, deletedAt: null, status: 'Active' },
      { new: true }
    );
  }

  async delete(id) {
    return Subscription.findByIdAndDelete(id);
  }

  async bulkArchive(ids, userId) {
    return Subscription.updateMany(
      { _id: { $in: ids }, user: userId },
      { isArchived: true, archivedAt: new Date(), status: 'Archived' }
    );
  }

  async bulkRestore(ids, userId) {
    return Subscription.updateMany(
      { _id: { $in: ids }, user: userId },
      { isArchived: false, archivedAt: null, isDeleted: false, deletedAt: null, status: 'Active' }
    );
  }

  async bulkDelete(ids, userId) {
    return Subscription.updateMany(
      { _id: { $in: ids }, user: userId },
      { isDeleted: true, deletedAt: new Date(), status: 'Deleted' }
    );
  }

  async bulkUpdateCategory(ids, userId, categoryRef, categoryName) {
    return Subscription.updateMany(
      { _id: { $in: ids }, user: userId },
      { categoryRef, category: categoryName || 'Other' }
    );
  }

  async bulkUpdateTags(ids, userId, tags) {
    return Subscription.updateMany({ _id: { $in: ids }, user: userId }, { tags });
  }

  async findUpcomingRenewals(filter = {}) {
    return Subscription.find({ isDeleted: false, isArchived: false, ...filter }).sort({
      renewalDate: 1
    });
  }
}

export default new SubscriptionRepository();
