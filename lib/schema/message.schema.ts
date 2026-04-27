import { Message, MessageType } from "@prisma/client";
import { z } from "../zod";
import { ListResponse } from "./response.schema";

export const MessageSchema = z
  .object({
    id: z.number(),
    participantId: z.number(),
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

export function toMessageDTO(data: Message): MessageDTO {
  return {
    ...data,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
}

export function toMessageListDTO(data: Message[]): MessageDTO[] {
  return data.map(toMessageDTO);
}
