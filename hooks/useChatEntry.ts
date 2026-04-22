"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { ChatEntryDto } from "@/lib/schema/chat-entry.schema";
import type { OkResponse } from "@/lib/schema/response.schema";

type UseChatEntryOptions = {
  onSuccess?: (data: OkResponse<ChatEntryDto>) => void;
};

export function useEntry(options?: UseChatEntryOptions) {
  return useMutation<OkResponse<ChatEntryDto>, Error, void>({
    mutationFn: async () =>
      await apiClient.post("chat/entry").json<OkResponse<ChatEntryDto>>(),

    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
  });
}
