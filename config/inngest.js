import { Inngest } from "inngest";
import connectDB from "./db";
import User from '../models/User'; 
import Order from "../models/Order";

export const inngest = new Inngest({ 
  id: "genius-next",
  retries: 3, 
});

// Inngest function to save data to a database
export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    
    const userData = {
      _id: id,
      email: email_addresses[0].email_address, 
      name: first_name + ' ' + last_name, 
      imageUrl: image_url
    };

    await connectDB();
    await User.create(userData);
  }
);

// Inngest function to update user data in the database
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    
    const userData = {
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      imageUrl: image_url
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngest function to delete user from the database
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

// Inngest function to create user's order in the database
export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: { 
      maxSize: 5,
      timeout: "5s",
    },
  },
  { event: "order/created" },
  async ({ events }) => {
    const orders = events
      .filter(event => event.data?.userId && event.data?.items?.length > 0)
      .map(event => ({
        userId: event.data.userId,
        items: event.data.items,
        amount: event.data.amount,
        address: event.data.address,
        date: event.data.date || new Date(),
      }));

    if (orders.length === 0) {
      console.warn("No valid orders to insert.");
      return { success: false, error: "No valid orders to process." };
    }

    try {
      await connectDB();
      await Order.insertMany(orders);
      console.log(`Inserted ${orders.length} orders`);
      return { success: true, processed: orders.length };
    } catch (error) {
      console.error("Error inserting orders:", error);
      return { success: false, error: error.message };
    }
  }
);