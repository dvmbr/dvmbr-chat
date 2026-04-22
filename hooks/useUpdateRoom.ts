"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import type { RoomDto, UpdateRoomDto } from "@/lib/schema/room.schema";

type UseUpdateRoomOptions = {
  onSuccess?: () => void;
};

export function useUpdateRoom(roomId: number, options?: UseUpdateRoomOptions) {
  const router = useRouter();

  return useMutation<RoomDto, Error, UpdateRoomDto>({
    mutationFn: async (payload) =>
      await apiClient
        .put(`rooms/${roomId}`, {
          json: payload,
        })
        .json<RoomDto>(),
    onSuccess: () => {
      options?.onSuccess?.();
      router.refresh();
    },
  });
}
