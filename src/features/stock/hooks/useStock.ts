"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { stockApi } from "@/lib/api/stock";
import type { StockMovementCreateDTO } from "@/types/stock-movements";

const movementsKey = ["stock", "movements"] as const;

export function useStockMovements(productId?: string) {
  return useQuery({
    queryKey: [...movementsKey, productId ?? "all"],
    queryFn: () => stockApi.list(productId),
  });
}

export function useMoveStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StockMovementCreateDTO) => stockApi.move(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: movementsKey });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Stock movement recorded successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to record movement",
      );
    },
  });
}
