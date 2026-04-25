import { z } from "../zod";

export const ChatRoomEntrySchema = z
  .object({
    roomId: z.number().int().positive(),
    participantId: z.number().int().positive(),
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
};
export function toChatRoomEntryDTO(data: ChatRoomEntry): ChatRoomEntryDTO {
  return ChatRoomEntrySchema.parse(data);
}
