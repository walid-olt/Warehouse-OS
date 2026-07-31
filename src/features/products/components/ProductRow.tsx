"use client";

import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD } from "@/types/dashboard";
import type { ProductWithCategory } from "@/types/product";
import { useArchiveProduct } from "../hooks/useProducts";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ProductRow = ({
  product,
  onArchived,
}: {
  product: ProductWithCategory;
  onArchived: () => void;
}) => {
  const archiveProduct = useArchiveProduct();
  const isLowStock = product.stockQuantity < LOW_STOCK_THRESHOLD;

  const handleArchiveToggle = async () => {
    await archiveProduct.mutateAsync(product._id);
    onArchived();
  };

  return (
    <TableRow
      data-state={product.isArchived ? "archived" : "active"}
      className={cn(product.isArchived && "opacity-50")}
    >
      <TableCell className="min-w-40 font-medium">
        <Link
          href={`/products/${product._id}`}
          className="text-foreground underline-offset-4 hover:underline"
        >
          {product.name}
        </Link>
      </TableCell>
      <TableCell className="min-w-28 font-mono text-xs text-muted-foreground">
        {product.sku}
      </TableCell>
      <TableCell className="min-w-36">{product.category.name}</TableCell>
      <TableCell className="min-w-24">
        {currency.format(product.price)}
      </TableCell>
      <TableCell className="min-w-24">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
            isLowStock
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "bg-muted text-muted-foreground",
          )}
          title={isLowStock ? `Below ${LOW_STOCK_THRESHOLD} units` : undefined}
        >
          {product.stockQuantity}
        </span>
      </TableCell>
      <TableCell className="w-16">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleArchiveToggle}
          disabled={archiveProduct.isPending}
          title={product.isArchived ? "Unarchive" : "Archive"}
        >
          {archiveProduct.isPending ? (
            <SpinnerIcon className="size-4 animate-spin" />
          ) : product.isArchived ? (
            <ArrowCounterClockwiseIcon className="size-4" />
          ) : (
            <ArchiveIcon className="size-4" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ProductRow;
