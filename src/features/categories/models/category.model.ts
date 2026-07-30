import mongoose, { type Model, model, Schema } from "mongoose";
import type { Category } from "@/types/category";

const categoryMongooseSchema = new Schema<Category>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const CategoryModel =
  (mongoose.models.Category as Model<Category>) ||
  model<Category>("Category", categoryMongooseSchema);
