import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

export interface IApiErrorPayload {
  success: false;
  message: string;
  statusCode?: number;
  errorDetails?: { path: string | number; message: string }[];
}

export interface IAxiosBaseQueryError {
  status?: number;
  data: IApiErrorPayload | { message: string };
}

export type TAxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

export const axiosBaseQuery =
  (
    baseUrl = "",
  ): BaseQueryFn<TAxiosBaseQueryArgs, unknown, IAxiosBaseQueryError> =>
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
      const axiosError = error as AxiosError<IApiErrorPayload>;

      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data ?? { message: axiosError.message },
        },
      };
    }
  };
