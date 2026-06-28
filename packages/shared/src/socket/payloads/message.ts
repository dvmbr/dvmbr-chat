import { z } from "zod";

export const MessageTypeSchema = z.enum(["TEXT", "IMAGE", "SYSTEM", "AI"]);

export const MessageCreatedPayloadSchema = z.object({
  id: z.number().int().positive(),
  participantId: z.number().int().positive(),
  sender: z.object({
    id: z.number().int().positive(),
    nickname: z.string().trim().min(1),
  }),
  roomId: z.number().int().positive(),
  content: z.string().trim().min(1),
  type: MessageTypeSchema,
  isDeleted: z.boolean(),
  isEdited: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export function parseMessageCreatedPayload(payload: unknown) {
  return MessageCreatedPayloadSchema.safeParse(payload);
}

export type MessageType = z.infer<typeof MessageTypeSchema>;
export type MessageCreatedPayload = z.infer<typeof MessageCreatedPayloadSchema>;
