"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ErrorScreen } from "@/components/ui/error-display";
import { PageLoader } from "@/components/ui/spinner";
import { Heading, Subheading } from "@/components/ui/typography";
import { useCategories } from "@/features/categories/hooks/useCategories";
import ProductForm from "./ProductForm";

const CreateProductPage = () => {
  const { data: categories, isLoading, error, refetch } = useCategories(false);

  if (isLoading) return <PageLoader label="Loading categories..." />;

  if (error) {
    return (
      <ErrorScreen
        title="Failed to load categories"
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
      <div className="mb-6">
        <Link
          href="/products"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to products
        </Link>
        <Heading>New Product</Heading>
        <Subheading>Add a product to your catalog</Subheading>
      </div>

      <ProductForm categories={categories ?? []} />
    </div>
  );
};

export default CreateProductPage;
