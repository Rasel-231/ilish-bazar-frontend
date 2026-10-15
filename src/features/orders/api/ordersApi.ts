import { baseApi } from "@/redux/baseApi/baseApi";
import type { IApiResponse, IPaginatedList } from "@/types/common.types";

import type {
  ICreateOrderPayload,
  IListOrdersQuery,
  IOrder,
  IUpdateOrderStatusPayload,
} from "../types/order.types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<IPaginatedList<IOrder>, IListOrdersQuery | void>({
      query: (params) => ({ url: "/orders", params: params ?? undefined }),
      providesTags: ["Order"],
    }),
    getOrderById: builder.query<IApiResponse<IOrder>, string>({
      query: (id) => ({ url: `/orders/${id}` }),
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation<IApiResponse<IOrder>, ICreateOrderPayload>({
      query: (body) => ({ url: "/orders", method: "POST", data: body }),
      invalidatesTags: ["Order"],
    }),
    cancelOrder: builder.mutation<IApiResponse<IOrder>, string>({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: "POST" }),
      invalidatesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation<
      IApiResponse<IOrder>,
      { id: string; body: IUpdateOrderStatusPayload }
    >({
      query: ({ id, body }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
} = ordersApi;
