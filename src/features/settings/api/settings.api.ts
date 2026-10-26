import { baseApi } from "@/redux/api/base-api";
import { TagTypes } from "@/redux/types/tag-types";
import type { ApiResponse } from "@/types/common.types";

import type { SiteSetting, UpdateSiteSettingPayload } from "../types/settings.types";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSiteSetting: builder.query<ApiResponse<SiteSetting>, void>({
      query: () => ({ url: "/settings" }),
      providesTags: [TagTypes.setting],
    }),
    updateSiteSetting: builder.mutation<
      ApiResponse<SiteSetting>,
      UpdateSiteSettingPayload
    >({
      query: (body) => ({ url: "/settings", method: "PATCH", data: body }),
      invalidatesTags: [TagTypes.setting],
    }),
  }),
});

export const { useGetSiteSettingQuery, useUpdateSiteSettingMutation } = settingsApi;
