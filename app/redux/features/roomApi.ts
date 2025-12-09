import {
  RoomVM,
  toRoomListVM,
  toRoomVM,
} from "@/app/(routes)/chat/_server/roomVM";
import {ApiResponseBody} from "@/app/(server)/api/api.types";
import {CreateRoomPayload} from "@/app/(server)/api/room/route";
import {RoomDTO} from "@/app/(server)/lib/room/roomDTO";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Rooms"],
  endpoints: (builder) => ({
    getRooms: builder.query<RoomVM[], void>({
      query: () => ({
        url: "/rooms",
        method: "GET",
      }),
      transformResponse: (response: ApiResponseBody<RoomDTO[]>) => {
        return toRoomListVM(response.data ?? []);
      },
      providesTags: ["Rooms"],
    }),
    createRoom: builder.mutation<RoomVM, CreateRoomPayload>({
      query: (body) => ({
        url: "/room",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseBody<RoomDTO>) => {
        return toRoomVM(response.data);
      },
      invalidatesTags: ["Rooms"],
    }),
  }),
});

export const {useGetRoomsQuery, useCreateRoomMutation} = roomApi;
