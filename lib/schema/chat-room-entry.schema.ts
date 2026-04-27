import { Room } from "@prisma/client";
import { z } from "../zod";
import { RoomSchema, toRoomDTO } from "./room.schema";

export const ChatRoomEntrySchema = z
  .object({
    roomId: z.number().int().positive(),
    participantId: z.number().int().positive(),
    room: RoomSchema,
  })
  .openapi("ChatRoomEntry");

export const ChatRoomEntryParamsSchema = z
  .object({
    roomId: z.coerce.number().int().positive(),
  })
  .openapi("ChatRoomEntryParams");

export type ChatRoomEntryDTO = z.infer<typeof ChatRoomEntrySchema>;

export type ChatRoomEntry = {
  roomId: number;
  participantId: number;
  room: Room;
};
export function toChatRoomEntryDTO(data: ChatRoomEntry): ChatRoomEntryDTO {
  return ChatRoomEntrySchema.parse({ ...data, room: toRoomDTO(data.room) });
}
