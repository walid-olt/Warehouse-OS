import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodError } from "zod";

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
  if (!name || typeof name !== 'string') return '';

  const cleanName = name.trim().replace(/\s+/g, ' '); // Normalize spaces
  const parts = cleanName.split(' ');

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase(); // "John" -> "JO"
  }

  const firstInitial = parts[0][0];
  const lastInitial = parts[parts.length - 1][0];

  return `${firstInitial}${lastInitial}`.toUpperCase(); // "John Doe" -> "JD"
}
