import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  amount: { type: Number, required: true },
  address: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Address' },
  status: {
    type: String,
    enum: ['Order Placed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Order Placed'
  },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
