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

    // ✅ Populate both address and items.product
    const orders = await Order.find({ userId })
      .populate('address')
      .populate('items.product');

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
