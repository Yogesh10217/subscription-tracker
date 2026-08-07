import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import userRepository from '#repositories/user.repository.js';

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('POST /api/v1/auth/sign-up should reject invalid payload with 422', async () => {
    const res = await request(app).post('/api/v1/auth/sign-up').send({ email: 'bad-email' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/v1/auth/sign-in should reject non-existent user with 404', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/auth/sign-in')
      .send({ email: 'notfound@example.com', password: 'password123' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
