// Auth State Management (In-Memory)
// Satisfies Phase 5 Constraint: Access token in memory, not localStorage.

class AuthState {
  constructor() {
    this.accessToken = null;
    this.user = null;
    this.listeners = new Set();
    
    // Attempt to recover user state from localStorage (not the token!)
    try {
      const storedUser = localStorage.getItem('subpulse_user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    } catch (e) {
      console.warn('Failed to parse stored user state');
    }
  }

  setToken(token) {
    this.accessToken = token;
  }

  getToken() {
    return this.accessToken;
  }

  setUser(user) {
    this.user = user;
    if (user) {
      localStorage.setItem('subpulse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('subpulse_user');
    }
    this.notifyListeners();
  }

  getUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  clear() {
    this.accessToken = null;
    this.setUser(null);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.user, this.isAuthenticated());
    }
  }
}

export const authState = new AuthState();
