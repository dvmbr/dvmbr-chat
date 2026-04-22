"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import type { OkResponse } from "@/lib/schema/response.schema";
import type { RoomDto, CreateRoomDto } from "@/lib/schema/room.schema";

type UseCreateRoomOptions = {
  onSuccess?: (data: OkResponse<RoomDto>) => void;
  onSettled?: () => void;
};

export function useCreateRoom(options?: UseCreateRoomOptions) {
  const router = useRouter();

  return useMutation<OkResponse<RoomDto>, Error, CreateRoomDto>({
    mutationFn: async (payload) =>
      await apiClient
        .post("rooms", {
          json: payload,
        })
        .json<OkResponse<RoomDto>>(),

    onSuccess: (data) => {
      options?.onSuccess?.(data);
      router.refresh();
    },

    onSettled: () => {
      options?.onSettled?.();
    },
  });
}
