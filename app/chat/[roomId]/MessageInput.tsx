"use client";

import {useState} from "react";

type MessageInputProps = {
  roomId: string;
  onMessageSent?: (message: {
    id: string;
    text: string;
    createdAt: string;
    roomId: string;
    user?: {
      id: string;
      username: string | null;
    } | null;
  }) => void;
  onSendSocket?: (text: string) => void;
};

export default function MessageInput({
  roomId,
  onMessageSent,
  onSendSocket,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) return;

    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          text: trimmed,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Failed:", data);
        return;
      }

      const created = await res.json(); // API에서 돌려준 메시지

      if (onSendSocket) {
        onSendSocket(trimmed);
      }

      // 입력창 비우기
      setText("");

      // 상위로 알리기 (리스트 갱신)
      if (onMessageSent) {
        onMessageSent({
          id: created.id,
          text: created.text,
          createdAt: created.createdAt,
          roomId: created.roomId,
          user: created.user,
        });
      }
    } catch (err) {
      console.error("Message send failed:", err);
    } finally {
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
