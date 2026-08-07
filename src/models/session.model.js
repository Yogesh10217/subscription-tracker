import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    familyId: {
      type: String,
      required: true,
      index: true
    },
    refreshTokenHash: {
      type: String,
      required: true,
      index: true
    },
    parentTokenHash: {
      type: String,
      default: null
    },
    currentTokenHash: {
      type: String,
      required: true
    },
    device: {
      type: String,
      default: 'Unknown Device'
    },
    browser: {
      type: String,
      default: 'Unknown Browser'
    },
    os: {
      type: String,
      default: 'Unknown OS'
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1'
    },
    location: {
      type: String,
      default: 'Local Network'
    },
    lastSeen: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // TTL Index
    },
    isCurrent: {
      type: Boolean,
      default: true
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true
    },
    revokedReason: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const Session = mongoose.model('Session', sessionSchema);

export default Session;
