import { auth } from "@/auth";
import { stockService } from "@/features/stock/services/stock.service";
import { getAuthUserId, parseBody } from "@/lib/api/utils";
import { toErrorResponse } from "@/lib/errors";
import { errorResponse, successResponse } from "@/lib/utils";

export const POST = auth(async (req) => {
  const userId = getAuthUserId(req);
  if (!userId) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

  const body = await parseBody(req);
  if (!body) return errorResponse("INVALID_JSON", "Invalid request body", 400);

  const [error, movement] = await stockService.move(userId, body);
  if (error) return toErrorResponse(error);

  return successResponse(movement, "Stock movement recorded successfully", 201);
});
