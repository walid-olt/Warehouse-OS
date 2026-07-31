import type { NextResponse } from "next/server";
import { errorResponse } from "@/lib/utils";
import type { ApiErrorResponse } from "@/types/api";
import { type ErrorCode, ErrorCodes } from "@/types/errors";

/**
 * Typed domain error returned as a value by the service layer.
 */
export class ServiceError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export function validationError(
  message = "Validation failed",
  details?: unknown,
): ServiceError {
  return new ServiceError(ErrorCodes.VALIDATION_ERROR, message, 400, details);
}

export function notFoundError(message = "Resource not found"): ServiceError {
  return new ServiceError(ErrorCodes.NOT_FOUND, message, 404);
}

export function conflictError(
  message = "Resource already exists",
): ServiceError {
  return new ServiceError(ErrorCodes.CONFLICT, message, 409);
}

export function internalError(
  message = "Something went wrong",
  details?: unknown,
): ServiceError {
  return new ServiceError(
    ErrorCodes.INTERNAL_SERVER_ERROR,
    message,
    500,
    details,
  );
}

const isDuplicateKeyError = (error: unknown): boolean =>
  error instanceof Error &&
  "code" in error &&
  (error as { code?: unknown }).code === 11000;

/**
 * Normalizes any thrown error into a ServiceError so callers can
 * handle it as a value instead of with try/catch.
 */
export function mapToServiceError(error: unknown): ServiceError {
  if (error instanceof ServiceError) return error;
  if (isDuplicateKeyError(error)) {
    return conflictError("A record with this value already exists");
  }
  return internalError();
}

/**
 * Converts a ServiceError into a standardized HTTP error response.
 */
export function toErrorResponse(
  error: ServiceError,
): NextResponse<ApiErrorResponse> {
  return errorResponse(error.code, error.message, error.status, error.details);
}
