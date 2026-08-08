import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  getSubscriptionDetails,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals,
  toggleFavorite,
  togglePin,
  archiveSubscription,
  restoreSubscription,
  bulkOperation
} from '../controllers/subscription.controller.js';
import { getNotes, addNote, deleteNote } from '../controllers/subscription-note.controller.js';
import { getFiles, addFile, deleteFile } from '../controllers/file-asset.controller.js';
import {
  getRules,
  addRule,
  updateRule,
  deleteRule
} from '../controllers/reminder-rule.controller.js';
import {
  getTimeline,
  getPriceHistory,
  getRenewalHistory
} from '../controllers/timeline.controller.js';
import {
  previewImport,
  dryRunImport,
  executeImport,
  exportSubscriptions
} from '../controllers/import-export.controller.js';

import { validateCreateSubscription } from '../validators/subscription.validator.js';
import validateSubscriptionNote from '../validators/subscription-note.validator.js';
import validateFileAsset from '../validators/file-asset.validator.js';
import validateReminderRule from '../validators/reminder-rule.validator.js';
import validateBulkOperation from '../validators/bulk.validator.js';
import validateImportPayload from '../validators/import-export.validator.js';

const subscriptionRouter = Router();

// Import & Export Endpoints
subscriptionRouter.post('/import/preview', authMiddleware, validateImportPayload, previewImport);
subscriptionRouter.post('/import/dry-run', authMiddleware, validateImportPayload, dryRunImport);
subscriptionRouter.post('/import', authMiddleware, validateImportPayload, executeImport);
subscriptionRouter.get('/export', authMiddleware, exportSubscriptions);

// Bulk Operations Endpoint
subscriptionRouter.post('/bulk', authMiddleware, validateBulkOperation, bulkOperation);

// Core List & Read Endpoints
subscriptionRouter.get('/', authMiddleware, getAllSubscriptions);
subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);
subscriptionRouter.get('/user/:id', authMiddleware, getUserSubscriptions);
subscriptionRouter.get('/:id', getSubscriptionDetails);

// Core Creation & Update Endpoints
subscriptionRouter.post('/', authMiddleware, validateCreateSubscription, createSubscription);
subscriptionRouter.put('/:id/cancel', authMiddleware, cancelSubscription);
subscriptionRouter.put('/:id', authMiddleware, updateSubscription);
subscriptionRouter.delete('/:id', authMiddleware, deleteSubscription);

// Favorite, Pin, Archive & Restore
subscriptionRouter.post('/:id/favorite', authMiddleware, toggleFavorite);
subscriptionRouter.post('/:id/pin', authMiddleware, togglePin);
subscriptionRouter.post('/:id/archive', authMiddleware, archiveSubscription);
subscriptionRouter.post('/:id/restore', authMiddleware, restoreSubscription);

// Notes Sub-Resource Endpoints
subscriptionRouter.get('/:id/notes', authMiddleware, getNotes);
subscriptionRouter.post('/:id/notes', authMiddleware, validateSubscriptionNote, addNote);
subscriptionRouter.delete('/:id/notes/:noteId', authMiddleware, deleteNote);

// File Assets Sub-Resource Endpoints
subscriptionRouter.get('/:id/files', authMiddleware, getFiles);
subscriptionRouter.post('/:id/files', authMiddleware, validateFileAsset, addFile);
subscriptionRouter.delete('/:id/files/:fileId', authMiddleware, deleteFile);

// Reminder Rules Sub-Resource Endpoints
subscriptionRouter.get('/:id/reminders', authMiddleware, getRules);
subscriptionRouter.post('/:id/reminders', authMiddleware, validateReminderRule, addRule);
subscriptionRouter.put('/:id/reminders/:ruleId', authMiddleware, updateRule);
subscriptionRouter.delete('/:id/reminders/:ruleId', authMiddleware, deleteRule);

// Timeline & History Endpoints
subscriptionRouter.get('/:id/timeline', authMiddleware, getTimeline);
subscriptionRouter.get('/:id/price-history', authMiddleware, getPriceHistory);
subscriptionRouter.get('/:id/renewal-history', authMiddleware, getRenewalHistory);

export default subscriptionRouter;
