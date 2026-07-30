"use client";

import { SmileySad, WarningCircle, WifiSlash } from "@phosphor-icons/react";
import type React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface ErrorScreenProps {
  title?: string;
  message?: string;
  variant?: "default" | "destructive" | "network";
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

const variantMap = {
  default: {
    icon: SmileySad,
    title: "Something went wrong",
    message: "An unexpected error occurred. Please try again.",
  },
  destructive: {
    icon: WarningCircle,
    title: "Error",
    message: "An error occurred while processing your request.",
  },
  network: {
    icon: WifiSlash,
    title: "Connection lost",
    message: "Please check your internet connection and try again.",
  },
};

function ErrorScreen({
  title,
  message,
  variant = "default",
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorScreenProps) {
  const config = variantMap[variant];
  const Icon = config.icon;

  return (
    <Empty className={cn("min-h-[300px]", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="size-5" />
        </EmptyMedia>
        <EmptyTitle>{title ?? config.title}</EmptyTitle>
        <EmptyDescription>{message ?? config.message}</EmptyDescription>
      </EmptyHeader>
      {onRetry && (
        <EmptyContent>
          <Button variant="outline" onClick={onRetry}>
            {retryLabel}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}

interface InlineErrorProps {
  title?: string;
  message: string;
  className?: string;
}

function InlineError({ title, message, className }: InlineErrorProps) {
  return (
    <Alert variant="destructive" className={className}>
      <WarningCircle className="size-4" weight="fill" />
      <AlertTitle>{title ?? "Error"}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export { ErrorScreen, InlineError };
