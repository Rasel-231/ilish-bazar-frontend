import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "../axiosBaseQuery/axiosBaseQuery";
import { tagtypeList } from "../types/tagTypes";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(API_BASE_URL),
  tagTypes: tagtypeList,
  endpoints: () => ({}),
});
