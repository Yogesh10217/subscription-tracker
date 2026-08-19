import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import { SubscriptionItem } from './SubscriptionTable';
import { ServiceLogo } from './ServiceLogo';
import { matchBrandByName } from '@/utils/brandLogos';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subscriptionData: Partial<SubscriptionItem>) => void;
  editingSubscription?: SubscriptionItem | null;
  currency: string;
}

// Shared form field wrapper
function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">{label}</div>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-[#6B6B6B]">
      {children}
    </span>
  );
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSubscription,
  currency,
}) => {
  const [formData, setFormData] = useState({
    name:          '',
    price:         '',
    currency:      currency || 'USD',
    frequency:     'monthly',
    category:      'Entertainment',
    paymentMethod: 'Credit Card',
    status:        'active',
    startDate:     new Date().toISOString().split('T')[0],
    notes:         '',
  });

  useEffect(() => {
    if (editingSubscription) {
      setFormData({
        name:          editingSubscription.name || '',
        price:         editingSubscription.price ? String(editingSubscription.price) : '',
        currency:      editingSubscription.currency || currency || 'USD',
        frequency:     editingSubscription.frequency || 'monthly',
        category:      editingSubscription.category || 'Entertainment',
        paymentMethod: editingSubscription.paymentMethod || 'Credit Card',
        status:        editingSubscription.status || 'active',
        startDate:     editingSubscription.startDate
          ? new Date(editingSubscription.startDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        notes:         editingSubscription.notes || '',
      });
    } else {
      setFormData({
        name:          '',
        price:         '',
        currency:      currency || 'USD',
        frequency:     'monthly',
        category:      'Entertainment',
        paymentMethod: 'Credit Card',
        status:        'active',
        startDate:     new Date().toISOString().split('T')[0],
        notes:         '',
      });
    }
  }, [editingSubscription, isOpen, currency]);

  const handleNameChange = (val: string) => {
    const brand = matchBrandByName(val);
    setFormData((prev) => ({
      ...prev,
      name:     val,
      category: brand ? brand.category : prev.category,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    onSave({
      ...(editingSubscription ? { _id: editingSubscription._id } : {}),
      name:          formData.name,
      price:         parseFloat(formData.price),
      currency:      formData.currency,
      frequency:     formData.frequency,
      category:      formData.category,
      paymentMethod: formData.paymentMethod,
      status:        formData.status as any,
      startDate:     formData.startDate,
      notes:         formData.notes,
    });
    onClose();
  };

  if (!isOpen) return null;

  const detectedBrand = matchBrandByName(formData.name);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-lg border border-[#E8E4DF] shadow-[0_8px_32px_rgba(26,26,26,0.10)] relative">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E8E4DF]">
          <h3 className="font-serif text-xl text-[#1A1A1A] tracking-tight leading-snug">
            {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#F5F3F0] text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Form ───────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Service name */}
          <Field
            label={
              <>
                <FieldLabel>Service Name *</FieldLabel>
                {detectedBrand && (
                  <span className="flex items-center gap-1 font-mono text-[10px] font-medium tracking-[0.08em] uppercase text-[#B8860B]">
                    <Sparkles className="w-3 h-3" />
                    Auto-detected {detectedBrand.name}
                  </span>
                )}
              </>
            }
          >
            <div className="flex items-center gap-2.5">
              <ServiceLogo name={formData.name} size="md" />
              <input
                type="text"
                required
                placeholder="e.g. Netflix, AWS, Spotify, Figma…"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="serif-input"
              />
            </div>
          </Field>

          {/* Price & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={<FieldLabel>Price *</FieldLabel>}>
              <div className="flex items-center gap-1.5">
                {/* Currency prefix select */}
                <div className="relative flex-shrink-0">
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="serif-select min-h-0 h-11 text-xs font-mono font-semibold text-[#B8860B] pr-6 appearance-none"
                    style={{ width: '72px' }}
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#6B6B6B]">▼</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="19.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="serif-input font-mono"
                />
              </div>
            </Field>

            <Field label={<FieldLabel>Billing Cycle</FieldLabel>}>
              <div className="relative">
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="serif-select appearance-none pr-7"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#6B6B6B]">▼</span>
              </div>
            </Field>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={<FieldLabel>Category</FieldLabel>}>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="serif-select appearance-none pr-7"
                >
                  <option value="Entertainment">Entertainment</option>
                  <option value="SaaS & Tools">SaaS &amp; Tools</option>
                  <option value="Cloud & Hosting">Cloud &amp; Hosting</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Fitness & Health">Fitness &amp; Health</option>
                  <option value="Other">Other</option>
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#6B6B6B]">▼</span>
              </div>
            </Field>

            <Field label={<FieldLabel>Status</FieldLabel>}>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="serif-select appearance-none pr-7"
                >
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#6B6B6B]">▼</span>
              </div>
            </Field>
          </div>

          {/* Start Date & Payment */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={<FieldLabel>Start Date</FieldLabel>}>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="serif-input font-mono"
              />
            </Field>

            <Field label={<FieldLabel>Payment Method</FieldLabel>}>
              <input
                type="text"
                placeholder="e.g. Visa ****4242"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="serif-input"
              />
            </Field>
          </div>

          {/* Notes */}
          <Field label={<FieldLabel>Notes (optional)</FieldLabel>}>
            <textarea
              rows={2}
              placeholder="Add any reminders or plan details…"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="serif-input resize-none py-2.5 leading-relaxed"
              style={{ minHeight: 'unset', height: 'auto' }}
            />
          </Field>

          {/* ── Footer ───────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E4DF] mt-2">
            <button type="button" onClick={onClose} className="serif-btn-secondary min-h-0 h-10 px-4 text-sm">
              Cancel
            </button>
            <button type="submit" className="serif-btn-primary min-h-0 h-10 px-5 text-sm">
              <Save className="w-4 h-4" />
              {editingSubscription ? 'Update Subscription' : 'Create Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
