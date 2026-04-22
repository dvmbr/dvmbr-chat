import { z } from "../openapi/zod";
import type { Message } from "@prisma/client";

export const MessageSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    participantId: z.coerce.number().int().positive(),
    roomId: z.coerce.number().int().positive(),
    content: z.string().trim().min(1),
    type: z.enum(["TEXT", "IMAGE", "SYSTEM"]),
    isDeleted: z.boolean(),
    isEdited: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Message");

export const CreateMessageSchema = z
  .object({
    content: z.string().trim().min(1),
    type: z.enum(["TEXT", "IMAGE", "SYSTEM"]).optional(),
  })
  .openapi("CreateMessage");

export const UpdateMessageSchema = z
  .object({
    content: z.string().trim().min(1),
  })
  .openapi("UpdateMessage");

export const RoomMessageParamSchema = z
  .object({
    roomId: z.coerce.number().int().positive(),
  })
  .openapi("RoomMessageParam");

export type MessageDto = z.infer<typeof MessageSchema>;
export type CreateMessageDto = z.infer<typeof CreateMessageSchema>;
export type UpdateMessageDto = z.infer<typeof UpdateMessageSchema>;
export type RoomMessageParamDto = z.infer<typeof RoomMessageParamSchema>;

export function toMessageDto(message: Message): MessageDto {
  return {
    ...message,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  };
}
