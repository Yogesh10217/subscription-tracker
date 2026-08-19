import React from 'react';
import { Zap, ArrowUpRight } from 'lucide-react';
import { SubscriptionItem } from './SubscriptionTable';
import { convertCurrency } from '@/utils/currency';

interface AnalyticsSectionProps {
  subscriptions: SubscriptionItem[];
  currencySymbol: string;
  currency?: string;
}

// Warm editorial palette — avoids neon, favors muted, intentional tones
const CATEGORY_COLORS: Record<string, string> = {
  Entertainment:    '#B8860B', // burnished gold
  'SaaS & Tools':   '#7C6A5A', // warm brown-gray
  'Cloud & Hosting':'#D97706', // amber
  Utilities:        '#16A34A', // green
  'Fitness & Health':'#7C3AED',// violet
  Other:            '#9CA3AF', // cool gray
};

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  subscriptions,
  currencySymbol,
  currency = 'USD',
}) => {
  // ── Compute category totals ──────────────────────────────────
  const categoryTotals: Record<string, number> = {};
  let grandTotal = 0;

  subscriptions.forEach((sub) => {
    if (sub.status === 'cancelled') return;
    const convertedPrice = convertCurrency(sub.price, sub.currency || 'USD', currency);
    let monthlyCost = convertedPrice;
    if (sub.frequency === 'yearly')      monthlyCost = convertedPrice / 12;
    else if (sub.frequency === 'weekly') monthlyCost = convertedPrice * 4.33;
    categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyCost;
    grandTotal += monthlyCost;
  });

  const categories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);

  return (
    <div className="mb-8">
      {/* ── Section Label — editorial flanking rule lines ──────── */}
      <div className="section-label-line mb-6">
        <span className="font-mono text-[11px] font-medium tracking-[0.15em] uppercase text-[#B8860B] flex-shrink-0">
          Spend Analytics
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Category Breakdown (2/3 width) ─────────────────────── */}
        <div className="serif-card p-6 lg:col-span-2">
          {/* Card header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg text-[#1A1A1A] tracking-tight leading-snug">
                Category Spend Allocation
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                Monthly cost distribution by service domain
              </p>
            </div>
            <span className="small-caps text-[#B8860B] mt-1">
              {currencySymbol}{grandTotal.toFixed(2)}/mo
            </span>
          </div>

          {/* Progress bars */}
          <div className="space-y-5">
            {categories.length === 0 ? (
              <p className="text-sm text-[#6B6B6B] py-4">No active categories recorded.</p>
            ) : (
              categories.map(([cat, total]) => {
                const percentage = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0;
                const color = CATEGORY_COLORS[cat] || '#9CA3AF';
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-xs mb-2">
                      {/* Category label with color swatch */}
                      <span className="flex items-center gap-2 font-medium text-[#1A1A1A]">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        {cat}
                      </span>
                      <span className="font-mono text-[#6B6B6B] tabular-nums">
                        {currencySymbol}{total.toFixed(2)}
                        <span className="text-[#9CA3AF] ml-1.5">({percentage}%)</span>
                      </span>
                    </div>
                    {/* Warm ivory track, category-colored fill */}
                    <div className="w-full bg-[#F5F3F0] h-1.5 rounded-full overflow-hidden border border-[#E8E4DF]">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── AI Pulse Insights (1/3 width) ──────────────────────── */}
        <div className="serif-card p-6 flex flex-col justify-between">
          {/* Card header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[rgba(184,134,11,0.09)] flex items-center justify-center flex-shrink-0">
                <Zap className="w-4.5 h-4.5 text-[#B8860B]" />
              </div>
              <div>
                <h3 className="font-serif text-base text-[#1A1A1A] tracking-tight leading-snug">
                  AI Pulse Insights
                </h3>
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B8860B]">
                  Live Recommendation
                </span>
              </div>
            </div>

            {/* Insight block */}
            <div className="bg-[#FAFAF8] border border-[#E8E4DF] rounded-md p-4 mb-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-semibold text-[#1A1A1A]">Annual Billing Savings</span>
                <span className="flex-shrink-0 text-[10px] bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-[0.06em]">
                  Save 18%
                </span>
              </div>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Switching 3 monthly subscriptions to annual billing can save you up to{' '}
                <span className="font-mono font-semibold text-[#1A1A1A]">
                  {currencySymbol}{(grandTotal * 0.18 * 12).toFixed(2)}/year
                </span>
                .
              </p>
            </div>

            {/* Second hint */}
            <div className="bg-[#FAFAF8] border border-[#E8E4DF] rounded-md p-4">
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                <span className="font-semibold text-[#1A1A1A]">Duplicate coverage detected.</span>{' '}
                GitHub Copilot and ChatGPT Plus may overlap. Review for consolidation.
              </p>
            </div>
          </div>

          {/* CTA */}
          <button className="serif-btn-secondary w-full mt-5 justify-between text-xs min-h-0 h-10">
            <span>View Full Optimization Report</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#B8860B]" />
          </button>
        </div>

      </div>
    </div>
  );
};
