import { auth } from "@/auth";
import { dashboardService } from "@/features/dashboard/services/dashboard.service";
import { getAuthUserId } from "@/lib/api/utils";
import { toErrorResponse } from "@/lib/errors";
import { errorResponse, successResponse } from "@/lib/utils";

export const GET = auth(async (req) => {
  const userId = getAuthUserId(req);
  if (!userId) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

  const [error, stats] = await dashboardService.getStats(userId);
  if (error) return toErrorResponse(error);

  return successResponse(stats, "Dashboard stats fetched successfully");
});
