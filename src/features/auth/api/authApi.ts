
import { baseApi } from "@/redux/baseApi/baseApi";
import { tagtypes } from "@/redux/types/tagTypes";
import type { IApiResponse } from "@/types/common.types";

import type {
  IAuthTokens,
  IChangePasswordPayload,
  IForgotPasswordPayload,
  ILoginPayload,
  IResetPasswordPayload,
  TLoginResponse,
} from "../types/auth.types";

const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    // Login
    login: builder.mutation<IApiResponse<IAuthTokens>, ILoginPayload>({
      query: (body) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [tagtypes.user],
    }),

    // Logout
    logout: builder.mutation<IApiResponse<null>, void>({
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

    // Refresh access token
    refreshToken: builder.mutation<TLoginResponse, void>({
      query: () => ({
        url: `${AUTH_URL}/refresh-token`,
        method: "POST",
      }),
    }),

    // Change password
    changePassword: builder.mutation<
      IApiResponse<null>,
      IChangePasswordPayload
    >({
      query: (body) => ({
        url: `${AUTH_URL}/change-password`,
        method: "POST",
        data: body,
      }),
    }),

    // Forgot password
    forgotPassword: builder.mutation<
      IApiResponse<null>,
      IForgotPasswordPayload
    >({
      query: (body) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: "POST",
        data: body,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<
      IApiResponse<null>,
      IResetPasswordPayload
    >({
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