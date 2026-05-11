import { apiClient } from "@/lib/api-client";
import {
  ErrorResponse,
  ListResponse,
  OkResponse,
} from "@/lib/schemas/response/schema";
import { RoomDTO } from "@/lib/schemas/room/schema";
import type {
  RoomCreateBody,
  RoomUpdateBody,
} from "@/lib/schemas/room/request";
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
      const res = await apiClient
        .post("rooms", { json: body })
        .json<OkResponse<RoomDTO>>();

      return res.data;
    },
  });
}

export function useUpdateRoom(roomId: number) {
  return useMutation<RoomDTO, ErrorResponse, RoomUpdateBody>({
    mutationFn: async (body) => {
      const res = await apiClient
        .patch(`rooms/${roomId}`, { json: body })
        .json<OkResponse<RoomDTO>>();

      return res.data;
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

export function useReadRoom(roomId: number) {
  return useMutation<null, ErrorResponse>({
    mutationFn: async () => {
      const res = await apiClient
        .post(`rooms/${roomId}/read`)
        .json<OkResponse<null>>();
      return res.data;
    },
  });
}
