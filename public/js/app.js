/* ==========================================================================
   SUBPULSE — CLIENT-SIDE APPLICATION ENGINE
   ========================================================================== */

(function () {
  'use strict';

  // --- CONFIG & CONSTANTS ---
  const API_BASE = '/api/v1';

  const CURRENCY_SYMBOLS = {
    USD: '$',
    INR: '₹',
    EUR: '€'
  };

  const CURRENCY_RATES = {
    USD: 1.0,
    INR: 83.5,
    EUR: 0.92
  };

  const PRESETS = [
    { name: 'Netflix', category: 'Entertainment', price: 15.99, currency: 'USD', frequency: 'Monthly', paymentMethod: 'Visa ending 4242', color: '#E50914', iconText: 'N' },
    { name: 'Spotify Premium', category: 'Entertainment', price: 10.99, currency: 'USD', frequency: 'Monthly', paymentMethod: 'MasterCard', color: '#1DB954', iconText: 'S' },
    { name: 'ChatGPT Plus', category: 'Productivity', price: 20.00, currency: 'USD', frequency: 'Monthly', paymentMethod: 'Apple Pay', color: '#10A37F', iconText: 'AI' },
    { name: 'GitHub Copilot', category: 'Productivity', price: 10.00, currency: 'USD', frequency: 'Monthly', paymentMethod: 'PayPal', color: '#2DBA4E', iconText: 'GH' },
    { name: 'AWS Cloud', category: 'Productivity', price: 45.50, currency: 'USD', frequency: 'Monthly', paymentMethod: 'Amex', color: '#FF9900', iconText: 'AWS' },
    { name: 'YouTube Premium', category: 'Entertainment', price: 13.99, currency: 'USD', frequency: 'Monthly', paymentMethod: 'Google Pay', color: '#FF0000', iconText: 'YT' },
    { name: 'Adobe Creative Cloud', category: 'Education', price: 54.99, currency: 'USD', frequency: 'Monthly', paymentMethod: 'Visa', color: '#FF0000', iconText: 'Ps' },
    { name: 'Gym Membership', category: 'Health', price: 29.99, currency: 'USD', frequency: 'Monthly', paymentMethod: 'Direct Debit', color: '#3B82F6', iconText: 'FIT' }
  ];

  const INITIAL_DEMO_SUBSCRIPTIONS = [
    {
      _id: 'demo-1',
      name: 'Netflix Premium',
      category: 'Entertainment',
      price: 19.99,
      currency: 'USD',
      frequency: 'Monthly',
      paymentMethod: 'Credit Card (Visa)',
      status: 'Active',
      startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      _id: 'demo-2',
      name: 'ChatGPT Plus',
      category: 'Productivity',
      price: 20.00,
      currency: 'USD',
      frequency: 'Monthly',
      paymentMethod: 'Apple Pay',
      status: 'Active',
      startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      _id: 'demo-3',
      name: 'Spotify Family',
      category: 'Entertainment',
      price: 16.99,
      currency: 'USD',
      frequency: 'Monthly',
      paymentMethod: 'PayPal',
      status: 'Active',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      _id: 'demo-4',
      name: 'GitHub Copilot',
      category: 'Productivity',
      price: 100.00,
      currency: 'USD',
      frequency: 'Yearly',
      paymentMethod: 'MasterCard',
      status: 'Active',
      startDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 165 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      _id: 'demo-5',
      name: 'Coursera Plus',
      category: 'Education',
      price: 399.00,
      currency: 'USD',
      frequency: 'Yearly',
      paymentMethod: 'Visa',
      status: 'expired',
      startDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      renewalDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  ];

  // --- APP STATE ---
  let state = {
    subscriptions: [],
    selectedCurrency: 'USD',
    searchQuery: '',
    categoryFilter: 'All',
    statusFilter: 'All',
    sortBy: 'renewalSoon',
    user: JSON.parse(localStorage.getItem('subpulse_user')) || null,
    token: localStorage.getItem('subpulse_token') || null,
    isDemoMode: false
  };

  // --- DOM ELEMENTS ---
  const el = {
    totalMonthlyCost: document.getElementById('totalMonthlyCost'),
    monthlySubCount: document.getElementById('monthlySubCount'),
    totalYearlyCost: document.getElementById('totalYearlyCost'),
    activeCount: document.getElementById('activeCount'),
    expiredCount: document.getElementById('expiredCount'),
    nextRenewalName: document.getElementById('nextRenewalName'),
    nextRenewalDate: document.getElementById('nextRenewalDate'),
    nextRenewalCountdown: document.getElementById('nextRenewalCountdown'),
    currencySelect: document.getElementById('currencySelect'),
    statusText: document.getElementById('statusText'),
    systemStatusBadge: document.getElementById('systemStatusBadge'),
    presetsGrid: document.getElementById('presetsGrid'),
    categoryBars: document.getElementById('categoryBars'),
    categoryCountDetails: document.getElementById('categoryCountDetails'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    categoryFilter: document.getElementById('categoryFilter'),
    statusFilter: document.getElementById('statusFilter'),
    sortBy: document.getElementById('sortBy'),
    subscriptionsGrid: document.getElementById('subscriptionsGrid'),
    resultsCount: document.getElementById('resultsCount'),
    emptyState: document.getElementById('emptyState'),
    emptyStateMsg: document.getElementById('emptyStateMsg'),
    emptyStateActionBtn: document.getElementById('emptyStateActionBtn'),
    resetDemoDataBtn: document.getElementById('resetDemoDataBtn'),
    exportDataBtn: document.getElementById('exportDataBtn'),
    userMenuBtn: document.getElementById('userMenuBtn'),
    avatarInitials: document.getElementById('avatarInitials'),

    // Modals
    openAddModalBtn: document.getElementById('openAddModalBtn'),
    subscriptionModal: document.getElementById('subscriptionModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelModalBtn: document.getElementById('cancelModalBtn'),
    subscriptionForm: document.getElementById('subscriptionForm'),
    modalTitle: document.getElementById('modalTitle'),
    subId: document.getElementById('subId'),
    subName: document.getElementById('subName'),
    subCategory: document.getElementById('subCategory'),
    subPrice: document.getElementById('subPrice'),
    subCurrency: document.getElementById('subCurrency'),
    subFrequency: document.getElementById('subFrequency'),
    subPaymentMethod: document.getElementById('subPaymentMethod'),
    subStatus: document.getElementById('subStatus'),
    subStartDate: document.getElementById('subStartDate'),
    subRenewalDate: document.getElementById('subRenewalDate'),
    saveSubBtn: document.getElementById('saveSubBtn'),

    // Auth Modal
    authModal: document.getElementById('authModal'),
    closeAuthModalBtn: document.getElementById('closeAuthModalBtn'),
    authTitle: document.getElementById('authTitle'),
    tabSignIn: document.getElementById('tabSignIn'),
    tabSignUp: document.getElementById('tabSignUp'),
    authForm: document.getElementById('authForm'),
    nameGroup: document.getElementById('nameGroup'),
    authName: document.getElementById('authName'),
    authEmail: document.getElementById('authEmail'),
    authPassword: document.getElementById('authPassword'),
    authError: document.getElementById('authError'),
    authSubmitBtn: document.getElementById('authSubmitBtn'),

    toastContainer: document.getElementById('toastContainer')
  };

  // --- INITIALIZATION ---
  function init() {
    setupEventListeners();
    renderPresets();
    updateUserAvatar();

    // Set default date picker to today
    if (el.subStartDate) {
      el.subStartDate.value = new Date().toISOString().split('T')[0];
    }

    loadSubscriptions();
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    el.currencySelect.addEventListener('change', (e) => {
      state.selectedCurrency = e.target.value;
      render();
    });

    el.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      el.clearSearchBtn.hidden = !state.searchQuery;
      render();
    });

    el.clearSearchBtn.addEventListener('click', () => {
      el.searchInput.value = '';
      state.searchQuery = '';
      el.clearSearchBtn.hidden = true;
      render();
    });

    el.categoryFilter.addEventListener('change', (e) => {
      state.categoryFilter = e.target.value;
      render();
    });

    el.statusFilter.addEventListener('change', (e) => {
      state.statusFilter = e.target.value;
      render();
    });

    el.sortBy.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      render();
    });

    el.openAddModalBtn.addEventListener('click', () => openAddModal());
    el.closeModalBtn.addEventListener('click', () => closeModal());
    el.cancelModalBtn.addEventListener('click', () => closeModal());
    el.emptyStateActionBtn.addEventListener('click', () => openAddModal());
    el.resetDemoDataBtn.addEventListener('click', () => resetDemoData());
    el.exportDataBtn.addEventListener('click', () => exportCSV());

    el.subscriptionForm.addEventListener('submit', handleSubscriptionSubmit);

    // Auth listeners
    el.userMenuBtn.addEventListener('click', () => openAuthModal());
    el.closeAuthModalBtn.addEventListener('click', () => closeAuthModal());
    el.tabSignIn.addEventListener('click', () => setAuthMode('signin'));
    el.tabSignUp.addEventListener('click', () => setAuthMode('signup'));
    el.authForm.addEventListener('submit', handleAuthSubmit);

    // Auto calculate renewal date when start date or frequency changes
    el.subStartDate.addEventListener('change', autoCalculateRenewalDate);
    el.subFrequency.addEventListener('change', autoCalculateRenewalDate);
  }

  // --- PRESETS RENDER ---
  function renderPresets() {
    el.presetsGrid.innerHTML = PRESETS.map((p, idx) => `
      <div class="preset-chip" onclick="window.subpulseApp.applyPreset(${idx})">
        <div class="preset-icon" style="background: ${p.color};">${p.iconText}</div>
        <div class="preset-info">
          <span class="preset-name">${p.name}</span>
          <span class="preset-price">$${p.price.toFixed(2)}/mo</span>
        </div>
      </div>
    `).join('');
  }

  function applyPreset(idx) {
    const preset = PRESETS[idx];
    openAddModal();
    el.subName.value = preset.name;
    el.subCategory.value = preset.category;
    el.subPrice.value = preset.price;
    el.subCurrency.value = preset.currency;
    el.subFrequency.value = preset.frequency;
    el.subPaymentMethod.value = preset.paymentMethod;
    autoCalculateRenewalDate();
    showToast(`Pre-filled template for ${preset.name}`, 'info');
  }

  // --- AUTO CALCULATE RENEWAL DATE ---
  function autoCalculateRenewalDate() {
    const startDateVal = el.subStartDate.value;
    const freq = el.subFrequency.value;
    if (!startDateVal) return;

    const start = new Date(startDateVal);
    if (isNaN(start.getTime())) return;

    const renewal = new Date(start);
    if (freq === 'Daily') renewal.setDate(renewal.getDate() + 1);
    else if (freq === 'Weekly') renewal.setDate(renewal.getDate() + 7);
    else if (freq === 'Monthly') renewal.setMonth(renewal.getMonth() + 1);
    else if (freq === 'Yearly') renewal.setFullYear(renewal.getFullYear() + 1);

    el.subRenewalDate.value = renewal.toISOString().split('T')[0];
  }

  // --- DATA LOADING & API CALLS ---
  async function loadSubscriptions() {
    try {
      let url = `${API_BASE}/subscriptions`;
      if (state.user && state.user._id) {
        url = `${API_BASE}/subscriptions/user/${state.user._id}`;
      }

      const headers = {};
      if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
      }

      const res = await fetch(url, { headers });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        state.subscriptions = data.data;
        state.isDemoMode = false;
        setSystemStatus(true, 'Connected to Mongo API');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.warn('API Fetch failed, activating interactive demo mode:', err.message);
      state.isDemoMode = true;
      const stored = localStorage.getItem('subpulse_demo_subscriptions');
      if (stored) {
        state.subscriptions = JSON.parse(stored);
      } else {
        state.subscriptions = [...INITIAL_DEMO_SUBSCRIPTIONS];
        saveDemoSubscriptions();
      }
      setSystemStatus(true, 'Demo Mode (Interactive)');
    }

    render();
  }

  function saveDemoSubscriptions() {
    localStorage.setItem('subpulse_demo_subscriptions', JSON.stringify(state.subscriptions));
  }

  function setSystemStatus(connected, text) {
    el.statusText.textContent = text;
    if (connected) {
      el.systemStatusBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    } else {
      el.systemStatusBadge.style.borderColor = 'rgba(244, 63, 94, 0.3)';
    }
  }

  function resetDemoData() {
    state.subscriptions = [...INITIAL_DEMO_SUBSCRIPTIONS];
    saveDemoSubscriptions();
    showToast('Reset sample subscriptions data', 'success');
    render();
  }

  // --- MAIN RENDER FUNCTION ---
  function render() {
    const filtered = getFilteredSubscriptions();
    renderStats(filtered);
    renderCategoryBars(filtered);
    renderSubscriptionsGrid(filtered);
  }

  // --- FILTER & SORT LOGIC ---
  function getFilteredSubscriptions() {
    return state.subscriptions.filter(sub => {
      // Search
      const q = state.searchQuery;
      const matchesSearch = !q ||
        sub.name.toLowerCase().includes(q) ||
        (sub.category && sub.category.toLowerCase().includes(q)) ||
        (sub.paymentMethod && sub.paymentMethod.toLowerCase().includes(q));

      // Category
      const matchesCat = state.categoryFilter === 'All' || sub.category === state.categoryFilter;

      // Status
      const matchesStatus = state.statusFilter === 'All' || sub.status === state.statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    }).sort((a, b) => {
      if (state.sortBy === 'renewalSoon') {
        const dateA = new Date(a.renewalDate || a.startDate).getTime();
        const dateB = new Date(b.renewalDate || b.startDate).getTime();
        return dateA - dateB;
      } else if (state.sortBy === 'priceHigh') {
        return normalizeToUSD(b.price, b.currency) - normalizeToUSD(a.price, a.currency);
      } else if (state.sortBy === 'priceLow') {
        return normalizeToUSD(a.price, a.currency) - normalizeToUSD(b.price, b.currency);
      } else if (state.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }

  function normalizeToUSD(price, currency = 'USD') {
    const rate = CURRENCY_RATES[currency] || 1;
    return price / rate;
  }

  function convertFromUSD(amountUSD, targetCurrency) {
    const rate = CURRENCY_RATES[targetCurrency] || 1;
    return amountUSD * rate;
  }

  function formatCurrency(amountUSD) {
    const targetCurr = state.selectedCurrency;
    const symbol = CURRENCY_SYMBOLS[targetCurr] || '$';
    const converted = convertFromUSD(amountUSD, targetCurr);
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // --- RENDER STATS ---
  function renderStats(subs) {
    let monthlyUSD = 0;
    let activeCount = 0;
    let expiredCount = 0;
    let nearestRenewal = null;
    let minDays = Infinity;

    const now = new Date();

    subs.forEach(sub => {
      const priceUSD = normalizeToUSD(sub.price, sub.currency);

      if (sub.status === 'Active') {
        activeCount++;
        // Monthly calculation multiplier
        if (sub.frequency === 'Monthly') monthlyUSD += priceUSD;
        else if (sub.frequency === 'Yearly') monthlyUSD += (priceUSD / 12);
        else if (sub.frequency === 'Weekly') monthlyUSD += (priceUSD * 4.33);
        else if (sub.frequency === 'Daily') monthlyUSD += (priceUSD * 30);

        // Upcoming renewal calculation
        if (sub.renewalDate) {
          const rDate = new Date(sub.renewalDate);
          const diffDays = Math.ceil((rDate - now) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays < minDays) {
            minDays = diffDays;
            nearestRenewal = { sub, days: diffDays };
          }
        }
      } else {
        expiredCount++;
      }
    });

    const yearlyUSD = monthlyUSD * 12;

    el.totalMonthlyCost.textContent = formatCurrency(monthlyUSD);
    el.monthlySubCount.textContent = `${activeCount} active recurring item${activeCount === 1 ? '' : 's'}`;
    el.totalYearlyCost.textContent = formatCurrency(yearlyUSD);
    el.activeCount.textContent = activeCount;
    el.expiredCount.textContent = `${expiredCount} expired / cancelled`;

    if (nearestRenewal) {
      el.nextRenewalName.textContent = nearestRenewal.sub.name;
      el.nextRenewalDate.textContent = `Renews on ${new Date(nearestRenewal.sub.renewalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
      el.nextRenewalCountdown.textContent = `${nearestRenewal.days} day${nearestRenewal.days === 1 ? '' : 's'} left`;
    } else {
      el.nextRenewalName.textContent = 'None';
      el.nextRenewalDate.textContent = 'No upcoming renewals';
      el.nextRenewalCountdown.textContent = '-- days left';
    }
  }

  // --- RENDER CATEGORY BARS ---
  function renderCategoryBars(subs) {
    const totals = {};
    let grandTotalUSD = 0;

    subs.forEach(sub => {
      if (sub.status !== 'Active') return;
      const cat = sub.category || 'Other';
      const monthlyUSD = normalizeToUSD(sub.price, sub.currency) * (sub.frequency === 'Yearly' ? 1/12 : 1);
      totals[cat] = (totals[cat] || 0) + monthlyUSD;
      grandTotalUSD += monthlyUSD;
    });

    const categories = Object.keys(totals);
    el.categoryCountDetails.textContent = `${categories.length} categories active`;

    if (categories.length === 0) {
      el.categoryBars.innerHTML = `<div class="text-muted" style="font-size:0.85rem;">No active category spending data</div>`;
      return;
    }

    const categoryColors = {
      Entertainment: 'var(--primary-violet)',
      Productivity: 'var(--accent-cyan)',
      Education: 'var(--accent-amber)',
      Health: 'var(--accent-emerald)',
      Other: 'var(--accent-pink)'
    };

    el.categoryBars.innerHTML = categories.map(cat => {
      const amtUSD = totals[cat];
      const pct = grandTotalUSD > 0 ? ((amtUSD / grandTotalUSD) * 100).toFixed(1) : 0;
      const color = categoryColors[cat] || categoryColors.Other;

      return `
        <div class="category-row">
          <span class="cat-label">${cat}</span>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%; background: ${color};"></div>
          </div>
          <span class="cat-val">${formatCurrency(amtUSD)}/mo (${pct}%)</span>
        </div>
      `;
    }).join('');
  }

  // --- RENDER SUBSCRIPTIONS GRID ---
  function renderSubscriptionsGrid(subs) {
    el.resultsCount.textContent = subs.length;

    if (subs.length === 0) {
      el.subscriptionsGrid.innerHTML = '';
      el.emptyState.hidden = false;
      if (state.searchQuery || state.categoryFilter !== 'All' || state.statusFilter !== 'All') {
        el.emptyStateMsg.textContent = 'No subscriptions match your current filter and search settings.';
      } else {
        el.emptyStateMsg.textContent = 'You haven\'t added any subscriptions yet. Click below to add your first!';
      }
      return;
    }

    el.emptyState.hidden = true;

    el.subscriptionsGrid.innerHTML = subs.map(sub => {
      const priceUSD = normalizeToUSD(sub.price, sub.currency);
      const formattedPrice = formatCurrency(priceUSD);
      
      const initials = sub.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

      // Days progress
      const now = new Date();
      const start = new Date(sub.startDate || Date.now());
      const renewal = new Date(sub.renewalDate || Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      const totalDuration = Math.max(1, renewal - start);
      const elapsed = Math.max(0, now - start);
      const pctElapsed = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
      const daysLeft = Math.max(0, Math.ceil((renewal - now) / (1000 * 60 * 60 * 24)));

      const statusClass = sub.status === 'Active' ? 'active-pill' : (sub.status === 'expired' ? 'expired-pill' : 'cancelled-pill');

      return `
        <div class="sub-card glass-card">
          <div class="sub-card-header">
            <div class="sub-brand-wrapper">
              <div class="sub-logo-avatar" style="background: ${getBrandGradient(sub.category)};">
                ${initials}
              </div>
              <div class="sub-meta">
                <span class="sub-title">${escapeHTML(sub.name)}</span>
                <span class="sub-category-tag">${escapeHTML(sub.category || 'Subscription')}</span>
              </div>
            </div>
            <span class="status-pill ${statusClass}">${sub.status}</span>
          </div>

          <div class="sub-pricing">
            <span class="price-amount">${formattedPrice}</span>
            <span class="price-cycle">/ ${sub.frequency ? sub.frequency.toLowerCase() : 'month'}</span>
          </div>

          <div class="sub-progress-section">
            <div class="progress-info">
              <span>Renewal Progress</span>
              <span class="days-remaining">${daysLeft} days left</span>
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
              ${escapeHTML(sub.paymentMethod || 'Credit Card')}
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
  }

  function getBrandGradient(cat) {
    switch (cat) {
      case 'Entertainment': return 'linear-gradient(135deg, #ec4899, #8b5cf6)';
      case 'Productivity': return 'linear-gradient(135deg, #6366f1, #06b6d4)';
      case 'Education': return 'linear-gradient(135deg, #f59e0b, #ec4899)';
      case 'Health': return 'linear-gradient(135deg, #10b981, #06b6d4)';
      default: return 'linear-gradient(135deg, #374151, #4b5563)';
    }
  }

  // --- MODAL & FORM HANDLERS ---
  function openAddModal() {
    el.modalTitle.textContent = 'Add New Subscription';
    el.subscriptionForm.reset();
    el.subId.value = '';
    el.subStartDate.value = new Date().toISOString().split('T')[0];
    autoCalculateRenewalDate();
    el.subscriptionModal.hidden = false;
  }

  function closeModal() {
    el.subscriptionModal.hidden = true;
  }

  function editSub(id) {
    const sub = state.subscriptions.find(s => s._id === id);
    if (!sub) return;

    el.modalTitle.textContent = 'Edit Subscription';
    el.subId.value = sub._id;
    el.subName.value = sub.name;
    el.subCategory.value = sub.category || 'Entertainment';
    el.subPrice.value = sub.price;
    el.subCurrency.value = sub.currency || 'USD';
    el.subFrequency.value = sub.frequency || 'Monthly';
    el.subPaymentMethod.value = sub.paymentMethod || 'Credit Card';
    el.subStatus.value = sub.status || 'Active';
    el.subStartDate.value = sub.startDate ? new Date(sub.startDate).toISOString().split('T')[0] : '';
    el.subRenewalDate.value = sub.renewalDate ? new Date(sub.renewalDate).toISOString().split('T')[0] : '';

    el.subscriptionModal.hidden = false;
  }

  async function handleSubscriptionSubmit(e) {
    e.preventDefault();

    const id = el.subId.value;
    const payload = {
      name: el.subName.value.trim(),
      category: el.subCategory.value,
      price: parseFloat(el.subPrice.value),
      currency: el.subCurrency.value,
      frequency: el.subFrequency.value,
      paymentMethod: el.subPaymentMethod.value.trim(),
      status: el.subStatus.value,
      startDate: el.subStartDate.value,
      renewalDate: el.subRenewalDate.value
    };

    if (state.isDemoMode) {
      if (id) {
        // Edit existing
        const idx = state.subscriptions.findIndex(s => s._id === id);
        if (idx !== -1) {
          state.subscriptions[idx] = { ...state.subscriptions[idx], ...payload };
          showToast(`Updated ${payload.name}`, 'success');
        }
      } else {
        // Create new
        const newSub = { ...payload, _id: 'demo-' + Date.now() };
        state.subscriptions.unshift(newSub);
        showToast(`Created ${payload.name}`, 'success');
      }
      saveDemoSubscriptions();
      closeModal();
      render();
      return;
    }

    // Real API Call
    try {
      const url = id ? `${API_BASE}/subscriptions/${id}` : `${API_BASE}/subscriptions`;
      const method = id ? 'PUT' : 'POST';

      const headers = { 'Content-Type': 'application/json' };
      if (state.token) headers['Authorization'] = `Bearer ${state.token}`;

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');

      showToast(`Successfully saved ${payload.name}`, 'success');
      closeModal();
      loadSubscriptions();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  }

  async function cancelSub(id) {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;

    if (state.isDemoMode) {
      const sub = state.subscriptions.find(s => s._id === id);
      if (sub) {
        sub.status = 'Cancelled';
        saveDemoSubscriptions();
        showToast(`Cancelled ${sub.name}`, 'info');
        render();
      }
      return;
    }

    try {
      const headers = {};
      if (state.token) headers['Authorization'] = `Bearer ${state.token}`;

      const res = await fetch(`${API_BASE}/subscriptions/${id}/cancel`, {
        method: 'PUT',
        headers
      });

      if (!res.ok) throw new Error('Failed to cancel subscription');
      showToast('Subscription cancelled', 'info');
      loadSubscriptions();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  }

  async function deleteSub(id) {
    if (!confirm('Are you sure you want to permanently delete this subscription?')) return;

    if (state.isDemoMode) {
      state.subscriptions = state.subscriptions.filter(s => s._id !== id);
      saveDemoSubscriptions();
      showToast('Subscription deleted', 'success');
      render();
      return;
    }

    try {
      const headers = {};
      if (state.token) headers['Authorization'] = `Bearer ${state.token}`;

      const res = await fetch(`${API_BASE}/subscriptions/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error('Failed to delete subscription');
      showToast('Subscription deleted', 'success');
      loadSubscriptions();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  }

  // --- EXPORT CSV ---
  function exportCSV() {
    if (state.subscriptions.length === 0) {
      showToast('No subscriptions to export', 'info');
      return;
    }

    const headers = ['Name', 'Category', 'Price', 'Currency', 'Frequency', 'Payment Method', 'Status', 'Start Date', 'Renewal Date'];
    const rows = state.subscriptions.map(s => [
      `"${s.name}"`,
      `"${s.category}"`,
      s.price,
      s.currency,
      s.frequency,
      `"${s.paymentMethod}"`,
      s.status,
      s.startDate ? s.startDate.split('T')[0] : '',
      s.renewalDate ? s.renewalDate.split('T')[0] : ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subpulse_subscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported CSV report successfully!', 'success');
  }

  // --- AUTH MODAL & HANDLERS ---
  let authMode = 'signin';

  function openAuthModal() {
    el.authModal.hidden = false;
    setAuthMode('signin');
  }

  function closeAuthModal() {
    el.authModal.hidden = true;
  }

  function setAuthMode(mode) {
    authMode = mode;
    el.authError.hidden = true;
    if (mode === 'signin') {
      el.tabSignIn.classList.add('active');
      el.tabSignUp.classList.remove('active');
      el.authTitle.textContent = 'Sign In to SubPulse';
      el.nameGroup.hidden = true;
      el.authSubmitBtn.textContent = 'Sign In';
    } else {
      el.tabSignUp.classList.add('active');
      el.tabSignIn.classList.remove('active');
      el.authTitle.textContent = 'Create New Account';
      el.nameGroup.hidden = false;
      el.authSubmitBtn.textContent = 'Create Account';
    }
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    el.authError.hidden = true;

    const email = el.authEmail.value.trim();
    const password = el.authPassword.value;
    const name = el.authName.value.trim();

    try {
      const endpoint = authMode === 'signin' ? '/auth/sign-in' : '/auth/sign-up';
      const body = authMode === 'signin' ? { email, password } : { name, email, password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      state.user = data.data.user;
      state.token = data.data.token;
      localStorage.setItem('subpulse_user', JSON.stringify(state.user));
      localStorage.setItem('subpulse_token', state.token);

      updateUserAvatar();
      closeAuthModal();
      showToast(`Welcome back, ${state.user.name || state.user.email}!`, 'success');
      loadSubscriptions();
    } catch (err) {
      el.authError.textContent = err.message;
      el.authError.hidden = false;
    }
  }

  function updateUserAvatar() {
    if (state.user && state.user.name) {
      const initials = state.user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      el.avatarInitials.textContent = initials;
    } else {
      el.avatarInitials.textContent = 'JS';
    }
  }

  // --- TOAST SYSTEM ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${escapeHTML(message)}</span>
    `;
    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- UTILS ---
  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Expose global window API for inline onclick handlers
  window.subpulseApp = {
    applyPreset,
    editSub,
    cancelSub,
    deleteSub
  };

  // Run on DOM load
  document.addEventListener('DOMContentLoaded', init);

})();
