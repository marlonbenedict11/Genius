import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { getAuth } from '@clerk/nextjs/server';
import Order from '@/models/Order';
import Address from '@/models/Address';
import authSeller from '@/lib/authSeller';

export async function GET(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
    }

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const orders = await Order.find({})
      .populate({
        path: 'address',
        model: Address,
      })
      .populate({
        path: 'items.product',
        model: 'Product', // assuming the model name is 'Product'
      })
      .sort({ createdAt: -1 }); // optional: newest orders first

    return NextResponse.json({ success: true, orders }, { status: 200 });

  } catch (error) {
    console.error('[GET ORDERS ERROR]', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
