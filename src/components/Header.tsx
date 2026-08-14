'use client';

import React from 'react';
import { Activity, Plus, Bell, Download, DollarSign, Euro, IndianRupee } from 'lucide-react';

interface HeaderProps {
  currency: string;
  onCurrencyChange: (currency: string) => void;
  onOpenAddModal: () => void;
  onExportReport: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  onOpenAddModal,
  onExportReport,
  unreadNotificationsCount = 2,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#13131b]/95 border-b border-[#292932] px-4 lg:px-8 py-3.5 backdrop-blur-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#4cd7f6] flex items-center justify-center shadow-lg shadow-[#8083ff]/10">
            <Activity className="w-5 h-5 text-[#1000a9]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">SubPulse</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#8083ff]/15 text-[#c0c1ff]">
                Pro
              </span>
            </div>
            <p className="text-xs text-[#908fa0] font-medium hidden sm:block">Subscription Intelligence</p>
          </div>
        </div>

        {/* Live System Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1b1b23] border border-[#292932] text-xs text-[#c7c4d7]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span>Engine Connected</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Currency Switcher */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="subpulse-input py-1.5 px-3 text-xs font-mono font-semibold bg-[#1b1b23] border-[#292932] cursor-pointer appearance-none pr-7"
            >
              <option value="USD">$ USD</option>
              <option value="INR">₹ INR</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#908fa0]">
              ▼
            </div>
          </div>

          {/* Notifications Button */}
          <button
            title="Notifications"
            className="p-2 rounded-lg bg-[#1b1b23] border border-[#292932] text-[#c7c4d7] hover:text-white hover:border-[#34343d] transition-all relative"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Export Report */}
          <button
            onClick={onExportReport}
            title="Export Report"
            className="p-2 rounded-lg bg-[#1b1b23] border border-[#292932] text-[#c7c4d7] hover:text-white hover:border-[#34343d] transition-all hidden sm:flex"
          >
            <Download className="w-4.5 h-4.5" />
          </button>

          {/* Add Subscription Button */}
          <button onClick={onOpenAddModal} className="subpulse-btn-primary text-xs sm:text-sm py-2 px-3.5">
            <Plus className="w-4 h-4" />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>
    </header>
  );
};
