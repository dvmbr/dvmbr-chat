import { z } from "zod";

export const UserRoomUnreadCountPayloadSchema = z.object({
  userId: z.number().int().positive(),
  roomId: z.number().int().positive(),
  unreadCount: z.number().int().min(0),
});

export const RoomUnreadCountUpdatedPayloadSchema = z.object({
  roomId: z.number().int().positive(),
  unreadCount: z.number().int().min(0),
});

export function parseUserRoomUnreadCountPayload(payload: unknown) {
  return UserRoomUnreadCountPayloadSchema.safeParse(payload);
}

export function parseRoomUnreadCountUpdatedPayload(payload: unknown) {
  return RoomUnreadCountUpdatedPayloadSchema.safeParse(payload);
}

export type UserRoomUnreadCountPayload = z.infer<
  typeof UserRoomUnreadCountPayloadSchema
>;
export type RoomUnreadCountUpdatedPayload = z.infer<
  typeof RoomUnreadCountUpdatedPayloadSchema
>;
