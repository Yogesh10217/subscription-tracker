/**
 * @file subscription-note.repository.js
 * @module repositories/subscription-note.repository
 * @description Data access operations for subscription rich-text notes.
 */

import SubscriptionNote from '../models/subscription-note.model.js';

export const subscriptionNoteRepository = {
  async create(noteData) {
    return SubscriptionNote.create(noteData);
  },

  async findBySubscription(subscriptionId, userId) {
    return SubscriptionNote.find({ subscription: subscriptionId, user: userId }).sort({
      createdAt: -1
    });
  },

  async findById(id) {
    return SubscriptionNote.findById(id);
  },

  async update(id, userId, text) {
    return SubscriptionNote.findOneAndUpdate({ _id: id, user: userId }, { text }, { new: true });
  },

  async delete(id, userId) {
    return SubscriptionNote.findOneAndDelete({ _id: id, user: userId });
  }
};

export default subscriptionNoteRepository;
