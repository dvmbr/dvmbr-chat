import { z } from "../../zod";

export const ChatRoomEntryParamsSchema = z
  .object({
    roomId: z.coerce.number().int().positive(),
  })
  .openapi("ChatRoomEntryParams");

export type ChatRoomEntryParams = z.infer<typeof ChatRoomEntryParamsSchema>;
