import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Sparkles } from 'lucide-react';
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

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSubscription,
  currency,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: currency || 'USD',
    frequency: 'monthly',
    category: 'Entertainment',
    paymentMethod: 'Credit Card',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (editingSubscription) {
      setFormData({
        name: editingSubscription.name || '',
        price: editingSubscription.price ? String(editingSubscription.price) : '',
        currency: editingSubscription.currency || currency || 'USD',
        frequency: editingSubscription.frequency || 'monthly',
        category: editingSubscription.category || 'Entertainment',
        paymentMethod: editingSubscription.paymentMethod || 'Credit Card',
        status: editingSubscription.status || 'active',
        startDate: editingSubscription.startDate
          ? new Date(editingSubscription.startDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        notes: editingSubscription.notes || '',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        currency: currency || 'USD',
        frequency: 'monthly',
        category: 'Entertainment',
        paymentMethod: 'Credit Card',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [editingSubscription, isOpen, currency]);

  const handleNameChange = (val: string) => {
    const brand = matchBrandByName(val);
    setFormData((prev) => ({
      ...prev,
      name: val,
      category: brand ? brand.category : prev.category,
    }));
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    onSave({
      ...(editingSubscription ? { _id: editingSubscription._id } : {}),
      name: formData.name,
      price: parseFloat(formData.price),
      currency: formData.currency,
      frequency: formData.frequency,
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      status: formData.status as any,
      startDate: formData.startDate,
      notes: formData.notes,
    });

    onClose();
  };

  const detectedBrand = matchBrandByName(formData.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="subpulse-card w-full max-w-lg p-6 bg-[#1f1f27] border-[#292932] shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#292932] mb-5">
          <h3 className="text-lg font-bold text-white">
            {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#292932] text-[#908fa0] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#908fa0] font-medium">Service Name *</label>
              {detectedBrand && (
                <span className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-detected {detectedBrand.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <ServiceLogo name={formData.name} size="md" />
              <input
                type="text"
                required
                placeholder="e.g. Netflix, AWS, Spotify, GitHub, Figma, ChatGPT"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="subpulse-input flex-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#908fa0] mb-1 font-medium">Billed Price & Currency *</label>
              <div className="flex items-center gap-1.5">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="subpulse-input bg-[#1b1b23] font-mono w-20 text-center font-semibold text-[#8083ff]"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="19.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="subpulse-input flex-1 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#908fa0] mb-1 font-medium">Billing Cycle</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="subpulse-input w-full bg-[#1b1b23]"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#908fa0] mb-1 font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="subpulse-input w-full bg-[#1b1b23]"
              >
                <option value="Entertainment">Entertainment</option>
                <option value="SaaS & Tools">SaaS & Tools</option>
                <option value="Cloud & Hosting">Cloud & Hosting</option>
                <option value="Utilities">Utilities</option>
                <option value="Fitness & Health">Fitness & Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[#908fa0] mb-1 font-medium">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="subpulse-input w-full bg-[#1b1b23]"
              >
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#908fa0] mb-1 font-medium">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="subpulse-input w-full font-mono"
              />
            </div>

            <div>
              <label className="block text-[#908fa0] mb-1 font-medium">Payment Method</label>
              <input
                type="text"
                placeholder="e.g. Visa ****4242"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="subpulse-input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#908fa0] mb-1 font-medium">Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="Add any reminders or plan details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="subpulse-input w-full resize-none"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#292932]">
            <button type="button" onClick={onClose} className="subpulse-btn-secondary py-2 text-xs">
              Cancel
            </button>
            <button type="submit" className="subpulse-btn-primary py-2 text-xs">
              <Save className="w-4 h-4" />
              <span>{editingSubscription ? 'Update Subscription' : 'Create Subscription'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
