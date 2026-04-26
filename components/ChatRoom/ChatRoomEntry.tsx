"use client";

import useChatRoomEntry from "@/hooks/useChatRoomEntry";
import { useEffect } from "react";
import ChatRoom from ".";
import { loadingStore } from "@/lib/stores/loadingStore";

type ChatRoomEntryProps = {
  roomId?: number;
};
export default function ChatRoomEntry({ roomId }: ChatRoomEntryProps) {
  const { mutate, data, isPending, isError } = useChatRoomEntry();
  const { show, hide } = loadingStore();

  useEffect(() => {
    mutate(roomId);
  }, [roomId, mutate]);

  useEffect(() => {
    if (isPending) {
      show();
    } else {
      hide();
    }
  }, [isPending, show, hide]);

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <p>Failed to enter room</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <ChatRoom roomId={data.roomId} participantId={data.participantId} />;
}
