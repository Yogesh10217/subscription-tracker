/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { apiClient } from '../../public/js/api/apiClient.js';
import { authState } from '../../public/js/state/auth.state.js';

describe('ApiClient', () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
    authState.clear();
    apiClient.refreshPromise = null;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('attaches auth token to requests', async () => {
    authState.setToken('test-token');
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'success' })
    });

    await apiClient.get('/test');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/test',
      expect.objectContaining({
        headers: expect.any(Headers)
      })
    );

    const headersArg = fetchMock.mock.calls[0][1].headers;
    expect(headersArg.get('Authorization')).toBe('Bearer test-token');
  });

  it('handles 401 exactly once and refreshes token', async () => {
    authState.setToken('old-token');

    // First call fails with 401
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' })
    });

    // Refresh call succeeds
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { accessToken: 'new-token' } })
    });

    // Retry succeeds
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'retry success' })
    });

    const res = await apiClient.get('/test');

    expect(res).toBe('retry success');
    expect(authState.getToken()).toBe('new-token');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('fails and clears state if refresh returns 401 (no infinite loop)', async () => {
    authState.setToken('old-token');

    // First call fails with 401
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' })
    });

    // Refresh call ALSO fails with 401
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Refresh Failed' })
    });

    await expect(apiClient.get('/test')).rejects.toThrow();

    expect(fetchMock).toHaveBeenCalledTimes(2); // Initial request + 1 refresh attempt
    expect(authState.getToken()).toBeNull(); // State cleared
  });

  it('shares refresh promise for concurrent 401s (prevents race conditions)', async () => {
    authState.setToken('old-token');

    // Both initial calls fail with 401
    fetchMock.mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) });
    fetchMock.mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) });

    // Refresh succeeds with delay
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              status: 200,
              json: async () => ({ data: { accessToken: 'shared-new-token' } })
            });
          }, 10);
        })
    );

    // Retries succeed
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ data: 'A' }) });
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ data: 'B' }) });

    const [res1, res2] = await Promise.all([apiClient.get('/testA'), apiClient.get('/testB')]);

    expect(res1).toBe('A');
    expect(res2).toBe('B');

    // Total calls:
    // 2 initial failing requests
    // 1 shared refresh request
    // 2 successful retries
    // = 5 total fetch calls
    expect(fetchMock).toHaveBeenCalledTimes(5);

    // Verify refresh endpoint was hit exactly once
    const refreshCalls = fetchMock.mock.calls.filter((call) => call[0] === '/api/v1/auth/refresh');
    expect(refreshCalls).toHaveLength(1);

    expect(authState.getToken()).toBe('shared-new-token');
  });
});
