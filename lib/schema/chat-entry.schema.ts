import { z } from "../openapi/zod";

export const ChatEntrySchema = z
  .object({
    room: z.object({
      id: z.coerce.number().int().positive(),
      name: z.string().trim().min(1),
    }),
    user: z.object({
      id: z.coerce.number().int().positive(),
      nickname: z.string().trim().min(1),
    }),
    participant: z.object({
      id: z.coerce.number().int().positive(),
      userId: z.coerce.number().int().positive(),
      roomId: z.coerce.number().int().positive(),
    }),
  })
  .openapi("ChatEntry");

export type ChatEntry = {
  room: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    nickname: string;
  };
  participant: {
    id: number;
    userId: number;
    roomId: number;
  };
};
export type ChatEntryDto = z.infer<typeof ChatEntrySchema>;

export function toChatEntryDto(chatEntry: ChatEntry): ChatEntryDto {
  return {
    ...chatEntry,
  };
}
