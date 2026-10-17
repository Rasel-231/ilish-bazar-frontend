import { baseApi } from "@/redux/api/base-api";
import { TagTypes } from "@/redux/types/tag-types";
import type { ApiResponse, PaginatedList } from "@/types/common.types";

import type {
  CreateProductPayload,
  ListProductsQuery,
  Product,
  UpdateProductPayload,
} from "../types/product.types";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedList<Product>,
      ListProductsQuery | void
    >({
      query: (params) => ({ url: "/catalog", params: params ?? undefined }),
      providesTags: [TagTypes.product],
    }),
    getProductById: builder.query<ApiResponse<Product>, string>({
      query: (id) => ({ url: `/catalog/${id}` }),
      providesTags: [TagTypes.product],
    }),
    createProduct: builder.mutation<ApiResponse<Product>, CreateProductPayload>(
      {
        query: (body) => ({ url: "/catalog", method: "POST", data: body }),
        invalidatesTags: [TagTypes.product],
      },
    ),
    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: string; body: UpdateProductPayload }
    >({
      query: ({ id, body }) => ({
        url: `/catalog/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [TagTypes.product],
    }),
    deleteProduct: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/catalog/${id}`, method: "DELETE" }),
      invalidatesTags: [TagTypes.product],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
