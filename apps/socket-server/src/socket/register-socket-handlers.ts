import { Server } from "socket.io";
import { parseMessageCreatedPayload } from "@dvmbr/shared/socket/payloads/message";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@dvmbr/shared/socket/contract";
import { SOCKET_EVENTS } from "@dvmbr/shared/socket/events";
import {
  SocketConnectionQuerySchema,
  SocketConnectionQuery,
} from "@dvmbr/shared/socket/query";

export function registerSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
) {
  io.on("connection", (socket) => {
    const parsedQuery = SocketConnectionQuerySchema.safeParse(
      socket.handshake.query,
    );

    if (!parsedQuery.success) {
      socket.disconnect(true);
      return;
    }

    const query: SocketConnectionQuery = parsedQuery.data;
    const { userId, roomId } = query;

    const userKey = `user:${userId}`;
    socket.join(userKey);

    let roomKey: string | null = null;

    if (typeof roomId === "number") {
      roomKey = `room:${roomId}`;
      socket.join(roomKey);
    }

    console.log(`connected: ${socket.id} -> ${userKey}`);

    if (roomKey) {
      console.log(`joined room: ${socket.id} -> ${roomKey}`);
    }

    socket.on(SOCKET_EVENTS.MESSAGE_CREATED, (message) => {
      if (!roomKey) return;

      const parsedMessage = parseMessageCreatedPayload(message);

      if (!parsedMessage.success) {
        console.warn(
          `Invalid ${SOCKET_EVENTS.MESSAGE_CREATED} payload from ${socket.id}`,
          parsedMessage.error.flatten(),
        );
        return;
      }

      socket
        .to(roomKey)
        .emit(SOCKET_EVENTS.MESSAGE_CREATED, parsedMessage.data);
    });

    socket.on("disconnect", (reason) => {
      console.log(`disconnected: ${socket.id}`, reason);
    });
  });
}
