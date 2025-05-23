import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { getAuth } from '@clerk/nextjs/server';
import Order from '@/models/Order';

export async function GET(request) {
  try {
    await connectDB();

    const { userId } = await getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Extract pagination params from URL
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;

    const orders = await Order.find({ userId })
      .sort({ date: -1 }) // Sort by latest first
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('address')
      .populate('items.product')
      .lean(); // Improve read performance

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
