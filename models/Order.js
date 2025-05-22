import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' }, // or ObjectId if needed
  items: [
    {
      product: { type: String, required: true, ref: 'Product' }, // or ObjectId
      quantity: { type: Number, required: true }
    }
  ],
  amount: { type: Number, required: true },
  address: { type: String, required: true, ref: 'Address' }, // or ObjectId
  status: {
    type: String,
    enum: ['Order Placed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Order Placed',
    required: true
  },
  date: { type: Date, required: true, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
