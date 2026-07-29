import { StockMovement } from "@/types/stock-movements";
import mongoose, { Schema, model, Types, Model } from "mongoose";

export interface IStockMovementDocument extends Omit<
  StockMovement,
  "productId" | "_id"
> {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
}

const stockMovementMongooseSchema = new Schema<IStockMovementDocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    type: { type: String, enum: ["IN", "OUT"], required: true },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
    note: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const StockMovementModel =
  (mongoose.models.StockMovement as Model<IStockMovementDocument>) ||
  model<IStockMovementDocument>("StockMovekent", stockMovementMongooseSchema);
