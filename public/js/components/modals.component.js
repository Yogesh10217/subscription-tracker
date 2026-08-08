import { authApi } from '../api/auth.api.js';
import { subscriptionsApi } from '../api/subscriptions.api.js';
import { domUtils } from '../utils/dom.util.js';

export const modalsComponent = {
  elements: {},
  authMode: 'signin',
  onSubscriptionSaved: null,
  abortController: null,

  init(onSubscriptionSavedCallback) {
    this.onSubscriptionSaved = onSubscriptionSavedCallback;
    this.elements = {
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
      
      // Sub Modal
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
      subRenewalDate: document.getElementById('subRenewalDate')
    };

    this.bindEvents();
  },

  bindEvents() {
    // Auth Events
    if (this.elements.closeAuthModalBtn) this.elements.closeAuthModalBtn.addEventListener('click', () => this.closeAuthModal());
    if (this.elements.tabSignIn) this.elements.tabSignIn.addEventListener('click', () => this.setAuthMode('signin'));
    if (this.elements.tabSignUp) this.elements.tabSignUp.addEventListener('click', () => this.setAuthMode('signup'));
    if (this.elements.authForm) this.elements.authForm.addEventListener('submit', (e) => this.handleAuthSubmit(e));

    // Sub Events
    if (this.elements.closeModalBtn) this.elements.closeModalBtn.addEventListener('click', () => this.closeSubModal());
    if (this.elements.cancelModalBtn) this.elements.cancelModalBtn.addEventListener('click', () => this.closeSubModal());
    if (this.elements.subscriptionForm) this.elements.subscriptionForm.addEventListener('submit', (e) => this.handleSubSubmit(e));

    // Auto calculate renewal
    if (this.elements.subStartDate) this.elements.subStartDate.addEventListener('change', () => this.autoCalculateRenewalDate());
    if (this.elements.subFrequency) this.elements.subFrequency.addEventListener('change', () => this.autoCalculateRenewalDate());
  },

  // --- Auth Modal ---
  openAuthModal() {
    if (this.elements.authModal) this.elements.authModal.hidden = false;
    this.setAuthMode('signin');
  },

  closeAuthModal() {
    if (this.elements.authModal) this.elements.authModal.hidden = true;
  },

  setAuthMode(mode) {
    this.authMode = mode;
    if (this.elements.authError) this.elements.authError.hidden = true;
    
    if (mode === 'signin') {
      if (this.elements.tabSignIn) this.elements.tabSignIn.classList.add('active');
      if (this.elements.tabSignUp) this.elements.tabSignUp.classList.remove('active');
      if (this.elements.authTitle) this.elements.authTitle.textContent = 'Sign In to SubPulse';
      if (this.elements.nameGroup) this.elements.nameGroup.hidden = true;
      if (this.elements.authSubmitBtn) this.elements.authSubmitBtn.textContent = 'Sign In';
    } else {
      if (this.elements.tabSignUp) this.elements.tabSignUp.classList.add('active');
      if (this.elements.tabSignIn) this.elements.tabSignIn.classList.remove('active');
      if (this.elements.authTitle) this.elements.authTitle.textContent = 'Create New Account';
      if (this.elements.nameGroup) this.elements.nameGroup.hidden = false;
      if (this.elements.authSubmitBtn) this.elements.authSubmitBtn.textContent = 'Create Account';
    }
  },

  async handleAuthSubmit(e) {
    e.preventDefault();
    if (this.elements.authError) this.elements.authError.hidden = true;

    const email = this.elements.authEmail.value.trim();
    const password = this.elements.authPassword.value;
    const name = this.elements.authName ? this.elements.authName.value.trim() : '';

    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    try {
      if (this.authMode === 'signin') {
        await authApi.signIn(email, password, this.abortController.signal);
      } else {
        await authApi.signUp(name, email, password, this.abortController.signal);
      }
      
      this.closeAuthModal();
      domUtils.showToast('Successfully authenticated', 'success');
      // Trigger a global reload after auth changes
      window.dispatchEvent(new CustomEvent('subpulse:auth-success'));
    } catch (err) {
      if (err.name !== 'AbortError') {
        if (this.elements.authError) {
          this.elements.authError.textContent = err.message || 'Authentication failed';
          this.elements.authError.hidden = false;
        }
      }
    }
  },

  // --- Sub Modal ---
  openAddSubModal() {
    if (this.elements.modalTitle) this.elements.modalTitle.textContent = 'Add New Subscription';
    if (this.elements.subscriptionForm) this.elements.subscriptionForm.reset();
    if (this.elements.subId) this.elements.subId.value = '';
    if (this.elements.subStartDate) this.elements.subStartDate.value = new Date().toISOString().split('T')[0];
    this.autoCalculateRenewalDate();
    if (this.elements.subscriptionModal) this.elements.subscriptionModal.hidden = false;
  },

  openEditSubModal(sub) {
    if (!sub) return;
    if (this.elements.modalTitle) this.elements.modalTitle.textContent = 'Edit Subscription';
    
    if (this.elements.subId) this.elements.subId.value = sub._id;
    if (this.elements.subName) this.elements.subName.value = sub.name;
    if (this.elements.subCategory) this.elements.subCategory.value = sub.category || 'Entertainment';
    if (this.elements.subPrice) this.elements.subPrice.value = sub.price;
    if (this.elements.subCurrency) this.elements.subCurrency.value = sub.currency || 'USD';
    if (this.elements.subFrequency) this.elements.subFrequency.value = sub.frequency || 'Monthly';
    if (this.elements.subPaymentMethod) this.elements.subPaymentMethod.value = sub.paymentMethod || 'Credit Card';
    if (this.elements.subStatus) this.elements.subStatus.value = sub.status || 'Active';
    if (this.elements.subStartDate) this.elements.subStartDate.value = sub.startDate ? new Date(sub.startDate).toISOString().split('T')[0] : '';
    if (this.elements.subRenewalDate) this.elements.subRenewalDate.value = sub.renewalDate ? new Date(sub.renewalDate).toISOString().split('T')[0] : '';

    if (this.elements.subscriptionModal) this.elements.subscriptionModal.hidden = false;
  },

  closeSubModal() {
    if (this.elements.subscriptionModal) this.elements.subscriptionModal.hidden = true;
  },

  autoCalculateRenewalDate() {
    if (!this.elements.subStartDate || !this.elements.subFrequency || !this.elements.subRenewalDate) return;
    
    const startDateVal = this.elements.subStartDate.value;
    const freq = this.elements.subFrequency.value;
    if (!startDateVal) return;

    const start = new Date(startDateVal);
    if (isNaN(start.getTime())) return;

    const renewal = new Date(start);
    if (freq === 'Daily') renewal.setDate(renewal.getDate() + 1);
    else if (freq === 'Weekly') renewal.setDate(renewal.getDate() + 7);
    else if (freq === 'Monthly') renewal.setMonth(renewal.getMonth() + 1);
    else if (freq === 'Yearly') renewal.setFullYear(renewal.getFullYear() + 1);

    this.elements.subRenewalDate.value = renewal.toISOString().split('T')[0];
  },

  async handleSubSubmit(e) {
    e.preventDefault();

    const id = this.elements.subId ? this.elements.subId.value : null;
    const payload = {
      name: this.elements.subName.value.trim(),
      category: this.elements.subCategory.value,
      price: parseFloat(this.elements.subPrice.value),
      currency: this.elements.subCurrency.value,
      frequency: this.elements.subFrequency.value,
      paymentMethod: this.elements.subPaymentMethod.value.trim(),
      status: this.elements.subStatus.value,
      startDate: this.elements.subStartDate.value,
      renewalDate: this.elements.subRenewalDate.value
    };

    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    try {
      if (id) {
        await subscriptionsApi.update(id, payload, this.abortController.signal);
      } else {
        await subscriptionsApi.create(payload, this.abortController.signal);
      }
      
      domUtils.showToast(`Successfully saved ${payload.name}`, 'success');
      this.closeSubModal();
      
      if (this.onSubscriptionSaved) {
        this.onSubscriptionSaved();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        domUtils.showToast(`Error: ${err.message}`, 'error');
      }
    }
  },

  destroy() {
    if (this.abortController) this.abortController.abort();
  }
};
