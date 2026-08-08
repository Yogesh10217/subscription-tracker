import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      default: 'Subscription',
      index: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    eventType: {
      type: String,
      enum: [
        'CREATED',
        'EDITED',
        'PRICE_CHANGE',
        'RENEWAL',
        'PAUSED',
        'CANCELLED',
        'REMINDER_CHANGED',
        'ATTACHMENT_ADDED',
        'IMPORTED',
        'RESTORED',
        'ARCHIVED',
        'TRIAL_CONVERSION'
      ],
      required: true
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    oldValues: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    newValues: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

timelineEventSchema.index({ entityId: 1, timestamp: -1 });

export default mongoose.models.TimelineEvent ||
  mongoose.model('TimelineEvent', timelineEventSchema);
