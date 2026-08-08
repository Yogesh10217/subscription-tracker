import mongoose from 'mongoose';

const reminderRuleSchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    ruleType: {
      type: String,
      enum: [
        '1_DAY_BEFORE',
        '3_DAYS_BEFORE',
        '7_DAYS_BEFORE',
        '14_DAYS_BEFORE',
        '30_DAYS_BEFORE',
        'CUSTOM'
      ],
      default: '7_DAYS_BEFORE'
    },
    daysBefore: {
      type: Number,
      default: 7
    },
    customDate: {
      type: Date,
      default: null
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    lastNotifiedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.models.ReminderRule || mongoose.model('ReminderRule', reminderRuleSchema);
