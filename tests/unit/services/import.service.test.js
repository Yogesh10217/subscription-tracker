import { jest } from '@jest/globals';
import importService from '#services/import.service.js';
import subscriptionRepository from '#repositories/subscription.repository.js';
import timelineService from '#services/timeline.service.js';
import ApiError from '#utils/api-error.js';

describe('ImportService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('validateRecords should separate valid and invalid records', () => {
    expect(() => importService.validateRecords([])).toThrow(ApiError);

    const records = [
      { name: 'Netflix', price: 15, startDate: '2026-01-01' },
      { name: '', price: 'invalid', startDate: '' }
    ];

    const result = importService.validateRecords(records);
    expect(result.validCount).toBe(1);
    expect(result.invalidCount).toBe(1);

    const preview = importService.previewImport(records);
    expect(preview.mode).toBe('PREVIEW');
  });

  test('dryRunImport and executeImport should detect duplicates and handle skipDuplicates options', async () => {
    const records = [{ name: 'Spotify', price: 10, startDate: '2026-01-01' }];
    jest.spyOn(subscriptionRepository, 'findByUserId').mockResolvedValue([{ name: 'spotify' }]);
    jest
      .spyOn(subscriptionRepository, 'create')
      .mockResolvedValue({ _id: 'sub123', name: 'Spotify' });
    jest.spyOn(timelineService, 'recordEvent').mockResolvedValue({});

    const dryRun = await importService.dryRunImport(records, 'u123');
    expect(dryRun.duplicateCount).toBe(1);

    const skippedRes = await importService.executeImport(records, 'u123', { skipDuplicates: true });
    expect(skippedRes.skippedCount).toBe(1);
    expect(skippedRes.importedCount).toBe(0);

    const importedRes = await importService.executeImport(records, 'u123', {
      skipDuplicates: false
    });
    expect(importedRes.importedCount).toBe(1);
  });
});
