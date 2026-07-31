"use client";

import { PackageIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ErrorScreen } from "@/components/ui/error-display";
import { PageLoader } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "../hooks/useProducts";
import { Header } from "./Header";
import ProductRow from "./ProductRow";

const Page = () => {
  const [includeArchived, setIncludeArchived] = useState(false);
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useProducts(includeArchived);

  if (isLoading) return <PageLoader label="Loading products..." />;

  if (error) {
    return (
      <ErrorScreen
        title="Failed to load products"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <Header />

      <div className="mb-4 flex items-center gap-2">
        <Checkbox
          checked={includeArchived}
          onCheckedChange={setIncludeArchived}
          id="include-archived"
        />
        <label
          htmlFor="include-archived"
          className="text-sm text-muted-foreground cursor-pointer select-none"
        >
          Show archived products
        </label>
      </div>

      {!products || products.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageIcon className="size-4" />
            </EmptyMedia>
            <EmptyTitle>No products found</EmptyTitle>
            <EmptyDescription>
              {includeArchived
                ? "No products at all. Create one to get started."
                : 'No active products. Toggle "Show archived" above or create a new one.'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
                onArchived={() => refetch()}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Page;
