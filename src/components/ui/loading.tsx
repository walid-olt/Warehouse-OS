"use client";

import { SpinnerIcon } from "@phosphor-icons/react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  label?: string;
  description?: string;
  className?: string;
}

function LoadingScreen({
  label = "Loading...",
  description,
  className,
}: LoadingScreenProps) {
  return (
    <Empty className={cn("min-h-[300px]", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SpinnerIcon className="size-5 animate-spin" />
        </EmptyMedia>
        <EmptyTitle>{label}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  );
}

export { LoadingScreen };
