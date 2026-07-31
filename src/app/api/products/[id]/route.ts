import { auth } from "@/auth";
import { productService } from "@/features/products/services/product.service";
import { getAuthUserId, parseBody } from "@/lib/api/utils";
import { toErrorResponse } from "@/lib/errors";
import { errorResponse, successResponse } from "@/lib/utils";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = auth(async (req, context: RouteContext) => {
  const userId = getAuthUserId(req);
  if (!userId) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

  const { id } = await context.params;

  const [error, product] = await productService.getById(userId, id);
  if (error) return toErrorResponse(error);

  return successResponse(product, "Product fetched successfully");
});

export const PATCH = auth(async (req, context: RouteContext) => {
  const userId = getAuthUserId(req);
  if (!userId) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

  const { id } = await context.params;

  const body = await parseBody(req);
  if (!body) return errorResponse("INVALID_JSON", "Invalid request body", 400);

  const [error, product] = await productService.update(userId, id, body);
  if (error) return toErrorResponse(error);

  return successResponse(product, "Product updated successfully");
});

export const DELETE = auth(async (req, context: RouteContext) => {
  const userId = getAuthUserId(req);
  if (!userId) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

  const { id } = await context.params;

  const [error, product] = await productService.archive(userId, id);
  if (error) return toErrorResponse(error);

  return successResponse(product, "Product archived successfully");
});
