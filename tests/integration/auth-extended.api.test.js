import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import userRepository from '#repositories/user.repository.js';
import sessionRepository from '#repositories/session.repository.js';
import securityRepository from '#repositories/security.repository.js';
import { generateTestToken } from '../helpers/auth-helper.js';

describe('Enterprise Auth & Security Extended Integration Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(userRepository, 'findByIdRaw').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'john@example.com',
      role: 'user',
      permissions: []
    });
  });

  test('POST /api/v1/auth/forgot-password should return 200 success', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'john@example.com'
    });
    jest.spyOn(securityRepository, 'saveVerificationToken').mockResolvedValue({});

    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'john@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/v1/auth/reset-password should reject missing or invalid token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ token: '', newPassword: 'Short' });

    expect(res.status).toBe(400);
  });

  test('POST /api/v1/auth/verify-email should reject missing token', async () => {
    const res = await request(app).post('/api/v1/auth/verify-email').send({});

    expect(res.status).toBe(400);
  });

  test('GET /api/v1/auth/sessions should return user sessions when authenticated', async () => {
    const token = generateTestToken();
    jest
      .spyOn(sessionRepository, 'findUserSessions')
      .mockResolvedValue([
        { _id: '507f1f77bcf86cd799439033', device: 'Desktop Workstation', isCurrent: true }
      ]);

    const res = await request(app)
      .get('/api/v1/auth/sessions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  test('DELETE /api/v1/auth/sessions/:id should revoke specified session', async () => {
    const token = generateTestToken();
    jest.spyOn(sessionRepository, 'revoke').mockResolvedValue({ _id: '507f1f77bcf86cd799439033' });

    const res = await request(app)
      .delete('/api/v1/auth/sessions/507f1f77bcf86cd799439033')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/v1/auth/logout-all should revoke all sessions', async () => {
    const token = generateTestToken();
    jest.spyOn(sessionRepository, 'revokeAll').mockResolvedValue({ modifiedCount: 2 });

    const res = await request(app)
      .post('/api/v1/auth/logout-all')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
