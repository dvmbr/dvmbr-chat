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

io.on("connection", (socket) => {
  const roomId = socket.handshake.query.roomId;

  if (typeof roomId !== "string" || roomId.trim() === "") {
    socket.disconnect(true);
    return;
  }

  const roomKey = `room:${roomId}`;

  socket.join(roomKey);

  console.log(`connected: ${socket.id} -> ${roomKey}`);

  socket.on(SOCKET_EVENTS.MESSAGE_CREATED, (message) => {
    socket.to(roomKey).emit(SOCKET_EVENTS.MESSAGE_CREATED, message);
  });

  socket.on("disconnect", (reason) => {
    console.log(`disconnected: ${socket.id}`, reason);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});