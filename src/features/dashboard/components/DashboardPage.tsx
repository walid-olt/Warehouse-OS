"use client";

import {
  ChartBarIcon,
  FolderIcon,
  PackageIcon,
  SwapIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { ErrorScreen } from "@/components/ui/error-display";
import { PageLoader } from "@/components/ui/spinner";
import { Large, Muted, Subheading } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "../hooks/useDashboardStats";

const currency = new Intl.NumberFormat("en-US");

const StatCard = ({
  label,
  value,
  icon,
  accent = "text-foreground",
  hint,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: string;
  hint?: string;
}) => (
  <div className="flex items-start justify-between gap-4 rounded-xl border bg-card p-5">
    <div className="space-y-1">
      <Muted>{label}</Muted>
      <div className={cn("text-3xl font-bold tracking-tight", accent)}>
        {currency.format(Number(value))}
      </div>
      {hint && <Muted>{hint}</Muted>}
    </div>
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg]:size-5">
      {icon}
    </div>
  </div>
);

const DashboardPage = () => {
  const { data, isLoading, error, refetch } = useDashboardStats();

  if (isLoading) return <PageLoader label="Loading dashboard..." />;

  if (error) {
    return (
      <ErrorScreen
        title="Failed to load dashboard"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Large>Dashboard</Large>
        <Subheading>Your warehouse at a glance</Subheading>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Products"
          value={data?.totalProducts ?? 0}
          icon={<PackageIcon />}
        />
        <StatCard
          label="Total Categories"
          value={data?.totalCategories ?? 0}
          icon={<FolderIcon />}
        />
        <StatCard
          label="Low Stock Products"
          value={data?.lowStockProducts ?? 0}
          icon={<WarningIcon />}
          accent="text-amber-600 dark:text-amber-400"
          hint={`Below ${data?.lowStockThreshold ?? 10} units`}
        />
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <SwapIcon className="size-4 text-muted-foreground" />
          <Large>Recent Movements</Large>
        </div>

        {!data?.recentMovements || data.recentMovements.length === 0 ? (
          <Muted>No movements recorded yet.</Muted>
        ) : (
          <ul className="divide-y divide-border/50">
            {data.recentMovements.map((movement) => {
              const isIn = movement.type === "IN";
              return (
                <li
                  key={movement._id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-semibold",
                        isIn
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-destructive/10 text-destructive",
                      )}
                    >
                      {movement.type}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-foreground">
                        {movement.productId.name}
                      </div>
                      <Muted>
                        {new Date(movement.createdAt).toLocaleString()}
                      </Muted>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-semibold tabular-nums",
                      isIn
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-destructive",
                    )}
                  >
                    {isIn ? "+" : "-"}
                    {movement.quantity}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <ChartBarIcon className="size-4" />
        <Muted>Dashboard is updated live from your inventory.</Muted>
      </div>
    </div>
  );
};

export default DashboardPage;
