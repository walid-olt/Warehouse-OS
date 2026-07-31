import type { DashboardStats } from "@/types/dashboard";
import { api } from "./client";

export const dashboardApi = {
  stats: () =>
    api
      .get("dashboard/stats")
      .json<{ data: DashboardStats }>()
      .then((r) => r.data),
};
