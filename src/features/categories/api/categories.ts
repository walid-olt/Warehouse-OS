import type { Category, CategoryCreateDTO } from "@/types/category";

const BASE_URL = "/api/categories";

class ApiError extends Error {
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

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json();
  if (!response.ok) {
    throw new ApiError(
      json.error?.message ?? "An unexpected error occurred",
      response.status,
      json.error?.code,
      json.error?.details,
    );
  }
  return json.data as T;
}

export async function fetchCategories(
  includeArchived = false,
): Promise<Category[]> {
  const params = new URLSearchParams();
  if (includeArchived) params.set("includeArchived", "true");
  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const res = await fetch(url);
  return handleResponse<Category[]>(res);
}

export async function fetchCategory(id: string): Promise<Category> {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse<Category>(res);
}

export async function createCategory(
  data: CategoryCreateDTO,
): Promise<Category> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Category>(res);
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryCreateDTO>,
): Promise<Category> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Category>(res);
}

export async function archiveCategory(id: string): Promise<Category> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return handleResponse<Category>(res);
}
