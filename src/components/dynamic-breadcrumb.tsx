"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
          const href = `/${segments.slice(0, index + 1).join("/")}`;

          return (
            <Fragment key={segment}>
              <BreadcrumbItem>
                {!isLast ? (
                  <BreadcrumbLink render={<Link href={href} />}>
                    {formatLabel(segment)}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="font-semibold">
                    {formatLabel(segment)}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
