import {MessageVM} from "@/app/(routes)/chat/[roomId]/_server/MessageVM";
import {WebSocketServer, WebSocket} from "ws";

const PORT = Number(process.env.PORT ?? 4000);

// 서버가 관리하는 클라이언트 상태
type Client = {
  socket: WebSocket;
  roomId: string | null;
  clientId: string | null; // userId
  lastPingAt: number;
};

export type ReceivedMessage =
  | {type: "join"; roomId: string; userId: string}
  | ({type: "message"} & MessageVM);

type Payload = {
  type: "broadcast";
} & MessageVM;

const wss = new WebSocketServer({port: PORT});
const clients = new Set<Client>();

wss.on("connection", (socket: WebSocket) => {
  const client: Client = {
    socket,
    roomId: null,
    clientId: null,
    lastPingAt: Date.now(),
  };

  clients.add(client);
  console.log("Client connected. Total:", clients.size);

  socket.on("message", (data: WebSocket.RawData) => {
    let msg: ReceivedMessage;

    try {
      msg = JSON.parse(data.toString());
    } catch {
      console.warn("Invalid JSON from client:", data.toString());
      return;
    }

    switch (msg.type) {
      case "join": {
        const {roomId, userId} = msg;

        if (!roomId || !userId) {
          console.warn("Invalid join payload:", msg);
          socket.close();
          return;
        }

        client.roomId = roomId;
        client.clientId = userId;

        console.log(`Client joined [${roomId}:${userId}]`);
        break;
      }

      case "message": {
        const {id, roomId, userId, userName, text, createdAt} = msg;
        if (!id || !roomId || !userId || !userName || !text || !createdAt) {
          console.warn("Invalid message payload:", msg);
          return;
        }

        const payload: Payload = {
          type: "broadcast",
          id,
          roomId,
          userId,
          userName,
          text,
          createdAt,
        };

        broadcastToRoom(payload);
        console.log(`Client send message: ${JSON.stringify(msg)}`);
        break;
      }

      default: {
        console.warn("Unknown message:", msg);
        return;
      }
    }
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });

  socket.on("close", () => {
    console.log(`Client left [${client.roomId}:${client.clientId}]`);
    clients.delete(client);
    console.log("Client disconnected. Total:", clients.size);
  });
});

console.log(`WebSocket server listening on ${PORT}`);

function broadcastToRoom(payload: Extract<Payload, {type: "broadcast"}>) {
  const message = JSON.stringify(payload);

  for (const client of clients) {
    if (
      client.socket.readyState === WebSocket.OPEN &&
      client.roomId === payload.roomId &&
      client.clientId !== payload.userId
    ) {
      client.socket.send(message);
    }
  }
}
