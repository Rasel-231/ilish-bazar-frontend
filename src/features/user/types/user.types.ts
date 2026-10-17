import type { IPaginationQuery, TUserRole } from "@/types/common.types";

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: TUserRole;
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface IUpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
}

export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: TUserRole;
  isActive?: boolean;
}

export interface IUpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: TUserRole;
  isActive?: boolean;
}

export interface IListUsersQuery extends IPaginationQuery {
  role?: TUserRole;
  isActive?: boolean;
}
