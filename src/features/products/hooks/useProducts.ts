"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsApi } from "@/lib/api/products";
import type { ProductCreateDTO, ProductUpdateDTO } from "@/types/product";

const productsKey = ["products"] as const;

export function useProducts(includeArchived = false) {
  return useQuery({
    queryKey: [...productsKey, includeArchived],
    queryFn: () => productsApi.list(includeArchived),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [...productsKey, id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductCreateDTO) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKey });
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product",
      );
    },
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductUpdateDTO) => productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKey });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product",
      );
    },
  });
}

export function useArchiveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKey });
      toast.success("Product archived");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to archive product",
      );
    },
  });
}
