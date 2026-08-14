import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  currency: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'User password is required'],
      minLength: 6,
      select: false,
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'INR', 'EUR', 'GBP'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
