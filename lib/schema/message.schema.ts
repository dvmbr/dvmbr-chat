import { Message } from "@prisma/client";
import { z } from "../openapi/zod";

export const MessageTypeSchema = z.enum(["TEXT", "IMAGE", "SYSTEM"]);

export const MessageSchema = z
  .object({
    id: z.number(),
    participantId: z.number().int().positive(),
    roomId: z.number().int().positive(),
    content: z.string(),
    type: MessageTypeSchema,
    isDeleted: z.boolean(),
    isEdited: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Message");

export const MessageQuerySchema = z
  .object({
    roomId: z.coerce.number().int().positive(),
    cursor: z.coerce.number().int().optional(), // 마지막 message id
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .openapi("MessageQuery");

export const MessageCreateBodySchema = z
  .object({
    content: z.string().trim().min(1),
    type: MessageTypeSchema.default("TEXT").optional(),
  })
  .openapi("MessageCreateBody");

export type MessageDTO = z.infer<typeof MessageSchema>;
export type MessageCreateBodyDTO = z.infer<typeof MessageCreateBodySchema>;
export type MessageQueryDTO = z.infer<typeof MessageQuerySchema>;

export function toMessageDTO(message: Message): MessageDTO {
  return MessageSchema.parse({
    id: message.id,
    participantId: message.participantId,
    roomId: message.roomId,
    content: message.content,
    type: message.type,
    isDeleted: message.isDeleted,
    isEdited: message.isEdited,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  });
}
