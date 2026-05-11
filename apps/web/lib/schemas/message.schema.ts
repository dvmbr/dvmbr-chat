import { Message, MessageType, User } from "@prisma/client";
import { z } from "../zod";

const MessageSenderSchema = z.object({
  id: z.number(),
  nickname: z.string(),
});

export const MessageSchema = z
  .object({
    id: z.number(),
    participantId: z.number(),
    sender: MessageSenderSchema,
    roomId: z.number(),
    content: z.string().trim().min(1),
    type: z.enum(MessageType),
    isDeleted: z.boolean(),
    isEdited: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Message");

export const MessageParamsSchema = z
  .object({
    roomId: z.coerce.number().int().positive(),
  })
  .openapi("MessageParams");

export const MessageCreateBodySchema = z
  .object({
    content: z.string().trim().min(1),
    type: z.enum(MessageType),
  })
  .openapi("MessageCreateBody");

export type MessageCreateBodyDTO = z.infer<typeof MessageCreateBodySchema>;
export type MessageDTO = z.infer<typeof MessageSchema>;

type MessageWithSender = Message & {
  participant: {
    user: Pick<User, "id" | "nickname">;
  };
};

export function toMessageDTO(data: MessageWithSender): MessageDTO {
  return MessageSchema.parse({
    id: data.id,
    participantId: data.participantId,
    sender: {
      id: data.participant.user.id,
      nickname: data.participant.user.nickname,
    },
    roomId: data.roomId,
    type: data.type,
    content: data.content,
    isDeleted: data.isDeleted,
    isEdited: data.isEdited,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  });
}

export function toMessageListDTO(data: MessageWithSender[]): MessageDTO[] {
  return data.map(toMessageDTO);
}
