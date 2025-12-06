"use client";

import {User} from "@prisma/client";
import {useEffect, useRef} from "react";
import {Message} from "../(server)/lib/message";

type UseWebSocketParams = {
  roomId: string;
  user: User;
  onBroadcast: (message: Message) => void; // 새 메시지 들어왔을 때 콜백
};

export function useWebSocket({roomId, user, onBroadcast}: UseWebSocketParams) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000"
    );
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          roomId,
          userId: user!.id,
        })
      );
    };

    ws.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        console.warn("Invalid WS message:", event.data);
        return;
      }

      if (msg.type !== "broadcast") return;
      if (msg.roomId !== roomId) return;
      if (msg.userId === user!.id) return; // 내가 보낸 건 무시

      const incoming: Message = {
        id: msg.id,
        roomId: msg.roomId,
        text: msg.text,
        createdAt: msg.createdAt,
        userId: msg.userId,
        username: msg.username,
      };

      onBroadcast(incoming);
    };

    ws.onerror = (e) => {
      console.warn("WS error:", e);
    };

    ws.onclose = (e) => {
      console.log("WS closed:", e.code, e.reason);
    };

    // cleanup
    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, [roomId, user, onBroadcast]);

  function sendToServer(message: Message) {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "message",
        ...message,
      })
    );
  }

  return {wsRef, sendToServer};
}
