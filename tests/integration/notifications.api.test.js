import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import userRepository from '#repositories/user.repository.js';
import notificationRepository from '#notifications/repositories/notification.repository.js';
import emailProvider from '#notifications/providers/email.provider.js';
import Notification from '#notifications/models/notification.model.js';
import { generateTestToken } from '../helpers/auth-helper.js';

describe('Notifications API Integration Tests', () => {
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

  test('GET /api/v1/notifications should return user in-app notifications', async () => {
    jest.spyOn(notificationRepository, 'findByUser').mockResolvedValue({
      items: [
        {
          _id: '507f1f77bcf86cd799439099',
          title: 'Test Notification',
          body: 'Test Body',
          deliveryStatus: 'DELIVERED',
          readAt: null
        }
      ],
      total: 1
    });

    const res = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items.length).toBe(1);
  });

  test('GET /api/v1/notifications/unread/count should return unread count', async () => {
    jest.spyOn(notificationRepository, 'countUnread').mockResolvedValue(3);

    const res = await request(app)
      .get('/api/v1/notifications/unread/count')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.unreadCount).toBe(3);
  });

  test('PATCH /api/v1/notifications/:id/read should mark notification as read', async () => {
    jest.spyOn(notificationRepository, 'markRead').mockResolvedValue({
      _id: '507f1f77bcf86cd799439099',
      readAt: new Date()
    });

    const res = await request(app)
      .patch('/api/v1/notifications/507f1f77bcf86cd799439099/read')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.readAt).toBeDefined();
  });

  test('POST /api/v1/notifications/worker should process job payload', async () => {
    jest.spyOn(notificationRepository, 'findById').mockResolvedValue({
      _id: '507f1f77bcf86cd799439099',
      user: '507f1f77bcf86cd799439011',
      channel: 'EMAIL',
      title: 'Title',
      body: 'Body',
      deliveryStatus: 'SCHEDULED'
    });
    jest.spyOn(notificationRepository, 'markProcessing').mockResolvedValue({});
    jest.spyOn(notificationRepository, 'markSent').mockResolvedValue({});
    jest.spyOn(emailProvider, 'send').mockResolvedValue({ success: true, messageId: 'msg_101' });

    const res = await request(app)
      .post('/api/v1/notifications/worker')
      .send({ notificationId: '507f1f77bcf86cd799439099' });

    expect(res.status).toBe(200);
    expect(res.body.data.success).toBe(true);
  });
});
