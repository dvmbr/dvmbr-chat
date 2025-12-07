import {AuthRequestBody, AuthResponseData} from "@/app/(server)/api/auth/route";
import {ApiResponseBody} from "@/app/redux/types/api";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponseBody<AuthResponseData>, AuthRequestBody>(
      {
        query: (body) => ({
          url: "/auth",
          method: "POST",
          body,
        }),
      }
    ),
    logout: builder.mutation<ApiResponseBody<void>, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {useLoginMutation, useLogoutMutation} = authApi;
