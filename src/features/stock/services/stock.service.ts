import { Types } from "mongoose";
import { ProductModel } from "@/features/products/models/product.model";
import {
  mapToServiceError,
  notFoundError,
  type ServiceError,
  validationError,
} from "@/lib/errors";
import { connectDB } from "@/lib/mongodb";
import { type Result, tryCatch } from "@/lib/return";
import { formatZodErrors } from "@/lib/utils";
import { objectIdSchema } from "@/schemas/common";
import { stockMoveSchema } from "@/schemas/stock-movement.schema";
import type {
  StockMovement,
  StockMovementWithProduct,
} from "@/types/stock-movements";
import { StockMovementModel } from "../models/stock-movement.model";

type StockResult<T> = Promise<Result<T, ServiceError>>;

const toPlainMovement = (doc: {
  _id?: unknown;
  productId: unknown;
  type: StockMovement["type"];
  quantity: number;
  note?: string;
  createdAt: Date;
}): StockMovement => ({
  _id: doc._id ? String(doc._id) : undefined,
  productId: String(doc.productId),
  type: doc.type,
  quantity: doc.quantity,
  note: doc.note,
  createdAt: doc.createdAt,
});

const toPlainMovementWithProduct = (doc: {
  _id: string;
  productId: { _id: string; name: string; sku: string };
  type: StockMovement["type"];
  quantity: number;
  note?: string;
  createdAt: Date;
}): StockMovementWithProduct => ({
  _id: String(doc._id),
  productId: {
    _id: String(doc.productId._id),
    name: doc.productId.name,
    sku: doc.productId.sku,
  },
  type: doc.type,
  quantity: doc.quantity,
  note: doc.note,
  createdAt: doc.createdAt,
});

const parseId = (id: string) => objectIdSchema.safeParse(id);
const parseUserId = (userId: string) => objectIdSchema.safeParse(userId);

export const stockService = {
  /**
   * Records a stock movement for one of the current user's products.
   *
   * Rules:
   * 1. Input is validated against the stock move schema.
   * 2. The product must belong to the current user.
   * 3. OUT movements are rejected when the requested quantity exceeds
   *    the product's available stock.
   * 4. The StockMovement document is saved.
   * 5. The parent product's stockQuantity is updated.
   */
  async move(userId: string, data: unknown): StockResult<StockMovement> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    const parsed = stockMoveSchema.safeParse(data);
    if (!parsed.success) {
      return [
        validationError("Validation failed", formatZodErrors(parsed.error)),
        undefined,
      ];
    }

    return tryCatch(
      (async () => {
        await connectDB();

        const product = await ProductModel.findOne({
          _id: parsed.data.productId,
          userId: parsedUserId.data,
        });
        if (!product) throw notFoundError("Product not found");
        if (product.isArchived) {
          throw validationError(
            "Cannot record a movement for an archived product",
          );
        }

        if (
          parsed.data.type === "OUT" &&
          product.stockQuantity < parsed.data.quantity
        ) {
          throw validationError(
            `Insufficient stock: only ${product.stockQuantity} available, tried to move ${parsed.data.quantity} out`,
          );
        }

        const delta =
          parsed.data.type === "IN"
            ? parsed.data.quantity
            : -parsed.data.quantity;

        const updatedProduct = await ProductModel.findOneAndUpdate(
          { _id: parsed.data.productId, userId: parsedUserId.data },
          { $inc: { stockQuantity: delta } },
          { new: true, runValidators: true },
        );
        if (!updatedProduct) throw notFoundError("Product not found");

        const movement = await StockMovementModel.create({
          ...parsed.data,
          productId: new Types.ObjectId(parsed.data.productId),
          userId: parsedUserId.data,
        });

        return toPlainMovement(movement);
      })(),
      mapToServiceError,
    );
  },

  /**
   * Lists the current user's stock movements, optionally filtered by one of
   * their products.
   */
  async list(
    userId: string,
    productId?: string,
  ): Promise<Result<StockMovementWithProduct[], ServiceError>> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    if (productId) {
      const parsedId = parseId(productId);
      if (!parsedId.success) {
        return [validationError("Invalid product id"), undefined];
      }
    }

    return tryCatch(
      (async () => {
        await connectDB();
        const filter = productId
          ? {
              userId: parsedUserId.data,
              productId: new Types.ObjectId(productId),
            }
          : { userId: parsedUserId.data };
        const docs = await StockMovementModel.find(filter)
          .populate("productId", "_id name sku")
          .sort({ createdAt: -1 });

        return docs.map((doc) =>
          toPlainMovementWithProduct(
            doc as unknown as {
              _id: string;
              productId: { _id: string; name: string; sku: string };
              type: StockMovement["type"];
              quantity: number;
              note?: string;
              createdAt: Date;
            },
          ),
        );
      })(),
      mapToServiceError,
    );
  },

  /**
   * Returns the current user's most recent movements (used by the dashboard).
   */
  async listRecent(
    userId: string,
    limit: number,
  ): Promise<Result<StockMovementWithProduct[], ServiceError>> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        const docs = await StockMovementModel.find({
          userId: parsedUserId.data,
        })
          .populate("productId", "_id name sku")
          .sort({ createdAt: -1 })
          .limit(limit);

        return docs.map((doc) =>
          toPlainMovementWithProduct(
            doc as unknown as {
              _id: string;
              productId: { _id: string; name: string; sku: string };
              type: StockMovement["type"];
              quantity: number;
              note?: string;
              createdAt: Date;
            },
          ),
        );
      })(),
      mapToServiceError,
    );
  },
};
