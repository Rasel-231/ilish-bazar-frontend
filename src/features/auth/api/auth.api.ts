import { baseApi } from "@/redux/api/base-api";
import { TagTypes } from "@/redux/types/tag-types";
import type { ApiResponse } from "@/types/common.types";

import type {
  AuthTokens,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
} from "../types/auth.types";

const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthTokens>, LoginPayload>({
      query: (body) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [TagTypes.user],
    }),

    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch {
          // Keep cached state if logout fails.
        }
      },
    }),

    refreshToken: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: `${AUTH_URL}/refresh-token`,
        method: "POST",
      }),
    }),

    changePassword: builder.mutation<
      ApiResponse<null>,
      ChangePasswordPayload
    >({
      query: (body) => ({
        url: `${AUTH_URL}/change-password`,
        method: "POST",
        data: body,
      }),
    }),

    forgotPassword: builder.mutation<
      ApiResponse<null>,
      ForgotPasswordPayload
    >({
      query: (body) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: "POST",
        data: body,
      }),
    }),

    resetPassword: builder.mutation<ApiResponse<null>, ResetPasswordPayload>({
      query: (body) => ({
        url: `${AUTH_URL}/reset-password`,
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
