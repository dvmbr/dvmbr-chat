"use client";

import { useMutation, type MutateOptions } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import type { OkResponse } from "@/lib/schema/response.schema";
import type {
  RoomCreateBodyDTO,
  RoomDTO,
  RoomParamDTO,
  RoomUpdateBodyDTO,
} from "@/lib/schema/room.schema";
import { EnterChatDTO } from "@/lib/schema/entry.schema";

type useCreateRoomOptions = {
  onSuccess?: (data: OkResponse<RoomDTO>) => void;
  onSettled?: () => void;
};
export function useCreateRoom(options?: useCreateRoomOptions) {
  const router = useRouter();

  return useMutation<OkResponse<RoomDTO>, Error, RoomCreateBodyDTO>({
    mutationFn: async (payload) =>
      await apiClient
        .post("rooms", {
          json: payload,
        })
        .json<OkResponse<RoomDTO>>(),

    onSuccess: (data) => {
      options?.onSuccess?.(data);
      router.refresh();
    },

    onSettled: () => {
      options?.onSettled?.();
    },
  });
}
type useUpdateRoomOptions = {
  onSuccess?: () => void;
};
export function useUpdateRoom(roomId: number, options?: useUpdateRoomOptions) {
  const router = useRouter();

  return useMutation<OkResponse<RoomDTO>, Error, RoomUpdateBodyDTO>({
    mutationFn: async (payload) =>
      await apiClient
        .put(`rooms/${roomId}`, {
          json: payload,
        })
        .json<OkResponse<RoomDTO>>(),
    onSuccess: () => {
      options?.onSuccess?.();
      router.refresh();
    },
  });
}

type UseDeleteRoomOptions = {
  onSuccess?: () => void;
};

export function useDeleteRoom(roomId: number, options?: UseDeleteRoomOptions) {
  const router = useRouter();

  return useMutation<void, Error>({
    mutationFn: async () => {
      await apiClient.delete(`rooms/${roomId}`);
    },
    onSuccess: () => {
      options?.onSuccess?.();
      router.refresh();
    },
  });
}

export function useJoinRoom() {
  return useMutation<OkResponse<EnterChatDTO>, Error, number>({
    mutationFn: async (roomId: number) => {
      return await apiClient.post(`rooms/${roomId}/entry`).json();
    },
  });
}
