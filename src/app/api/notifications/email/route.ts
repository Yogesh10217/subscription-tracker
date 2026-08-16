import { NextRequest, NextResponse } from 'next/server';
import { sendRenewalReminderEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, serviceName, price, currency, frequency, renewalDate, daysLeft } = body;

    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid recipient email address is required' },
        { status: 400 }
      );
    }

    if (!serviceName || !price) {
      return NextResponse.json(
        { success: false, error: 'Service name and price are required' },
        { status: 400 }
      );
    }

    const result = await sendRenewalReminderEmail({
      to,
      serviceName,
      price: Number(price),
      currency: currency || 'USD',
      frequency: frequency || 'monthly',
      renewalDate: renewalDate || new Date().toISOString(),
      daysLeft: daysLeft || 3,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to deliver email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Renewal reminder email sent successfully to ${to}`,
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error('Error in email notification API route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
