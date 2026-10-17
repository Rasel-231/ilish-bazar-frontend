import { baseApi } from "@/redux/api/base-api";
import { TagTypes } from "@/redux/types/tag-types";
import type { ApiResponse, PaginatedList } from "@/types/common.types";

import type {
  CreateOrderPayload,
  ListOrdersQuery,
  Order,
  UpdateOrderStatusPayload,
} from "../types/order.types";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedList<Order>, ListOrdersQuery | void>({
      query: (params) => ({ url: "/orders", params: params ?? undefined }),
      providesTags: [TagTypes.order],
    }),
    getOrderById: builder.query<ApiResponse<Order>, string>({
      query: (id) => ({ url: `/orders/${id}` }),
      providesTags: [TagTypes.order],
    }),
    createOrder: builder.mutation<ApiResponse<Order>, CreateOrderPayload>({
      query: (body) => ({ url: "/orders", method: "POST", data: body }),
      invalidatesTags: [TagTypes.order],
    }),
    cancelOrder: builder.mutation<ApiResponse<Order>, string>({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: "POST" }),
      invalidatesTags: [TagTypes.order],
    }),
    updateOrderStatus: builder.mutation<
      ApiResponse<Order>,
      { id: string; body: UpdateOrderStatusPayload }
    >({
      query: ({ id, body }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [TagTypes.order],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
} = orderApi;
