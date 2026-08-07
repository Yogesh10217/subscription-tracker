import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import ApiError from '../utils/api-error.js';

export class AuthService {
  async signUp({ name, email, password }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict('User already exists with this email');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await userRepository.create(
        { name, email, password: hashedPassword },
        session
      );

      const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });

      await session.commitTransaction();
      session.endSession();

      return {
        userId: newUser._id,
        email: newUser.email,
        name: newUser.name,
        token
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async signIn({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw ApiError.notFound('User Not Found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid Credentials');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const userObj = user.toObject();
    delete userObj.password;

    return {
      token,
      user: userObj
    };
  }
}

export default new AuthService();
