import {
  ChatRoomEntrySchema,
  type ChatRoomEntryDTO,
} from "@/lib/schemas/chat-room-entry/schema";
import { toRoomDTO, type RoomDTOData } from "./room.mapper";

export type ChatRoomEntryDTOData = {
  roomId: number;
  participantId: number;
  room: RoomDTOData;
};

export function toChatRoomEntryDTO(
  data: ChatRoomEntryDTOData,
): ChatRoomEntryDTO {
  return ChatRoomEntrySchema.parse({
    ...data,
    room: toRoomDTO(data.room),
  });
}
