import timelineEventRepository from '../repositories/timeline-event.repository.js';

export const timelineService = {
  async recordEvent({
    entityId,
    entityType = 'Subscription',
    user,
    eventType,
    actor,
    oldValues = null,
    newValues = null,
    metadata = {}
  }) {
    return timelineEventRepository.createEvent({
      entityId,
      entityType,
      user,
      eventType,
      actor: actor || user,
      oldValues,
      newValues,
      metadata,
      timestamp: new Date()
    });
  },

  async getEntityTimeline(entityId, entityType = 'Subscription') {
    return timelineEventRepository.findByEntity(entityId, entityType);
  },

  async getPriceHistory(entityId) {
    return timelineEventRepository.findPriceHistory(entityId);
  },

  async getRenewalHistory(entityId) {
    return timelineEventRepository.findRenewalHistory(entityId);
  }
};

export default timelineService;
