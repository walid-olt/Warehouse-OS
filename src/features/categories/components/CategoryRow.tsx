"use client";

import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";
import { EditableField } from "@/components/EditableField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { Muted } from "@/components/ui/typography";
import { useEditableMutation } from "@/hooks/useEditableMutation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import { useUpdateCategoryField } from "../hooks/useCategories";

const CategoryRow = ({ category }: { category: Category }) => {
  const updateField = useUpdateCategoryField(category._id);

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
    await updateField.mutateAsync({ isArchived: !category.isArchived });
  };

  return (
    <TableRow
      data-state={category.isArchived ? "archived" : "active"}
      className={cn(category.isArchived && "opacity-50")}
    >
      <TableCell className="min-w-45">
        <EditableField
          value={category.name}
          {...nameMutation.fieldProps}
          validate={(v) => (!v.trim() ? "Name is required" : null)}
        />
      </TableCell>
      <TableCell className="min-w-62.5">
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
          disabled={updateField.isPending}
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
          disabled={updateField.isPending}
          title={category.isArchived ? "Unarchive" : "Archive"}
        >
          {updateField.isPending ? (
            <SpinnerIcon className="size-4 animate-spin" />
          ) : category.isArchived ? (
            <ArrowCounterClockwiseIcon className="size-4" />
          ) : (
            <ArchiveIcon className="size-4" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CategoryRow;
