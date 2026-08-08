import { jest } from '@jest/globals';
import * as authController from '#controllers/auth.controller.js';
import authService from '#services/auth.service.js';
import sessionService from '#services/session.service.js';
import * as subscriptionController from '#controllers/subscription.controller.js';
import subscriptionService from '#services/subscription.service.js';
import * as categoryController from '#controllers/category.controller.js';
import categoryService from '#services/category.service.js';
import * as providerController from '#controllers/provider.controller.js';
import providerService from '#services/provider.service.js';
import * as tagController from '#controllers/tag.controller.js';
import tagService from '#services/tag.service.js';
import * as reminderRuleController from '#controllers/reminder-rule.controller.js';
import reminderRuleService from '#services/reminder-rule.service.js';
import * as subscriptionNoteController from '#controllers/subscription-note.controller.js';
import subscriptionNoteService from '#services/subscription-note.service.js';
import * as fileAssetController from '#controllers/file-asset.controller.js';
import fileAssetService from '#services/file-asset.service.js';
import * as timelineController from '#controllers/timeline.controller.js';
import timelineService from '#services/timeline.service.js';
import * as importExportController from '#controllers/import-export.controller.js';
import importService from '#services/import.service.js';
import exportService from '#services/export.service.js';
import * as analyticsController from '#controllers/analytics.controller.js';
import analyticsService from '#analytics/analytics.service.js';
import * as workflowController from '#controllers/workflow.controller.js';
import workflowService from '#services/workflow.service.js';
import * as userController from '#controllers/user.controller.js';
import userService from '#services/user.service.js';

describe('Controller Layer Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { _id: '507f1f77bcf86cd799439011', email: 'test@example.com' },
      ip: '127.0.0.1',
      headers: { 'user-agent': 'Jest' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('AuthController', () => {
    test('signUp, signIn, refreshToken, logout, logoutAll, forgotPassword, resetPassword, changePassword, verifyEmail, resendVerification, getSessions, revokeSession', async () => {
      jest
        .spyOn(authService, 'signUp')
        .mockResolvedValue({ tokens: { refreshToken: 'r' }, user: { email: 'test@example.com' } });
      jest.spyOn(authService, 'signIn').mockResolvedValue({ refreshToken: 'r', accessToken: 'a' });
      jest
        .spyOn(authService, 'refreshTokens')
        .mockResolvedValue({ accessToken: 'a2', refreshToken: 'r2' });
      jest.spyOn(authService, 'forgotPassword').mockResolvedValue();
      jest.spyOn(authService, 'resetPassword').mockResolvedValue();
      jest.spyOn(authService, 'changePassword').mockResolvedValue();
      jest.spyOn(authService, 'verifyEmail').mockResolvedValue();
      jest.spyOn(sessionService, 'hashToken').mockReturnValue('hash');
      jest.spyOn(sessionService, 'revokeSession').mockResolvedValue({ _id: 's1' });
      jest.spyOn(sessionService, 'revokeAllSessions').mockResolvedValue({});
      jest.spyOn(sessionService, 'getUserSessions').mockResolvedValue([]);

      await authController.signUp(req, res);
      expect(res.status).toHaveBeenCalledWith(201);

      await authController.signIn(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      req.body = { refreshToken: 'r' };
      await authController.refreshToken(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      await authController.logout(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      await authController.logoutAll(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      await authController.forgotPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      req.body = { token: 't', newPassword: 'Pass' };
      await authController.resetPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      req.body = { currentPassword: 'Old', newPassword: 'New' };
      await authController.changePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      req.body = { token: 'vt' };
      await authController.verifyEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      await authController.resendVerification(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      await authController.getSessions(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      req.params = { id: 's1' };
      await authController.revokeSession(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('SubscriptionController', () => {
    test('all subscription endpoint handlers', async () => {
      jest.spyOn(subscriptionService, 'createSubscription').mockResolvedValue({ subscription: {} });
      jest.spyOn(subscriptionService, 'getUserSubscriptions').mockResolvedValue([]);
      jest.spyOn(subscriptionService, 'getAllSubscriptions').mockResolvedValue([]);
      jest.spyOn(subscriptionService, 'getSubscriptionDetails').mockResolvedValue({});
      jest.spyOn(subscriptionService, 'updateSubscription').mockResolvedValue({});
      jest.spyOn(subscriptionService, 'toggleFavorite').mockResolvedValue({});
      jest.spyOn(subscriptionService, 'togglePin').mockResolvedValue({});
      jest.spyOn(subscriptionService, 'archiveSubscription').mockResolvedValue({});
      jest.spyOn(subscriptionService, 'restoreSubscription').mockResolvedValue({});
      jest.spyOn(subscriptionService, 'deleteSubscription').mockResolvedValue({});
      jest.spyOn(subscriptionService, 'cancelSubscription').mockResolvedValue({});
      jest.spyOn(subscriptionService, 'bulkOperation').mockResolvedValue({});
      jest.spyOn(subscriptionService, 'getUpcomingRenewals').mockResolvedValue([]);

      await subscriptionController.createSubscription(req, res);
      expect(res.status).toHaveBeenCalledWith(201);

      req.params = { userId: '507f1f77bcf86cd799439011', id: 's1' };
      await subscriptionController.getUserSubscriptions(req, res);
      await subscriptionController.getAllSubscriptions(req, res);
      await subscriptionController.getSubscriptionDetails(req, res);
      await subscriptionController.updateSubscription(req, res);
      await subscriptionController.toggleFavorite(req, res);
      await subscriptionController.togglePin(req, res);
      await subscriptionController.archiveSubscription(req, res);
      await subscriptionController.restoreSubscription(req, res);
      await subscriptionController.deleteSubscription(req, res);
      await subscriptionController.cancelSubscription(req, res);
      await subscriptionController.bulkOperation(req, res);
      await subscriptionController.getUpcomingRenewals(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Taxonomy Controllers (Category, Provider, Tag, User)', () => {
    test('category, provider, tag, and user controllers', async () => {
      jest.spyOn(categoryService, 'getCategories').mockResolvedValue([]);
      jest.spyOn(categoryService, 'createCategory').mockResolvedValue({});
      jest.spyOn(categoryService, 'updateCategory').mockResolvedValue({});
      jest.spyOn(categoryService, 'deleteCategory').mockResolvedValue({});

      await categoryController.getCategories(req, res);
      await categoryController.createCategory(req, res);
      req.params = { id: 'c1' };
      await categoryController.updateCategory(req, res);
      await categoryController.deleteCategory(req, res);

      jest.spyOn(providerService, 'getProviders').mockResolvedValue([]);
      jest.spyOn(providerService, 'createProvider').mockResolvedValue({});
      jest.spyOn(providerService, 'updateProvider').mockResolvedValue({});
      jest.spyOn(providerService, 'deleteProvider').mockResolvedValue({});

      await providerController.getProviders(req, res);
      await providerController.createProvider(req, res);
      req.params = { id: 'p1' };
      await providerController.updateProvider(req, res);
      await providerController.deleteProvider(req, res);

      jest.spyOn(tagService, 'getTags').mockResolvedValue([]);
      jest.spyOn(tagService, 'createTag').mockResolvedValue({});
      jest.spyOn(tagService, 'updateTag').mockResolvedValue({});
      jest.spyOn(tagService, 'deleteTag').mockResolvedValue({});

      await tagController.getTags(req, res);
      await tagController.createTag(req, res);
      req.params = { id: 't1' };
      await tagController.updateTag(req, res);
      await tagController.deleteTag(req, res);

      jest.spyOn(userService, 'getUsers').mockResolvedValue([]);
      jest.spyOn(userService, 'getUserById').mockResolvedValue({});

      await userController.getUsers(req, res);
      req.params = { id: 'u1' };
      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Sub-document Controllers', () => {
    test('ReminderRule, SubscriptionNote, FileAsset, Timeline', async () => {
      jest.spyOn(reminderRuleService, 'addRule').mockResolvedValue({});
      jest.spyOn(reminderRuleService, 'getRules').mockResolvedValue([]);
      jest.spyOn(reminderRuleService, 'updateRule').mockResolvedValue({});
      jest.spyOn(reminderRuleService, 'deleteRule').mockResolvedValue({});

      req.params = { id: 's1', ruleId: 'r1' };
      await reminderRuleController.addRule(req, res);
      await reminderRuleController.getRules(req, res);
      await reminderRuleController.updateRule(req, res);
      await reminderRuleController.deleteRule(req, res);

      jest.spyOn(subscriptionNoteService, 'addNote').mockResolvedValue({});
      jest.spyOn(subscriptionNoteService, 'getNotes').mockResolvedValue([]);
      jest.spyOn(subscriptionNoteService, 'deleteNote').mockResolvedValue({});

      req.params = { id: 's1', noteId: 'n1' };
      await subscriptionNoteController.addNote(req, res);
      await subscriptionNoteController.getNotes(req, res);
      await subscriptionNoteController.deleteNote(req, res);

      jest.spyOn(fileAssetService, 'addFileAsset').mockResolvedValue({});
      jest.spyOn(fileAssetService, 'getFileAssets').mockResolvedValue([]);
      jest.spyOn(fileAssetService, 'deleteFileAsset').mockResolvedValue({});

      req.params = { id: 's1', fileId: 'fa1' };
      await fileAssetController.addFile(req, res);
      await fileAssetController.getFiles(req, res);
      await fileAssetController.deleteFile(req, res);

      jest.spyOn(timelineService, 'getEntityTimeline').mockResolvedValue([]);
      jest.spyOn(timelineService, 'getPriceHistory').mockResolvedValue([]);
      jest.spyOn(timelineService, 'getRenewalHistory').mockResolvedValue([]);

      req.params = { id: 's1' };
      await timelineController.getTimeline(req, res);
      await timelineController.getPriceHistory(req, res);
      await timelineController.getRenewalHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Import/Export, Analytics, Workflow Controllers', () => {
    test('Import/Export controller handlers', async () => {
      jest.spyOn(importService, 'previewImport').mockReturnValue({ valid: [], invalid: [] });
      jest.spyOn(importService, 'dryRunImport').mockResolvedValue({ valid: [], invalid: [] });
      jest.spyOn(importService, 'executeImport').mockResolvedValue({});
      jest.spyOn(exportService, 'exportJSON').mockResolvedValue([]);
      jest.spyOn(exportService, 'exportCSV').mockResolvedValue('Name,Price\n');

      req.body = { records: [] };
      await importExportController.previewImport(req, res);
      await importExportController.dryRunImport(req, res);
      await importExportController.executeImport(req, res);

      req.query = { format: 'json' };
      await importExportController.exportSubscriptions(req, res);

      req.query = { format: 'csv' };
      await importExportController.exportSubscriptions(req, res);

      expect(res.setHeader).toHaveBeenCalled();
    });

    test('Analytics & Workflow controllers', async () => {
      jest.spyOn(analyticsService, 'getSummary').mockResolvedValue({});
      jest.spyOn(analyticsService, 'getSpending').mockResolvedValue({});
      jest.spyOn(analyticsService, 'getSubscriptions').mockResolvedValue({});
      jest.spyOn(analyticsService, 'getCategories').mockResolvedValue({});
      jest.spyOn(analyticsService, 'getProviders').mockResolvedValue({});
      jest.spyOn(analyticsService, 'getRenewals').mockResolvedValue({});
      jest.spyOn(analyticsService, 'getTrials').mockResolvedValue({});
      jest.spyOn(analyticsService, 'getTrends').mockResolvedValue({});
      jest.spyOn(analyticsService, 'getPriceChanges').mockResolvedValue({});
      jest.spyOn(analyticsService, 'getInsights').mockResolvedValue({});
      jest
        .spyOn(workflowService, 'processSubscriptionReminder')
        .mockResolvedValue({ processed: true });

      await analyticsController.getSummary(req, res);
      await analyticsController.getSpending(req, res);
      await analyticsController.getSubscriptions(req, res);
      await analyticsController.getCategories(req, res);
      await analyticsController.getProviders(req, res);
      await analyticsController.getRenewals(req, res);
      await analyticsController.getTrials(req, res);
      await analyticsController.getTrends(req, res);
      await analyticsController.getPriceChanges(req, res);
      await analyticsController.getInsights(req, res);

      await workflowController.sendReminders(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
