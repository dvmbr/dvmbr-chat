"use client";

import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

type ChatRoomProps = {
  roomId: number;
};

export default function ChatRoom({ roomId }: ChatRoomProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const handleSend = (msg: string) => {
    setMessages([...messages, msg]);
  };

  return (
    <section className="container mx-auto flex h-full max-w-3xl flex-col">
      <div className="min-h-0 flex-1">
        <ChatMessages messages={messages} />
      </div>
      <div className="bg-background sticky bottom-0 z-10">
        <ChatInput onSend={handleSend} />
      </div>
    </section>
  );
}
