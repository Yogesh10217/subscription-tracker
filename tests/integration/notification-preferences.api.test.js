import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import userRepository from '#repositories/user.repository.js';
import notificationPreferenceRepository from '#notifications/repositories/notification-preference.repository.js';
import { generateTestToken } from '../helpers/auth-helper.js';

describe('Notification Preferences API Integration Tests', () => {
  let token;

  beforeEach(() => {
    jest.restoreAllMocks();
    token = generateTestToken();
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'john@example.com',
      role: 'user'
    });
  });

  test('GET /api/v1/notification-preferences should return user preferences', async () => {
    jest.spyOn(notificationPreferenceRepository, 'findByUserId').mockResolvedValue({
      user: '507f1f77bcf86cd799439011',
      emailEnabled: true,
      inAppEnabled: true
    });

    const res = await request(app)
      .get('/api/v1/notification-preferences')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.emailEnabled).toBe(true);
  });

  test('PUT /api/v1/notification-preferences should update user preferences', async () => {
    jest.spyOn(notificationPreferenceRepository, 'updateByUserId').mockResolvedValue({
      user: '507f1f77bcf86cd799439011',
      emailEnabled: false
    });

    const res = await request(app)
      .put('/api/v1/notification-preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ emailEnabled: false });

    expect(res.status).toBe(200);
    expect(res.body.data.emailEnabled).toBe(false);
  });
});
