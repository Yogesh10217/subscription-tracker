import { authState } from '../state/auth.state.js';

const API_BASE = '/api/v1';

class ApiClient {
  constructor() {
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  /**
   * Main fetch wrapper with support for AbortSignal and cookie credentials
   * @param {string} endpoint - e.g. '/subscriptions'
   * @param {Object} options - fetch options (method, body, signal, etc.)
   * @param {boolean} _retry - Internal flag to prevent infinite loops
   */
  async request(endpoint, options = {}, _retry = false) {
    const url = `${API_BASE}${endpoint}`;
    
    // Setup default headers
    const headers = new Headers(options.headers || {});
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    const token = authState.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const fetchOptions = {
      credentials: 'same-origin',
      ...options,
      headers
    };

    let response;
    try {
      response = await fetch(url, fetchOptions);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error; // Let the caller handle cancellation
      }
      throw new Error(`Network Error: ${error.message}`);
    }

    // Handle 401 Unauthorized
    if (response.status === 401) {
      // 1. If we already retried, do not try again.
      // 7. Refresh endpoint itself must never recursively trigger refresh.
      if (_retry || endpoint === '/auth/refresh') {
        this.handleAuthFailure();
        throw new Error('Unauthorized');
      }

      try {
        // 2 & 3. Wait for the shared refresh promise if it exists, otherwise create it.
        if (!this.refreshPromise) {
          this.refreshPromise = this.executeRefresh();
        }
        
        const newAccessToken = await this.refreshPromise;
        
        // 5. Retry the original request exactly once
        headers.set('Authorization', `Bearer ${newAccessToken}`);
        const retryOptions = { ...fetchOptions, headers };
        
        const retryResponse = await fetch(url, retryOptions);
        
        // 6. If retry returns 401, fail and clear state
        if (retryResponse.status === 401) {
          this.handleAuthFailure();
          throw new Error('Session expired');
        }
        
        return this.parseResponse(retryResponse);
      } catch (refreshError) {
        if (refreshError.name !== 'AbortError') {
          this.handleAuthFailure();
        }
        throw refreshError;
      }
    }

    // Handle other errors
    if (!response.ok) {
      let message = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch (e) {
        // Ignore parse error on fallback
      }
      throw new Error(message);
    }

    return this.parseResponse(response);
  }

  async parseResponse(response) {
    if (response.status === 204) return null; // No content
    const data = await response.json();
    return data.data !== undefined ? data.data : data; // Return data payload if structured
  }

  async executeRefresh() {
    try {
      // POST to refresh. credentials: 'same-origin' ensures the httpOnly refreshToken cookie is sent.
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Refresh failed');
      }

      const data = await res.json();
      const newAccessToken = data.data?.accessToken || data.accessToken;
      
      // 4. Store newly returned access token in memory
      authState.setToken(newAccessToken);
      return newAccessToken;
    } finally {
      // 8. Clear the lock so future 401s can trigger a new refresh if needed
      this.refreshPromise = null;
    }
  }

  handleAuthFailure() {
    authState.clear();
    window.dispatchEvent(new CustomEvent('subpulse:auth-failure'));
  }

  // Convenience methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
