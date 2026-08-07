import request from 'supertest';
import app from '../../src/app.js';

describe('Health & Observability API Integration Tests', () => {
  test('GET /health should return 200 with UP status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.environment).toBeDefined();
    expect(res.headers['x-request-id']).toBeDefined();
  });

  test('GET /ready should return status status probe', async () => {
    const res = await request(app).get('/ready');
    expect([200, 503]).toContain(res.status);
  });

  test('GET /live should return 200 with ALIVE status', async () => {
    const res = await request(app).get('/live');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ALIVE');
  });
});
