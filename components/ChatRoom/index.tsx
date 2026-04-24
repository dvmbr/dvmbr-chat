"use client";

import { useState } from "react";
// import { useMessages, useCreateMessage } from "@/hooks/useMessages";
import ChatMessages from "../ChatRoom/ChatMessages";
import ChatInput from "../ChatRoom/ChatInput";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ChatRoom({ entry }: { entry: any }) {
  const { roomId } = entry;

  // const { data, isLoading } = useMessages(roomId);
  // const { mutate: createMessage, isPending } = useCreateMessage(roomId);

  const [input, setInput] = useState("");

  const handleSend = () => {
    // if (!input.trim()) return;

    // createMessage({ content: input });
    setInput("");
  };

  // if (isLoading) {
  //   return <div>Loading messages...</div>;
  // }

  return (
    <section className="container mx-auto flex h-full max-w-3xl flex-col">
      <div className="min-h-0 flex-1">
        {/* <ChatMessages messages={data?.data.items || []} /> */}
      </div>
      <div className="bg-background sticky bottom-0 z-10">
        {/* <ChatInput onSend={handleSend} disabled={isPending} /> */}
      </div>
    </section>
  );
}
