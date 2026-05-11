import { z } from "zod";

export const MessageTypeSchema = z.enum(["TEXT", "IMAGE", "SYSTEM"]);

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

export const RoomUnreadCountUpdatedPayloadSchema = z.object({
  roomId: z.number().int().positive(),
  unreadCount: z.number().int().min(0),
});

export function parseMessageCreatedPayload(payload: unknown) {
  return MessageCreatedPayloadSchema.safeParse(payload);
}

export function parseRoomUnreadCountUpdatedPayload(payload: unknown) {
  return RoomUnreadCountUpdatedPayloadSchema.safeParse(payload);
}

export type MessageType = z.infer<typeof MessageTypeSchema>;
export type MessageCreatedPayload = z.infer<typeof MessageCreatedPayloadSchema>;
export type RoomUnreadCountUpdatedPayload = z.infer<
  typeof RoomUnreadCountUpdatedPayloadSchema
>;
