import { Prisma } from "@prisma/client";
import {
  ChatRoomEntrySchema,
  type ChatRoomEntryDTO,
} from "@/lib/schemas/chat-room-entry/schema";
import { roomDTOSelect, toRoomDTO } from "./room.mapper";

export const chatRoomEntryDTOSelect = {
  id: true,
  userId: true,
  roomId: true,
  room: {
    select: roomDTOSelect,
  },
} satisfies Prisma.ParticipantSelect;

export type ChatRoomEntryDTOData = Prisma.ParticipantGetPayload<{
  select: typeof chatRoomEntryDTOSelect;
}>;

export function toChatRoomEntryDTO(
  data: ChatRoomEntryDTOData,
): ChatRoomEntryDTO {
  return ChatRoomEntrySchema.parse({
    ...data,
    participantId: data.id,
    room: toRoomDTO(data.room),
  });
}
