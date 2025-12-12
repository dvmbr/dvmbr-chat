import {MessageVM} from "@/app/(routes)/chat/[roomId]/_server/MessageVM";
import {RoomVM} from "@/app/(routes)/chat/_server/roomVM";
import {WebSocketServer, WebSocket} from "ws";

const PORT = Number(process.env.PORT ?? 4000);

// 서버가 관리하는 클라이언트 상태
type Client = {
  socket: WebSocket;
  clientId: string | null; // userId
  lastPingAt: number;
};

export type ReceivedMessage =
  | {type: "join"; userId: string}
  | ({type: "roomCreated"} & RoomVM)
  | ({type: "messageCreated"} & MessageVM);

const wss = new WebSocketServer({port: PORT});
const clients = new Set<Client>();

wss.on("connection", (socket: WebSocket) => {
  const client: Client = {
    socket,
    clientId: null,
    lastPingAt: Date.now(),
  };

  clients.add(client);
  console.log(formatDateTime(), "Client connected. Total:", clients.size);

  socket.on("message", (data: WebSocket.RawData) => {
    let msg: ReceivedMessage;

    try {
      msg = JSON.parse(data.toString());
    } catch {
      console.warn(
        formatDateTime(),
        "Invalid JSON from client:",
        data.toString()
      );
      return;
    }

    switch (msg.type) {
      case "join": {
        const {userId} = msg;

        if (!userId) {
          console.warn(formatDateTime(), "Invalid join payload:", msg);
          socket.close();
          return;
        }

        client.clientId = userId;

        console.log(formatDateTime(), `Client joined [${userId}]`);
        break;
      }

      case "roomCreated": {
        if (!msg.id) {
          console.warn(formatDateTime(), "Invalid roomCreated payload:", msg);
          return;
        }

        console.log(
          formatDateTime(),
          `Client send roomCreated: ${JSON.stringify(msg)}`
        );

        broadcast(socket, msg);
        break;
      }

      case "messageCreated": {
        if (!msg.id) {
          console.warn(
            formatDateTime(),
            "Invalid messageCreated payload:",
            msg
          );
          return;
        }

        console.log(
          formatDateTime(),
          `Client send messageCreated: ${JSON.stringify(msg)}`
        );

        broadcast(socket, msg);

        break;
      }

      default: {
        console.warn(formatDateTime(), "Unknown message:", msg);
        return;
      }
    }
  });

  socket.on("error", (err) => {
    console.error(formatDateTime(), "Socket error:", err);
  });

  socket.on("close", () => {
    console.log(formatDateTime(), `Client left [${client.clientId}]`);
    clients.delete(client);
    console.log(formatDateTime(), "Client disconnected. Total:", clients.size);
  });
});

console.log(`WebSocket server listening on ${PORT}`);

function broadcast(sender: WebSocket, payload: ReceivedMessage) {
  const body = JSON.stringify(payload);

  for (const client of clients) {
    if (client.socket === sender) continue;
    if (client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(body);
    }
  }
}

export function formatDateTime(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${y}.${m}.${d} ${hh}:${mm}:${ss}`;
}
