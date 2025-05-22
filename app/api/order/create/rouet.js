import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { getAuth } from '@clerk/nextjs/server';
import Product from '@/models/product';
import User from '@/models/user';
import Order from '@/models/order';
import { inngest } from '@/lib/inngest'; // assuming you have this setup

export async function POST(request) {
  try {
    await connectDB();

    const { userId } = await getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { address, items } = await request.json();
    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }

    let amount = 0;
    const products = await Promise.all(items.map(item => Product.findById(item.product)));

    for (let i = 0; i < items.length; i++) {
      const product = products[i];
      if (!product) {
        return NextResponse.json({ success: false, message: `Product with ID ${items[i].product} not found` }, { status: 404 });
      }
      amount += product.offerPrice * items[i].quantity;
    }

    amount += Math.floor(amount * 0.02); // Add 2% fee

    // ✅ Save order to DB
    const newOrder = await Order.create({
      userId,
      items,
      address,
      amount,
      date: new Date(),
    });

    // Send order created event
    await inngest.send({
      name: 'order/created',
      data: {
        userId,
        address,
        items,
        amount,
        date: newOrder.date.toISOString(),
      },
    });

    // Clear user's cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      amount,
      orderId: newOrder._id,
      items,
    }, { status: 200 });

  } catch (error) {
    console.error("Error in order POST:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
