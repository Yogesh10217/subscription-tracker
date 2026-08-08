import mongoose from 'mongoose';
import { RENEWAL_PERIODS } from '../constants/payment-frequency.js';

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subscription Name is required'],
      trim: true,
      minLength: 2,
      maxLength: 100
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive number'],
      max: [100000, 'Price must be less than 100000']
    },
    currency: {
      type: String,
      enum: ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
      default: 'USD'
    },
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Custom'],
      default: 'Monthly'
    },
    category: {
      type: String,
      default: 'Other'
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      default: null,
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'UPI', 'PayPal', 'Bank', 'Cash', 'Wallet', 'Other'],
      default: 'Credit Card',
      trim: true
    },
    status: {
      type: String,
      enum: [
        'Draft',
        'Trial',
        'Active',
        'Paused',
        'Cancelled',
        'Expired',
        'expired',
        'Archived',
        'Deleted'
      ],
      default: 'Active'
    },
    startDate: {
      type: Date,
      required: [true, 'Start Date is required']
    },
    renewalDate: {
      type: Date
    },
    // Trial Tracking
    isTrial: {
      type: Boolean,
      default: false
    },
    trialStartDate: {
      type: Date,
      default: null
    },
    trialEndDate: {
      type: Date,
      default: null
    },
    conversionDate: {
      type: Date,
      default: null
    },
    trialReminderDays: {
      type: Number,
      default: 3
    },
    // Favorites & Archive
    isFavorite: {
      type: Boolean,
      default: false,
      index: true
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },
    archivedAt: {
      type: Date,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

subscriptionSchema.index({ user: 1, isDeleted: 1, isArchived: 1, status: 1 });
subscriptionSchema.index({ user: 1, renewalDate: 1 });
subscriptionSchema.index({ name: 'text' });

subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate && this.startDate && this.frequency) {
    const daysToAdd = RENEWAL_PERIODS[this.frequency] || 30;
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + daysToAdd);
  }
  if (this.renewalDate && this.renewalDate < new Date() && this.status === 'Active') {
    this.status = 'Expired';
  }
  next();
});

export default mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
