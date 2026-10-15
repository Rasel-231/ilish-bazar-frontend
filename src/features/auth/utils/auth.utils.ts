import type { TUserRole } from "@/types/common.types";

export const isAdmin = (role?: TUserRole | null) => role === "ADMIN";

export const getRoleLabel = (role?: TUserRole | null) =>
  role === "ADMIN" ? "Administrator" : "Customer";

export const getPostLoginRedirect = (redirect?: string | null) => {
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }

  return "/dashboard";
};
