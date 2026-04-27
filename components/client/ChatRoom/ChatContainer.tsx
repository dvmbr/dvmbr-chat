"use client";

import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useCreateMessage, useGetMessages } from "@/hooks/useMessages";

type ChatContainerProps = {
  roomId: number;
  participantId: number;
};
export default function ChatContainer({
  roomId,
  participantId,
}: ChatContainerProps) {
  console.log(roomId, participantId);
  const { data } = useGetMessages(roomId);
  const { mutate } = useCreateMessage(roomId, participantId);

  const handleSend = (input: string) => {
    mutate({ content: input, type: "TEXT" });
  };

  return (
    <section className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <ChatMessages
          participantId={participantId}
          messages={data?.items || []}
        />
      </div>
      <div className="bg-background sticky bottom-0 z-10">
        <ChatInput onSend={handleSend} />
      </div>
    </section>
  );
}
