import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Subscription from '@/models/Subscription';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const subscriptions = await Subscription.find({ status: { $ne: 'cancelled' } });

    let totalMonthlySpend = 0;
    let activeCount = 0;
    let trialCount = 0;
    const categoryTotals: Record<string, number> = {};

    subscriptions.forEach((sub) => {
      let monthlyCost = sub.price;
      if (sub.frequency === 'yearly') monthlyCost = sub.price / 12;
      else if (sub.frequency === 'weekly') monthlyCost = sub.price * 4.33;
      else if (sub.frequency === 'daily') monthlyCost = sub.price * 30;

      totalMonthlySpend += monthlyCost;

      if (sub.status === 'active') activeCount++;
      if (sub.status === 'trial') trialCount++;

      categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyCost;
    });

    const yearlyEstimate = totalMonthlySpend * 12;

    // Upcoming renewals within 7 days
    const now = new Date();
    const next7Days = new Date();
    next7Days.setDate(now.getDate() + 7);

    const upcomingRenewals = subscriptions.filter(
      (sub) => sub.renewalDate && new Date(sub.renewalDate) >= now && new Date(sub.renewalDate) <= next7Days
    );

    return NextResponse.json({
      success: true,
      data: {
        totalMonthlySpend: Number(totalMonthlySpend.toFixed(2)),
        yearlyEstimate: Number(yearlyEstimate.toFixed(2)),
        activeCount,
        trialCount,
        totalCount: subscriptions.length,
        categoryTotals,
        upcomingRenewalsCount: upcomingRenewals.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error calculating analytics' },
      { status: 500 }
    );
  }
}
