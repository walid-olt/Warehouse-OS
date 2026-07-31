import { auth } from "@/auth";
import { categoryService } from "@/features/categories/services/category.service";
import { getAuthUserId, parseBody } from "@/lib/api/utils";
import { toErrorResponse } from "@/lib/errors";
import { errorResponse, successResponse } from "@/lib/utils";

export const GET = auth(async (req) => {
  const userId = getAuthUserId(req);
  if (!userId) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const includeArchived = searchParams.get("includeArchived") === "true";

  const [error, categories] = await categoryService.list(
    userId,
    includeArchived,
  );
  if (error) return toErrorResponse(error);

  return successResponse(categories, "Categories fetched successfully");
});

export const POST = auth(async (req) => {
  const userId = getAuthUserId(req);
  if (!userId) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

  const body = await parseBody(req);
  if (!body) return errorResponse("INVALID_JSON", "Invalid request body", 400);

  const [error, category] = await categoryService.create(userId, body);
  if (error) return toErrorResponse(error);

  return successResponse(category, "Category created successfully", 201);
});
