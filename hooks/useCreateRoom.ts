"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import type { CreateRoomDTO, RoomDTO } from "@/lib/schema/room.schema";
import type { OkResponse } from "@/lib/schema/response.schema";

type UseCreateRoomOptions = {
  onSuccess?: (data: OkResponse<RoomDTO>) => void;
  onSettled?: () => void;
};

export function useCreateRoom(options?: UseCreateRoomOptions) {
  const router = useRouter();

  return useMutation<OkResponse<RoomDTO>, Error, CreateRoomDTO>({
    mutationFn: async (payload) =>
      await apiClient
        .post("rooms", {
          json: payload,
        })
        .json<OkResponse<RoomDTO>>(),

    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },

    onSettled: () => {
      options?.onSettled?.();
      router.refresh();
    },
  });
}
