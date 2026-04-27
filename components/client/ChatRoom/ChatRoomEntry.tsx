"use client";

import ChatRoomScaffold from "@/components/client/ChatRoom/ChatRoomScaffold";
import Loading from "@/components/ui/Loading";
import useChatRoomEntry from "@/hooks/useChatRoomEntry";
import { roomStore } from "@/lib/stores/roomStore";
import { useEffect } from "react";
import ChatContainer from "./ChatContainer";

type ChatRoomEntryProps = {
  roomId?: number;
};
export default function ChatRoomEntry({ roomId }: ChatRoomEntryProps) {
  const { mutate, data, error, isIdle, isPending, isError } =
    useChatRoomEntry();

  const { setRoom } = roomStore();

  useEffect(() => {
    mutate(roomId, {
      onSuccess: (data) => {
        setRoom(data.roomId, data.room.name, data.participantId);
      },
    });
  }, [mutate, roomId, setRoom]);

  if (isError) {
    if (error.statusCode === 401) {
      return <ChatRoomScaffold />;
    }

    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <p>Failed to enter room</p>
      </div>
    );
  }

  if (isIdle || isPending) {
    return (
      <>
        <ChatRoomScaffold />
        <Loading text="Preparing the chatting room..." />
      </>
    );
  }

  if (!data) {
    return <ChatRoomScaffold />;
  }

  return (
    <ChatContainer roomId={data.roomId} participantId={data.participantId} />
  );
}
