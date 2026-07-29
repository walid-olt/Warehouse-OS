import { stockMovementSchema } from "@/schemas/stock-movement.schema";
import z from "zod";

export type StockMovement = z.infer<typeof stockMovementSchema>;
