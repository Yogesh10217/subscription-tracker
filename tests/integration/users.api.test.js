import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import userRepository from '#repositories/user.repository.js';
import { generateTestToken } from '../helpers/auth-helper.js';

describe('Users API Integration Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest
      .spyOn(userRepository, 'findByIdRaw')
      .mockResolvedValue({ _id: '507f1f77bcf86cd799439011' });
  });

  test('GET /api/v1/users should return 200 array response', async () => {
    jest
      .spyOn(userRepository, 'findAll')
      .mockResolvedValue([
        { _id: '507f1f77bcf86cd799439011', name: 'John Doe', email: 'john@example.com' }
      ]);

    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/v1/users/:id should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/v1/users/507f1f77bcf86cd799439011');
    expect(res.status).toBe(401);
  });

  test('GET /api/v1/users/:id should return user details when authorized', async () => {
    const token = generateTestToken('507f1f77bcf86cd799439011');
    jest.spyOn(userRepository, 'findById').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      name: 'John Doe',
      email: 'john@example.com'
    });

    const res = await request(app)
      .get('/api/v1/users/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('John Doe');
  });
});
