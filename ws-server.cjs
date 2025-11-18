/* eslint-disable @typescript-eslint/no-require-imports */
const {WebSocketServer, WebSocket} = require("ws");

// Railway의 PORT 또는 수동 WS_PORT, 없으면 4000
const PORT = process.env.PORT ?? process.env.WS_PORT ?? 4000;

const wss = new WebSocketServer({port: Number(PORT)});

// 각 클라이언트에 대해 roomId, userId 정보를 들고 있을 객체
const clients = new Set();

// 헬퍼: 같은 roomId 를 가진 클라이언트들에게 브로드캐스트
function broadcastToRoom(roomId, payload, excludeClient) {
  const message = JSON.stringify(payload);

  for (const client of clients) {
    if (
      client !== excludeClient && // 보낸 클라이언트는 제외
      client.roomId === roomId &&
      client.socket.readyState === WebSocket.OPEN
    ) {
      client.socket.send(message);
    }
  }
}

wss.on("connection", (socket) => {
  const client = {socket, roomId: null, userId: null, username: null};
  clients.add(client);

  console.log("Client connected. Total:", clients.size);

  socket.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch {
      console.warn("Invalid JSON from client:", data.toString());
      return;
    }

    switch (msg.type) {
      case "join": {
        if (!msg.roomId || !msg.userId || !msg.username) {
          console.warn("Invalid join payload:", msg);
          socket.close();
          return;
        }

        client.roomId = msg.roomId;
        client.userId = msg.userId;
        client.username = msg.username;
        console.log(
          `Client joined room ${client.roomId} (user: ${client.userId}, name: ${client.username})`
        );
      }

      case "leave": {
        console.log(
          `Client left room ${client.roomId} (user: ${client.userId})`
        );
        client.roomId = null;
        break;
      }

      case "message": {
        // { type: "message", roomId, text, userId }
        if (!client.roomId || client.roomId !== msg.roomId) {
          console.warn("Client sent message without joining room");
          return;
        }

        const payload = {
          type: "message",
          roomId: client.roomId,
          text: msg.text,
          userId: client.userId,
          username: client.username,
          createdAt: new Date().toISOString(),
        };

        // 같은 방에 있는 모든 클라이언트에게 브로드캐스트
        broadcastToRoom(client.roomId, payload, client);
        break;
      }

      default: {
        console.warn("Unknown message type:", msg.type);
      }
    }
  });

  socket.on("close", () => {
    clients.delete(client);
    console.log("Client disconnected. Total:", clients.size);
  });
});

console.log(`WebSocket server listening on ws://localhost:${PORT}`);
