import { apiClient } from "@/lib/api-client";
import { ErrorResponse, ListResponse } from "@/lib/schema/response.schema";
import {
  RoomCreateBody,
  RoomDTO,
  RoomUpdateBody,
} from "@/lib/schema/room.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetRooms() {
  return useQuery<ListResponse<RoomDTO>["data"], ErrorResponse>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await apiClient.get(`rooms`).json<ListResponse<RoomDTO>>();
      return res.data;
    },
  });
}

export function useCreateRoom() {
  return useMutation<RoomDTO, ErrorResponse, RoomCreateBody>({
    mutationFn: async (body) => {
      const res = await apiClient.post("rooms", { json: body }).json<RoomDTO>();

      return res;
    },
  });
}

export function useUpdateRoom(roomId: number) {
  return useMutation<RoomDTO, ErrorResponse, RoomUpdateBody>({
    mutationFn: async (body) => {
      const res = await apiClient
        .patch(`rooms/${roomId}`, { json: body })
        .json<RoomDTO>();

      return res;
    },
  });
}

export function useDeleteRoom(roomId: number) {
  return useMutation<void, ErrorResponse>({
    mutationFn: async () => {
      await apiClient.delete(`rooms/${roomId}`);
    },
  });
}
