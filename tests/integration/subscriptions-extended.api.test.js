import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import userRepository from '#repositories/user.repository.js';
import subscriptionRepository from '#repositories/subscription.repository.js';
import providerRepository from '#repositories/provider.repository.js';
import categoryRepository from '#repositories/category.repository.js';
import tagRepository from '#repositories/tag.repository.js';
import { generateTestToken } from '../helpers/auth-helper.js';

describe('Subscriptions Extended Enterprise API Integration Tests', () => {
  let token;

  beforeEach(() => {
    jest.restoreAllMocks();
    token = generateTestToken();
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'john@example.com',
      role: 'user',
      permissions: []
    });
  });

  test('GET /api/v1/providers should return provider catalog', async () => {
    jest
      .spyOn(providerRepository, 'findAllForUser')
      .mockResolvedValue([{ name: 'Netflix', slug: 'netflix', isSystem: true }]);

    const res = await request(app).get('/api/v1/providers').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/v1/categories should return category taxonomy', async () => {
    jest
      .spyOn(categoryRepository, 'findAllForUser')
      .mockResolvedValue([{ name: 'Streaming', slug: 'streaming', isSystem: true }]);

    const res = await request(app)
      .get('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/v1/tags should return tag taxonomy', async () => {
    jest
      .spyOn(tagRepository, 'findAllForUser')
      .mockResolvedValue([{ name: 'Work', slug: 'work', isSystem: true }]);

    const res = await request(app).get('/api/v1/tags').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/v1/subscriptions/bulk should execute bulk archive operation', async () => {
    jest.spyOn(subscriptionRepository, 'bulkArchive').mockResolvedValue({ modifiedCount: 2 });

    const res = await request(app)
      .post('/api/v1/subscriptions/bulk')
      .set('Authorization', `Bearer ${token}`)
      .send({ action: 'archive', ids: ['507f1f77bcf86cd799439022', '507f1f77bcf86cd799439033'] });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.modifiedCount).toBe(2);
  });

  test('POST /api/v1/subscriptions/import/preview should validate import payload', async () => {
    const res = await request(app)
      .post('/api/v1/subscriptions/import/preview')
      .set('Authorization', `Bearer ${token}`)
      .send({
        records: [
          { name: 'Netflix', price: 15.99, startDate: '2026-01-01' },
          { name: '', price: 'invalid' }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.data.summary.validCount).toBe(1);
    expect(res.body.data.summary.invalidCount).toBe(1);
  });

  test('GET /api/v1/subscriptions/export should return exported subscriptions', async () => {
    jest.spyOn(subscriptionRepository, 'findAll').mockResolvedValue([
      {
        _id: 's1',
        name: 'Netflix',
        price: 15.99,
        currency: 'USD',
        frequency: 'Monthly',
        category: 'Streaming',
        paymentMethod: 'Credit Card',
        status: 'Active'
      }
    ]);

    const res = await request(app)
      .get('/api/v1/subscriptions/export?format=json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });
});
