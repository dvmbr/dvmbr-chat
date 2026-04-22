"use client";

import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import { useGetMessages } from "@/hooks/useGetMessages";
import { useCreateMessage } from "@/hooks/useCreateMessage";

type ChatRoomProps = {
  roomId: number;
  participantId: number;
};

export default function ChatRoom({ roomId, participantId }: ChatRoomProps) {
  console.log("roomId", roomId, "participantId", participantId);
  const { data } = useGetMessages(roomId);
  const { mutate: createMessage, isPending: isSending } =
    useCreateMessage(roomId);

  const messages = data?.data.items ?? [];

  const handleSend = (content: string) => {
    createMessage({
      content,
      type: "TEXT",
    });
  };

  return (
    <section className="container mx-auto flex h-full max-w-3xl flex-col">
      <div className="min-h-0 flex-1">
        <ChatMessages messages={messages} />
      </div>
      <div className="bg-background sticky bottom-0 z-10">
        <ChatInput onSend={handleSend} disabled={isSending} />
      </div>
    </section>
  );
}
