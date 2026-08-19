'use client';

import React from 'react';
import { TrendingUp, Calendar, ShieldCheck, Lightbulb } from 'lucide-react';

interface MetricCardsProps {
  totalMonthlySpend: number;
  yearlyEstimate: number;
  activeCount: number;
  trialCount: number;
  upcomingRenewalsCount: number;
  currencySymbol: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalMonthlySpend,
  yearlyEstimate,
  activeCount,
  trialCount,
  upcomingRenewalsCount,
  currencySymbol,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

      {/* ── Card 1: Monthly Spend — GOLD ACCENT (primary metric) ──── */}
      <div className="serif-card serif-card-accent-top p-6">
        {/* Label */}
        <div className="flex items-center justify-between mb-4">
          <span className="small-caps text-[#B8860B]">Monthly Spend</span>
          <div className="w-8 h-8 rounded-lg bg-[rgba(184,134,11,0.08)] flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#B8860B]" />
          </div>
        </div>

        {/* Primary number — Playfair Display */}
        <div className="mb-1">
          <span className="font-serif text-3xl lg:text-4xl font-semibold text-[#1A1A1A] tracking-tight leading-none">
            {currencySymbol}
            {totalMonthlySpend.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Trend badge */}
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16A34A] bg-[#16A34A]/8 px-2 py-0.5 rounded-full border border-[#16A34A]/20">
            <TrendingUp className="w-2.5 h-2.5" />
            +3.2%
          </span>
          <span className="text-xs text-[#6B6B6B]">vs last month</span>
        </div>

        {/* Sub-line */}
        <div className="mt-3 pt-3 border-t border-[#E8E4DF]">
          <p className="text-xs text-[#6B6B6B]">
            Annual estimate:{' '}
            <span className="font-mono font-medium text-[#1A1A1A]">
              {currencySymbol}
              {yearlyEstimate.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>
      </div>

      {/* ── Card 2: Active Services ───────────────────────────────── */}
      <div className="serif-card p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="small-caps">Active Services</span>
          <div className="w-8 h-8 rounded-lg bg-[#16A34A]/8 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          </div>
        </div>

        <div className="mb-1">
          <span className="font-serif text-3xl lg:text-4xl font-semibold text-[#1A1A1A] tracking-tight leading-none">
            {activeCount}
          </span>
          <span className="font-sans text-sm text-[#6B6B6B] ml-2">services</span>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E8E4DF]">
          <p className="text-xs text-[#6B6B6B]">
            Trials running:{' '}
            <span className="font-mono font-medium text-[#D97706]">
              {trialCount} active
            </span>
          </p>
        </div>
      </div>

      {/* ── Card 3: Upcoming Renewals ─────────────────────────────── */}
      <div className="serif-card p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="small-caps">Renewing Soon</span>
          <div className="w-8 h-8 rounded-lg bg-[#D97706]/8 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[#D97706]" />
          </div>
        </div>

        <div className="mb-1">
          <span className="font-serif text-3xl lg:text-4xl font-semibold text-[#1A1A1A] tracking-tight leading-none">
            {upcomingRenewalsCount}
          </span>
          <span className="font-sans text-sm text-[#6B6B6B] ml-2">in 7 days</span>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E8E4DF]">
          <p className="text-xs text-[#6B6B6B]">
            Auto-alerts:{' '}
            <span className="font-mono font-medium text-[#16A34A]">Enabled</span>
          </p>
        </div>
      </div>

      {/* ── Card 4: Potential Savings ─────────────────────────────── */}
      <div className="serif-card p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="small-caps">Potential Savings</span>
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/8 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-[#7C3AED]" />
          </div>
        </div>

        <div className="mb-1">
          <span className="font-serif text-3xl lg:text-4xl font-semibold text-[#B8860B] tracking-tight leading-none">
            {currencySymbol}
            {(totalMonthlySpend * 0.15).toFixed(2)}
          </span>
          <span className="font-sans text-sm text-[#6B6B6B] ml-1">/mo</span>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E8E4DF]">
          <p className="text-xs text-[#6B6B6B]">2 unutilized services flagged</p>
        </div>
      </div>

    </div>
  );
};
