'use client';

import React from 'react';
import { DollarSign, Calendar, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Metric 1: Total Monthly Spend */}
      <div className="subpulse-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#908fa0]">
            Monthly Spend
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#8083ff]/15 flex items-center justify-center text-[#c0c1ff]">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl lg:text-3xl font-bold font-mono text-white">
            {currencySymbol}
            {totalMonthlySpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-[#10B981] font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +3.2%
          </span>
        </div>
        <p className="text-xs text-[#908fa0]">
          Est. Annual:{' '}
          <span className="font-mono text-[#c7c4d7]">
            {currencySymbol}
            {yearlyEstimate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </p>
      </div>

      {/* Metric 2: Active Subscriptions */}
      <div className="subpulse-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#908fa0]">
            Active Services
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 flex items-center justify-center text-[#10B981]">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl lg:text-3xl font-bold font-mono text-white">
            {activeCount}
          </span>
          <span className="text-xs text-[#908fa0]">services active</span>
        </div>
        <p className="text-xs text-[#908fa0]">
          Trials running:{' '}
          <span className="font-semibold text-[#F59E0B] font-mono">{trialCount} active</span>
        </p>
      </div>

      {/* Metric 3: Upcoming Renewals */}
      <div className="subpulse-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#908fa0]">
            Renewing in 7 Days
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center text-[#F59E0B]">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl lg:text-3xl font-bold font-mono text-white">
            {upcomingRenewalsCount}
          </span>
          <span className="text-xs text-[#908fa0]">subscriptions due</span>
        </div>
        <p className="text-xs text-[#908fa0]">
          Auto-renew alerts:{' '}
          <span className="text-[#10B981] font-semibold">Enabled</span>
        </p>
      </div>

      {/* Metric 4: Optimization Insights */}
      <div className="subpulse-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#908fa0]">
            Potential Savings
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#4cd7f6]/15 flex items-center justify-center text-[#4cd7f6]">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl lg:text-3xl font-bold font-mono text-[#4cd7f6]">
            {currencySymbol}
            {(totalMonthlySpend * 0.15).toFixed(2)}
          </span>
          <span className="text-xs text-[#4cd7f6] font-semibold">/mo</span>
        </div>
        <p className="text-xs text-[#908fa0]">
          2 unutilized services flagged
        </p>
      </div>
    </div>
  );
};
