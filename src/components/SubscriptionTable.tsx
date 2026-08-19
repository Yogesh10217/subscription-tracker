'use client';

import React, { useState } from 'react';
import { Search, Trash2, Edit3 } from 'lucide-react';
import { ServiceLogo } from './ServiceLogo';
import { convertCurrency, CURRENCIES } from '@/utils/currency';

export interface SubscriptionItem {
  _id: string;
  name: string;
  price: number;
  currency: string;
  frequency: string;
  category: string;
  paymentMethod: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  renewalDate: string;
  icon?: string;
  notes?: string;
}

interface SubscriptionTableProps {
  subscriptions: SubscriptionItem[];
  currencySymbol: string;
  currency: string;
  onEdit: (sub: SubscriptionItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
}

// Soft editorial status badges — semantic colors preserved, warm borders
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          Active
        </span>
      );
    case 'trial':
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
          Trial
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
          {status}
        </span>
      );
  }
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  currencySymbol,
  currency = 'USD',
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(subscriptions.map((s) => s.category)))];

  const filtered = subscriptions.filter((sub) => {
    const matchSearch   = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'All' || sub.category === categoryFilter;
    const matchStatus   = statusFilter === 'All' || sub.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="serif-card">

      {/* ── Table Header & Filters ─────────────────────────────── */}
      <div className="p-5 pb-0">
        {/* Section label */}
        <div className="section-label-line mb-5">
          <span className="font-mono text-[11px] font-medium tracking-[0.15em] uppercase text-[#B8860B] flex-shrink-0">
            Active Subscriptions
          </span>
        </div>

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <p className="text-xs text-[#6B6B6B]">
            Showing{' '}
            <span className="font-mono font-medium text-[#1A1A1A]">{filtered.length}</span>
            {' '}of{' '}
            <span className="font-mono font-medium text-[#1A1A1A]">{subscriptions.length}</span>
            {' '}recurring services
          </p>

          {/* Filter controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#B8860B]/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="serif-input min-h-0 h-9 pl-8 pr-3 text-xs w-44 sm:w-52"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="serif-select min-h-0 h-9 text-xs pr-7 appearance-none"
                style={{ minWidth: '130px' }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#6B6B6B]">▼</span>
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="serif-select min-h-0 h-9 text-xs pr-7 appearance-none"
                style={{ minWidth: '120px' }}
              >
                <option value="All">All Statuses</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#6B6B6B]">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">

          {/* Head — IBM Plex Mono small-caps, hairline bottom border */}
          <thead>
            <tr className="border-b border-[#E8E4DF] bg-[#FAFAF8]">
              {['Service', 'Category', 'Billing', 'Price', 'Next Renewal', 'Status', ''].map((col, i) => (
                <th
                  key={col + i}
                  className="py-3 px-4 font-mono text-[10px] font-medium tracking-[0.13em] uppercase text-[#6B6B6B] whitespace-nowrap"
                  style={i === 6 ? { textAlign: 'right' } : undefined}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-sm text-[#6B6B6B]">
                  <span className="font-serif italic text-lg block mb-1 text-[#9CA3AF]">Nothing here.</span>
                  No subscriptions match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => {
                const nativeSymbol = CURRENCIES[sub.currency || 'USD']?.symbol || '$';
                const isDifferent  = (sub.currency || 'USD') !== (currency || 'USD');
                const converted    = convertCurrency(sub.price, sub.currency || 'USD', currency);

                return (
                  <tr
                    key={sub._id}
                    className="border-b border-[#F0EDE9] hover:bg-[#F5F3F0]/50 transition-colors duration-150 group"
                  >
                    {/* Service name + logo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <ServiceLogo name={sub.name} size="md" />
                        <div>
                          <div className="text-sm font-semibold text-[#1A1A1A] leading-snug">
                            {sub.name}
                          </div>
                          <div className="text-[11px] text-[#6B6B6B]">
                            {sub.paymentMethod || 'Credit Card'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs px-2.5 py-1 rounded bg-[#F5F3F0] text-[#6B6B6B] border border-[#E8E4DF] whitespace-nowrap">
                        {sub.category}
                      </span>
                    </td>

                    {/* Billing cycle */}
                    <td className="py-3.5 px-4 text-sm text-[#6B6B6B] capitalize">
                      {sub.frequency}
                    </td>

                    {/* Price — primary in Playfair-ish numerals via font-serif */}
                    <td className="py-3.5 px-4">
                      <div className="font-serif font-semibold text-sm text-[#1A1A1A] tabular-nums leading-snug">
                        {nativeSymbol}{Number(sub.price).toFixed(2)}
                        <span className="font-sans font-normal text-[10px] text-[#9CA3AF] ml-1">
                          {sub.currency || 'USD'}/{sub.frequency.charAt(0)}
                        </span>
                      </div>
                      {isDifferent && (
                        <div className="font-mono text-[11px] text-[#B8860B] mt-0.5">
                          ≈ {currencySymbol}{converted.toFixed(2)}
                        </div>
                      )}
                    </td>

                    {/* Next renewal */}
                    <td className="py-3.5 px-4 font-mono text-xs text-[#6B6B6B] whitespace-nowrap" suppressHydrationWarning>
                      {sub.renewalDate
                        ? new Date(sub.renewalDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            timeZone: 'UTC',
                          })
                        : '—'}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={sub.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => onEdit(sub)}
                          title="Edit Subscription"
                          className="p-1.5 rounded-md hover:bg-[#F5F3F0] text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(sub._id)}
                          title="Delete Subscription"
                          className="p-1.5 rounded-md hover:bg-red-50 text-[#9CA3AF] hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table footer */}
      {filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-[#F0EDE9] bg-[#FAFAF8] rounded-b-lg">
          <p className="text-[11px] text-[#9CA3AF] font-mono">
            {filtered.length} service{filtered.length !== 1 ? 's' : ''} · actions visible on row hover
          </p>
        </div>
      )}
    </div>
  );
};
