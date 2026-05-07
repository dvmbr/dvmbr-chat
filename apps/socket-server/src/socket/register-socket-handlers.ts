import { Server } from "socket.io";
import { SOCKET_EVENTS } from "@dvmbr/shared/socket-events";

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    const { roomId, userId } = socket.handshake.query;

    if (typeof userId !== "string" || userId.trim() === "") {
      socket.disconnect(true);
      return;
    }

    const userKey = `user:${userId}`;
    socket.join(userKey);

    let roomKey: string | null = null;

    if (typeof roomId === "string" && roomId.trim() !== "") {
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
