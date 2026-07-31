"use client";

import { SpinnerIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ProductWithCategory } from "@/types/product";
import { useMoveStock } from "../hooks/useStock";

type MoveStockFormProps = {
  products: ProductWithCategory[];
  onSuccess: () => void;
};

const selectClassName =
  "flex h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-[border,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

const MoveStockForm = ({ products, onSuccess }: MoveStockFormProps) => {
  const [productId, setProductId] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const moveStock = useMoveStock();

  const parsedQuantity = Number(quantity);
  const isValid =
    !!productId && Number.isInteger(parsedQuantity) && parsedQuantity > 0;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isValid) return;

    await moveStock.mutateAsync({
      productId,
      type,
      quantity: parsedQuantity,
      note: note.trim() || undefined,
    });
    setQuantity("");
    setNote("");
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded-xl border bg-card p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1.5 lg:col-span-2">
          <label
            htmlFor="move-product"
            className="text-xs font-medium text-muted-foreground"
          >
            Product
          </label>
          <select
            id="move-product"
            className={cn(
              selectClassName,
              !productId && "text-muted-foreground",
            )}
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="" disabled>
              Select a product
            </option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} ({product.stockQuantity} in stock)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="move-type"
            className="text-xs font-medium text-muted-foreground"
          >
            Type
          </label>
          <select
            id="move-type"
            className={selectClassName}
            value={type}
            onChange={(e) => setType(e.target.value as "IN" | "OUT")}
          >
            <option value="IN">IN (Receive)</option>
            <option value="OUT">OUT (Ship)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="move-quantity"
            className="text-xs font-medium text-muted-foreground"
          >
            Quantity
          </label>
          <Input
            id="move-quantity"
            type="number"
            min="1"
            step="1"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            aria-invalid={quantity !== "" && !Number.isInteger(parsedQuantity)}
          />
        </div>

        <div className="flex items-end">
          <Button
            type="submit"
            disabled={moveStock.isPending || !isValid}
            className="w-full"
          >
            {moveStock.isPending ? (
              <SpinnerIcon className="size-4 animate-spin" />
            ) : (
              "Record Movement"
            )}
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <label
          htmlFor="move-note"
          className="text-xs font-medium text-muted-foreground"
        >
          Note (optional)
        </label>
        <Textarea
          id="move-note"
          placeholder="e.g. Restock from supplier"
          className="min-h-16"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </form>
  );
};

export default MoveStockForm;
