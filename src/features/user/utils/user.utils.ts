import type { User } from "../types/user.types";

export const getUserDisplayName = (user: Pick<User, "name" | "email">) =>
  user.name?.trim() || user.email;

export const isAdminUser = (user?: Pick<User, "role"> | null) =>
  user?.role === "ADMIN";

export const filterActiveUsers = (users: User[]) =>
  users.filter((user) => user.isActive);
