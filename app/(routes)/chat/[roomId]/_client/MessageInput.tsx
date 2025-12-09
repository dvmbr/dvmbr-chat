"use client";

import {useState} from "react";
import {useCreateMessageMutation} from "@/app/redux/features/messageApi";
import {MessageVM} from "../_server/MessageVM";

type MessageInputProps = {
  roomId: string;
  pendingMessages: MessageVM[];
  setPendingMessages: React.Dispatch<React.SetStateAction<MessageVM[]>>;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayMessages: React.Dispatch<React.SetStateAction<MessageVM[]>>;
  onMessageCreated: (msg: MessageVM) => void;
};

export default function MessageInput({
  roomId,
  pendingMessages,
  setPendingMessages,
  setIsPending,
  setDisplayMessages,
  onMessageCreated,
}: MessageInputProps) {
  const [triggerCreateMessage, {isLoading}] = useCreateMessageMutation();
  const [text, setText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) return;

    const createdAt = new Date();

    // 입력창 비우기
    setText("");

    setIsPending(true);

    // 낙관적 UI 업데이트
    const optimisticMessage: MessageVM = {
      id: "optimistic-" + Date.now(),
      roomId,
      userId: "",
      userName: "pending...",
      text: trimmed,
      createdAt,
      isPending: true,
    };

    setPendingMessages([...pendingMessages, optimisticMessage]);

    try {
      const createdMessage = await triggerCreateMessage({
        roomId,
        createdAt,
        text: trimmed,
      }).unwrap();

      setDisplayMessages((prev) => [...prev, createdMessage]);
      setPendingMessages((prev) => prev.filter((msg) => !msg.isPending));

      onMessageCreated(createdMessage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
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
        disabled={isLoading}
        className="px-4 py-2 rounded bg-brand-mint text-bg-primary text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-accent-mintLight transition"
      >
        전송
      </button>
    </form>
  );
}
