'use client';

import React from 'react';
import { Plus, Bell, Download } from 'lucide-react';

interface HeaderProps {
  currency: string;
  onCurrencyChange: (currency: string) => void;
  onOpenAddModal: () => void;
  onExportReport: () => void;
  onOpenEmailModal?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  onOpenAddModal,
  onExportReport,
  onOpenEmailModal,
  unreadNotificationsCount = 2,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/95 backdrop-blur-sm border-b border-[#E8E4DF] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* ── Brand Mark ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Gold accent rule before wordmark */}
          <div className="hidden sm:block w-0.5 h-7 bg-[#B8860B] rounded-full" aria-hidden="true" />
          <div>
            <div className="flex items-center gap-2.5 leading-none">
              {/* Playfair Display italic wordmark */}
              <span className="font-serif italic text-[1.35rem] text-[#1A1A1A] tracking-tight select-none">
                SubPulse
              </span>
              {/* Pro badge — small-caps treatment */}
              <span className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase px-2 py-0.5 rounded bg-[rgba(184,134,11,0.09)] text-[#B8860B] border border-[rgba(184,134,11,0.22)]">
                Pro
              </span>
            </div>
            <p className="hidden sm:block font-mono text-[10px] tracking-[0.1em] uppercase text-[#6B6B6B] mt-0.5">
              Subscription Intelligence
            </p>
          </div>
        </div>

        {/* ── Live Status Pill (desktop) ───────────────────────────── */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F3F0] border border-[#E8E4DF]">
          {/* Pulsing green dot */}
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#6B6B6B]">
            Engine Live
          </span>
        </div>

        {/* ── Action Controls ──────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Currency Switcher */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="serif-select min-h-0 h-9 text-xs font-mono font-medium appearance-none pr-6 cursor-pointer"
              style={{ width: 'auto', minWidth: '78px' }}
            >
              <option value="USD">$ USD</option>
              <option value="INR">₹ INR</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#6B6B6B]">
              ▼
            </div>
          </div>

          {/* Notification / Email Bell */}
          <button
            onClick={onOpenEmailModal}
            title="Send Live Email Alert"
            className="relative flex items-center justify-center h-9 w-9 rounded-md bg-white border border-[#E8E4DF] text-[#6B6B6B] hover:text-[#B8860B] hover:border-[rgba(184,134,11,0.5)] transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#DC2626] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Export Report */}
          <button
            onClick={onExportReport}
            title="Export JSON Report"
            className="hidden sm:flex items-center justify-center h-9 w-9 rounded-md bg-white border border-[#E8E4DF] text-[#6B6B6B] hover:text-[#B8860B] hover:border-[rgba(184,134,11,0.5)] transition-all duration-200"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Add Subscription CTA — Burnished Gold */}
          <button
            onClick={onOpenAddModal}
            className="serif-btn-primary h-9 min-h-0 px-3.5 text-xs"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Add Subscription</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

      </div>
    </header>
  );
};
