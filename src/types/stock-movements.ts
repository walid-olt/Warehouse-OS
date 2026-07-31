import type z from "zod";
import type {
  stockMovementSchema,
  stockMoveSchema,
} from "@/schemas/stock-movement.schema";

export type StockMovement = z.infer<typeof stockMovementSchema>;
export type StockMovementCreateDTO = z.infer<typeof stockMoveSchema>;

/**
 * Stock movement shape returned by the API with the product populated.
 */
export type StockMovementWithProduct = Omit<StockMovement, "productId"> & {
  productId: {
    _id: string;
    name: string;
    sku: string;
  };
};
