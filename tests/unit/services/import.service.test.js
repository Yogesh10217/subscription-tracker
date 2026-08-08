import { jest } from '@jest/globals';
import importService from '#services/import.service.js';
import subscriptionRepository from '#repositories/subscription.repository.js';
import timelineService from '#services/timeline.service.js';

describe('ImportService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('validateRecords should separate valid and invalid records', () => {
    const records = [
      { name: 'Netflix', price: 15, startDate: '2026-01-01' },
      { name: '', price: 'invalid', startDate: '' }
    ];

    const result = importService.validateRecords(records);
    expect(result.validCount).toBe(1);
    expect(result.invalidCount).toBe(1);
  });

  test('executeImport should create valid subscriptions and record timeline event', async () => {
    const records = [{ name: 'Spotify', price: 10, startDate: '2026-01-01' }];
    jest.spyOn(subscriptionRepository, 'findByUserId').mockResolvedValue([]);
    jest
      .spyOn(subscriptionRepository, 'create')
      .mockResolvedValue({ _id: 'sub123', name: 'Spotify' });
    jest.spyOn(timelineService, 'recordEvent').mockResolvedValue({});

    const result = await importService.executeImport(records, 'u123');
    expect(result.importedCount).toBe(1);
  });
});
