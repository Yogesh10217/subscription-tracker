'use client';

import React, { useState } from 'react';
import { Search, Filter, Trash2, Edit3, ExternalLink, Shield, CheckCircle, Clock, XCircle } from 'lucide-react';

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
  onEdit: (sub: SubscriptionItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  currencySymbol,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(subscriptions.map((s) => s.category)))];

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || sub.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || sub.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            <CheckCircle className="w-3 h-3" /> Active
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
            <Clock className="w-3 h-3" /> Trial
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="subpulse-card p-5">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Active Subscriptions</h2>
          <p className="text-xs text-[#908fa0]">
            Showing {filteredSubscriptions.length} of {subscriptions.length} recurring services
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#908fa0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="subpulse-input pl-9 py-1.5 text-xs w-48 sm:w-60"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="subpulse-input py-1.5 text-xs bg-[#1b1b23] border-[#292932]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="subpulse-input py-1.5 text-xs bg-[#1b1b23] border-[#292932]"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#c7c4d7]">
          <thead className="bg-[#1b1b23] text-[#908fa0] uppercase tracking-wider text-[10px] font-semibold border-b border-[#292932]">
            <tr>
              <th className="py-3 px-4 rounded-l-lg">Service</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Billing Cycle</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Next Renewal</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#292932]">
            {filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[#908fa0]">
                  No subscriptions found matching your filters.
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((sub) => (
                <tr key={sub._id} className="hover:bg-[#1b1b23]/50 transition-colors">
                  {/* Service Name & Icon */}
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#292932] flex items-center justify-center text-sm font-bold text-[#8083ff]">
                        {sub.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{sub.name}</div>
                        <div className="text-[10px] text-[#908fa0]">{sub.paymentMethod || 'Credit Card'}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded bg-[#292932] text-[#c7c4d7] text-[11px]">
                      {sub.category}
                    </span>
                  </td>

                  {/* Billing Cycle */}
                  <td className="py-3.5 px-4 capitalize">{sub.frequency}</td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                    {currencySymbol}
                    {Number(sub.price).toFixed(2)}
                    <span className="text-[10px] font-normal text-[#908fa0]">/{sub.frequency.charAt(0)}</span>
                  </td>

                  {/* Next Renewal */}
                  <td className="py-3.5 px-4 font-mono text-xs" suppressHydrationWarning>
                    {sub.renewalDate
                      ? new Date(sub.renewalDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          timeZone: 'UTC',
                        })
                      : 'N/A'}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">{getStatusBadge(sub.status)}</td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(sub)}
                        title="Edit Subscription"
                        className="p-1.5 rounded hover:bg-[#292932] text-[#908fa0] hover:text-white transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(sub._id)}
                        title="Delete Subscription"
                        className="p-1.5 rounded hover:bg-[#EF4444]/20 text-[#908fa0] hover:text-[#EF4444] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
