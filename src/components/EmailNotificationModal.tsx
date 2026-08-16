'use client';

import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SubscriptionItem } from './SubscriptionTable';

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: SubscriptionItem[];
  currencySymbol: string;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({
  isOpen,
  onClose,
  subscriptions,
  currencySymbol,
}) => {
  const [email, setEmail] = useState('');
  const [selectedSubId, setSelectedSubId] = useState(subscriptions[0]?._id || '');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid Gmail address.' });
      return;
    }

    const sub = subscriptions.find((s) => s._id === selectedSubId) || subscriptions[0];
    if (!sub) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          serviceName: sub.name,
          price: sub.price,
          currency: sub.currency || 'USD',
          frequency: sub.frequency || 'monthly',
          renewalDate: sub.renewalDate || new Date().toISOString(),
          daysLeft: 3,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setStatusMessage({
          type: 'success',
          text: `Gmail alert sent successfully to ${email}!`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: json.error || 'Failed to deliver email alert.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'Network error or server API route offline.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="subpulse-card w-full max-w-md p-6 bg-[#1f1f27] border-[#292932] shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#292932] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8083ff]/15 flex items-center justify-center text-[#8083ff]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gmail Renewal Alerts</h3>
              <p className="text-[10px] text-[#908fa0]">Send automated SMTP reminders to your inbox</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#292932] text-[#908fa0] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#908fa0] mb-1 font-medium">Your Gmail Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="subpulse-input w-full"
            />
          </div>

          <div>
            <label className="block text-[#908fa0] mb-1 font-medium">Select Subscription Alert *</label>
            <select
              value={selectedSubId}
              onChange={(e) => setSelectedSubId(e.target.value)}
              className="subpulse-input w-full bg-[#1b1b23]"
            >
              {subscriptions.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.currency || 'USD'} {sub.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-lg flex items-start gap-2 text-xs ${
                statusMessage.type === 'success'
                  ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                  : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#292932]">
            <button type="button" onClick={onClose} className="subpulse-btn-secondary py-2 text-xs">
              Close
            </button>
            <button type="submit" disabled={loading} className="subpulse-btn-primary py-2 text-xs">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Gmail...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Live Gmail Alert</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
