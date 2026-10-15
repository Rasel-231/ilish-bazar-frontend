import type { IApiResponse, IPaginationQuery } from "@/types/common.types";

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface IListUsersQuery extends IPaginationQuery {
  role?: "USER" | "ADMIN";
  isActive?: boolean;
}

export type TLoginResponse = IApiResponse<IAuthTokens>;
export type TAuthUserResponse = IApiResponse<IAuthUser>;
