import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { inngest } from "@/config/inngest";
import User from "@/models/User"; // Your local mongoose User model

export async function POST(request) {
  try {
    const { userId } = await getAuth(request); // Await getAuth
    const { address, items } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid data' });
    }

    // Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: `Product not found: ${item.product}` });
      }
      amount += product.offerPrice * item.quantity;
    }

    // Add 2% fee
    amount += Math.floor(amount * 0.02);

    // Send event to Inngest
    await inngest.send({
      name: 'order/created',
      data: {
        userId,
        address,
        items,
        amount,
        date: new Date().toISOString(), // optional but good to include
      },
    });

    // Clear user cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({ success: true, message: 'Order placed successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
