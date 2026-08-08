/**
 * @file tag.repository.js
 * @module repositories/tag.repository
 * @description Data access operations for subscription tags.
 */

import Tag from '../models/tag.model.js';

export const tagRepository = {
  async create(tagData) {
    return Tag.create(tagData);
  },

  async findAllForUser(userId) {
    return Tag.find({
      $or: [{ isSystem: true }, { user: userId }]
    }).sort({ name: 1 });
  },

  async findById(id) {
    return Tag.findById(id);
  },

  async update(id, userId, updateData) {
    return Tag.findOneAndUpdate({ _id: id, user: userId, isSystem: false }, updateData, {
      new: true
    });
  },

  async delete(id, userId) {
    return Tag.findOneAndDelete({ _id: id, user: userId, isSystem: false });
  },

  async seedSystemTags() {
    const defaultTags = [
      { name: 'Work', slug: 'work', color: '#3B82F6', isSystem: true },
      { name: 'Personal', slug: 'personal', color: '#10B981', isSystem: true },
      { name: 'Shared', slug: 'shared', color: '#F59E0B', isSystem: true },
      { name: 'Tax Deductible', slug: 'tax-deductible', color: '#8B5CF6', isSystem: true }
    ];

    for (const tag of defaultTags) {
      await Tag.updateOne(
        { slug: tag.slug, isSystem: true },
        { $setOnInsert: tag },
        { upsert: true }
      );
    }
  }
};

export default tagRepository;
