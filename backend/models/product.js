import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: String,       
  price: Number,
  category: String,    
  image: String,       
  stock: Number
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);