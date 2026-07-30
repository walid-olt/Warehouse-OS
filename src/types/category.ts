import type z from "zod";
import type {
  categoryCreateSchema,
  categorySchema,
} from "@/schemas/category.schema";

export type Category = z.infer<typeof categorySchema>;
export type CategoryCreateDTO = z.infer<typeof categoryCreateSchema>;
