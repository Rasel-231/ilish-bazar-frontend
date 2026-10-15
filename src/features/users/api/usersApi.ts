import { baseApi } from "@/redux/baseApi/baseApi";
import type { IApiResponse, IPaginatedList } from "@/types/common.types";

import type {
  ICreateUserPayload,
  IListUsersQuery,
  IRegisterPayload,
  IUpdateProfilePayload,
  IUpdateUserPayload,
  IUser,
} from "../types/user.types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<IApiResponse<IUser>, IRegisterPayload>({
      query: (body) => ({ url: "/users/register", method: "POST", data: body }),
      invalidatesTags: ["Auth", "User"],
    }),
    getMe: builder.query<IApiResponse<IUser>, void>({
      query: () => ({ url: "/users/me" }),
      providesTags: ["Auth", "User"],
    }),
    updateMe: builder.mutation<IApiResponse<IUser>, IUpdateProfilePayload>({
      query: (body) => ({ url: "/users/me", method: "PATCH", data: body }),
      invalidatesTags: ["Auth", "User"],
    }),
    getUsers: builder.query<IPaginatedList<IUser>, IListUsersQuery | void>({
      query: (params) => ({ url: "/users", params: params ?? undefined }),
      providesTags: ["User"],
    }),
    getUserById: builder.query<IApiResponse<IUser>, string>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation<IApiResponse<IUser>, ICreateUserPayload>({
      query: (body) => ({ url: "/users", method: "POST", data: body }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<
      IApiResponse<IUser>,
      { id: string; body: IUpdateUserPayload }
    >({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
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
} = usersApi;
