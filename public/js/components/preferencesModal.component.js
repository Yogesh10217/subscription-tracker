import { notificationPreferencesApi } from '../api/notification-preferences.api.js';
import { domUtils } from '../utils/dom.util.js';

export const preferencesModalComponent = {
  elements: {},
  abortController: null,

  init() {
    this.elements = {
      modal: document.getElementById('preferencesModal'),
      closeBtn: document.getElementById('closePreferencesModalBtn'),
      form: document.getElementById('preferencesForm'),
      emailToggle: document.getElementById('emailNotifToggle'),
      inAppToggle: document.getElementById('inAppNotifToggle')
    };

    if (this.elements.closeBtn) {
      this.elements.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.elements.form) {
      this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // Accessibility: ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.elements.modal && !this.elements.modal.hidden) {
        this.close();
      }
    });
  },

  async open() {
    if (this.elements.modal) {
      this.elements.modal.hidden = false;
      this.elements.closeBtn.focus();
    }
    
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    try {
      const prefs = await notificationPreferencesApi.get(this.abortController.signal);
      if (prefs) {
        if (this.elements.emailToggle) this.elements.emailToggle.checked = prefs.emailEnabled;
        if (this.elements.inAppToggle) this.elements.inAppToggle.checked = prefs.inAppEnabled;
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        domUtils.showToast('Failed to load preferences', 'error');
      }
    }
  },

  close() {
    if (this.elements.modal) {
      this.elements.modal.hidden = true;
    }
  },

  async handleSubmit(e) {
    e.preventDefault();
    const payload = {
      emailEnabled: this.elements.emailToggle?.checked || false,
      inAppEnabled: this.elements.inAppToggle?.checked || false
    };

    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    try {
      await notificationPreferencesApi.update(payload, this.abortController.signal);
      domUtils.showToast('Preferences updated successfully', 'success');
      this.close();
    } catch (e) {
      if (e.name !== 'AbortError') {
        domUtils.showToast('Failed to update preferences', 'error');
      }
    }
  },

  destroy() {
    if (this.abortController) this.abortController.abort();
  }
};
