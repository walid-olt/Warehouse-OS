import type z from "zod";
import type { stockMovementSchema } from "@/schemas/stock-movement.schema";

export type StockMovement = z.infer<typeof stockMovementSchema>;
