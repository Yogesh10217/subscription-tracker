import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Subscription from '@/models/Subscription';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ id: 'sub_1' }, { id: 'sub_2' }];
}

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const subscription = await Subscription.findById(params.id);

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: subscription });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching subscription' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const updated = await Subscription.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Subscription updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const deleted = await Subscription.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error deleting subscription' },
      { status: 500 }
    );
  }
}
