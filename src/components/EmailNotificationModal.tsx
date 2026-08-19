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
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
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
          to:          email,
          serviceName: sub.name,
          price:       sub.price,
          currency:    sub.currency || 'USD',
          frequency:   sub.frequency || 'monthly',
          renewalDate: sub.renewalDate || new Date().toISOString(),
          daysLeft:    3,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setStatusMessage({ type: 'success', text: `Alert sent successfully to ${email}!` });
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Failed to deliver email alert.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error or server API route offline.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-lg border border-[#E8E4DF] shadow-[0_8px_32px_rgba(26,26,26,0.10)]">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E8E4DF]">
          <div className="flex items-center gap-3">
            {/* Gold mail icon */}
            <div className="w-9 h-9 rounded-lg bg-[rgba(184,134,11,0.09)] flex items-center justify-center flex-shrink-0">
              <Mail className="w-4.5 h-4.5 text-[#B8860B]" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-[#1A1A1A] tracking-tight leading-snug">
                Email Renewal Alerts
              </h3>
              <p className="font-mono text-[10px] tracking-[0.08em] text-[#6B6B6B] mt-0.5">
                SMTP reminders to your inbox
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#F5F3F0] text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Form ───────────────────────────────────────────────── */}
        <form onSubmit={handleSendEmail} className="px-6 py-5 space-y-4">

          {/* Email address */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-[#6B6B6B] block">
              Your Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="serif-input"
            />
          </div>

          {/* Subscription selector */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-[#6B6B6B] block">
              Select Subscription to Alert *
            </label>
            <div className="relative">
              <select
                value={selectedSubId}
                onChange={(e) => setSelectedSubId(e.target.value)}
                className="serif-select appearance-none pr-7"
              >
                {subscriptions.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} ({sub.currency || 'USD'} {sub.price.toFixed(2)})
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#6B6B6B]">▼</span>
            </div>
          </div>

          {/* Status message */}
          {statusMessage && (
            <div
              className={[
                'flex items-start gap-2.5 text-sm p-3.5 rounded-md border',
                statusMessage.type === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200',
              ].join(' ')}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* ── Footer ───────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E4DF] mt-2">
            <button type="button" onClick={onClose} className="serif-btn-secondary min-h-0 h-10 px-4 text-sm">
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="serif-btn-primary min-h-0 h-10 px-5 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Alert
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
