import { auth } from "@/auth";
import { stockService } from "@/features/stock/services/stock.service";
import { getAuthUserId } from "@/lib/api/utils";
import { toErrorResponse } from "@/lib/errors";
import { errorResponse, successResponse } from "@/lib/utils";

export const GET = auth(async (req) => {
  const userId = getAuthUserId(req);
  if (!userId) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId") ?? undefined;

  const [error, movements] = await stockService.list(userId, productId);
  if (error) return toErrorResponse(error);

  return successResponse(movements, "Stock movements fetched successfully");
});
