import type { Role } from "./jwt";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function apiFetch<T>(
  path: string,
  opts?: {
    method?: string;
    body?: any;
    token?: string | null;
  },
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    method: opts?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts?.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: opts?.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  const json = (await res.json().catch(() => ({}))) as ApiResponse<T>;

  if (!res.ok || json.success === false) {
    throw new Error(json?.message || `Request failed: ${res.status}`);
  }

  return json.data as T;
}

export function isAdminRole(role?: Role | null) {
  return role === "ADMIN";
}

