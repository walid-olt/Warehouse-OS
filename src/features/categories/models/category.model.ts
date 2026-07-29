import { Category } from "@/types/category";

import mongoose, { Model, Schema, model } from "mongoose";

const categoryMongooseSchema = new Schema<Category>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const CategoryModel =
  (mongoose.models.Category as Model<Category>) ||
  model<Category>("Category", categoryMongooseSchema);
