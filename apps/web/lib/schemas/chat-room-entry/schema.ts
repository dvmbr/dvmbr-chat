import { z } from "../../zod";
import { RoomSchema } from "../room/schema";

export const ChatRoomEntrySchema = z
  .object({
    roomId: z.number().int().positive(),
    participantId: z.number().int().positive(),
    room: RoomSchema,
  })
  .openapi("ChatRoomEntry");

export type ChatRoomEntryDTO = z.infer<typeof ChatRoomEntrySchema>;
