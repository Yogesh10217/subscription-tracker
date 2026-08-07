import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User Name is required'],
      trim: true,
      minLength: 2,
      maxLength: 50
    },
    email: {
      type: String,
      required: [true, 'User Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: [true, 'User Password is required'],
      minLength: 6
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    permissions: {
      type: [String],
      default: []
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: null
    },
    passwordHistory: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
