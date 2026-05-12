import { Server } from "socket.io";
import type { UnreadCountBodyDTO } from "@/lib/schemas/unread-count.schema.js";
import {
  parseRoomUnreadCountUpdatedPayload,
  parseUserRoomUnreadCountPayload,
  SOCKET_EVENTS,
} from "@dvmbr/shared/socket";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@dvmbr/shared/socket";

/** NOTE:
 * A single message can update unread counts
 * for multiple room participants.
 */
export function emitUnreadCount(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  payloads: UnreadCountBodyDTO["payloads"],
) {
  for (const payload of payloads) {
    const parsedRecipientPayload = parseUserRoomUnreadCountPayload(payload);

    if (!parsedRecipientPayload.success) {
      console.warn(
        `Invalid unread count recipient payload`,
        parsedRecipientPayload.error.flatten(),
      );
      continue;
    }

    const { userId, ...eventPayload } = parsedRecipientPayload.data;
    const parsedPayload = parseRoomUnreadCountUpdatedPayload({
      roomId: eventPayload.roomId,
      unreadCount: eventPayload.unreadCount,
    });

    if (!parsedPayload.success) {
      console.warn(
        `Invalid ${SOCKET_EVENTS.ROOM_UNREAD_COUNT_UPDATED} payload for user:${userId}`,
        parsedPayload.error.flatten(),
      );
      continue;
    }

    io.to(`user:${userId}`).emit(
      SOCKET_EVENTS.ROOM_UNREAD_COUNT_UPDATED,
      parsedPayload.data,
    );
  }
}
