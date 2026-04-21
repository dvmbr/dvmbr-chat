import { z } from "../openapi/zod";
import type { Message } from "@prisma/client";

export const MessageSchema = z
  .object({
    id: z.number(),
    participantId: z.number(),
    roomId: z.number(),

    content: z.string(),

    type: z.enum(["TEXT", "IMAGE", "SYSTEM"]),
    isDeleted: z.boolean(),
    isEdited: z.boolean(),

    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Message");

export const CreateMessageSchema = z
  .object({
    participantId: z.number(),
    roomId: z.number(),
    content: z.string().min(1),
    type: z.enum(["TEXT", "IMAGE", "SYSTEM"]).optional(),
  })
  .openapi("CreateMessage");

export const UpdateMessageSchema = z
  .object({
    id: z.number(),
    content: z.string().min(1),
  })
  .openapi("UpdateMessage");

export const DeleteMessageSchema = z
  .object({
    id: z.number(),
  })
  .openapi("DeleteMessage");

export const MessageQuerySchema = z
  .object({
    id: z.coerce.number().optional(),
    participantId: z.coerce.number().optional(),
    roomId: z.coerce.number().optional(),
  })
  .openapi("MessageQuery");

export type MessageDTO = z.infer<typeof MessageSchema>;
export type CreateMessageDTO = z.infer<typeof CreateMessageSchema>;
export type UpdateMessageDTO = z.infer<typeof UpdateMessageSchema>;
export type DeleteMessageDTO = z.infer<typeof DeleteMessageSchema>;
export type MessageQueryDTO = z.infer<typeof MessageQuerySchema>;

export function toMessageDto(message: Message): MessageDTO {
  return {
    ...message,
    createdAt: new Date(message.createdAt).toISOString(),
    updatedAt: new Date(message.updatedAt).toISOString(),
  };
}
