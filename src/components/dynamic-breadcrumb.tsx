"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  categories: "Categories",
};

function formatLabel(segment: string): string {
  return (
    segmentLabels[segment] ??
    segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function DynamicBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="font-semibold">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");

          return (
            <BreadcrumbItem key={segment}>
              {!isLast ? (
                <>
                  <BreadcrumbLink render={<Link href={href} />}>
                    {formatLabel(segment)}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage className="font-semibold">
                  {formatLabel(segment)}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
