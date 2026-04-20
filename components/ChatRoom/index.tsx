"use client";

import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import Loading from "../custom/Loading";
import { Button } from "../ui/button";
import { is } from "zod/v4/locales";

type ChatRoomProps = {
  roomId: number | null;
  isEntryPending?: boolean;
  isEntryError?: boolean;
  onRetryEntry?: () => void;
};

export default function ChatRoom({
  roomId,
  isEntryPending,
  isEntryError,
  onRetryEntry,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const handleSend = (msg: string) => {
    setMessages([...messages, msg]);
  };

  if (isEntryPending) return <Loading />;
  if (isEntryError)
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4">
        <div>Failed to enter room</div>
        <Button onClick={onRetryEntry}>Retry</Button>
      </div>
    );

  return (
    <section className="container mx-auto">
      <div className="mx-auto flex h-dvh max-w-3xl flex-col p-4">
        <div className="min-h-0 flex-1">
          <ChatMessages messages={messages} />
        </div>
        <div className="bg-background sticky bottom-0 z-10">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </section>
  );
}
