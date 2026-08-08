import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category Name is required'],
      trim: true,
      minLength: 2,
      maxLength: 50
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    icon: {
      type: String,
      default: 'folder'
    },
    color: {
      type: String,
      default: '#3B82F6'
    },
    description: {
      type: String,
      maxLength: 250,
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

categorySchema.index({ user: 1, slug: 1 }, { unique: true });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
