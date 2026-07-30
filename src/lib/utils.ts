import { type ClassValue, clsx } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import type { ZodError } from "zod";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import type { ErrorCode } from "@/types/errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZodErrors(error: ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const fieldPath = issue.path.join(".") || "root";
    acc[fieldPath] = issue.message;
    return acc;
  }, {});
}

export function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== "string") return "";

  const cleanName = name.trim().replace(/\s+/g, " "); // Normalize spaces
  const parts = cleanName.split(" ");

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase(); // "John" -> "JO"
  }

  const firstInitial = parts[0][0];
  const lastInitial = parts[parts.length - 1][0];

  return `${firstInitial}${lastInitial}`.toUpperCase(); // "John Doe" -> "JD"
}

/**
 * Returns a standardized success response.
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
  meta?: ApiSuccessResponse<T>["meta"],
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
      ...(meta && { meta }),
    },
    { status },
  );
}

/**
 * Returns a standardized error response.
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number = 400,
  details?: any,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    { status },
  );
}
