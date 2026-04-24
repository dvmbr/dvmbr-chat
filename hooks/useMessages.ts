import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { ListResponse, OkResponse } from "@/lib/schema/response.schema";
import type {
  MessageCreateBodyDTO,
  MessageDTO,
} from "@/lib/schema/message.schema";

export function useMessages(roomId?: number) {
  return useQuery<ListResponse<MessageDTO>>({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      return apiClient
        .get(`rooms/${roomId}/messages`)
        .json<ListResponse<MessageDTO>>();
    },
    enabled: !!roomId,
  });
}

export function useCreateMessage(roomId: number) {
  const qc = useQueryClient();

  return useMutation<OkResponse<MessageDTO>, Error, MessageCreateBodyDTO>({
    mutationFn: async (payload) => {
      return apiClient
        .post(`rooms/${roomId}/messages`, {
          json: payload,
        })
        .json<OkResponse<MessageDTO>>();
    },

    onSuccess: (newMessage) => {
      qc.setQueryData<ListResponse<MessageDTO>>(["messages", roomId], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: [newMessage.data, ...old.data.items],
            total: old.data.total + 1,
          },
        };
      });
    },
  });
}
