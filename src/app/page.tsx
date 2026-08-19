'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MetricCards } from '@/components/MetricCards';
import { SubscriptionTable, SubscriptionItem } from '@/components/SubscriptionTable';
import { AnalyticsSection } from '@/components/AnalyticsSection';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import { EmailNotificationModal } from '@/components/EmailNotificationModal';
import { convertCurrency, CURRENCIES } from '@/utils/currency';

const INITIAL_DEMO_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    _id: 'sub_1',
    name: 'Netflix Premium',
    price: 649.00,
    currency: 'INR',
    frequency: 'monthly',
    category: 'Entertainment',
    paymentMethod: 'UPI / Card',
    status: 'active',
    startDate: '2024-01-15',
    renewalDate: '2026-08-16T00:00:00.000Z',
    notes: 'Family 4K plan (India)',
  },
  {
    _id: 'sub_2',
    name: 'Spotify Family',
    price: 179.00,
    currency: 'INR',
    frequency: 'monthly',
    category: 'Entertainment',
    paymentMethod: 'Mastercard ****8812',
    status: 'active',
    startDate: '2023-11-01',
    renewalDate: '2026-08-26T00:00:00.000Z',
  },
  {
    _id: 'sub_3',
    name: 'AWS Cloud Infrastructure',
    price: 145.00,
    currency: 'USD',
    frequency: 'monthly',
    category: 'Cloud & Hosting',
    paymentMethod: 'Amex ****9011',
    status: 'active',
    startDate: '2023-06-10',
    renewalDate: '2026-08-19T00:00:00.000Z',
  },
  {
    _id: 'sub_4',
    name: 'GitHub Copilot Enterprise',
    price: 190.00,
    currency: 'USD',
    frequency: 'yearly',
    category: 'SaaS & Tools',
    paymentMethod: 'Company Credit Card',
    status: 'active',
    startDate: '2024-02-01',
    renewalDate: '2026-09-28T00:00:00.000Z',
  },
  {
    _id: 'sub_5',
    name: 'Figma Professional',
    price: 15.00,
    currency: 'USD',
    frequency: 'monthly',
    category: 'SaaS & Tools',
    paymentMethod: 'Visa ****4242',
    status: 'trial',
    startDate: '2024-08-01',
    renewalDate: '2026-08-17T00:00:00.000Z',
  },
  {
    _id: 'sub_6',
    name: 'ChatGPT Plus',
    price: 20.00,
    currency: 'USD',
    frequency: 'monthly',
    category: 'SaaS & Tools',
    paymentMethod: 'Visa ****4242',
    status: 'active',
    startDate: '2024-03-01',
    renewalDate: '2026-08-22T00:00:00.000Z',
  },
  {
    _id: 'sub_7',
    name: 'Vercel Pro Plan',
    price: 20.00,
    currency: 'USD',
    frequency: 'monthly',
    category: 'Cloud & Hosting',
    paymentMethod: 'Amex ****9011',
    status: 'active',
    startDate: '2024-04-12',
    renewalDate: '2026-08-30T00:00:00.000Z',
  },
];

export default function DashboardPage() {
  const [currency, setCurrency] = useState('USD');
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(INITIAL_DEMO_SUBSCRIPTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubscriptionItem | null>(null);

  const currencySymbol = CURRENCIES[currency]?.symbol || '$';

  // Fetch from API if MongoDB is connected
  useEffect(() => {
    async function loadSubscriptions() {
      try {
        const res = await fetch('/api/subscriptions');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setSubscriptions(json.data);
        }
      } catch {
        console.warn('API endpoint unavailable, using in-memory demo state.');
      }
    }
    loadSubscriptions();
  }, []);

  // ── Metrics ───────────────────────────────────────────────────
  let totalMonthlySpend = 0;
  let activeCount       = 0;
  let trialCount        = 0;
  let upcomingCount     = 0;

  const now      = new Date();
  const next7    = new Date();
  next7.setDate(now.getDate() + 7);

  subscriptions.forEach((sub) => {
    if (sub.status === 'cancelled') return;
    const converted   = convertCurrency(sub.price, sub.currency || 'USD', currency);
    let monthlyCost   = converted;
    if (sub.frequency === 'yearly')      monthlyCost = converted / 12;
    else if (sub.frequency === 'weekly') monthlyCost = converted * 4.33;
    totalMonthlySpend += monthlyCost;
    if (sub.status === 'active') activeCount++;
    if (sub.status === 'trial')  trialCount++;
    if (sub.renewalDate) {
      const renewal = new Date(sub.renewalDate);
      if (renewal >= now && renewal <= next7) upcomingCount++;
    }
  });

  const yearlyEstimate = totalMonthlySpend * 12;

  // ── Handlers ──────────────────────────────────────────────────
  const handleOpenAddModal = () => { setEditingSub(null); setIsModalOpen(true); };
  const handleEditSub      = (sub: SubscriptionItem) => { setEditingSub(sub); setIsModalOpen(true); };

  const handleDeleteSub = async (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s._id !== id));
    try { await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' }); } catch { /* noop */ }
  };

  const handleSaveSub = async (data: Partial<SubscriptionItem>) => {
    if (data._id) {
      setSubscriptions((prev) =>
        prev.map((s) => (s._id === data._id ? ({ ...s, ...data } as SubscriptionItem) : s))
      );
      try {
        await fetch(`/api/subscriptions/${data._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch { /* noop */ }
    } else {
      const newSub: SubscriptionItem = {
        _id:           'sub_' + Date.now(),
        name:          data.name          || 'Untitled Service',
        price:         data.price         || 0,
        currency:      data.currency      || currency,
        frequency:     data.frequency     || 'monthly',
        category:      data.category      || 'Other',
        paymentMethod: data.paymentMethod || 'Credit Card',
        status:        (data.status as any) || 'active',
        startDate:     data.startDate     || new Date().toISOString().split('T')[0],
        renewalDate:   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes:         data.notes         || '',
      };
      setSubscriptions((prev) => [newSub, ...prev]);
      try {
        await fetch('/api/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch { /* noop */ }
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s._id === id ? { ...s, status: newStatus as any } : s))
    );
  };

  const handleExportReport = () => {
    const blob = new Blob([JSON.stringify(subscriptions, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = `subpulse-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    // paper-texture + ambient-glow are applied via CSS pseudo-elements in globals.css
    <div className="min-h-screen flex flex-col bg-background paper-texture ambient-glow">

      {/* ── Sticky Header ─────────────────────────────────────── */}
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenAddModal={handleOpenAddModal}
        onExportReport={handleExportReport}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
      />

      {/* ── Dashboard Body ────────────────────────────────────── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 lg:py-10">
        {/* KPI Cards */}
        <MetricCards
          totalMonthlySpend={totalMonthlySpend}
          yearlyEstimate={yearlyEstimate}
          activeCount={activeCount}
          trialCount={trialCount}
          upcomingRenewalsCount={upcomingCount}
          currencySymbol={currencySymbol}
        />

        {/* Analytics */}
        <AnalyticsSection
          subscriptions={subscriptions}
          currencySymbol={currencySymbol}
          currency={currency}
        />

        {/* Subscriptions Table */}
        <SubscriptionTable
          subscriptions={subscriptions}
          currencySymbol={currencySymbol}
          currency={currency}
          onEdit={handleEditSub}
          onDelete={handleDeleteSub}
          onStatusChange={handleStatusChange}
        />
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#E8E4DF] py-5 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Wordmark */}
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-base text-[#1A1A1A] tracking-tight">
              SubPulse
            </span>
            <span className="w-px h-4 bg-[#E8E4DF]" aria-hidden="true" />
            <span className="text-xs text-[#6B6B6B]">
              Next.js 14 · Subscription Intelligence Engine
            </span>
          </div>
          {/* Copyright */}
          <p className="text-xs text-[#9CA3AF]">
            © {new Date().getFullYear()} SubPulse Inc. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── Modals ────────────────────────────────────────────── */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSub}
        editingSubscription={editingSub}
        currency={currency}
      />

      <EmailNotificationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        subscriptions={subscriptions}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}
