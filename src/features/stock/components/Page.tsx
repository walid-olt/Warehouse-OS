"use client";

import { PlusIcon, SwapIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ErrorScreen } from "@/components/ui/error-display";
import { PageLoader } from "@/components/ui/spinner";
import { Large, Subheading } from "@/components/ui/typography";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useStockMovements } from "../hooks/useStock";
import MovementsTable from "./MovementsTable";
import MoveStockForm from "./MoveStockForm";

const selectClassName =
  "h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-[border,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const StockMovementsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [filterProductId, setFilterProductId] = useState("");

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts(false);

  const {
    data: movements,
    isLoading,
    error,
    refetch,
  } = useStockMovements(filterProductId || undefined);

  if (isLoading || productsLoading) {
    return <PageLoader label="Loading stock movements..." />;
  }

  if (error || productsError) {
    return (
      <ErrorScreen
        title="Failed to load stock movements"
        message={
          (error instanceof Error ? error.message : "") ||
          (productsError instanceof Error ? productsError.message : "") ||
          "An unexpected error occurred"
        }
        onRetry={() => {
          refetch();
          refetchProducts();
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Large>Stock Movements</Large>
          <Subheading>Track stock in and out of your warehouse</Subheading>
        </div>
        <Button onClick={() => setShowForm((prev) => !prev)}>
          <PlusIcon className="size-4" />
          {showForm ? "Close" : "Record Movement"}
        </Button>
      </div>

      {showForm && (
        <MoveStockForm
          products={products ?? []}
          onSuccess={() => setShowForm(false)}
        />
      )}

      <div className="mb-4 flex items-center gap-2">
        <label
          htmlFor="filter-product"
          className="text-sm text-muted-foreground"
        >
          Filter by product
        </label>
        <select
          id="filter-product"
          className={selectClassName}
          value={filterProductId}
          onChange={(e) => setFilterProductId(e.target.value)}
        >
          <option value="">All products</option>
          {products?.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {!movements || movements.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SwapIcon className="size-4" />
            </EmptyMedia>
            <EmptyTitle>No stock movements found</EmptyTitle>
            <EmptyDescription>
              Record your first movement to start tracking stock.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <MovementsTable movements={movements} />
      )}
    </div>
  );
};

export default StockMovementsPage;
