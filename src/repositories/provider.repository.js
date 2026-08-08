/**
 * @file provider.repository.js
 * @module repositories/provider.repository
 * @description Data access operations for subscription providers catalog.
 */

import Provider from '../models/provider.model.js';

export const providerRepository = {
  async create(providerData) {
    return Provider.create(providerData);
  },

  async findAllForUser(userId) {
    return Provider.find({
      $or: [{ isSystem: true }, { user: userId }]
    }).sort({ name: 1 });
  },

  async findById(id) {
    return Provider.findById(id);
  },

  async update(id, userId, updateData) {
    return Provider.findOneAndUpdate({ _id: id, user: userId, isSystem: false }, updateData, {
      new: true
    });
  },

  async delete(id, userId) {
    return Provider.findOneAndDelete({ _id: id, user: userId, isSystem: false });
  },

  async seedSystemProviders(providersList = []) {
    const defaultProviders = [
      { name: 'Netflix', slug: 'netflix', color: '#E50914', isSystem: true },
      { name: 'Spotify', slug: 'spotify', color: '#1DB954', isSystem: true },
      { name: 'Amazon Prime', slug: 'prime', color: '#00A8E1', isSystem: true },
      { name: 'YouTube Premium', slug: 'youtube-premium', color: '#FF0000', isSystem: true },
      { name: 'Adobe Creative Cloud', slug: 'adobe', color: '#FF0000', isSystem: true },
      { name: 'GitHub', slug: 'github', color: '#181717', isSystem: true },
      { name: 'ChatGPT Plus', slug: 'chatgpt', color: '#10A37F', isSystem: true },
      { name: 'AWS', slug: 'aws', color: '#FF9900', isSystem: true }
    ];

    const toInsert = providersList.length > 0 ? providersList : defaultProviders;
    for (const p of toInsert) {
      await Provider.updateOne(
        { slug: p.slug, isSystem: true },
        { $setOnInsert: p },
        { upsert: true }
      );
    }
  }
};

export default providerRepository;
