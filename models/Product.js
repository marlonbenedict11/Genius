import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk userId — no ref needed
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  images: { type: [String], required: true, default: [] },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true }); // Optional but useful

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
