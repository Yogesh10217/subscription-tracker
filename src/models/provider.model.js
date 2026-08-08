import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Provider Name is required'],
      trim: true,
      minLength: 2,
      maxLength: 100
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    logoUrl: {
      type: String,
      trim: true,
      default: ''
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      default: 'General'
    },
    color: {
      type: String,
      default: '#4F46E5'
    },
    isSystem: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

providerSchema.index({ user: 1, slug: 1 }, { unique: true });

export default mongoose.models.Provider || mongoose.model('Provider', providerSchema);
