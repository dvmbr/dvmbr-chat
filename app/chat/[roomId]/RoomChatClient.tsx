"use client";

import {useEffect, useRef, useState} from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

type ChatMessage = {
  id: string;
  text: string;
  createdAt: string;
  roomId: string;
  user?: {
    id: string;
    username: string | null;
  } | null;
};

type RoomChatClientProps = {
  roomId: string;
  initialMessages: ChatMessage[];
  sessionUser: {
    id: string;
    username: string;
  };
};

export default function RoomChatClient({
  roomId,
  initialMessages,
  sessionUser,
}: RoomChatClientProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const wsRef = useRef<WebSocket | null>(null);

  // 메시지 리스트에 새 메시지 추가
  function appendMessage(msg: ChatMessage) {
    setMessages((prev) => [...prev, msg]);
  }

  // MessageInput에서 HTTP POST 성공 후 호출
  function handleMessageSent(newMsg: ChatMessage) {
    appendMessage(newMsg);
  }

  // WebSocket 연결
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
      ws.send(
        JSON.stringify({
          type: "join",
          roomId,
          userId: sessionUser.id,
          username: sessionUser.username,
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

      if (msg.type === "message" && msg.roomId === roomId) {
        if (msg.userId === sessionUser.id) {
          return;
        }
        appendMessage({
          id: msg.id ?? `ws-${Date.now()}`,
          text: msg.text,
          createdAt: msg.createdAt,
          roomId: msg.roomId,
          user: {
            id: msg.userId ?? "unknown",
            username: msg.username ?? "알 수 없는 사용자",
          },
        });
      }
    };

    ws.onclose = () => {
      console.log("WS disconnected");
    };

    return () => {
      // 방 떠날 때 leave 보내기
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({type: "leave"}));
      }
      ws.close();
    };
  }, [roomId, sessionUser.id]);

  // WebSocket으로 다른 클라이언트에게 메시지 전파
  function sendMessageOverSocket(text: string) {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "message",
        roomId,
        text,
        userId: sessionUser.id,
        username: sessionUser.username,
      })
    );
  }

  return (
    <>
      <div className="flex-1 bg-surface border border-surface-border rounded-lg p-4 flex flex-col">
        <MessageList roomId={roomId} messages={messages} />
      </div>

      <MessageInput
        roomId={roomId}
        onMessageSent={handleMessageSent}
        onSendSocket={sendMessageOverSocket}
      />
    </>
  );
}
