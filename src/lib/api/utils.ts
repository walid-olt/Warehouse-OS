import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

export function getAuthUserId(
  req: NextRequest & { auth: Session | null },
): string | null {
  return req.auth?.user?.id ?? null;
}

export async function parseBody<T = Record<string, unknown>>(
  req: NextRequest,
): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
