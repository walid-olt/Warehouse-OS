"use client";

import { ArchiveIcon, PlusIcon } from "@phosphor-icons/react";
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
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category } from "@/types/category";
import CategoryRow from "./CategoryRow";

type CategoryTableProps = {
  categories: Category[];
  includeArchived: boolean;
  onIncludeArchivedChange: (checked: boolean) => void;
  onShowAddForm: () => void;
};

const CategoryTable = ({
  categories,
  includeArchived,
  onIncludeArchivedChange,
  onShowAddForm,
}: CategoryTableProps) => {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Checkbox
          checked={includeArchived}
          onCheckedChange={onIncludeArchivedChange}
          id="include-archived"
        />
        <label
          htmlFor="include-archived"
          className="text-sm text-muted-foreground cursor-pointer select-none"
        >
          Show archived categories
        </label>
      </div>

      {categories.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ArchiveIcon className="size-4" />
            </EmptyMedia>
            <EmptyTitle>No categories found</EmptyTitle>
            <EmptyDescription>
              {includeArchived
                ? "No categories at all. Create one to get started."
                : 'No active categories. Toggle "Show archived"  above or create a new one.'}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={onShowAddForm}>
              <PlusIcon className="size-4" />
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

export default CategoryTable;
