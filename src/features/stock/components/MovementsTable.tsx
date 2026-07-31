"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { StockMovementWithProduct } from "@/types/stock-movements";

const MovementsTable = ({
  movements,
}: {
  movements: StockMovementWithProduct[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements.map((movement) => {
          const isIn = movement.type === "IN";
          return (
            <TableRow key={movement._id}>
              <TableCell className="min-w-40 font-medium">
                {movement.productId.name}
              </TableCell>
              <TableCell className="min-w-24 font-mono text-xs text-muted-foreground">
                {movement.productId.sku}
              </TableCell>
              <TableCell className="w-20">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
                    isIn
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {movement.type}
                </span>
              </TableCell>
              <TableCell
                className={cn(
                  "w-24 font-medium tabular-nums",
                  isIn
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-destructive",
                )}
              >
                {isIn ? "+" : "-"}
                {movement.quantity}
              </TableCell>
              <TableCell className="w-40 whitespace-nowrap text-muted-foreground">
                {new Date(movement.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="min-w-40 text-muted-foreground">
                {movement.note || "—"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default MovementsTable;
