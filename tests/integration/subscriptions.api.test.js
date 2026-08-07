import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import subscriptionRepository from '#repositories/subscription.repository.js';
import userRepository from '#repositories/user.repository.js';
import { generateTestToken } from '../helpers/auth-helper.js';

describe('Subscriptions API Integration Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest
      .spyOn(userRepository, 'findByIdRaw')
      .mockResolvedValue({ _id: '507f1f77bcf86cd799439011' });
  });

  test('GET /api/v1/subscriptions should return 200 array response', async () => {
    jest
      .spyOn(subscriptionRepository, 'findAll')
      .mockResolvedValue([{ _id: '507f1f77bcf86cd799439022', name: 'Netflix', price: 15.99 }]);

    const res = await request(app).get('/api/v1/subscriptions');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/v1/subscriptions/upcoming-renewals should return 200 response', async () => {
    jest.spyOn(subscriptionRepository, 'findUpcomingRenewals').mockResolvedValue([]);

    const res = await request(app).get('/api/v1/subscriptions/upcoming-renewals');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/v1/subscriptions should reject unauthenticated request', async () => {
    const res = await request(app).post('/api/v1/subscriptions').send({});
    expect(res.status).toBe(401);
  });

  test('POST /api/v1/subscriptions should validate body payload', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/v1/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Short' });

    expect(res.status).toBe(422);
  });

  test('GET /api/v1/subscriptions/:id should return details if found', async () => {
    jest.spyOn(subscriptionRepository, 'findById').mockResolvedValue({
      _id: '507f1f77bcf86cd799439022',
      name: 'Netflix'
    });

    const res = await request(app).get('/api/v1/subscriptions/507f1f77bcf86cd799439022');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Netflix');
  });
});
