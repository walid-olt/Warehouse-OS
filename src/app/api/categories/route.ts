import { auth } from "@/auth";
import { CategoryModel } from "@/features/categories/models/category.model";
import { connectDB } from "@/lib/mongodb";
import { errorResponse, formatZodErrors, successResponse } from "@/lib/utils";
import { categoryCreateSchema } from "@/schemas/category.schema";

export const GET = auth(async (req) => {
  if (!req.auth) return errorResponse("UNAUTHORIZED", "unauthorized", 401);

  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const includeArchived = searchParams.get("includeArchived") === "true";

    const filter = includeArchived ? {} : { isArchived: false };
    const categories = await CategoryModel.find(filter).sort({ createdAt: -1 });

    return successResponse(categories, "Categories fetched successfully");
  } catch {
    return errorResponse(
      "INTERNAL_SERVER_ERROR",
      "Failed to fetch categories",
      500,
    );
  }
});

export const POST = auth(async (req) => {
  if (!req.auth) return errorResponse("UNAUTHORIZED", "unauthorized", 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse("INVALID_JSON", "Invalid JSON body", 400);
  }

  const parsed = categoryCreateSchema.safeParse(body);
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
    const category = await CategoryModel.create(parsed.data);
    return successResponse(category, "Category created successfully", 201);
  } catch {
    return errorResponse(
      "INTERNAL_SERVER_ERROR",
      "Failed to create category",
      500,
    );
  }
});
