import { apiClient } from "@/lib/api-client";
import { ChatRoomEntryDTO } from "@/lib/schemas/chat-room-entry.schema";
import { ErrorResponse, OkResponse } from "@/lib/schemas/response.schema";

import { useMutation } from "@tanstack/react-query";

export default function useChatRoomEntry() {
  return useMutation<ChatRoomEntryDTO, ErrorResponse, number | undefined>({
    mutationFn: async (roomId) => {
      const res = await apiClient
        .post(roomId ? `rooms/${roomId}/entry` : "rooms/entry")
        .json<OkResponse<ChatRoomEntryDTO>>();
      return res.data;
    },
  });
}
