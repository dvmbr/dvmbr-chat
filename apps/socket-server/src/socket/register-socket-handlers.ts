import { Server } from "socket.io";
import { SOCKET_EVENTS } from "@dvmbr/shared/socket/socket-events";
import {
  SocketConnectionQuerySchema,
  type SocketConnectionQuery,
} from "@dvmbr/shared/socket/socket-query";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@dvmbr/shared/socket/socket-contract";

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

      socket.to(roomKey).emit(SOCKET_EVENTS.MESSAGE_CREATED, message);
    });

    socket.on("disconnect", (reason) => {
      console.log(`disconnected: ${socket.id}`, reason);
    });
  });
}
