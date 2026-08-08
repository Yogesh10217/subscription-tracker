import mongoose from 'mongoose';

const subscriptionNoteSchema = new mongoose.Schema(
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
    text: {
      type: String,
      required: [true, 'Note text is required'],
      maxLength: 2000
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.SubscriptionNote ||
  mongoose.model('SubscriptionNote', subscriptionNoteSchema);
