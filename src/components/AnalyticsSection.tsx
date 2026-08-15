import React from 'react';
import { PieChart, Zap, ArrowUpRight } from 'lucide-react';
import { SubscriptionItem } from './SubscriptionTable';
import { convertCurrency } from '@/utils/currency';

interface AnalyticsSectionProps {
  subscriptions: SubscriptionItem[];
  currencySymbol: string;
  currency?: string;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  subscriptions,
  currencySymbol,
  currency = 'USD',
}) => {
  const categoryTotals: Record<string, number> = {};
  let grandTotal = 0;

  subscriptions.forEach((sub) => {
    if (sub.status === 'cancelled') return;

    // Convert sub native price to active global target currency
    const convertedPrice = convertCurrency(sub.price, sub.currency || 'USD', currency);

    let monthlyCost = convertedPrice;
    if (sub.frequency === 'yearly') monthlyCost = convertedPrice / 12;
    else if (sub.frequency === 'weekly') monthlyCost = convertedPrice * 4.33;

    categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyCost;
    grandTotal += monthlyCost;
  });

  const categoryColors: Record<string, string> = {
    Entertainment: '#8083ff',
    'SaaS & Tools': '#4cd7f6',
    'Cloud & Hosting': '#d97721',
    Utilities: '#10B981',
    'Fitness & Health': '#F59E0B',
    Other: '#908fa0',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Category Spending Breakdown */}
      <div className="subpulse-card p-5 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Category Spend Allocation</h3>
            <p className="text-xs text-[#908fa0]">Monthly cost distribution by service domain</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#8083ff]/15 flex items-center justify-center text-[#c0c1ff]">
            <PieChart className="w-4 h-4" />
          </div>
        </div>

        {/* Progress Bars for Categories */}
        <div className="space-y-4">
          {Object.entries(categoryTotals).length === 0 ? (
            <p className="text-xs text-[#908fa0] py-4">No active categories recorded.</p>
          ) : (
            Object.entries(categoryTotals).map(([cat, total]) => {
              const percentage = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0;
              const color = categoryColors[cat] || '#8083ff';

              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                      {cat}
                    </span>
                    <span className="font-mono text-[#c7c4d7]">
                      {currencySymbol}
                      {total.toFixed(2)} / mo ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#1b1b23] h-2 rounded-full overflow-hidden border border-[#292932]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Intelligent AI Pulse Recommendations */}
      <div className="subpulse-card p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#4cd7f6]/15 flex items-center justify-center text-[#4cd7f6]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">SubPulse AI Insights</h3>
              <p className="text-[10px] text-[#4cd7f6] uppercase tracking-wider font-semibold">Live Recommendation</p>
            </div>
          </div>

          <div className="bg-[#1b1b23] border border-[#292932] rounded-lg p-3.5 mb-3 text-xs space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-white">Annual Billing Savings</span>
              <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.5 rounded font-mono font-bold">
                Save 18%
              </span>
            </div>
            <p className="text-[#908fa0] leading-relaxed">
              Switching 3 monthly subscriptions (GitHub, Figma, Notion) to annual billing can save you up to{' '}
              <span className="text-white font-mono font-semibold">
                {currencySymbol}
                {(grandTotal * 0.18 * 12).toFixed(2)}/year
              </span>
              .
            </p>
          </div>
        </div>

        <button className="subpulse-btn-secondary w-full text-xs justify-between py-2 mt-2">
          <span>View Optimization Report</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#908fa0]" />
        </button>
      </div>
    </div>
  );
};
