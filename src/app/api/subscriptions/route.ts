import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Subscription from '@/models/Subscription';

// Mock user ID for local standalone testing if no JWT cookie is present
const DEFAULT_USER_ID = '650000000000000000000001';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: Record<string, any> = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const subscriptions = await Subscription.find(query).sort({ renewalDate: 1 });

    return NextResponse.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.name || !body.price || !body.frequency) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and frequency are required' },
        { status: 400 }
      );
    }

    const subscriptionData = {
      ...body,
      user: body.user || DEFAULT_USER_ID,
      price: Number(body.price),
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      renewalDate: body.renewalDate ? new Date(body.renewalDate) : undefined,
    };

    const newSubscription = await Subscription.create(subscriptionData);

    return NextResponse.json(
      {
        success: true,
        data: newSubscription,
        message: 'Subscription created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
