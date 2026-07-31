import z from "zod";
import { objectIdSchema } from "./common";

export const productSchema = z.object({
  _id: objectIdSchema,
  name: z.string().min(3, "Product name must be at least 3 characters"),
  sku: z
    .string()
    .min(8, "SKU must be at least 8 characters")
    .regex(/^[A-Z0-9]+$/, "SKU must be alphanumeric and uppercase")
    .max(12, "SKU must be at most 12 characters"),
  description: z.string().default(""),
  category: objectIdSchema,
  price: z.number().positive("Price must be a positive number"),
  stockQuantity: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock quantity cannot be negative"),
  isArchived: z.boolean().default(false),
});

export const productCreateSchema = productSchema.omit({
  _id: true,
});

export const productUpdateSchema = productSchema.partial().omit({
  _id: true,
  sku: true,
});
