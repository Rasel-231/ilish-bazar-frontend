import type { UserRole } from "@/types/common.types";

export const isAdmin = (role?: UserRole | null) => role === "ADMIN";

export const getRoleLabel = (role?: UserRole | null) =>
  role === "ADMIN" ? "Administrator" : "Customer";

export const getPostLoginRedirect = (redirect?: string | null) => {
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }

  return "/dashboard";
};
