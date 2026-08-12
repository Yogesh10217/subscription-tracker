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
    const subs = metrics.subscriptions || {};
    const active = subs.Active !== undefined ? subs.Active : (subs.activeCount !== undefined ? subs.activeCount : (subs.total || 0));
    const expired = (subs.Expired || 0) + (subs.expired || 0) + (subs.Cancelled || 0) + (subs.expiredCount || 0);

    if (this.elements.activeCount) this.elements.activeCount.textContent = active;
    if (this.elements.expiredCount) this.elements.expiredCount.textContent = `${expired} expired / cancelled`;
    if (this.elements.monthlySubCount) this.elements.monthlySubCount.textContent = `${active} active recurring items`;

    // Multi-currency handling for Monthly and Yearly projected spend
    const spendObj = metrics.projectedSpend || {};

    const renderMonthlyCurrency = (currencyMap) => {
      if (!currencyMap || Object.keys(currencyMap).length === 0) {
        return `<div>$0.00</div>`;
      }
      return Object.entries(currencyMap)
        .map(([curr, val]) => {
          const amt = typeof val === 'number' ? val : (val.projectedMonthlySpend || val.monthly || 0);
          return `<div>${currencyUtils.format(amt, curr)}</div>`;
        })
        .join('');
    };

    const renderYearlyCurrency = (currencyMap) => {
      if (!currencyMap || Object.keys(currencyMap).length === 0) {
        return `<div>$0.00</div>`;
      }
      return Object.entries(currencyMap)
        .map(([curr, val]) => {
          const amt = typeof val === 'number' ? val : (val.projectedYearlySpend || val.yearly || 0);
          return `<div>${currencyUtils.format(amt, curr)}</div>`;
        })
        .join('');
    };

    if (this.elements.totalMonthlyCost) {
      this.elements.totalMonthlyCost.innerHTML = renderMonthlyCurrency(spendObj);
    }
    
    if (this.elements.totalYearlyCost) {
      this.elements.totalYearlyCost.innerHTML = renderYearlyCurrency(spendObj);
    }

    // Next Renewal Handling
    const upcomingList = metrics.renewals?.upcomingSubscriptions || [];
    if (upcomingList.length > 0) {
      const nextSub = upcomingList[0];
      const renewalDateObj = new Date(nextSub.renewalDate);
      const daysLeft = Math.max(0, Math.ceil((renewalDateObj - new Date()) / (1000 * 60 * 60 * 24)));

      if (this.elements.nextRenewalName) this.elements.nextRenewalName.textContent = nextSub.name;
      if (this.elements.nextRenewalDate) {
        this.elements.nextRenewalDate.textContent = `${currencyUtils.format(nextSub.price, nextSub.currency)} on ${renewalDateObj.toLocaleDateString()}`;
      }
      if (this.elements.nextRenewalCountdown) {
        this.elements.nextRenewalCountdown.textContent = `${daysLeft} days left`;
      }
    } else {
      if (this.elements.nextRenewalName) this.elements.nextRenewalName.textContent = 'None';
      if (this.elements.nextRenewalDate) this.elements.nextRenewalDate.textContent = 'No upcoming renewals';
      if (this.elements.nextRenewalCountdown) this.elements.nextRenewalCountdown.textContent = '-- days left';
    }

    // Categories
    this.renderCategoryBars(summary.topCategoryByCurrency, selectedCurrency);
  },

  renderCategoryBars(categoryData, selectedCurrency) {
    if (!this.elements.categoryBars) return;

    const availableCurrencies = categoryData ? Object.keys(categoryData) : [];
    const targetCurrency = (categoryData && categoryData[selectedCurrency])
      ? selectedCurrency
      : (availableCurrencies.length > 0 ? availableCurrencies[0] : selectedCurrency);

    const rawGroup = categoryData ? categoryData[targetCurrency] : null;
    let targetData = [];

    if (Array.isArray(rawGroup)) {
      targetData = rawGroup;
    } else if (rawGroup && Array.isArray(rawGroup.categories)) {
      targetData = rawGroup.categories;
    }

    if (!targetData || targetData.length === 0) {
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

    this.elements.categoryBars.innerHTML = targetData.map(item => {
      const cat = domUtils.escapeHTML(item.name || item.category || 'Other');
      const amt = item.monthlySpend !== undefined ? item.monthlySpend : (item.spend || 0);
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
