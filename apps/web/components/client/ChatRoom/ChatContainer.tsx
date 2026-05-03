"use client";

import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useCreateMessage, useGetMessages } from "@/hooks/useMessages";
import ChatRoomScaffold from "./ChatRoomScaffold";
import LoadingView from "@/components/ui/LoadingView";

type ChatContainerProps = {
  roomId: number;
  participantId: number;
};
export default function ChatContainer({
  roomId,
  participantId,
}: ChatContainerProps) {
  const { data, isPending } = useGetMessages(roomId);
  const { mutate } = useCreateMessage(roomId, participantId);

  const handleSend = (input: string) => {
    mutate({ content: input, type: "TEXT" });
  };

  if (isPending) {
    return (
      <>
        <ChatRoomScaffold />
        <LoadingView text="Pending messages..." />
      </>
    );
  }

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
