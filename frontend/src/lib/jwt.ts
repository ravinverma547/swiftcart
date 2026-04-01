export type Role = "CUSTOMER" | "ADMIN";

export type DecodedJwt = {
  userId?: string;
  role?: Role;
  email?: string;
  exp?: number;
};

export function decodeJwt(token: string): DecodedJwt | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as DecodedJwt;
  } catch {
    return null;
  }
}

