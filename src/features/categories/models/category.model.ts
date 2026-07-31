import mongoose, { type Model, model, Schema, type Types } from "mongoose";
import type { Category } from "@/types/category";

export interface ICategoryDocument extends Omit<Category, "_id"> {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
}

const categoryMongooseSchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
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

const CategoryModel =
  (mongoose.models.Category as Model<ICategoryDocument>) ||
  model<ICategoryDocument>("Category", categoryMongooseSchema);

export default CategoryModel;
