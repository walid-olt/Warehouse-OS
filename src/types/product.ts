import type z from "zod";
import type {
  productCreateSchema,
  productSchema,
  productUpdateSchema,
} from "@/schemas/product.schema";

export type Product = z.infer<typeof productSchema>;
export type ProductCreateDTO = z.infer<typeof productCreateSchema>;
export type ProductUpdateDTO = z.infer<typeof productUpdateSchema>;

/**
 * Product shape returned by the API with the category populated.
 */
export type ProductWithCategory = Omit<Product, "category"> & {
  category: {
    _id: string;
    name: string;
  };
};
