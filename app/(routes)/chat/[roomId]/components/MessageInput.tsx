"use client";

import {useState} from "react";
import type {ChatMessage} from "@/types/chat";

type MessageInputProps = {
  roomId: string;
  pendingMessages: ChatMessage[];
  setPendingMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onMessageCreated: (msg: ChatMessage) => void;
};

export default function MessageInput({
  roomId,
  pendingMessages,
  setPendingMessages,
  setIsPending,
  setDisplayMessages,
  onMessageCreated,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) return;

    const createdAt = new Date();

    // 입력창 비우기
    setText("");

    setIsPending(true);
    setLoading(true);

    // 낙관적 UI 업데이트
    const optimisticMessage: ChatMessage = {
      id: "optimistic-" + Date.now(),
      roomId,
      userId: "",
      username: "pending...",
      text: trimmed,
      createdAt,
      isPending: true,
    };

    setPendingMessages([...pendingMessages, optimisticMessage]);

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          text: trimmed,
          createdAt,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Failed:", data);
        return;
      }

      const created: ChatMessage = await res.json();
      setDisplayMessages((prev) => [...prev, created]);
      setPendingMessages((prev) => prev.filter((msg) => !msg.isPending));

      onMessageCreated(created);
    } catch (err) {
      console.error("Message send failed:", err);
    } finally {
      setIsPending(false);
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex items-center gap-2 bg-bg-secondary border border-surface-border rounded-lg p-2"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="메시지를 입력하세요..."
        className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-brand-mint text-bg-primary text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-accent-mintLight transition"
      >
        전송
      </button>
    </form>
  );
}
