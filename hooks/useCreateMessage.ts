"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { OkResponse } from "@/lib/schema/response.schema";
import type { CreateMessageDTO, MessageDTO } from "@/lib/schema/message.schema";

type UseCreateMessageOptions = {
  onSuccess?: (data: OkResponse<MessageDTO>) => void;
  onSettled?: () => void;
};

export function useCreateMessage(
  roomId: number,
  options?: UseCreateMessageOptions,
) {
  const queryClient = useQueryClient();

  return useMutation<OkResponse<MessageDTO>, Error, CreateMessageDTO>({
    mutationFn: async (payload) =>
      await apiClient
        .post(`rooms/${roomId}/messages`, {
          json: payload,
        })
        .json<OkResponse<MessageDTO>>(),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", roomId],
      });

      options?.onSuccess?.(data);
    },

    onSettled: () => {
      options?.onSettled?.();
    },
  });
}
