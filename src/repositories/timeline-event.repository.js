/**
 * @file timeline-event.repository.js
 * @module repositories/timeline-event.repository
 * @description Data access operations for entity timeline audit events.
 */

import TimelineEvent from '../models/timeline-event.model.js';

export const timelineEventRepository = {
  async createEvent(eventData) {
    return TimelineEvent.create(eventData);
  },

  async findByEntity(entityId, entityType = 'Subscription') {
    return TimelineEvent.find({ entityId, entityType }).sort({ timestamp: -1 });
  },

  async findPriceHistory(entityId) {
    return TimelineEvent.find({ entityId, eventType: 'PRICE_CHANGE' }).sort({ timestamp: -1 });
  },

  async findRenewalHistory(entityId) {
    return TimelineEvent.find({ entityId, eventType: 'RENEWAL' }).sort({ timestamp: -1 });
  }
};

export default timelineEventRepository;
