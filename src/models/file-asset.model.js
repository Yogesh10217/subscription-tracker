import mongoose from 'mongoose';

const fileAssetSchema = new mongoose.Schema(
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
    fileName: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    storageKey: {
      type: String,
      required: true
    },
    assetType: {
      type: String,
      enum: ['Invoice', 'Receipt', 'Screenshot', 'Contract', 'PDF', 'Image', 'Export', 'Logo'],
      default: 'Receipt'
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.models.FileAsset || mongoose.model('FileAsset', fileAssetSchema);
