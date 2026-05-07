import { Server } from "socket.io";
import { SOCKET_EVENTS } from "@dvmbr/shared/socket-events";
import { UnreadCountBodyDTO } from "@/lib/schemas/unread-count.schema.js";

/** NOTE:
 * A single message can update unread counts
 * for multiple room participants.
 */
export function emitUnreadCount(
  io: Server,
  payloads: UnreadCountBodyDTO["payloads"],
) {
  for (const payload of payloads) {
    io.to(`user:${payload.userId}`).emit(
      SOCKET_EVENTS.ROOM_UNREAD_COUNT_UPDATED,
      {
        roomId: payload.roomId,
        unreadCount: payload.unreadCount,
      },
    );
  }
}
