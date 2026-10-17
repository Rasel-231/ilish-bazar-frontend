import { baseApi } from "@/redux/baseApi/baseApi";
import type { IApiResponse, IPaginatedList } from "@/types/common.types";

import type {
  ICreateProductPayload,
  IListProductsQuery,
  IProduct,
  IUpdateProductPayload,
} from "../types/product.types";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      IPaginatedList<IProduct>,
      IListProductsQuery | void
    >({
      query: (params) => ({ url: "/catalog", params: params ?? undefined }),
      providesTags: ["Product"],
    }),
    getProductById: builder.query<IApiResponse<IProduct>, string>({
      query: (id) => ({ url: `/catalog/${id}` }),
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<
      IApiResponse<IProduct>,
      ICreateProductPayload
    >({
      query: (body) => ({ url: "/catalog", method: "POST", data: body }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<
      IApiResponse<IProduct>,
      { id: string; body: IUpdateProductPayload }
    >({
      query: ({ id, body }) => ({
        url: `/catalog/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({ url: `/catalog/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
