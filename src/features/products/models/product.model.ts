import { Product } from "@/types/product";
import mongoose, { Model, Schema, model, Types } from "mongoose";

export interface IProductDocument extends Omit<Product, "category" | "_id"> {
  _id?: Types.ObjectId;
  category: Types.ObjectId;
}

const productMongooseSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, minlength: 3, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isInteger,
    },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export const ProductModel =
  (mongoose.models.Product as Model<Product>) ||
  model<IProductDocument>("Product", productMongooseSchema);
