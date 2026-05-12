import { z } from "zod";

export const RoomUnreadCountUpdatedPayloadSchema = z.object({
  roomId: z.number().int().positive(),
  unreadCount: z.number().int().min(0),
});

export function parseRoomUnreadCountUpdatedPayload(payload: unknown) {
  return RoomUnreadCountUpdatedPayloadSchema.safeParse(payload);
}

export type RoomUnreadCountUpdatedPayload = z.infer<
  typeof RoomUnreadCountUpdatedPayloadSchema
>;
