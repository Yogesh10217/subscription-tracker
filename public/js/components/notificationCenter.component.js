import { notificationsApi } from '../api/notifications.api.js';
import { domUtils } from '../utils/dom.util.js';

export const notificationCenterComponent = {
  elements: {},
  abortController: null,
  isOpen: false,
  notifications: [],

  init() {
    // These elements will need to be added to index.html
    this.elements = {
      bellIcon: document.getElementById('notificationBellBtn'),
      badge: document.getElementById('notificationBadge'),
      dropdown: document.getElementById('notificationDropdown'),
      list: document.getElementById('notificationList'),
      markAllReadBtn: document.getElementById('markAllReadBtn')
    };

    if (this.elements.bellIcon) {
      this.elements.bellIcon.addEventListener('click', () => this.toggleDropdown());
    }

    if (this.elements.markAllReadBtn) {
      this.elements.markAllReadBtn.addEventListener('click', () => this.markAllAsRead());
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && this.elements.dropdown && !this.elements.dropdown.contains(e.target) && !this.elements.bellIcon.contains(e.target)) {
        this.closeDropdown();
      }
    });
  },

  async fetchUnreadCount() {
    try {
      const data = await notificationsApi.getUnreadCount();
      const count = data?.count || 0;
      this.updateBadge(count);
    } catch (e) {
      console.warn('Failed to fetch unread count', e);
    }
  },

  updateBadge(count) {
    if (!this.elements.badge) return;
    if (count > 0) {
      this.elements.badge.textContent = count > 99 ? '99+' : count;
      this.elements.badge.hidden = false;
    } else {
      this.elements.badge.hidden = true;
    }
  },

  async toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.isOpen = true;
      if (this.elements.dropdown) {
        this.elements.dropdown.hidden = false;
        // Accessibility: set focus
        this.elements.dropdown.focus();
      }
      await this.loadNotifications();
    }
  },

  closeDropdown() {
    this.isOpen = false;
    if (this.elements.dropdown) {
      this.elements.dropdown.hidden = true;
    }
  },

  async loadNotifications() {
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    try {
      this.renderLoading();
      this.notifications = await notificationsApi.getAll({}, this.abortController.signal);
      this.renderList();
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.renderError();
      }
    }
  },

  async markAsRead(id) {
    try {
      await notificationsApi.markAsRead(id);
      // Update local state and re-render without full fetch
      const notif = this.notifications.find(n => n._id === id);
      if (notif) notif.status = 'READ';
      this.renderList();
      this.fetchUnreadCount(); // update badge
    } catch (e) {
      domUtils.showToast('Failed to mark notification as read', 'error');
    }
  },

  async markAllAsRead() {
    try {
      await notificationsApi.markAllAsRead();
      this.notifications.forEach(n => n.status = 'READ');
      this.renderList();
      this.updateBadge(0);
    } catch (e) {
      domUtils.showToast('Failed to mark all as read', 'error');
    }
  },

  renderLoading() {
    if (this.elements.list) {
      this.elements.list.innerHTML = '<div class="notification-item loading">Loading...</div>';
    }
  },

  renderError() {
    if (this.elements.list) {
      this.elements.list.innerHTML = '<div class="notification-item error">Failed to load notifications</div>';
    }
  },

  renderList() {
    if (!this.elements.list) return;

    if (!this.notifications || this.notifications.length === 0) {
      this.elements.list.innerHTML = '<div class="notification-empty">No notifications</div>';
      return;
    }

    this.elements.list.innerHTML = this.notifications.map(n => {
      const isUnread = n.status !== 'READ';
      return `
        <div class="notification-item ${isUnread ? 'unread' : ''}" data-id="${n._id}">
          <div class="notification-title">${domUtils.escapeHTML(n.title)}</div>
          <div class="notification-body">${domUtils.escapeHTML(n.message)}</div>
          ${isUnread ? `<button class="btn btn-ghost btn-sm mark-read-btn" onclick="window.subpulseApp.markNotificationRead('${n._id}')">Mark Read</button>` : ''}
        </div>
      `;
    }).join('');
  },

  destroy() {
    if (this.abortController) this.abortController.abort();
  }
};
