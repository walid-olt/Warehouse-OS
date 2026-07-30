"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CategoryCreateDTO } from "@/types/category";
import {
  archiveCategory,
  createCategory,
  fetchCategories,
  updateCategory,
} from "../api/categories";

const categoriesKey = ["categories"] as const;

export function useCategories(includeArchived = false) {
  return useQuery({
    queryKey: [...categoriesKey, includeArchived],
    queryFn: () => fetchCategories(includeArchived),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryCreateDTO) => createCategory(data),
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
    mutationFn: (id: string) => archiveCategory(id),
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
    mutationFn: (data: Partial<CategoryCreateDTO>) => updateCategory(id, data),
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
