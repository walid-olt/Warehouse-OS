import CategoryModel from "@/features/categories/models/category.model";
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
import {
  productCreateSchema,
  productUpdateSchema,
} from "@/schemas/product.schema";
import type { Product, ProductWithCategory } from "@/types/product";
import { ProductModel } from "../models/product.model";

type ProductResult<T> = Promise<Result<T, ServiceError>>;

const toPlainProduct = (doc: {
  _id: unknown;
  name: string;
  sku: string;
  description: string;
  category: unknown;
  price: number;
  stockQuantity: number;
  isArchived: boolean;
}): Product => ({
  _id: String(doc._id),
  name: doc.name,
  sku: doc.sku,
  description: doc.description,
  category: String(doc.category),
  price: doc.price,
  stockQuantity: doc.stockQuantity,
  isArchived: doc.isArchived,
});

const toPlainProductWithCategory = (doc: {
  _id: string;
  name: string;
  sku: string;
  description: string;
  category: { _id: string; name: string };
  price: number;
  stockQuantity: number;
  isArchived: boolean;
}): ProductWithCategory => ({
  _id: String(doc._id),
  name: doc.name,
  sku: doc.sku,
  description: doc.description,
  category: {
    _id: String(doc.category._id),
    name: doc.category.name,
  },
  price: doc.price,
  stockQuantity: doc.stockQuantity,
  isArchived: doc.isArchived,
});

const parseId = (id: string) => objectIdSchema.safeParse(id);
const parseUserId = (userId: string) => objectIdSchema.safeParse(userId);

const assertCategoryExists = async (categoryId: string, userId: string) => {
  const exists = await CategoryModel.exists({ _id: categoryId, userId });
  if (!exists) throw validationError("Selected category does not exist");
};

export const productService = {
  /**
   * Lists the current user's products, optionally including archived ones.
   */
  async list(
    userId: string,
    includeArchived = false,
  ): Promise<Result<ProductWithCategory[], ServiceError>> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        const filter = includeArchived
          ? { userId: parsedUserId.data }
          : { userId: parsedUserId.data, isArchived: false };
        const docs = await ProductModel.find(filter)
          .populate("category", "_id name")
          .sort({ createdAt: -1 });
        return docs.map((doc) =>
          toPlainProductWithCategory(
            doc as unknown as {
              _id: string;
              name: string;
              sku: string;
              description: string;
              category: { _id: string; name: string };
              price: number;
              stockQuantity: number;
              isArchived: boolean;
            },
          ),
        );
      })(),
      mapToServiceError,
    );
  },

  /**
   * Returns a single product owned by the current user.
   */
  async getById(
    userId: string,
    id: string,
  ): Promise<Result<ProductWithCategory, ServiceError>> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    const parsedId = parseId(id);
    if (!parsedId.success) {
      return [notFoundError("Product not found"), undefined];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        const doc = await ProductModel.findOne({
          _id: parsedId.data,
          userId: parsedUserId.data,
        }).populate("category", "_id name");
        if (!doc) throw notFoundError("Product not found");
        return toPlainProductWithCategory(
          doc as unknown as {
            _id: string;
            name: string;
            sku: string;
            description: string;
            category: { _id: string; name: string };
            price: number;
            stockQuantity: number;
            isArchived: boolean;
          },
        );
      })(),
      mapToServiceError,
    );
  },

  /**
   * Creates a new product for the current user. Input is validated against
   * the product schema, the referenced category must belong to the user, and
   * the SKU must be unique for the user.
   */
  async create(userId: string, data: unknown): ProductResult<Product> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    const parsed = productCreateSchema.safeParse(data);
    if (!parsed.success) {
      return [
        validationError("Validation failed", formatZodErrors(parsed.error)),
        undefined,
      ];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        await assertCategoryExists(parsed.data.category, parsedUserId.data);
        const doc = await ProductModel.create({
          ...parsed.data,
          userId: parsedUserId.data,
        });
        return toPlainProduct(doc);
      })(),
      mapToServiceError,
    );
  },

  /**
   * Updates one or more fields of a product owned by the current user.
   */
  async update(
    userId: string,
    id: string,
    data: unknown,
  ): ProductResult<Product> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    const parsedId = parseId(id);
    if (!parsedId.success) {
      return [notFoundError("Product not found"), undefined];
    }

    const parsed = productUpdateSchema.safeParse(data);
    if (!parsed.success) {
      return [
        validationError("Validation failed", formatZodErrors(parsed.error)),
        undefined,
      ];
    }
    if (Object.keys(parsed.data).length === 0) {
      return [validationError("No fields to update"), undefined];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        if (parsed.data.category) {
          await assertCategoryExists(parsed.data.category, parsedUserId.data);
        }

        const doc = await ProductModel.findOneAndUpdate(
          { _id: parsedId.data, userId: parsedUserId.data },
          parsed.data,
          {
            new: true,
            runValidators: true,
          },
        );
        if (!doc) throw notFoundError("Product not found");
        return toPlainProduct(doc);
      })(),
      mapToServiceError,
    );
  },

  /**
   * Soft-deletes a product owned by the current user by setting isArchived
   * to true.
   */
  async archive(userId: string, id: string): ProductResult<Product> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    const parsedId = parseId(id);
    if (!parsedId.success) {
      return [notFoundError("Product not found"), undefined];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        const doc = await ProductModel.findOneAndUpdate(
          { _id: parsedId.data, userId: parsedUserId.data },
          { isArchived: true },
          { new: true, runValidators: true },
        );
        if (!doc) throw notFoundError("Product not found");
        return toPlainProduct(doc);
      })(),
      mapToServiceError,
    );
  },

  /**
   * Counts the current user's active (non-archived) products.
   */
  async count(userId: string): Promise<Result<number, ServiceError>> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        return ProductModel.countDocuments({
          userId: parsedUserId.data,
          isArchived: false,
        });
      })(),
      mapToServiceError,
    );
  },

  /**
   * Counts the current user's active products whose stock is below the given
   * threshold.
   */
  async countLowStock(
    userId: string,
    threshold: number,
  ): Promise<Result<number, ServiceError>> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        return ProductModel.countDocuments({
          userId: parsedUserId.data,
          isArchived: false,
          stockQuantity: { $lt: threshold },
        });
      })(),
      mapToServiceError,
    );
  },
};
