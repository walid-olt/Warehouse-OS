import z from "zod";
import { objectIdSchema } from "./common";

export const categorySchema = z.object({
  _id: objectIdSchema,
  name: z.string().min(1, "Category name is required"),
  description: z.string().default(""),
  isArchived: z.boolean().default(false),
  createdAt: z.coerce.date().default(() => new Date()),
});

export const categoryCreateSchema = categorySchema.omit({
  createdAt: true,
  _id: true,
});
