"use client";

import {useEffect, useRef} from "react";
import {ChatMessage} from "@/types/chat";
import {SessionUser} from "@/types/session";

type UseWebSocketParams = {
  roomId: string;
  sessionUser: SessionUser;
  onBroadcast: (msg: ChatMessage) => void; // 새 메시지 들어왔을 때 콜백
};

export function useWebSocket({
  roomId,
  sessionUser,
  onBroadcast,
}: UseWebSocketParams) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(process.env.WS_URL || "ws://localhost:4000");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          roomId,
          userId: sessionUser!.id,
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
      if (msg.userId === sessionUser!.id) return; // 내가 보낸 건 무시

      const incoming: ChatMessage = {
        id: msg.id,
        roomId: msg.roomId,
        text: msg.text,
        createdAt: msg.createdAt,
        userId: msg.userId,
        username: msg.username,
      };

      onBroadcast(incoming);
    };

    return () => {
      wsRef.current?.close();
    };
  }, [roomId, sessionUser, onBroadcast]);

  function sendToServer(message: ChatMessage) {
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
