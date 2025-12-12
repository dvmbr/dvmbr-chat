import {
  MessageVM,
  toMessageListVM,
  toMessageVM,
} from "@/app/(routes)/chat/[roomId]/_server/MessageVM";
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
    getMessagesByRoomId: builder.query<MessageVM[], string>({
      query: (roomId) => ({
        url: `/messages/${roomId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponseBody<MessageDTO[]>) => {
        return toMessageListVM(response.data ?? []);
      },
      providesTags: (_r, _e, roomId) => [{type: "Messages", id: roomId}],
    }),
    createMessage: builder.mutation<MessageVM, CreateMessagePayload>({
      query: (body) => ({
        url: "/message",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseBody<MessageDTO>) => {
        return toMessageVM(response.data);
      },
      invalidatesTags: (_r, _e, body) =>
        body.roomId ? [{type: "Messages", id: body.roomId}] : [],
    }),
  }),
});

export const {useGetMessagesByRoomIdQuery, useCreateMessageMutation} =
  messageApi;
