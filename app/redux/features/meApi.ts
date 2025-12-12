import {ApiResponseBody} from "@/app/(server)/api/api.types";
import {User} from "@prisma/client";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const meApi = createApi({
  reducerPath: "meApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      transformResponse: (response: ApiResponseBody<User>) => {
        return response.data;
      },
    }),
  }),
});

export const {useGetMeQuery} = meApi;
