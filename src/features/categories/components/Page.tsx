"use client";

import {
  Archive,
  ArrowCounterClockwise,
  Plus,
  SpinnerIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { EditableField } from "@/components/EditableField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ErrorScreen } from "@/components/ui/error-display";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Large, Muted, Subheading } from "@/components/ui/typography";
import { useEditableMutation } from "@/hooks/useEditableMutation";
import { cn } from "@/lib/utils";
import {
  useArchiveCategory,
  useCategories,
  useCreateCategory,
  useUpdateCategoryField,
} from "../hooks/useCategories";

function AddCategoryForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createCategory = useCreateCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createCategory.mutateAsync({
      name: name.trim(),
      description: description.trim(),
      isArchived: false,
    });
    setName("");
    setDescription("");
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex items-end gap-3 rounded-xl border bg-card p-4"
    >
      <div className="flex-1 space-y-1">
        <label
          htmlFor="add-category-name"
          className="text-xs font-medium text-muted-foreground"
        >
          Name
        </label>
        <Input
          id="add-category-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
        />
      </div>
      <div className="flex-1 space-y-1">
        <label
          htmlFor="add-category-desc"
          className="text-xs font-medium text-muted-foreground"
        >
          Description
        </label>
        <Input
          id="add-category-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>
      <Button type="submit" disabled={createCategory.isPending || !name.trim()}>
        {createCategory.isPending ? (
          <SpinnerIcon className="size-4 animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
        Add
      </Button>
    </form>
  );
}

function CategoryRow({
  category,
}: {
  category: {
    _id: string;
    name: string;
    description: string;
    isArchived: boolean;
    createdAt: string | Date;
  };
}) {
  const updateField = useUpdateCategoryField(category._id);
  const archiveMutation = useArchiveCategory();

  const nameMutation = useEditableMutation({
    queryKey: ["categories"],
    mutationFn: (name: string) => updateField.mutateAsync({ name }),
    successMessage: "Name updated",
    errorMessage: "Failed to update name",
  });

  const descMutation = useEditableMutation({
    queryKey: ["categories"],
    mutationFn: (description: string) =>
      updateField.mutateAsync({ description }),
    successMessage: "Description updated",
    errorMessage: "Failed to update description",
  });

  const handleArchiveToggle = async () => {
    await archiveMutation.mutateAsync(category._id);
  };

  return (
    <TableRow
      data-state={category.isArchived ? "archived" : "active"}
      className={cn(category.isArchived && "opacity-50")}
    >
      <TableCell className="min-w-[180px]">
        <EditableField
          value={category.name}
          {...nameMutation.fieldProps}
          validate={(v) => (!v.trim() ? "Name is required" : null)}
        />
      </TableCell>
      <TableCell className="min-w-[250px]">
        <EditableField
          value={category.description}
          {...descMutation.fieldProps}
          type="textarea"
          placeholder="No description"
        />
      </TableCell>
      <TableCell className="w-20">
        <Checkbox
          checked={category.isArchived}
          onCheckedChange={handleArchiveToggle}
          disabled={archiveMutation.isPending}
        />
      </TableCell>
      <TableCell className="w-32 whitespace-nowrap text-muted-foreground">
        <Muted>{new Date(category.createdAt).toLocaleDateString()}</Muted>
      </TableCell>
      <TableCell className="w-16">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleArchiveToggle}
          disabled={archiveMutation.isPending}
          title={category.isArchived ? "Unarchive" : "Archive"}
        >
          {archiveMutation.isPending ? (
            <SpinnerIcon className="size-4 animate-spin" />
          ) : category.isArchived ? (
            <ArrowCounterClockwise className="size-4" />
          ) : (
            <Archive className="size-4" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
}

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
          <Plus className="size-4" />
          {showAddForm ? "Close" : "Add Category"}
        </Button>
      </div>

      {showAddForm && (
        <AddCategoryForm onSuccess={() => setShowAddForm(false)} />
      )}

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
          Show archived categories
        </label>
      </div>

      {!categories || categories.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Archive className="size-4" />
            </EmptyMedia>
            <EmptyTitle>No categories found</EmptyTitle>
            <EmptyDescription>
              {includeArchived
                ? "No categories at all. Create one to get started."
                : "No active categories. Toggle &quot;Show archived&quot; above or create a new one."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="size-4" />
              Create Category
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Archived</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <CategoryRow key={cat._id} category={cat} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Page;
