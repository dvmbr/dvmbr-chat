import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import { SOCKET_EVENTS } from "@dvmbr/shared/socket-events";

const PORT = parseInt(process.env.PORT || "4000", 10);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
  },
});

// TODO(socket): Add unread count broadcasting when a new message is created
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

  socket.on(SOCKET_EVENTS.ROOM_UNREAD_COUNT_UPDATED, (payload) => {
    socket.to(`user:${payload.userId}`).emit(
      SOCKET_EVENTS.ROOM_UNREAD_COUNT_UPDATED,
      {
        roomId: payload.roomId,
        unreadCount: payload.unreadCount,
      },
    );
  });

  socket.on("disconnect", (reason) => {
    console.log(`disconnected: ${socket.id}`, reason);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});