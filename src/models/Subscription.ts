import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
  user: mongoose.Types.ObjectId | string;
  name: string;
  price: number;
  currency: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: string;
  paymentMethod: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: Date;
  renewalDate: Date;
  notes?: string;
  icon?: string;
  reminderDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Subscription name is required'],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, 'Subscription price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      enum: ['USD', 'INR', 'EUR', 'GBP'],
    },
    frequency: {
      type: String,
      required: [true, 'Billing frequency is required'],
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: 'monthly',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'General',
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'trial'],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
    },
    renewalDate: {
      type: Date,
      required: [true, 'Renewal date is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    icon: {
      type: String,
      default: '',
    },
    reminderDays: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

// Auto-calculate renewal date before validation if missing
SubscriptionSchema.pre('validate', function (next) {
  if (!this.renewalDate && this.startDate && this.frequency) {
    const start = new Date(this.startDate);
    const renewal = new Date(start);
    if (this.frequency === 'daily') renewal.setDate(renewal.getDate() + 1);
    else if (this.frequency === 'weekly') renewal.setDate(renewal.getDate() + 7);
    else if (this.frequency === 'monthly') renewal.setMonth(renewal.getMonth() + 1);
    else if (this.frequency === 'yearly') renewal.setFullYear(renewal.getFullYear() + 1);
    this.renewalDate = renewal;
  }
  next();
});

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
