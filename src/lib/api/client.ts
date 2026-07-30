import ky, { HTTPError } from "ky";
import type { ApiErrorResponse } from "@/types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = ky.create({
  prefix: "/api",
  headers: { "Content-Type": "application/json" },
  hooks: {
    beforeError: [
      async (state) => {
        const { error } = state;
        if (error instanceof HTTPError) {
          const response = error.response;
          const data = error.data as ApiErrorResponse | undefined;
          if (data?.error) {
            return new ApiError(
              data.error.message ?? error.message,
              response.status,
              data.error.code,
              data.error.details,
            );
          }
          return new ApiError(error.message, response.status);
        }
        return new ApiError(error.message, 500);
      },
    ],
  },
  retry: 0,
});
