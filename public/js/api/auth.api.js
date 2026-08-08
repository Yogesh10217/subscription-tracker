import { apiClient } from './apiClient.js';
import { authState } from '../state/auth.state.js';

export const authApi = {
  async signIn(email, password, signal) {
    const response = await apiClient.post('/auth/sign-in', { email, password }, { signal });
    // Assuming backend returns { user: {...}, accessToken: "..." } in the data payload
    // Note: The Phase 1 auth controller might return just 'accessToken' or 'token'.
    // Looking at the controller: "res.cookie('refreshToken'...); return ApiResponse.success(res, result);"
    // result contains { user, accessToken, refreshToken }. We use accessToken.
    if (response && response.accessToken) {
      authState.setToken(response.accessToken);
    } else if (response && response.token) { // Fallback if property is named token
      authState.setToken(response.token);
    }
    
    if (response && response.user) {
      authState.setUser(response.user);
    }
    
    return response;
  },

  async signUp(name, email, password, signal) {
    const response = await apiClient.post('/auth/sign-up', { name, email, password }, { signal });
    // Sign up usually sets cookies too, but we can rely on signIn for actual session if it doesn't return token immediately.
    if (response && response.tokens && response.tokens.accessToken) {
      authState.setToken(response.tokens.accessToken);
    }
    if (response && response.user) {
      authState.setUser(response.user);
    }
    return response;
  },

  async logout(signal) {
    try {
      await apiClient.post('/auth/logout', {}, { signal });
    } finally {
      // Always clear local state even if server request fails
      authState.clear();
    }
  }
};
