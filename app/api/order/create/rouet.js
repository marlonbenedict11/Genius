import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import User from "@/models/User";
import { inngest } from "@/config/inngest";
import connectDB from "@/config/db"; // If not already handled globally

export async function POST(request) {
  try {
    await connectDB(); // Ensure DB connection

    const { userId } = await getAuth(request);
    const { address, items } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid data' });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: `Product with ID ${item.product} not found` });
      }
      amount += product.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02); // Add 2% fee

    await inngest.send({
      name: 'order/created',
      data: {
        userId,
        address,
        items,
        amount,
        date: new Date().toISOString(),
      },
    });

    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({ success: true, message: 'Order placed successfully' });

  } catch (error) {
    console.error("Error in order POST:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
