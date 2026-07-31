"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SpinnerIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { objectIdSchema } from "@/schemas/common";
import type { Category } from "@/types/category";
import type { ProductWithCategory } from "@/types/product";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProducts";

const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  category: objectIdSchema,
  price: z.number().positive("Price must be a positive number"),
  stockQuantity: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock quantity cannot be negative"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

type ProductFormProps = {
  categories: Category[];
  initialValues?: ProductWithCategory;
  onCancel?: () => void;
};

const selectClassName =
  "flex h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-[border,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

const ProductForm = ({
  categories,
  initialValues,
  onCancel,
}: ProductFormProps) => {
  const router = useRouter();
  const isEditing = !!initialValues;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          sku: initialValues.sku,
          description: initialValues.description,
          category: initialValues.category._id,
          price: initialValues.price,
          stockQuantity: initialValues.stockQuantity,
        }
      : {
          name: "",
          sku: "",
          description: "",
          category: "",
        },
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(initialValues?._id ?? "");

  const onSubmit = async (values: ProductFormValues) => {
    if (isEditing) {
      const { sku: _sku, ...payload } = values;
      await updateProduct.mutateAsync(payload);
      onCancel?.();
      return;
    }

    await createProduct.mutateAsync({
      ...values,
      description: values.description ?? "",
      isArchived: false,
    });
    router.push("/products");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border bg-card p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="product-name"
            className="text-xs font-medium text-muted-foreground"
          >
            Name
          </label>
          <Input
            id="product-name"
            placeholder="Product name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="product-sku"
            className="text-xs font-medium text-muted-foreground"
          >
            SKU
          </label>
          <Input
            id="product-sku"
            placeholder="e.g. WH-1001"
            disabled={isEditing}
            aria-invalid={!!errors.sku}
            {...register("sku")}
          />
          {errors.sku && (
            <p className="text-xs text-destructive">{errors.sku.message}</p>
          )}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label
            htmlFor="product-description"
            className="text-xs font-medium text-muted-foreground"
          >
            Description
          </label>
          <Textarea
            id="product-description"
            placeholder="Optional description"
            className="min-h-20"
            {...register("description")}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="product-category"
            className="text-xs font-medium text-muted-foreground"
          >
            Category
          </label>
          <select
            id="product-category"
            className={cn(
              selectClassName,
              !initialValues && "text-muted-foreground",
            )}
            aria-invalid={!!errors.category}
            {...register("category")}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-destructive">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="product-price"
              className="text-xs font-medium text-muted-foreground"
            >
              Price
            </label>
            <Input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              aria-invalid={!!errors.price}
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-xs text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="product-stock"
              className="text-xs font-medium text-muted-foreground"
            >
              Stock Quantity
            </label>
            <Input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              aria-invalid={!!errors.stockQuantity}
              {...register("stockQuantity", { valueAsNumber: true })}
            />
            {errors.stockQuantity && (
              <p className="text-xs text-destructive">
                {errors.stockQuantity.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <SpinnerIcon className="size-4 animate-spin" />
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
