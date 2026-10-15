import type { IUser } from "../types/user.types";

export const getUserDisplayName = (user: Pick<IUser, "name" | "email">) =>
  user.name?.trim() || user.email;

export const isAdminUser = (user?: Pick<IUser, "role"> | null) =>
  user?.role === "ADMIN";

export const filterActiveUsers = (users: IUser[]) =>
  users.filter((user) => user.isActive);
