import { auth } from "@/auth";
import { CategoryModel } from "@/features/categories/models/category.model";
import { connectDB } from "@/lib/mongodb";
import { errorResponse, formatZodErrors, successResponse } from "@/lib/utils";
import { categoryCreateSchema } from "@/schemas/category.schema";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = auth(async (req, context: RouteContext) => {
  if (!req.auth) return errorResponse("UNAUTHORIZED", "unauthorized", 401);

  const { id } = await context.params;

  await connectDB();

  try {
    const category = await CategoryModel.findById(id);
    if (!category) {
      return errorResponse("NOT_FOUND", "Category not found", 404);
    }
    return successResponse(category, "Category fetched successfully");
  } catch {
    return errorResponse(
      "INTERNAL_SERVER_ERROR",
      "Failed to fetch category",
      500,
    );
  }
});

export const PATCH = auth(async (req, context: RouteContext) => {
  if (!req.auth) return errorResponse("UNAUTHORIZED", "unauthorized", 401);

  const { id } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse("INVALID_JSON", "Invalid JSON body", 400);
  }

  const parsed = categoryCreateSchema.partial().safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      "VALIDATION_ERROR",
      "Validation failed",
      400,
      formatZodErrors(parsed.error),
    );
  }

  await connectDB();

  try {
    const category = await CategoryModel.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return errorResponse("NOT_FOUND", "Category not found", 404);
    }
    return successResponse(category, "Category updated successfully");
  } catch {
    return errorResponse(
      "INTERNAL_SERVER_ERROR",
      "Failed to update category",
      500,
    );
  }
});

export const DELETE = auth(async (req, context: RouteContext) => {
  if (!req.auth) return errorResponse("UNAUTHORIZED", "unauthorized", 401);

  const { id } = await context.params;

  await connectDB();

  try {
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true },
    );
    if (!category) {
      return errorResponse("NOT_FOUND", "Category not found", 404);
    }
    return successResponse(category, "Category archived successfully");
  } catch {
    return errorResponse(
      "INTERNAL_SERVER_ERROR",
      "Failed to archive category",
      500,
    );
  }
});
