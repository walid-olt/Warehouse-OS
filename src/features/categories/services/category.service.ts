import {
  mapToServiceError,
  notFoundError,
  type ServiceError,
  validationError,
} from "@/lib/errors";
import { connectDB } from "@/lib/mongodb";
import { type Result, tryCatch } from "@/lib/return";
import { formatZodErrors } from "@/lib/utils";
import { categoryCreateSchema } from "@/schemas/category.schema";
import { objectIdSchema } from "@/schemas/common";
import type { Category } from "@/types/category";
import CategoryModel from "../models/category.model";

type CategoryResult<T> = Promise<Result<T, ServiceError>>;

const toPlainCategory = (doc: {
  _id: unknown;
  name: string;
  description: string;
  isArchived: boolean;
  createdAt: Date;
}): Category => ({
  _id: String(doc._id),
  name: doc.name,
  description: doc.description,
  isArchived: doc.isArchived,
  createdAt: doc.createdAt,
});

const parseId = (id: string) => objectIdSchema.safeParse(id);
const parseUserId = (userId: string) => objectIdSchema.safeParse(userId);

export const categoryService = {
  /**
   * Lists the current user's categories, optionally including archived ones.
   */
  async list(
    userId: string,
    includeArchived = false,
  ): CategoryResult<Category[]> {
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
        const docs = await CategoryModel.find(filter).sort({ createdAt: -1 });
        return docs.map(toPlainCategory);
      })(),
      mapToServiceError,
    );
  },

  /**
   * Returns a single category owned by the current user.
   */
  async getById(userId: string, id: string): CategoryResult<Category> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    const parsedId = parseId(id);
    if (!parsedId.success) {
      return [notFoundError("Category not found"), undefined];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        const doc = await CategoryModel.findOne({
          _id: parsedId.data,
          userId: parsedUserId.data,
        });
        if (!doc) throw notFoundError("Category not found");
        return toPlainCategory(doc);
      })(),
      mapToServiceError,
    );
  },

  /**
   * Creates a new category owned by the current user. Input is validated
   * against the category schema.
   */
  async create(userId: string, data: unknown): CategoryResult<Category> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    const parsed = categoryCreateSchema.safeParse(data);
    if (!parsed.success) {
      return [
        validationError("Validation failed", formatZodErrors(parsed.error)),
        undefined,
      ];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        const doc = await CategoryModel.create({
          ...parsed.data,
          userId: parsedUserId.data,
        });
        return toPlainCategory(doc);
      })(),
      mapToServiceError,
    );
  },

  /**
   * Updates one or more fields of a category owned by the current user.
   */
  async update(
    userId: string,
    id: string,
    data: unknown,
  ): CategoryResult<Category> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    const parsedId = parseId(id);
    if (!parsedId.success) {
      return [notFoundError("Category not found"), undefined];
    }

    const parsed = categoryCreateSchema.partial().safeParse(data);
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
        const doc = await CategoryModel.findOneAndUpdate(
          { _id: parsedId.data, userId: parsedUserId.data },
          parsed.data,
          {
            new: true,
            runValidators: true,
          },
        );
        if (!doc) throw notFoundError("Category not found");
        return toPlainCategory(doc);
      })(),
      mapToServiceError,
    );
  },

  /**
   * Soft-deletes a category owned by the current user by setting isArchived
   * to true.
   */
  async archive(userId: string, id: string): CategoryResult<Category> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    const parsedId = parseId(id);
    if (!parsedId.success) {
      return [notFoundError("Category not found"), undefined];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        const doc = await CategoryModel.findOneAndUpdate(
          { _id: parsedId.data, userId: parsedUserId.data },
          { isArchived: true },
          { new: true, runValidators: true },
        );
        if (!doc) throw notFoundError("Category not found");
        return toPlainCategory(doc);
      })(),
      mapToServiceError,
    );
  },

  /**
   * Counts the current user's active (non-archived) categories.
   */
  async count(userId: string): Promise<Result<number, ServiceError>> {
    const parsedUserId = parseUserId(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    return tryCatch(
      (async () => {
        await connectDB();
        return CategoryModel.countDocuments({
          userId: parsedUserId.data,
          isArchived: false,
        });
      })(),
      mapToServiceError,
    );
  },
};
