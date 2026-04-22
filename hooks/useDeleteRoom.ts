"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import type { DeleteRoomDTO } from "@/lib/schema/room.schema";

type UseDeleteRoomOptions = {
  onSuccess?: () => void;
};

export function useDeleteRoom(options?: UseDeleteRoomOptions) {
  const router = useRouter();

  return useMutation<void, Error, DeleteRoomDTO>({
    mutationFn: async (payload) => {
      await apiClient.delete(`rooms/${payload.id}`);
    },
    onSuccess: () => {
      options?.onSuccess?.();
      router.refresh();
    },
  });
}
