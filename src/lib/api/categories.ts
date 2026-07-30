import type { Category, CategoryCreateDTO } from "@/types/category";
import { api } from "./client";

export const categoriesApi = {
  list: (includeArchived = false) =>
    api
      .get("categories", {
        searchParams: includeArchived ? { includeArchived: "true" } : undefined,
      })
      .json<{ data: Category[] }>()
      .then((r) => r.data),

  getById: (id: string) =>
    api
      .get(`categories/${id}`)
      .json<{ data: Category }>()
      .then((r) => r.data),

  create: (data: CategoryCreateDTO) =>
    api
      .post("categories", { json: data })
      .json<{ data: Category }>()
      .then((r) => r.data),

  update: (id: string, data: Partial<CategoryCreateDTO>) =>
    api
      .patch(`categories/${id}`, { json: data })
      .json<{ data: Category }>()
      .then((r) => r.data),

  archive: (id: string) =>
    api
      .delete(`categories/${id}`)
      .json<{ data: Category }>()
      .then((r) => r.data),
};
