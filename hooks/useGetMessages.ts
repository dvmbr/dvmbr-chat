"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { OkResponse } from "@/lib/schema/response.schema";
import type { MessageDTO } from "@/lib/schema/message.schema";

export function useGetMessages(roomId: number) {
  return useQuery<OkResponse<MessageDTO[]>, Error>({
    queryKey: ["messages", roomId],
    queryFn: async () =>
      await apiClient
        .get(`rooms/${roomId}/messages`)
        .json<OkResponse<MessageDTO[]>>(),
    enabled: Number.isFinite(roomId) && roomId > 0,
  });
}
