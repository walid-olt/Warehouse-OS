import z from "zod";
import { objectIdSchema } from "./common";

export const stockMovementSchema = z.object({
  _id: objectIdSchema.optional(),
  productId: objectIdSchema, // Reference to Product ID
  type: z.enum(["IN", "OUT"], "Invalid operation type"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be a positive integer"),
  note: z.string().optional(),
  createdAt: z.coerce.date().default(() => new Date()),
});
