import { authState } from './state/auth.state.js';
import { dashboardComponent } from './components/dashboard.component.js';
import { subscriptionListComponent } from './components/subscriptionList.component.js';
import { notificationCenterComponent } from './components/notificationCenter.component.js';
import { preferencesModalComponent } from './components/preferencesModal.component.js';
import { modalsComponent } from './components/modals.component.js';
import { subscriptionsApi } from './api/subscriptions.api.js';
import { apiClient } from './api/apiClient.js';
import { domUtils } from './utils/dom.util.js';

class App {
  constructor() {
    this.currency = 'USD';
  }

  async init() {
    // Initialize components
    dashboardComponent.init();
    subscriptionListComponent.init(() => this.onDataMutated());
    notificationCenterComponent.init();
    preferencesModalComponent.init();
    modalsComponent.init(() => this.onDataMutated());

    this.bindGlobalEvents();
    
    // Subscribe to auth changes
    authState.subscribe((user, isAuthenticated) => this.onAuthStateChanged(user, isAuthenticated));

    // Try silent token refresh on app startup using httpOnly cookie
    try {
      await apiClient.executeRefresh();
    } catch (_err) {
      // Non-fatal silent refresh failure for unauthenticated visitors
    }

    if (authState.isAuthenticated()) {
      await this.loadApplicationData();
    } else {
      this.setSystemStatus(false, 'Not Authenticated');
    }

    // Expose global methods for inline HTML event handlers
    window.subpulseApp = {
      applyPreset: (idx) => this.applyPreset(idx),
      editSub: (id) => this.editSub(id),
      cancelSub: (id) => this.cancelSub(id),
      deleteSub: (id) => this.deleteSub(id),
      markNotificationRead: (id) => notificationCenterComponent.markAsRead(id)
    };
  }

  bindGlobalEvents() {
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
      currencySelect.addEventListener('change', (e) => {
        this.currency = e.target.value;
        this.loadApplicationData();
      });
    }

    const openAddModalBtn = document.getElementById('openAddModalBtn');
    if (openAddModalBtn) {
      openAddModalBtn.addEventListener('click', () => modalsComponent.openAddSubModal());
    }

    const emptyStateActionBtn = document.getElementById('emptyStateActionBtn');
    if (emptyStateActionBtn) {
      emptyStateActionBtn.addEventListener('click', () => modalsComponent.openAddSubModal());
    }

    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', () => {
        if (authState.isAuthenticated()) {
          if (confirm('Do you want to log out?')) {
            authApi.logout().then(() => domUtils.showToast('Logged out successfully', 'info'));
          }
        } else {
          modalsComponent.openAuthModal();
        }
      });
    }

    // Listen to component events
    window.addEventListener('subpulse:auth-success', () => {
      this.loadApplicationData();
    });

    window.addEventListener('subpulse:auth-failure', () => {
      this.setSystemStatus(false, 'Session Expired');
      modalsComponent.openAuthModal();
    });
  }

  onAuthStateChanged(user, isAuthenticated) {
    const avatarInitials = document.getElementById('avatarInitials');
    if (isAuthenticated && user) {
      this.setSystemStatus(true, 'Connected to API');
      if (avatarInitials) {
        avatarInitials.textContent = (user.name || user.email || 'U').substring(0, 2).toUpperCase();
      }
    } else {
      this.setSystemStatus(false, 'Logged Out');
      if (avatarInitials) {
        avatarInitials.textContent = '--';
      }
      
      // Clear views
      const grid = document.getElementById('subscriptionsGrid');
      if (grid) grid.innerHTML = '';
      dashboardComponent.renderErrorState();
    }
  }

  async loadApplicationData() {
    if (!authState.isAuthenticated()) return;
    
    // Load dashboard analytics and subscription list in parallel
    await Promise.allSettled([
      dashboardComponent.load(this.currency),
      subscriptionListComponent.load(),
      notificationCenterComponent.fetchUnreadCount()
    ]);
  }

  async onDataMutated() {
    // When a subscription is added/edited/deleted, reload both dashboard analytics and subscription list
    await Promise.all([
      dashboardComponent.load(this.currency),
      subscriptionListComponent.load()
    ]);
  }

  setSystemStatus(connected, text) {
    const statusText = document.getElementById('statusText');
    const badge = document.getElementById('systemStatusBadge');
    
    if (statusText) statusText.textContent = text;
    if (badge) {
      badge.style.borderColor = connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)';
    }
  }

  // --- Inline Actions ---
  applyPreset(idx) {
    // (Implementation similar to original app.js, using PRESETS constant)
    domUtils.showToast('Presets feature moved to modular component (TODO)', 'info');
  }

  editSub(id) {
    const sub = subscriptionListComponent.subscriptions.find(s => s._id === id);
    if (sub) {
      modalsComponent.openEditSubModal(sub);
    }
  }

  async cancelSub(id) {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await subscriptionsApi.cancel(id);
      domUtils.showToast('Subscription cancelled', 'info');
      this.loadApplicationData();
    } catch (e) {
      domUtils.showToast('Failed to cancel subscription', 'error');
    }
  }

  async deleteSub(id) {
    if (!confirm('Are you sure you want to permanently delete this subscription?')) return;
    try {
      await subscriptionsApi.delete(id);
      domUtils.showToast('Subscription deleted', 'success');
      this.loadApplicationData();
    } catch (e) {
      domUtils.showToast('Failed to delete subscription', 'error');
    }
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
