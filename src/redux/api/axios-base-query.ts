import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

export interface ApiErrorPayload {
  success: false;
  message: string;
  statusCode?: number;
  errorDetails?: { path: string | number; message: string }[];
}

export interface AxiosBaseQueryError {
  status?: number;
  data: ApiErrorPayload | { message: string };
}

export type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

export const axiosBaseQuery =
  (
    baseUrl = "",
  ): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        withCredentials: true,
      });

      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorPayload>;

      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data ?? { message: axiosError.message },
        },
      };
    }
  };
