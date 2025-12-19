"use client";

import { useState } from "react";
import { useCreateMessageMutation } from "@/app/redux/features/messageApi";
import { MessageVM } from "../_server/MessageVM";
import { useWebSocketClient } from "@/app/components/providers/WebSocketProvider";
import { createId } from "@paralleldrive/cuid2";

type MessageInputProps = {
  meId: string;
  roomId: string;
  setMessageStack: React.Dispatch<React.SetStateAction<MessageVM[]>>;
};

export default function MessageInput({
  meId,
  roomId,
  setMessageStack,
}: MessageInputProps) {
  const [triggerCreateMessage, { isLoading }] = useCreateMessageMutation();
  const [text, setText] = useState("");
  const { sendMessageCreated } = useWebSocketClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) return;

    const createdAt = new Date();

    // 입력창 비우기
    setText("");

    // 낙관적 UI 업데이트
    const cuid = createId();
    setMessageStack((prev) => [
      ...prev,
      {
        id: cuid,
        cuid,
        roomId,
        userId: meId,
        userName: "pending...",
        text: trimmed,
        createdAt,
        isPending: true,
      },
    ]);

    // setDisplayMessages((m) => [...m, optimisticMessage]);

    try {
      const createdMessage = await triggerCreateMessage({
        cuid,
        roomId,
        createdAt,
        text: trimmed,
      }).unwrap();

      sendMessageCreated(createdMessage);
    } catch (e) {
      console.error(e);
      setMessageStack((prev) =>
        prev.map((m) => {
          if (m.cuid === cuid) {
            m.isFailed = true;
          }

          return m;
        })
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-bg-surface p-2"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="메시지를 입력하세요..."
        className="flex-1 bg-transparent text-sm text-text-main placeholder:text-text-muted outline-none"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-bg-deep transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        전송
      </button>
    </form>
  );
}
