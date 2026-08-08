/**
 * @file import.service.js
 * @module services/import.service
 * @description Multi-stage CSV/JSON import engine (Validation -> Preview -> Dry Run -> Import -> Rollback Report).
 */

import subscriptionRepository from '../repositories/subscription.repository.js';
import timelineService from './timeline.service.js';
import ApiError from '../utils/api-error.js';

export const importService = {
  /**
   * Validates and parses raw array of records.
   * @param {Array<Object>} records
   * @returns {Object} Validation summary
   */
  validateRecords(records = []) {
    if (!Array.isArray(records) || records.length === 0) {
      throw ApiError.badRequest('Import dataset must be a non-empty array');
    }

    const validRecords = [];
    const invalidRecords = [];

    records.forEach((row, index) => {
      const errors = [];
      if (!row.name || typeof row.name !== 'string') errors.push('Missing or invalid name');
      if (row.price === undefined || isNaN(Number(row.price)))
        errors.push('Missing or invalid price');
      if (!row.startDate) errors.push('Missing start date');

      if (errors.length === 0) {
        validRecords.push({
          rowNumber: index + 1,
          data: {
            name: row.name.trim(),
            price: Number(row.price),
            currency: row.currency || 'USD',
            frequency: row.frequency || 'Monthly',
            category: row.category || 'Other',
            paymentMethod: row.paymentMethod || 'Credit Card',
            status: row.status || 'Active',
            startDate: new Date(row.startDate)
          }
        });
      } else {
        invalidRecords.push({ rowNumber: index + 1, data: row, errors });
      }
    });

    return {
      totalRows: records.length,
      validCount: validRecords.length,
      invalidCount: invalidRecords.length,
      validRecords,
      invalidRecords
    };
  },

  /**
   * Previews import without modifying database state.
   * @param {Array<Object>} records
   * @returns {Object} Preview envelope
   */
  previewImport(records = []) {
    const summary = this.validateRecords(records);
    return {
      mode: 'PREVIEW',
      summary
    };
  },

  /**
   * Dry Run mode simulating database creation.
   * @param {Array<Object>} records
   * @param {string} userId
   * @returns {Object} Dry run summary
   */
  async dryRunImport(records = [], userId) {
    const summary = this.validateRecords(records);
    const existing = await subscriptionRepository.findByUserId(userId);
    const existingNames = new Set(existing.map((s) => s.name.toLowerCase()));

    const duplicates = [];
    const newItems = [];

    summary.validRecords.forEach((item) => {
      if (existingNames.has(item.data.name.toLowerCase())) {
        duplicates.push(item);
      } else {
        newItems.push(item);
      }
    });

    return {
      mode: 'DRY_RUN',
      totalCount: summary.totalRows,
      creatableCount: newItems.length,
      duplicateCount: duplicates.length,
      invalidCount: summary.invalidCount,
      validRecords: summary.validRecords,
      duplicates,
      invalidRecords: summary.invalidRecords
    };
  },

  /**
   * Executes full import pipeline and records timeline events.
   * @param {Array<Object>} records
   * @param {string} userId
   * @param {Object} [options={ skipDuplicates: false }]
   * @returns {Promise<Object>} Import execution result & rollback token
   */
  async executeImport(records = [], userId, options = { skipDuplicates: false }) {
    const dryRun = await this.dryRunImport(records, userId);
    const created = [];
    const skipped = [];
    const rollbackToken = `ROLLBACK_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    for (const item of dryRun.duplicates) {
      if (options.skipDuplicates) {
        skipped.push({ rowNumber: item.rowNumber, reason: 'Duplicate subscription name' });
      }
    }

    const itemsToCreate = options.skipDuplicates
      ? dryRun.validRecords.filter(
          (r) => !dryRun.duplicates.some((d) => d.rowNumber === r.rowNumber)
        )
      : dryRun.validRecords;

    for (const item of itemsToCreate) {
      const doc = await subscriptionRepository.create({
        ...item.data,
        user: userId
      });

      await timelineService.recordEvent({
        entityId: doc._id,
        user: userId,
        eventType: 'IMPORTED',
        actor: userId,
        newValues: doc.toObject ? doc.toObject() : doc,
        metadata: { rollbackToken, rowNumber: item.rowNumber }
      });

      created.push(doc);
    }

    return {
      mode: 'IMPORT_EXECUTION',
      rollbackToken,
      importedCount: created.length,
      skippedCount: skipped.length,
      invalidCount: dryRun.invalidCount,
      importedItems: created,
      skippedItems: skipped
    };
  }
};

export default importService;
