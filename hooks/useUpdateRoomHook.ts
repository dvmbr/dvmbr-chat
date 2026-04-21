"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import type { RoomDTO, UpdateRoomDTO } from "@/lib/schema/room.schema";

type UseUpdateRoomOptions = {
  onSuccess?: (data: RoomDTO) => void;
};

export function useUpdateRoom(options?: UseUpdateRoomOptions) {
  const router = useRouter();

  return useMutation<RoomDTO, Error, UpdateRoomDTO>({
    mutationFn: async (payload) =>
      await apiClient
        .put(`rooms/${payload.id}`, {
          json: payload,
        })
        .json<RoomDTO>(),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      router.refresh();
    },
  });
}
