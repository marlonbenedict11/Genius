import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/User"; 
import Order from "../models/Order";

export const inngest = new Inngest({ 
  id: "genius-next",
  retries: 3, 
});

// Handle Clerk user creation
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address || "", 
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();
    await User.create(userData);
  }
);

// Handle Clerk user update
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const updatedData = {
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, updatedData);
  }
);

// Handle Clerk user deletion
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event; // ✅ FIXED: Access ID from event root
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

// Batch create orders
export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: {
      event: "order/created",
      maxSize: 5,
      timeout: "5s",
    },
  },
  async ({ events }) => {
    const orders = events.map(({ data }) => ({
      userId: data.userId,
      items: data.items,
      amount: data.amount,
      address: data.address,
      date: data.date,
    }));

    await connectDB();
    await Order.insertMany(orders);

    return { success: true, processed: orders.length };
  }
);
