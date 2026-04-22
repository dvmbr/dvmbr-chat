"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";

type UseDeleteRoomOptions = {
  onSuccess?: () => void;
};

export function useDeleteRoom(options?: UseDeleteRoomOptions) {
  const router = useRouter();

  return useMutation<void, Error, { roomId: number }>({
    mutationFn: async (payload) => {
      await apiClient.delete(`rooms/${payload.roomId}`);
    },
    onSuccess: () => {
      options?.onSuccess?.();
      router.refresh();
    },
  });
}
