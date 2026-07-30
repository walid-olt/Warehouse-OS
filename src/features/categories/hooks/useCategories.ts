"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoriesApi } from "@/lib/api/categories";
import type { CategoryCreateDTO } from "@/types/category";

const categoriesKey = ["categories"] as const;

export function useCategories(includeArchived = false) {
  return useQuery({
    queryKey: [...categoriesKey, includeArchived],
    queryFn: () => categoriesApi.list(includeArchived),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryCreateDTO) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKey });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category",
      );
    },
  });
}

export function useArchiveCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKey });
      toast.success("Category archived");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to archive category",
      );
    },
  });
}

export function useUpdateCategoryField(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CategoryCreateDTO>) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKey });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update category",
      );
    },
  });
}
