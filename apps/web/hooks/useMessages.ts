import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useCreateMessage(roomId: number, participantId: number) {
  const queryClient = useQueryClient();
  return useMutation<
    MessageDTO,
    ErrorResponse,
    MessageCreateBodyDTO,
    { previousMessages?: ListResponse<MessageDTO>["data"] }
  >({
    mutationFn: async (body) => {
      const res = await apiClient
        .post(`rooms/${roomId}/messages`, { json: body })
        .json<OkResponse<MessageDTO>>();

      return res.data;
    },
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: ["messages", roomId] });

      const previousMessages = queryClient.getQueryData<
        ListResponse<MessageDTO>["data"]
      >(["messages", roomId]);

      const optimisticMessage: MessageDTO = {
        id: Date.now() * -1, // Temporary ID for optimistic message
        roomId,
        participantId,
        content: body.content,
        type: body.type,
        isDeleted: false,
        isEdited: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<ListResponse<MessageDTO>["data"]>(
        ["messages", roomId],

        (old) => ({
          items: [...(old?.items ?? []), optimisticMessage],
          total: (old?.total ?? 0) + 1,
        }),
      );

      return { previousMessages };
    },
    onError: (_error, _body, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", roomId],

          context.previousMessages,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", roomId],
      });
    },
  });
}
