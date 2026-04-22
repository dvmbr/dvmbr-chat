"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { ListResponse } from "@/lib/schema/response.schema";
import type { MessageDto } from "@/lib/schema/message.schema";

export function useGetMessages(roomId: number) {
  return useQuery<ListResponse<MessageDto>, Error>({
    queryKey: ["messages", roomId],
    queryFn: async () =>
      await apiClient
        .get(`rooms/${roomId}/messages`)
        .json<ListResponse<MessageDto>>(),
    enabled: Number.isFinite(roomId) && roomId > 0,
  });
}
