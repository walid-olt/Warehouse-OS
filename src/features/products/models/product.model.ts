import mongoose, { type Model, model, Schema, type Types } from "mongoose";
import type { Product } from "@/types/product";

export interface IProductDocument extends Omit<Product, "category" | "_id"> {
  _id?: Types.ObjectId;
  category: Types.ObjectId;
  userId: Types.ObjectId;
}

const productMongooseSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, minlength: 3, trim: true },
    sku: { type: String, required: true, trim: true },
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

productMongooseSchema.index({ sku: 1, userId: 1 }, { unique: true });

export const ProductModel =
  (mongoose.models.Product as Model<IProductDocument>) ||
  model<IProductDocument>("Product", productMongooseSchema);
