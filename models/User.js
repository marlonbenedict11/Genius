// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },  // Added unique
  imageUrl: { type: String, required: true },
  cartItems: { type: Object, default: {} }
}, {
  minimize: false,
  timestamps: true  
});

const User = mongoose.models.User || mongoose.model("User", userSchema);  // Capitalized model name

export default User;