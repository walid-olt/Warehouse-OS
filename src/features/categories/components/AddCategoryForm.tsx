"use client";

import { PlusIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateCategory } from "../hooks/useCategories";

const AddCategoryForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createCategory = useCreateCategory();

  const handleSubmit = async (e: React.SubmitEvent) => {
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
          <PlusIcon className="size-4" />
        )}
        Add
      </Button>
    </form>
  );
};

export default AddCategoryForm;
