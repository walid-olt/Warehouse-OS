import type { StockMovementWithProduct } from "./stock-movements";

export const LOW_STOCK_THRESHOLD = 10;

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  lowStockProducts: number;
  lowStockThreshold: number;
  recentMovements: StockMovementWithProduct[];
}
