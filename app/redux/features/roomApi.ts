import {CreateRoomRequestBody} from "@/app/(server)/api/room/route";
import {RoomsData} from "@/app/(server)/api/rooms/route";
import {ApiResponseBody} from "@/app/redux/types/api";
import {Room} from "@prisma/client";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Rooms"],
  endpoints: (builder) => ({
    getRooms: builder.query<ApiResponseBody<RoomsData>, void>({
      query: () => ({
        url: "/rooms",
        method: "GET",
      }),
      providesTags: ["Rooms"],
    }),
    createRoom: builder.mutation<ApiResponseBody<Room>, CreateRoomRequestBody>({
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
