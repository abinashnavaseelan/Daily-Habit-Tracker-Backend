import mongoose from "mongoose";
export interface ProductDocument {
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: "Price is required" },
    description: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
  },
  { timestamps: true },
);

export const ProductModel = mongoose.model<ProductDocument>(
  "Product",
  productSchema,
);
