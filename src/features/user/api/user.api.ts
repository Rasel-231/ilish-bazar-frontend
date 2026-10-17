import { baseApi } from "@/redux/api/base-api";
import { TagTypes } from "@/redux/types/tag-types";
import type { ApiResponse, PaginatedList } from "@/types/common.types";

import type {
  CreateUserPayload,
  ListUsersQuery,
  RegisterPayload,
  UpdateProfilePayload,
  UpdateUserPayload,
  User,
} from "../types/user.types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<User>, RegisterPayload>({
      query: (body) => ({ url: "/users/register", method: "POST", data: body }),
      invalidatesTags: [TagTypes.auth, TagTypes.user],
    }),
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => ({ url: "/users/me" }),
      providesTags: [TagTypes.auth, TagTypes.user],
    }),
    updateMe: builder.mutation<ApiResponse<User>, UpdateProfilePayload>({
      query: (body) => ({ url: "/users/me", method: "PATCH", data: body }),
      invalidatesTags: [TagTypes.auth, TagTypes.user],
    }),
    getUsers: builder.query<PaginatedList<User>, ListUsersQuery | void>({
      query: (params) => ({ url: "/users", params: params ?? undefined }),
      providesTags: [TagTypes.user],
    }),
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: [TagTypes.user],
    }),
    createUser: builder.mutation<ApiResponse<User>, CreateUserPayload>({
      query: (body) => ({ url: "/users", method: "POST", data: body }),
      invalidatesTags: [TagTypes.user],
    }),
    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; body: UpdateUserPayload }
    >({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [TagTypes.user],
    }),
    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: [TagTypes.user],
    }),
  }),
});

export const {
  useRegisterMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
