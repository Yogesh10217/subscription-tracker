import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '#models/user.model.js';
import Subscription from '#models/subscription.model.js';

describe('Mongoose Models Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('User Model', () => {
    test('pre-save hook hashes password if modified', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!'
      });

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpass');

      // Call pre-save hook directly
      await new Promise((resolve, reject) => {
        user.$op = 'save';
        user.isModified = () => true;
        User.schema.s.hooks.execPre('save', user, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      expect(user.password).toBe('hashedpass');
    });

    test('pre-save hook skips if password is not modified', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'AlreadyHashed'
      });

      user.isModified = () => false;

      await new Promise((resolve, reject) => {
        User.schema.s.hooks.execPre('save', user, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      expect(user.password).toBe('AlreadyHashed');
    });

    test('comparePassword delegates to bcrypt', async () => {
      const user = new User({ password: 'hashed' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const match = await user.comparePassword('rawpass');
      expect(match).toBe(true);
    });
  });

  describe('Subscription Model', () => {
    test('pre-save hook calculates renewalDate if missing and marks status Expired if renewalDate is in the past', async () => {
      const sub = new Subscription({
        name: 'Netflix',
        price: 15,
        currency: 'USD',
        frequency: 'Monthly',
        startDate: new Date('2020-01-01'),
        status: 'Active',
        user: new mongoose.Types.ObjectId()
      });

      await new Promise((resolve, reject) => {
        Subscription.schema.s.hooks.execPre('save', sub, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      expect(sub.renewalDate).toBeDefined();
      expect(sub.status).toBe('Expired');
    });
  });
});
