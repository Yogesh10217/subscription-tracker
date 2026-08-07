import mongoose from 'mongoose';

const verificationTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['email_verification', 'password_reset', 'magic_link', 'user_invite'],
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // TTL Index
    }
  },
  { timestamps: true }
);

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);

export default VerificationToken;
