import request from 'supertest';
import app from '../../src/app.js';

describe('Workflows API Integration Tests', () => {
  test('POST /api/v1/workflows/subscription/reminder should reject missing subscriptionId', async () => {
    const res = await request(app).post('/api/v1/workflows/subscription/reminder').send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
