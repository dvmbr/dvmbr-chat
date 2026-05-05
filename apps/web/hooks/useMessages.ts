import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { MessageCreateBodyDTO, MessageDTO } from "@/lib/schema/message.schema";
import {
  ErrorResponse,
  ListResponse,
  OkResponse,
} from "@/lib/schema/response.schema";

export function useGetMessages(roomId: number) {
  return useQuery<ListResponse<MessageDTO>["data"], ErrorResponse>({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await apiClient
        .get(`rooms/${roomId}/messages`)
        .json<ListResponse<MessageDTO>>();

      return res.data;
    },
    enabled: !!roomId,
  });
}

export function useCreateMessage(roomId: number) {
  return useMutation<MessageDTO, ErrorResponse, MessageCreateBodyDTO>({
    mutationFn: async (body) => {
      const res = await apiClient
        .post(`rooms/${roomId}/messages`, { json: body })
        .json<OkResponse<MessageDTO>>();

      return res.data;
    },
  });
}
