"use client";

import { useState } from "react";
import ChatMessages from "../ChatRoom/ChatMessages";
import ChatInput from "../ChatRoom/ChatInput";

type ChatRoomProps = {
  roomId?: number;
  participantId?: number;
};
export default function ChatRoom({ roomId, participantId }: ChatRoomProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setInput("");
  };

  return (
    <section className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <ChatMessages messages={[]} />
      </div>
      <div className="bg-background sticky bottom-0 z-10">
        <ChatInput onSend={handleSend} />
      </div>
    </section>
  );
}
