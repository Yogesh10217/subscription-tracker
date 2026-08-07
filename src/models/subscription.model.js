import mongoose from "mongoose";
import { RENEWAL_PERIODS } from "../constants/payment-frequency.js";

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: [true, 'Subscription Name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],  
    min: [0, 'Price must be positive number'],
    max: [1000, 'Price must be less than 1000']
  },
  currency: {
    type: String,
    enum: ['USD', 'INR', 'EUR'],
    default: 'USD'
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
  },
  category: {
    type: String,
    enum: ['Entertainment', 'Productivity', 'Education', 'Health', 'Other'],
    required: [true, 'Category is required']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment Method is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'expired', 'Cancelled'],
    default: 'Active'
  },
  startDate: {
    type: Date,
    required: [true, 'Start Date is required'],
  },
  renewalDate: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  }
}, { timestamps: true });

subscriptionSchema.pre('save', function(next) {
  if (!this.renewalDate && this.startDate && this.frequency) {
    const daysToAdd = RENEWAL_PERIODS[this.frequency] || 30;
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + daysToAdd);
  }
  if (this.renewalDate && this.renewalDate < new Date()) {
    this.status = 'expired';
  }
  next();
});

export default mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
