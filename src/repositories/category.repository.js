/**
 * @file category.repository.js
 * @module repositories/category.repository
 * @description Data access operations for subscription categories taxonomy.
 */

import Category from '../models/category.model.js';

export const categoryRepository = {
  async create(categoryData) {
    return Category.create(categoryData);
  },

  async findAllForUser(userId) {
    return Category.find({
      $or: [{ isSystem: true }, { user: userId }]
    }).sort({ name: 1 });
  },

  async findById(id) {
    return Category.findById(id);
  },

  async update(id, userId, updateData) {
    return Category.findOneAndUpdate({ _id: id, user: userId, isSystem: false }, updateData, {
      new: true
    });
  },

  async delete(id, userId) {
    return Category.findOneAndDelete({ _id: id, user: userId, isSystem: false });
  },

  async seedSystemCategories() {
    const defaultCategories = [
      { name: 'Streaming', slug: 'streaming', icon: 'tv', color: '#E50914', isSystem: true },
      { name: 'Music', slug: 'music', icon: 'music', color: '#1DB954', isSystem: true },
      { name: 'Gaming', slug: 'gaming', icon: 'gamepad', color: '#9146FF', isSystem: true },
      { name: 'Cloud', slug: 'cloud', icon: 'cloud', color: '#00A8E1', isSystem: true },
      { name: 'Education', slug: 'education', icon: 'book', color: '#F59E0B', isSystem: true },
      { name: 'Software', slug: 'software', icon: 'code', color: '#3B82F6', isSystem: true },
      {
        name: 'Productivity',
        slug: 'productivity',
        icon: 'check-square',
        color: '#10B981',
        isSystem: true
      },
      { name: 'Utilities', slug: 'utilities', icon: 'tool', color: '#6B7280', isSystem: true },
      { name: 'Finance', slug: 'finance', icon: 'dollar-sign', color: '#8B5CF6', isSystem: true },
      {
        name: 'Shopping',
        slug: 'shopping',
        icon: 'shopping-cart',
        color: '#EC4899',
        isSystem: true
      }
    ];

    for (const cat of defaultCategories) {
      await Category.updateOne(
        { slug: cat.slug, isSystem: true },
        { $setOnInsert: cat },
        { upsert: true }
      );
    }
  }
};

export default categoryRepository;
