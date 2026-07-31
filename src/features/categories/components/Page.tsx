"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorScreen } from "@/components/ui/error-display";
import { PageLoader } from "@/components/ui/spinner";
import { Large, Subheading } from "@/components/ui/typography";
import { useCategories } from "../hooks/useCategories";
import AddCategoryForm from "./AddCategoryForm";
import CategoryTable from "./CategoryTable";

const Page = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [includeArchived, setIncludeArchived] = useState(false);
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useCategories(includeArchived);

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
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Large>Categories</Large>
          <Subheading>Manage your product categories</Subheading>
        </div>
        <Button onClick={() => setShowAddForm((p) => !p)}>
          <PlusIcon className="size-4" />
          {showAddForm ? "Close" : "Add Category"}
        </Button>
      </div>

      {showAddForm && (
        <AddCategoryForm onSuccess={() => setShowAddForm(false)} />
      )}

      <CategoryTable
        categories={categories ?? []}
        includeArchived={includeArchived}
        onIncludeArchivedChange={setIncludeArchived}
        onShowAddForm={() => setShowAddForm(true)}
      />
    </div>
  );
};

export default Page;
