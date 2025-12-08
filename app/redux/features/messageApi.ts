import {ApiResponseBody} from "@/app/(server)/api/api.types";
import {CreateMessagePayload} from "@/app/(server)/api/message/route";
import {MessageDTO} from "@/app/(server)/lib/message/messageDTO";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Messages"],
  endpoints: (builder) => ({
    getMessagesByRoomId: builder.query<ApiResponseBody<MessageDTO[]>, string>({
      query: (roomId) => ({
        url: `/messages/${roomId}`,
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),
    createMessage: builder.mutation<
      ApiResponseBody<MessageDTO>,
      CreateMessagePayload
    >({
      query: (body) => ({
        url: "/message",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {useGetMessagesByRoomIdQuery, useCreateMessageMutation} =
  messageApi;
