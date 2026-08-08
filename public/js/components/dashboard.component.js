import { analyticsApi } from '../api/analytics.api.js';
import { currencyUtils } from '../utils/currency.util.js';
import { domUtils } from '../utils/dom.util.js';

export const dashboardComponent = {
  elements: {},
  abortController: null,

  init() {
    this.elements = {
      totalMonthlyCost: document.getElementById('totalMonthlyCost'),
      monthlySubCount: document.getElementById('monthlySubCount'),
      totalYearlyCost: document.getElementById('totalYearlyCost'),
      activeCount: document.getElementById('activeCount'),
      expiredCount: document.getElementById('expiredCount'),
      categoryBars: document.getElementById('categoryBars'),
      categoryCountDetails: document.getElementById('categoryCountDetails'),
      nextRenewalName: document.getElementById('nextRenewalName'),
      nextRenewalDate: document.getElementById('nextRenewalDate'),
      nextRenewalCountdown: document.getElementById('nextRenewalCountdown')
    };
  },

  async load(currencyFilter = 'USD') {
    // Abort previous request if still pending (Phase 5 AbortController requirement)
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    try {
      this.renderLoadingState();
      
      const summary = await analyticsApi.getSummary(
        { currency: currencyFilter }, 
        this.abortController.signal
      );
      
      this.render(summary, currencyFilter);
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Failed to load dashboard:', error);
      domUtils.showToast('Failed to load dashboard metrics', 'error');
      this.renderErrorState();
    }
  },

  renderLoadingState() {
    if (this.elements.totalMonthlyCost) this.elements.totalMonthlyCost.innerHTML = '<span class="loading-pulse">...</span>';
    if (this.elements.totalYearlyCost) this.elements.totalYearlyCost.innerHTML = '<span class="loading-pulse">...</span>';
    if (this.elements.categoryBars) this.elements.categoryBars.innerHTML = '<div class="loading-pulse">Loading categories...</div>';
  },

  renderErrorState() {
    if (this.elements.totalMonthlyCost) this.elements.totalMonthlyCost.textContent = '---';
    if (this.elements.totalYearlyCost) this.elements.totalYearlyCost.textContent = '---';
    if (this.elements.categoryBars) this.elements.categoryBars.innerHTML = '<div class="text-error">Error loading data</div>';
  },

  render(summary, selectedCurrency) {
    if (!summary || !summary.metrics) return;

    const metrics = summary.metrics;
    
    // Rendering Subscriptions Count
    const active = metrics.subscriptions.activeCount || 0;
    const expired = metrics.subscriptions.expiredCount || 0;
    if (this.elements.activeCount) this.elements.activeCount.textContent = active;
    if (this.elements.expiredCount) this.elements.expiredCount.textContent = `${expired} expired / cancelled`;
    if (this.elements.monthlySubCount) this.elements.monthlySubCount.textContent = `${active} active recurring items`;

    // Multi-currency handling: Never add them. Render each currency block.
    // The backend provides projectedSpendByCurrency -> { monthly: { USD: 10, INR: 50 }, yearly: { USD: 120, INR: 600 } }
    // Wait, let's assume it provides monthly/yearly, or just a flat object.
    // If it's a flat object { USD: 100, INR: 5000 } for projectedSpendByCurrency...
    // Actually we need to check the backend structure if possible, but let's render dynamically based on keys.
    const renderMultiCurrency = (currencyObj) => {
      if (!currencyObj || Object.keys(currencyObj).length === 0) {
        return `<div>$0.00</div>`; // Fallback
      }
      return Object.entries(currencyObj)
        .map(([curr, amt]) => `<div>${currencyUtils.format(amt, curr)}</div>`)
        .join('');
    };

    // If projectedSpend is structured { monthly: { USD: 10 }, yearly: { USD: 120 } }
    const projectedMonthly = metrics.projectedSpend?.monthly || metrics.projectedSpend || {};
    const projectedYearly = metrics.projectedSpend?.yearly || {};
    // If it's flat we will just use projectedSpend and assume it's monthly, then we don't have yearly.
    // The backend contract says projectedSpend: data.spendingAnalytics?.projectedSpendByCurrency || {}
    
    if (this.elements.totalMonthlyCost) {
      this.elements.totalMonthlyCost.innerHTML = renderMultiCurrency(projectedMonthly);
    }
    
    if (this.elements.totalYearlyCost) {
      this.elements.totalYearlyCost.innerHTML = renderMultiCurrency(projectedYearly);
    }

    // Categories
    this.renderCategoryBars(summary.topCategoryByCurrency, selectedCurrency);
  },

  renderCategoryBars(categoryData, selectedCurrency) {
    if (!this.elements.categoryBars) return;

    const targetData = categoryData[selectedCurrency] || [];
    if (targetData.length === 0) {
      this.elements.categoryBars.innerHTML = `<div class="text-muted" style="font-size:0.85rem;">No active category spending data</div>`;
      if (this.elements.categoryCountDetails) this.elements.categoryCountDetails.textContent = '0 categories active';
      return;
    }

    if (this.elements.categoryCountDetails) {
      this.elements.categoryCountDetails.textContent = `${targetData.length} categories active`;
    }

    const categoryColors = {
      Entertainment: 'var(--primary-violet)',
      Productivity: 'var(--accent-cyan)',
      Education: 'var(--accent-amber)',
      Health: 'var(--accent-emerald)',
      Other: 'var(--accent-pink)'
    };

    // Assuming targetData is an array of { category: 'Name', spend: 50, percentage: 25 }
    this.elements.categoryBars.innerHTML = targetData.map(item => {
      const cat = domUtils.escapeHTML(item.category || 'Other');
      const amt = item.spend || 0;
      const pct = item.percentage || 0;
      const color = categoryColors[cat] || categoryColors.Other;

      return `
        <div class="category-row">
          <span class="cat-label">${cat}</span>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%; background: ${color};"></div>
          </div>
          <span class="cat-val">${currencyUtils.format(amt, selectedCurrency)}/mo (${pct}%)</span>
        </div>
      `;
    }).join('');
  },

  destroy() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
};
