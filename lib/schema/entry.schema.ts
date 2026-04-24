import { z } from "../openapi/zod";

export const EnterChatSchema = z
  .object({
    userId: z.number().int().positive(),
    roomId: z.number().int().positive(),
    participantId: z.number().int().positive(),
  })
  .openapi("EnterChat");

export const EnterChatCreateBodySchema = z
  .object({
    nickname: z.string().trim().min(1),
  })
  .openapi("EnterChatCreateBody");

export const EnterCookieSchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
});

type EnterChat = {
  userId: number;
  roomId: number;
  participantId: number;
};
export type EnterChatDTO = z.infer<typeof EnterChatSchema>;
export type EnterChatCreateBodyDTO = z.infer<typeof EnterChatCreateBodySchema>;
export type EnterCookieDTO = z.infer<typeof EnterCookieSchema>;

export function toEnterChatDTO(enterChat: EnterChat): EnterChatDTO {
  return EnterChatSchema.parse({
    userId: enterChat.userId,
    roomId: enterChat.roomId,
    participantId: enterChat.participantId,
  });
}
