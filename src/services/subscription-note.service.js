import subscriptionNoteRepository from '../repositories/subscription-note.repository.js';
import subscriptionRepository from '../repositories/subscription.repository.js';
import ApiError from '../utils/api-error.js';

export const subscriptionNoteService = {
  async addNote(subscriptionId, userId, text) {
    const sub = await subscriptionRepository.findById(subscriptionId);
    if (!sub || sub.user.toString() !== userId) {
      throw ApiError.notFound('Subscription not found');
    }
    return subscriptionNoteRepository.create({
      subscription: subscriptionId,
      user: userId,
      createdBy: userId,
      text
    });
  },

  async getNotes(subscriptionId, userId) {
    return subscriptionNoteRepository.findBySubscription(subscriptionId, userId);
  },

  async deleteNote(noteId, userId) {
    const deleted = await subscriptionNoteRepository.delete(noteId, userId);
    if (!deleted) {
      throw ApiError.notFound('Note not found');
    }
    return deleted;
  }
};

export default subscriptionNoteService;
