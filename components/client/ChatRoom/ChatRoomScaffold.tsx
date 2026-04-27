"use client";

import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

export default function ChatRoomScaffold() {
  return (
    <section className="container mx-auto flex h-full max-w-3xl flex-col">
      <div className="min-h-0 flex-1">
        <ChatMessages messages={[]} />
      </div>
      <div className="bg-background sticky bottom-0 z-10">
        <ChatInput onSend={() => {}} disabled={true} />
      </div>
    </section>
  );
}
