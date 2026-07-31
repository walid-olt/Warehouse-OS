import CategoryModel from "@/features/categories/models/category.model";
import { ProductModel } from "@/features/products/models/product.model";
import { StockMovementModel } from "@/features/stock/models/stock-movement.model";
import {
  mapToServiceError,
  type ServiceError,
  validationError,
} from "@/lib/errors";
import { connectDB } from "@/lib/mongodb";
import { type Result, tryCatch } from "@/lib/return";
import { objectIdSchema } from "@/schemas/common";
import { type DashboardStats, LOW_STOCK_THRESHOLD } from "@/types/dashboard";
import type { StockMovement } from "@/types/stock-movements";

export const dashboardService = {
  /**
   * Aggregates the current user's dashboard stats: totals, low stock count
   * and recent movements.
   */
  async getStats(
    userId: string,
  ): Promise<Result<DashboardStats, ServiceError>> {
    const parsedUserId = objectIdSchema.safeParse(userId);
    if (!parsedUserId.success) {
      return [validationError("Invalid user id"), undefined];
    }

    return tryCatch(
      (async () => {
        await connectDB();

        const [totalProducts, totalCategories, lowStockProducts, recentDocs] =
          await Promise.all([
            ProductModel.countDocuments({
              userId: parsedUserId.data,
              isArchived: false,
            }),
            CategoryModel.countDocuments({
              userId: parsedUserId.data,
              isArchived: false,
            }),
            ProductModel.countDocuments({
              userId: parsedUserId.data,
              isArchived: false,
              stockQuantity: { $lt: LOW_STOCK_THRESHOLD },
            }),
            StockMovementModel.find({ userId: parsedUserId.data })
              .populate("productId", "_id name sku")
              .sort({ createdAt: -1 })
              .limit(5),
          ]);

        return {
          totalProducts,
          totalCategories,
          lowStockProducts,
          lowStockThreshold: LOW_STOCK_THRESHOLD,
          recentMovements: recentDocs.map((doc) => {
            const movement = doc as unknown as {
              _id: string;
              productId: { _id: string; name: string; sku: string };
              type: StockMovement["type"];
              quantity: number;
              note?: string;
              createdAt: Date;
            };
            return {
              _id: String(movement._id),
              productId: {
                _id: String(movement.productId._id),
                name: movement.productId.name,
                sku: movement.productId.sku,
              },
              type: movement.type,
              quantity: movement.quantity,
              note: movement.note,
              createdAt: movement.createdAt,
            };
          }),
        };
      })(),
      mapToServiceError,
    );
  },
};
