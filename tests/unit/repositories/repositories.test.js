import { jest } from '@jest/globals';
import subscriptionRepository from '#repositories/subscription.repository.js';
import Subscription from '#models/subscription.model.js';
import categoryRepository from '#repositories/category.repository.js';
import Category from '#models/category.model.js';
import providerRepository from '#repositories/provider.repository.js';
import Provider from '#models/provider.model.js';
import tagRepository from '#repositories/tag.repository.js';
import Tag from '#models/tag.model.js';
import reminderRuleRepository from '#repositories/reminder-rule.repository.js';
import ReminderRule from '#models/reminder-rule.model.js';
import subscriptionNoteRepository from '#repositories/subscription-note.repository.js';
import SubscriptionNote from '#models/subscription-note.model.js';
import fileAssetRepository from '#repositories/file-asset.repository.js';
import FileAsset from '#models/file-asset.model.js';
import timelineEventRepository from '#repositories/timeline-event.repository.js';
import TimelineEvent from '#models/timeline-event.model.js';
import securityRepository from '#repositories/security.repository.js';
import VerificationToken from '#models/verification-token.model.js';
import AuditLog from '#models/audit-log.model.js';
import sessionRepository from '#repositories/session.repository.js';
import Session from '#models/session.model.js';
import userRepository from '#repositories/user.repository.js';
import User from '#models/user.model.js';

describe('Repository Layer Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('SubscriptionRepository', () => {
    test('methods call Mongoose model query chain', async () => {
      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([{ _id: 'sub1' }])
      };

      jest.spyOn(Subscription, 'create').mockResolvedValue({ _id: 'sub1' });
      jest.spyOn(Subscription, 'findOne').mockReturnValue(mockQueryChain);
      jest.spyOn(Subscription, 'find').mockReturnValue(mockQueryChain);
      jest.spyOn(Subscription, 'findOneAndUpdate').mockReturnValue(mockQueryChain);
      jest.spyOn(Subscription, 'findByIdAndDelete').mockResolvedValue({ _id: 'sub1' });
      jest.spyOn(Subscription, 'countDocuments').mockResolvedValue(1);
      jest.spyOn(Subscription, 'updateMany').mockResolvedValue({ modifiedCount: 1 });

      await subscriptionRepository.create({ name: 'Sub' });
      await subscriptionRepository.findById('sub1');
      await subscriptionRepository.findByIdWithUser('sub1');
      await subscriptionRepository.findByUserId('u1');
      await subscriptionRepository.findAll({});
      await subscriptionRepository.findWithQuery({});
      await subscriptionRepository.update('sub1', { price: 20 });
      await subscriptionRepository.softDelete('sub1', 'u1');
      await subscriptionRepository.archive('sub1', 'u1');
      await subscriptionRepository.restore('sub1', 'u1');
      await subscriptionRepository.delete('sub1');
      await subscriptionRepository.bulkArchive(['sub1'], 'u1');
      await subscriptionRepository.bulkRestore(['sub1'], 'u1');
      await subscriptionRepository.bulkDelete(['sub1'], 'u1');
      await subscriptionRepository.bulkUpdateCategory(['sub1'], 'u1', 'cat1', 'CatName');
      await subscriptionRepository.bulkUpdateTags(['sub1'], 'u1', ['tag1']);
      await subscriptionRepository.findUpcomingRenewals({});

      expect(Subscription.findOne).toHaveBeenCalled();
      expect(Subscription.find).toHaveBeenCalled();
    });
  });

  describe('Session & User Repositories', () => {
    test('SessionRepository methods', async () => {
      const sortChain = { sort: jest.fn().mockResolvedValue([{ _id: 'sess1' }]) };

      jest.spyOn(Session, 'create').mockResolvedValue({ _id: 'sess1' });
      jest.spyOn(Session, 'findOne').mockResolvedValue({ _id: 'sess1' });
      jest.spyOn(Session, 'findByIdAndUpdate').mockResolvedValue({ _id: 'sess1' });
      jest.spyOn(Session, 'updateMany').mockResolvedValue({ modifiedCount: 1 });
      jest.spyOn(Session, 'find').mockReturnValue(sortChain);
      jest.spyOn(Session, 'deleteMany').mockResolvedValue({ deletedCount: 1 });

      await sessionRepository.create({ refreshTokenHash: 'hash' });
      await sessionRepository.findByRefreshToken('hash');
      await sessionRepository.findAnyByRefreshToken('hash');
      await sessionRepository.rotate('sess1', 'newHash', new Date());
      await sessionRepository.revoke('sess1', 'Logout');
      await sessionRepository.revokeFamily('fam1', 'Replay');
      await sessionRepository.revokeAll('u1', 'Logout All');
      await sessionRepository.findUserSessions('u1');
      await sessionRepository.cleanupExpired();

      expect(Session.create).toHaveBeenCalled();
      expect(Session.deleteMany).toHaveBeenCalled();
    });

    test('UserRepository methods', async () => {
      const selectChain = { select: jest.fn().mockResolvedValue({ _id: 'u1' }) };

      jest.spyOn(User, 'findById').mockReturnValue(selectChain);
      jest.spyOn(User, 'findOne').mockReturnValue(selectChain);
      jest.spyOn(User, 'create').mockResolvedValue({ _id: 'u1' });
      jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue({ _id: 'u1' });

      await userRepository.findById('u1');
      await userRepository.findByEmail('u1@example.com');
      await userRepository.create({ name: 'User' });
      await userRepository.update('u1', { name: 'Updated' });

      expect(User.findById).toHaveBeenCalledWith('u1');
      expect(User.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('Taxonomy Repositories (Category, Provider, Tag)', () => {
    test('CategoryRepository methods and seeding', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue({ _id: 'c1' });
      jest.spyOn(Category, 'findOneAndUpdate').mockResolvedValue({ _id: 'c1' });
      jest.spyOn(Category, 'findOneAndDelete').mockResolvedValue({ _id: 'c1' });
      jest.spyOn(Category, 'updateOne').mockResolvedValue({ upsertedCount: 1 });

      await categoryRepository.findById('c1');
      await categoryRepository.update('c1', 'u1', { name: 'Cat' });
      await categoryRepository.delete('c1', 'u1');
      await categoryRepository.seedSystemCategories();

      expect(Category.findById).toHaveBeenCalledWith('c1');
      expect(Category.updateOne).toHaveBeenCalled();
    });

    test('ProviderRepository methods and seeding', async () => {
      jest.spyOn(Provider, 'findById').mockResolvedValue({ _id: 'p1' });
      jest.spyOn(Provider, 'findOneAndUpdate').mockResolvedValue({ _id: 'p1' });
      jest.spyOn(Provider, 'findOneAndDelete').mockResolvedValue({ _id: 'p1' });
      jest.spyOn(Provider, 'updateOne').mockResolvedValue({ upsertedCount: 1 });

      await providerRepository.findById('p1');
      await providerRepository.update('p1', 'u1', { name: 'Prov' });
      await providerRepository.delete('p1', 'u1');
      await providerRepository.seedSystemProviders();

      expect(Provider.findById).toHaveBeenCalledWith('p1');
      expect(Provider.updateOne).toHaveBeenCalled();
    });

    test('TagRepository methods and seeding', async () => {
      jest.spyOn(Tag, 'findById').mockResolvedValue({ _id: 't1' });
      jest.spyOn(Tag, 'findOneAndUpdate').mockResolvedValue({ _id: 't1' });
      jest.spyOn(Tag, 'findOneAndDelete').mockResolvedValue({ _id: 't1' });
      jest.spyOn(Tag, 'updateOne').mockResolvedValue({ upsertedCount: 1 });

      await tagRepository.findById('t1');
      await tagRepository.update('t1', 'u1', { name: 'Tag' });
      await tagRepository.delete('t1', 'u1');
      await tagRepository.seedSystemTags();

      expect(Tag.findById).toHaveBeenCalledWith('t1');
      expect(Tag.updateOne).toHaveBeenCalled();
    });
  });

  describe('Sub-document Repositories', () => {
    test('ReminderRule, SubscriptionNote, FileAsset, TimelineEvent', async () => {
      const sortChain = { sort: jest.fn().mockResolvedValue([{ _id: '1' }]) };

      jest.spyOn(ReminderRule, 'create').mockResolvedValue({ _id: 'r1' });
      jest.spyOn(ReminderRule, 'find').mockReturnValue(sortChain);
      jest.spyOn(ReminderRule, 'findById').mockResolvedValue({ _id: 'r1' });
      jest.spyOn(ReminderRule, 'findOneAndUpdate').mockResolvedValue({ _id: 'r1' });
      jest.spyOn(ReminderRule, 'findOneAndDelete').mockResolvedValue({ _id: 'r1' });

      await reminderRuleRepository.create({ daysBefore: 3 });
      await reminderRuleRepository.findBySubscription('s1', 'u1');
      await reminderRuleRepository.findById('r1');
      await reminderRuleRepository.update('r1', 'u1', {});
      await reminderRuleRepository.delete('r1', 'u1');

      jest.spyOn(SubscriptionNote, 'create').mockResolvedValue({ _id: 'n1' });
      jest.spyOn(SubscriptionNote, 'find').mockReturnValue(sortChain);
      jest.spyOn(SubscriptionNote, 'findById').mockResolvedValue({ _id: 'n1' });
      jest.spyOn(SubscriptionNote, 'findOneAndUpdate').mockResolvedValue({ _id: 'n1' });
      jest.spyOn(SubscriptionNote, 'findOneAndDelete').mockResolvedValue({ _id: 'n1' });

      await subscriptionNoteRepository.create({ text: 't' });
      await subscriptionNoteRepository.findBySubscription('s1', 'u1');
      await subscriptionNoteRepository.findById('n1');
      await subscriptionNoteRepository.update('n1', 'u1', 't');
      await subscriptionNoteRepository.delete('n1', 'u1');

      jest.spyOn(FileAsset, 'create').mockResolvedValue({ _id: 'f1' });
      jest.spyOn(FileAsset, 'find').mockReturnValue(sortChain);
      jest.spyOn(FileAsset, 'findById').mockResolvedValue({ _id: 'f1' });
      jest.spyOn(FileAsset, 'findOneAndDelete').mockResolvedValue({ _id: 'f1' });

      await fileAssetRepository.create({ fileName: 'a' });
      await fileAssetRepository.findBySubscription('s1', 'u1');
      await fileAssetRepository.findById('f1');
      await fileAssetRepository.delete('f1', 'u1');

      jest.spyOn(TimelineEvent, 'create').mockResolvedValue({ _id: 'te1' });
      jest.spyOn(TimelineEvent, 'find').mockReturnValue(sortChain);

      await timelineEventRepository.createEvent({});
      await timelineEventRepository.findByEntity('e1');
      await timelineEventRepository.findPriceHistory('e1');
      await timelineEventRepository.findRenewalHistory('e1');

      expect(TimelineEvent.create).toHaveBeenCalled();
    });

    test('SecurityRepository verification tokens and audit logs', async () => {
      const sortLimitChain = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([{ _id: 'al1' }])
      };

      jest.spyOn(VerificationToken, 'deleteMany').mockResolvedValue({ deletedCount: 1 });
      jest.spyOn(VerificationToken, 'create').mockResolvedValue({ _id: 'vt1' });
      jest.spyOn(VerificationToken, 'findOne').mockResolvedValue({ _id: 'vt1' });
      jest.spyOn(VerificationToken, 'findByIdAndDelete').mockResolvedValue({ _id: 'vt1' });
      jest.spyOn(AuditLog, 'create').mockResolvedValue({ _id: 'al1' });
      jest.spyOn(AuditLog, 'find').mockReturnValue(sortLimitChain);

      await securityRepository.saveVerificationToken({ user: 'u1', type: 'email' });
      await securityRepository.findVerificationToken('hash', 'email');
      await securityRepository.deleteVerificationToken('vt1');
      await securityRepository.createAuditLog({ action: 'TEST' });
      await securityRepository.findAuditLogs({});

      expect(VerificationToken.create).toHaveBeenCalled();
      expect(AuditLog.create).toHaveBeenCalled();
    });
  });
});
