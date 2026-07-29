import { productSchema } from "@/schemas/product.schema";
import z from "zod";

export type Product = z.infer<typeof productSchema>;
