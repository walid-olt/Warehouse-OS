"use client";

import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  PencilIcon,
  SpinnerIcon,
  XIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { Heading, Muted, Subheading } from "@/components/ui/typography";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { cn } from "@/lib/utils";
import { useArchiveProduct, useProduct } from "../hooks/useProducts";
import ProductForm from "./ProductForm";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const DetailItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Muted>{label}</Muted>
    <div className="text-sm font-medium text-foreground">{children}</div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [editing, setEditing] = useState(false);

  const { data: product, isLoading, error, refetch } = useProduct(id);
  const { data: categories } = useCategories(true);
  const archiveProduct = useArchiveProduct();

  if (isLoading) return <PageLoader label="Loading product..." />;

  if (error) {
    return (
      <ErrorScreen
        title="Failed to load product"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!product) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ArchiveIcon className="size-4" />
          </EmptyMedia>
          <EmptyTitle>Product not found</EmptyTitle>
          <EmptyDescription>
            <Link
              href="/products"
              className="text-primary underline underline-offset-4"
            >
              Go to Products
            </Link>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const handleArchiveToggle = async () => {
    await archiveProduct.mutateAsync(product._id);
    refetch();
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/products"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to products
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Heading
              className={cn(product.isArchived && "opacity-50 line-through")}
            >
              {product.name}
            </Heading>
            <Subheading>SKU: {product.sku}</Subheading>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {editing ? (
              <Button variant="outline" onClick={() => setEditing(false)}>
                <XIcon className="size-4" />
                Close
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setEditing(true)}>
                <PencilIcon className="size-4" />
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
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
          </div>
        </div>
      </div>

      {editing ? (
        <ProductForm
          categories={categories ?? []}
          initialValues={product}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="grid gap-6 rounded-xl border bg-card p-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Name">{product.name}</DetailItem>
          <DetailItem label="SKU">{product.sku}</DetailItem>
          <DetailItem label="Category">{product.category.name}</DetailItem>
          <DetailItem label="Price">
            {currency.format(product.price)}
          </DetailItem>
          <DetailItem label="Available Stock">
            {product.stockQuantity}
          </DetailItem>
          <DetailItem label="Status">
            {product.isArchived ? "Archived" : "Active"}
          </DetailItem>
          <DetailItem label="Description">
            {product.description || "No description"}
          </DetailItem>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
