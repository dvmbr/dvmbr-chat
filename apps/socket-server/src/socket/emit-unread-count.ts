import { Server } from "socket.io";
import { SOCKET_EVENTS } from "@dvmbr/shared/socket/socket-events";
import { UnreadCountBodyDTO } from "@/lib/schemas/unread-count.schema.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@dvmbr/shared/socket/socket-contract";
import { parseRoomUnreadCountUpdatedPayload } from "@dvmbr/shared/socket/payloads/room";

/** NOTE:
 * A single message can update unread counts
 * for multiple room participants.
 */
export function emitUnreadCount(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  payloads: UnreadCountBodyDTO["payloads"],
) {
  for (const payload of payloads) {
    const parsedPayload = parseRoomUnreadCountUpdatedPayload({
      roomId: payload.roomId,
      unreadCount: payload.unreadCount,
    });

    if (!parsedPayload.success) {
      console.warn(
        `Invalid ${SOCKET_EVENTS.ROOM_UNREAD_COUNT_UPDATED} payload for user:${payload.userId}`,
        parsedPayload.error.flatten(),
      );
      continue;
    }

    io.to(`user:${payload.userId}`).emit(
      SOCKET_EVENTS.ROOM_UNREAD_COUNT_UPDATED,
      parsedPayload.data,
    );
  }
}
