import type {
  ApiResponse,
  PaginationQuery,
  UserRole,
} from "@/types/common.types";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ListUsersQuery extends PaginationQuery {
  role?: UserRole;
  isActive?: boolean;
}

export type LoginResponse = ApiResponse<AuthTokens>;
export type AuthUserResponse = ApiResponse<AuthUser>;
