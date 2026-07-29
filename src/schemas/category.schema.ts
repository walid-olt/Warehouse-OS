import z from "zod";
import { objectIdSchema } from "./common";

export const categorySchema = z.object({
  _id: objectIdSchema.optional(),
  name: z.string().min(1, "Category name is required"),
  description: z.string().default(""),
  createdAt: z.coerce.date().default(() => new Date()),
});
