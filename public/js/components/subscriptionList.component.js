import { subscriptionsApi } from '../api/subscriptions.api.js';
import { currencyUtils } from '../utils/currency.util.js';
import { domUtils } from '../utils/dom.util.js';

export const subscriptionListComponent = {
  elements: {},
  abortController: null,
  subscriptions: [],
  filters: {
    search: '',
    category: 'All',
    status: 'All',
    sortBy: 'renewalSoon'
  },
  onSubscriptionsChanged: null,

  init(onSubscriptionsChangedCallback) {
    this.onSubscriptionsChanged = onSubscriptionsChangedCallback;
    
    this.elements = {
      grid: document.getElementById('subscriptionsGrid'),
      resultsCount: document.getElementById('resultsCount'),
      emptyState: document.getElementById('emptyState'),
      emptyStateMsg: document.getElementById('emptyStateMsg'),
      searchInput: document.getElementById('searchInput'),
      clearSearchBtn: document.getElementById('clearSearchBtn'),
      categoryFilter: document.getElementById('categoryFilter'),
      statusFilter: document.getElementById('statusFilter'),
      sortBy: document.getElementById('sortBy')
    };

    this.bindEvents();
  },

  bindEvents() {
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.toLowerCase().trim();
        if (this.elements.clearSearchBtn) {
          this.elements.clearSearchBtn.hidden = !this.filters.search;
        }
        this.render();
      });
    }

    if (this.elements.clearSearchBtn) {
      this.elements.clearSearchBtn.addEventListener('click', () => {
        if (this.elements.searchInput) this.elements.searchInput.value = '';
        this.filters.search = '';
        this.elements.clearSearchBtn.hidden = true;
        this.render();
      });
    }

    if (this.elements.categoryFilter) {
      this.elements.categoryFilter.addEventListener('change', (e) => {
        this.filters.category = e.target.value;
        this.render();
      });
    }

    if (this.elements.statusFilter) {
      this.elements.statusFilter.addEventListener('change', (e) => {
        this.filters.status = e.target.value;
        this.render();
      });
    }

    if (this.elements.sortBy) {
      this.elements.sortBy.addEventListener('change', (e) => {
        this.filters.sortBy = e.target.value;
        this.render();
      });
    }
  },

  async load() {
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    try {
      if (this.elements.grid) this.elements.grid.innerHTML = '<div class="loading-pulse">Loading subscriptions...</div>';
      
      // Map UI filters to backend QueryBuilder API contract
      const params = {
        limit: 50 // UI does not have pagination yet, fetch a large chunk
      };
      
      if (this.filters.search) params.search = this.filters.search;
      if (this.filters.category && this.filters.category !== 'All') params.category = this.filters.category;
      if (this.filters.status && this.filters.status !== 'All') params.status = this.filters.status;

      // Map Sort
      switch (this.filters.sortBy) {
        case 'renewalSoon':
          params.sortBy = 'renewalDate';
          params.order = 'asc';
          break;
        case 'priceHigh':
          params.sortBy = 'price';
          params.order = 'desc';
          break;
        case 'priceLow':
          params.sortBy = 'price';
          params.order = 'asc';
          break;
        case 'name':
          params.sortBy = 'name';
          params.order = 'asc';
          break;
      }

      const response = await subscriptionsApi.getAll(params, this.abortController.signal);
      
      // The backend returns an array if NO params are provided, or { subscriptions, pagination } if ANY params are provided.
      // Since we always send at least 'limit' and 'sortBy', we will get the object format.
      this.subscriptions = response.subscriptions || response || [];
      
      this.render();
      if (this.onSubscriptionsChanged) this.onSubscriptionsChanged();
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to load subscriptions:', error);
        domUtils.showToast('Failed to load subscriptions', 'error');
        if (this.elements.grid) this.elements.grid.innerHTML = '<div class="text-error">Error loading data</div>';
      }
    }
  },

  render() {
    if (!this.elements.grid) return;

    // Use the fetched subscriptions directly from backend instead of client filtering
    const filtered = this.subscriptions || [];
    
    if (this.elements.resultsCount) {
      this.elements.resultsCount.textContent = filtered.length;
    }

    if (filtered.length === 0) {
      this.elements.grid.innerHTML = '';
      if (this.elements.emptyState) {
        this.elements.emptyState.hidden = false;
        if (this.elements.emptyStateMsg) {
          const hasFilters = this.filters.search || this.filters.category !== 'All' || this.filters.status !== 'All';
          this.elements.emptyStateMsg.textContent = hasFilters 
            ? 'No subscriptions match your current filter and search settings.' 
            : 'You haven\'t added any subscriptions yet. Click below to add your first!';
        }
      }
      return;
    }

    if (this.elements.emptyState) this.elements.emptyState.hidden = true;

    this.elements.grid.innerHTML = filtered.map(sub => {
      const formattedPrice = currencyUtils.format(sub.price, sub.currency);
      const initials = (sub.name || 'Sub').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      
      const statusClass = sub.status === 'Active' ? 'active-pill' : (sub.status === 'expired' ? 'expired-pill' : 'cancelled-pill');
      
      // Compute simple days remaining purely for presentation
      let daysLeftText = '-- days left';
      let pctElapsed = 0;
      if (sub.renewalDate && sub.startDate) {
        const now = new Date();
        const start = new Date(sub.startDate);
        const renewal = new Date(sub.renewalDate);
        const totalDuration = Math.max(1, renewal - start);
        const elapsed = Math.max(0, now - start);
        pctElapsed = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
        const daysLeft = Math.max(0, Math.ceil((renewal - now) / (1000 * 60 * 60 * 24)));
        daysLeftText = `${daysLeft} days left`;
      }

      return `
        <div class="sub-card glass-card">
          <div class="sub-card-header">
            <div class="sub-brand-wrapper">
              <div class="sub-logo-avatar" style="background: ${this.getBrandGradient(sub.category)};">
                ${domUtils.escapeHTML(initials)}
              </div>
              <div class="sub-meta">
                <span class="sub-title">${domUtils.escapeHTML(sub.name)}</span>
                <span class="sub-category-tag">${domUtils.escapeHTML(sub.category || 'Subscription')}</span>
              </div>
            </div>
            <span class="status-pill ${statusClass}">${domUtils.escapeHTML(sub.status)}</span>
          </div>
          <div class="sub-pricing">
            <span class="price-amount">${domUtils.escapeHTML(formattedPrice)}</span>
            <span class="price-cycle">/ ${sub.frequency ? sub.frequency.toLowerCase() : 'month'}</span>
          </div>
          <div class="sub-progress-section">
            <div class="progress-info">
              <span>Renewal Progress</span>
              <span class="days-remaining">${daysLeftText}</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${pctElapsed}%; background: ${pctElapsed > 85 ? 'var(--accent-rose)' : 'var(--primary-violet)'}"></div>
            </div>
          </div>
          <div class="sub-card-actions">
            <span class="payment-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              ${domUtils.escapeHTML(sub.paymentMethod || 'Credit Card')}
            </span>
            <div class="action-btns">
              <button class="action-icon-btn" title="Edit Subscription" onclick="window.subpulseApp.editSub('${sub._id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              ${sub.status === 'Active' ? `
                <button class="action-icon-btn" title="Cancel Subscription" onclick="window.subpulseApp.cancelSub('${sub._id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                  </svg>
                </button>
              ` : ''}
              <button class="action-icon-btn delete" title="Delete Subscription" onclick="window.subpulseApp.deleteSub('${sub._id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  getBrandGradient(cat) {
    switch (cat) {
      case 'Entertainment': return 'linear-gradient(135deg, #ec4899, #8b5cf6)';
      case 'Productivity': return 'linear-gradient(135deg, #6366f1, #06b6d4)';
      case 'Education': return 'linear-gradient(135deg, #f59e0b, #ec4899)';
      case 'Health': return 'linear-gradient(135deg, #10b981, #06b6d4)';
      default: return 'linear-gradient(135deg, #374151, #4b5563)';
    }
  },

  destroy() {
    if (this.abortController) this.abortController.abort();
  }
};
