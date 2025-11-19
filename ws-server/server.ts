import {ChatMessage} from "@/types/chat";
import {WebSocket} from "ws";

// 서버가 관리하는 클라이언트 상태
type Client = {
  socket: WebSocket;
  roomId: string | null;
  clientId: string | null; // userId
  lastPingAt: number;
};

export type ReceivedMessage =
  | {type: "join"; roomId: string; userId: string}
  | {type: "leave"; roomId: string; userId: string}
  | {type: "ping"}
  | ({type: "message"} & ChatMessage);

type Payload =
  | {
      type: "pong";
      ts: number;
    }
  | ({
      type: "broadcast";
    } & ChatMessage);

const ws = new WebSocket(
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000"
);
const clients = new Set<Client>();

ws.on("connection", (socket: WebSocket) => {
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

      case "leave": {
        client.roomId = null;
        client.clientId = null;
        console.log(`Client left [${msg.roomId}:${msg.userId}]`);

        break;
      }

      case "ping": {
        client.lastPingAt = Date.now();

        const payload: Payload = {
          type: "pong",
          ts: client.lastPingAt,
        };

        socket.send(JSON.stringify(payload));
        break;
      }

      case "message": {
        const {id, roomId, userId, username, text, createdAt} = msg;
        if (!id || !roomId || !userId || !username || !text || !createdAt) {
          console.warn("Invalid message payload:", msg);
          return;
        }

        const payload: Payload = {
          type: "broadcast",
          id,
          roomId,
          userId,
          username,
          text,
          createdAt,
        };

        broadcastToRoom(payload);
        break;
      }

      default: {
        console.warn("Unknown message:", msg);
        return;
      }
    }
  });

  socket.on("close", () => {
    clients.delete(client);
    console.log("Client disconnected. Total:", clients.size);
  });
});

console.log(`WebSocket server listening on ${process.env.NEXT_PUBLIC_WS_URL}`);

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
