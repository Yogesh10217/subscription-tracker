import { jest } from '@jest/globals';
import categoryService from '#services/category.service.js';
import categoryRepository from '#repositories/category.repository.js';
import providerService from '#services/provider.service.js';
import providerRepository from '#repositories/provider.repository.js';
import tagService from '#services/tag.service.js';
import tagRepository from '#repositories/tag.repository.js';
import reminderRuleService from '#services/reminder-rule.service.js';
import reminderRuleRepository from '#repositories/reminder-rule.repository.js';
import subscriptionNoteService from '#services/subscription-note.service.js';
import subscriptionNoteRepository from '#repositories/subscription-note.repository.js';
import fileAssetService from '#services/file-asset.service.js';
import fileAssetRepository from '#repositories/file-asset.repository.js';
import timelineService from '#services/timeline.service.js';
import timelineEventRepository from '#repositories/timeline-event.repository.js';
import exportService from '#services/export.service.js';
import searchService from '#services/search.service.js';
import emailService from '#services/email.service.js';
import subscriptionRepository from '#repositories/subscription.repository.js';
import ApiError from '#utils/api-error.js';

describe('Domain CRUD Services Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('CategoryService', () => {
    test('getCategories, createCategory, updateCategory, deleteCategory', async () => {
      jest.spyOn(categoryRepository, 'seedSystemCategories').mockResolvedValue();
      jest.spyOn(categoryRepository, 'findAllForUser').mockResolvedValue([{ name: 'Cat1' }]);
      jest.spyOn(categoryRepository, 'create').mockImplementation((d) => Promise.resolve(d));
      jest.spyOn(categoryRepository, 'update').mockResolvedValue({ name: 'Cat1' });
      jest.spyOn(categoryRepository, 'delete').mockResolvedValue({ name: 'Cat1' });

      const list = await categoryService.getCategories('u1');
      expect(list).toHaveLength(1);

      const created = await categoryService.createCategory({ name: 'Cat 1' }, 'u1');
      expect(created.slug).toBe('cat-1');

      const updated = await categoryService.updateCategory('c1', 'u1', { name: 'Cat1' });
      expect(updated).toBeDefined();

      const deleted = await categoryService.deleteCategory('c1', 'u1');
      expect(deleted).toBeDefined();

      jest.spyOn(categoryRepository, 'update').mockResolvedValue(null);
      await expect(categoryService.updateCategory('c1', 'u1', {})).rejects.toThrow(ApiError);

      jest.spyOn(categoryRepository, 'delete').mockResolvedValue(null);
      await expect(categoryService.deleteCategory('c1', 'u1')).rejects.toThrow(ApiError);
    });
  });

  describe('ProviderService', () => {
    test('getProviders, createProvider, updateProvider, deleteProvider', async () => {
      jest.spyOn(providerRepository, 'seedSystemProviders').mockResolvedValue();
      jest.spyOn(providerRepository, 'findAllForUser').mockResolvedValue([{ name: 'P1' }]);
      jest.spyOn(providerRepository, 'create').mockImplementation((d) => Promise.resolve(d));
      jest.spyOn(providerRepository, 'update').mockResolvedValue({ name: 'P1' });
      jest.spyOn(providerRepository, 'delete').mockResolvedValue({ name: 'P1' });

      const list = await providerService.getProviders('u1');
      expect(list).toHaveLength(1);

      const created = await providerService.createProvider({ name: 'P 1' }, 'u1');
      expect(created.slug).toBe('p-1');

      const updated = await providerService.updateProvider('p1', 'u1', { name: 'P1' });
      expect(updated).toBeDefined();

      const deleted = await providerService.deleteProvider('p1', 'u1');
      expect(deleted).toBeDefined();

      jest.spyOn(providerRepository, 'update').mockResolvedValue(null);
      await expect(providerService.updateProvider('p1', 'u1', {})).rejects.toThrow(ApiError);

      jest.spyOn(providerRepository, 'delete').mockResolvedValue(null);
      await expect(providerService.deleteProvider('p1', 'u1')).rejects.toThrow(ApiError);
    });
  });

  describe('TagService', () => {
    test('getTags, createTag, updateTag, deleteTag', async () => {
      jest.spyOn(tagRepository, 'seedSystemTags').mockResolvedValue();
      jest.spyOn(tagRepository, 'findAllForUser').mockResolvedValue([{ name: 'T1' }]);
      jest.spyOn(tagRepository, 'create').mockImplementation((d) => Promise.resolve(d));
      jest.spyOn(tagRepository, 'update').mockResolvedValue({ name: 'T1' });
      jest.spyOn(tagRepository, 'delete').mockResolvedValue({ name: 'T1' });

      const list = await tagService.getTags('u1');
      expect(list).toHaveLength(1);

      const created = await tagService.createTag({ name: 'T 1' }, 'u1');
      expect(created.slug).toBe('t-1');

      const updated = await tagService.updateTag('t1', 'u1', { name: 'T1' });
      expect(updated).toBeDefined();

      const deleted = await tagService.deleteTag('t1', 'u1');
      expect(deleted).toBeDefined();

      jest.spyOn(tagRepository, 'update').mockResolvedValue(null);
      await expect(tagService.updateTag('t1', 'u1', {})).rejects.toThrow(ApiError);

      jest.spyOn(tagRepository, 'delete').mockResolvedValue(null);
      await expect(tagService.deleteTag('t1', 'u1')).rejects.toThrow(ApiError);
    });
  });

  describe('ReminderRuleService', () => {
    test('addRule, getRules, updateRule, deleteRule', async () => {
      jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue({ _id: 's1', user: 'u1' });
      jest.spyOn(reminderRuleRepository, 'create').mockResolvedValue({ daysBefore: 3 });
      jest
        .spyOn(reminderRuleRepository, 'findBySubscription')
        .mockResolvedValue([{ daysBefore: 3 }]);
      jest.spyOn(reminderRuleRepository, 'update').mockResolvedValue({ daysBefore: 5 });
      jest.spyOn(reminderRuleRepository, 'delete').mockResolvedValue({ _id: 'r1' });

      const added = await reminderRuleService.addRule('s1', 'u1', { daysBefore: 3 });
      expect(added.daysBefore).toBe(3);

      const list = await reminderRuleService.getRules('s1', 'u1');
      expect(list).toHaveLength(1);

      const updated = await reminderRuleService.updateRule('r1', 'u1', { daysBefore: 5 });
      expect(updated.daysBefore).toBe(5);

      const deleted = await reminderRuleService.deleteRule('r1', 'u1');
      expect(deleted).toBeDefined();

      jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue(null);
      await expect(reminderRuleService.addRule('s1', 'u1', {})).rejects.toThrow(ApiError);

      jest.spyOn(reminderRuleRepository, 'update').mockResolvedValue(null);
      await expect(reminderRuleService.updateRule('r1', 'u1', {})).rejects.toThrow(ApiError);

      jest.spyOn(reminderRuleRepository, 'delete').mockResolvedValue(null);
      await expect(reminderRuleService.deleteRule('r1', 'u1')).rejects.toThrow(ApiError);
    });
  });

  describe('SubscriptionNoteService', () => {
    test('addNote, getNotes, deleteNote', async () => {
      jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue({ _id: 's1', user: 'u1' });
      jest.spyOn(subscriptionNoteRepository, 'create').mockResolvedValue({ text: 'Note 1' });
      jest
        .spyOn(subscriptionNoteRepository, 'findBySubscription')
        .mockResolvedValue([{ text: 'Note 1' }]);
      jest.spyOn(subscriptionNoteRepository, 'delete').mockResolvedValue({ _id: 'n1' });

      const added = await subscriptionNoteService.addNote('s1', 'u1', 'Note 1');
      expect(added.text).toBe('Note 1');

      const list = await subscriptionNoteService.getNotes('s1', 'u1');
      expect(list).toHaveLength(1);

      const deleted = await subscriptionNoteService.deleteNote('n1', 'u1');
      expect(deleted).toBeDefined();

      jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue(null);
      await expect(subscriptionNoteService.addNote('s1', 'u1', 'test')).rejects.toThrow(ApiError);

      jest.spyOn(subscriptionNoteRepository, 'delete').mockResolvedValue(null);
      await expect(subscriptionNoteService.deleteNote('n1', 'u1')).rejects.toThrow(ApiError);
    });
  });

  describe('FileAssetService', () => {
    test('addFileAsset, getFileAssets, deleteFileAsset', async () => {
      jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue({ _id: 's1', user: 'u1' });
      jest.spyOn(fileAssetRepository, 'create').mockResolvedValue({ fileName: 'file.pdf' });
      jest
        .spyOn(fileAssetRepository, 'findBySubscription')
        .mockResolvedValue([{ fileName: 'file.pdf' }]);
      jest.spyOn(fileAssetRepository, 'delete').mockResolvedValue({ _id: 'f1' });

      const added = await fileAssetService.addFileAsset('s1', 'u1', { fileName: 'file.pdf' });
      expect(added.fileName).toBe('file.pdf');

      const list = await fileAssetService.getFileAssets('s1', 'u1');
      expect(list).toHaveLength(1);

      const deleted = await fileAssetService.deleteFileAsset('f1', 'u1');
      expect(deleted).toBeDefined();

      jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue(null);
      await expect(fileAssetService.addFileAsset('s1', 'u1', {})).rejects.toThrow(ApiError);

      jest.spyOn(fileAssetRepository, 'delete').mockResolvedValue(null);
      await expect(fileAssetService.deleteFileAsset('f1', 'u1')).rejects.toThrow(ApiError);
    });
  });

  describe('TimelineService', () => {
    test('recordEvent, getEntityTimeline, getPriceHistory, getRenewalHistory', async () => {
      jest
        .spyOn(timelineEventRepository, 'createEvent')
        .mockResolvedValue({ eventType: 'CREATED' });
      jest
        .spyOn(timelineEventRepository, 'findByEntity')
        .mockResolvedValue([{ eventType: 'CREATED' }]);
      jest
        .spyOn(timelineEventRepository, 'findPriceHistory')
        .mockResolvedValue([{ eventType: 'PRICE_CHANGE' }]);
      jest
        .spyOn(timelineEventRepository, 'findRenewalHistory')
        .mockResolvedValue([{ eventType: 'RENEWAL' }]);

      const rec = await timelineService.recordEvent({
        entityId: 's1',
        user: 'u1',
        eventType: 'CREATED'
      });
      expect(rec.eventType).toBe('CREATED');

      const timeline = await timelineService.getEntityTimeline('s1');
      expect(timeline).toHaveLength(1);

      const price = await timelineService.getPriceHistory('s1');
      expect(price).toHaveLength(1);

      const renewal = await timelineService.getRenewalHistory('s1');
      expect(renewal).toHaveLength(1);
    });
  });

  describe('ExportService', () => {
    test('exportJSON and exportCSV format output properly', async () => {
      const mockSub = {
        _id: 's1',
        name: 'Netflix "Premium"',
        price: 15.99,
        currency: 'USD',
        frequency: 'monthly',
        category: 'Entertainment',
        paymentMethod: 'Credit Card',
        status: 'Active',
        startDate: '2026-01-01',
        renewalDate: '2026-02-01',
        isTrial: false,
        isFavorite: true,
        isPinned: false,
        createdAt: '2026-01-01',
        toObject: function () {
          return this;
        }
      };

      jest.spyOn(subscriptionRepository, 'findAll').mockResolvedValue([mockSub]);

      const json = await exportService.exportJSON('u1');
      expect(json).toHaveLength(1);
      expect(json[0].name).toBe('Netflix "Premium"');

      const csv = await exportService.exportCSV('u1');
      expect(csv).toContain('Netflix ""Premium""');

      jest.spyOn(subscriptionRepository, 'findAll').mockResolvedValue([]);
      const emptyCsv = await exportService.exportCSV('u1');
      expect(emptyCsv).toContain('Name,Price,Currency');
    });
  });

  describe('SearchService & EmailService', () => {
    test('searchSubscriptions computes pagination metadata', async () => {
      jest.spyOn(subscriptionRepository, 'findWithQuery').mockResolvedValue({
        items: [{ _id: 's1' }],
        total: 1
      });

      const res = await searchService.searchSubscriptions({ page: 1, limit: 10 }, 'u1');
      expect(res.pagination.total).toBe(1);
      expect(res.pagination.hasNextPage).toBe(false);
    });

    test('emailService delegates to sendReminder', async () => {
      const res = await emailService.sendReminder('test@example.com', '7 days before reminder', {
        name: 'Netflix'
      });
      expect(res).toBeDefined();
    });
  });
});
