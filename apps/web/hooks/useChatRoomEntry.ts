import { apiClient } from "@/lib/http-clients";
import { ChatRoomEntryDTO } from "@/lib/schema/chat-room-entry.schema";
import { ErrorResponse, OkResponse } from "@/lib/schema/response.schema";

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
