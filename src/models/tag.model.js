import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag Name is required'],
      trim: true,
      minLength: 1,
      maxLength: 30
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    color: {
      type: String,
      default: '#10B981'
    },
    description: {
      type: String,
      maxLength: 150,
      default: ''
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

tagSchema.index({ user: 1, slug: 1 }, { unique: true });

export default mongoose.models.Tag || mongoose.model('Tag', tagSchema);
