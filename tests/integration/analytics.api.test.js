import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import userRepository from '#repositories/user.repository.js';
import Subscription from '#models/subscription.model.js';
import TimelineEvent from '#models/timeline-event.model.js';
import { generateTestToken } from '../helpers/auth-helper.js';

describe('Analytics & Insights API Integration Tests', () => {
  let token;

  beforeEach(() => {
    jest.restoreAllMocks();
    token = generateTestToken();
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'john@example.com',
      role: 'user'
    });

    // Mock Mongoose model queries
    jest.spyOn(Subscription, 'find').mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([
        {
          _id: '507f1f77bcf86cd799439022',
          name: 'Netflix',
          price: 15.99,
          currency: 'USD',
          frequency: 'Monthly',
          category: 'Streaming',
          status: 'Active',
          renewalDate: new Date()
        }
      ])
    });

    jest
      .spyOn(Subscription, 'aggregate')
      .mockResolvedValue([{ _id: 'Active', count: 1, favorites: 0, pinned: 0, trials: 0 }]);

    jest.spyOn(Subscription, 'countDocuments').mockResolvedValue(1);

    jest.spyOn(TimelineEvent, 'find').mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([])
    });

    jest.spyOn(TimelineEvent, 'countDocuments').mockResolvedValue(0);
  });

  test('GET /api/v1/analytics/summary should return 200 dashboard summary envelope', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.metrics).toBeDefined();
  });

  test('GET /api/v1/analytics/spending should return projected vs historical spend', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/spending?period=this_month')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.projectedSpendByCurrency).toBeDefined();
  });

  test('GET /api/v1/analytics/categories should return category spend breakdown', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/categories')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/v1/analytics/providers should return provider spend breakdown', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/providers')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/v1/analytics/renewals should return upcoming renewal analytics', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/renewals')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/v1/analytics/trials should return trial conversion metrics', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/trials')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/v1/analytics/trends should return time-series trend data', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/trends')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/v1/analytics/insights should return rule-based insights', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/insights')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
