"use client";

import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

export default function ChatRoom() {
  const [messages, setMessages] = useState<string[]>([]);
  const handleSend = (msg: string) => {
    setMessages([...messages, msg]);
  };
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
