import {ApiResponseBody} from "@/app/(server)/api/api.types";
import {CreateRoomPayload} from "@/app/(server)/api/room/route";
import {RoomListViewModel} from "@/app/(server)/lib/room/utils";
import {Room} from "@prisma/client";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Rooms"],
  endpoints: (builder) => ({
    getRooms: builder.query<ApiResponseBody<RoomListViewModel>, void>({
      query: () => ({
        url: "/rooms",
        method: "GET",
      }),
      providesTags: ["Rooms"],
    }),
    createRoom: builder.mutation<ApiResponseBody<Room>, CreateRoomPayload>({
      query: (body) => ({
        url: "/room",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Rooms"],
    }),
  }),
});

export const {useGetRoomsQuery, useCreateRoomMutation} = roomApi;
