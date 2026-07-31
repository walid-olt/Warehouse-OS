import type {
  Product,
  ProductCreateDTO,
  ProductUpdateDTO,
  ProductWithCategory,
} from "@/types/product";
import { api } from "./client";

export const productsApi = {
  list: (includeArchived = false) =>
    api
      .get("products", {
        searchParams: includeArchived ? { includeArchived: "true" } : undefined,
      })
      .json<{ data: ProductWithCategory[] }>()
      .then((r) => r.data),

  getById: (id: string) =>
    api
      .get(`products/${id}`)
      .json<{ data: ProductWithCategory }>()
      .then((r) => r.data),

  create: (data: ProductCreateDTO) =>
    api
      .post("products", { json: data })
      .json<{ data: Product }>()
      .then((r) => r.data),

  update: (id: string, data: ProductUpdateDTO) =>
    api
      .patch(`products/${id}`, { json: data })
      .json<{ data: Product }>()
      .then((r) => r.data),

  archive: (id: string) =>
    api
      .delete(`products/${id}`)
      .json<{ data: Product }>()
      .then((r) => r.data),
};
