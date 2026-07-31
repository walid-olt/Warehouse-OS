import type {
  StockMovement,
  StockMovementCreateDTO,
  StockMovementWithProduct,
} from "@/types/stock-movements";
import { api } from "./client";

export const stockApi = {
  move: (data: StockMovementCreateDTO) =>
    api
      .post("stock/move", { json: data })
      .json<{ data: StockMovement }>()
      .then((r) => r.data),

  list: (productId?: string) =>
    api
      .get("stock/movements", {
        searchParams: productId ? { productId } : undefined,
      })
      .json<{ data: StockMovementWithProduct[] }>()
      .then((r) => r.data),
};
