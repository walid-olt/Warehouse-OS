import z from "zod";
import { objectIdSchema } from "./common";

export const productSchema = z.object({
  _id: objectIdSchema.optional(),
  name: z.string().min(3, "Product name must be at least 3 characters"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().default(""),
  category: objectIdSchema,
  price: z.number().positive("Price must be a positive number"),
  stockQuantity: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock quantity cannot be negative"),
  isArchived: z.boolean().default(false),
});
