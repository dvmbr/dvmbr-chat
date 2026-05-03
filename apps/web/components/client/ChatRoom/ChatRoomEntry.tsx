"use client";

import ChatRoomScaffold from "@/components/client/ChatRoom/ChatRoomScaffold";
import LoadingView from "@/components/ui/LoadingView";
import useChatRoomEntry from "@/hooks/useChatRoomEntry";
import { roomStore } from "@/lib/stores/roomStore";
import { useEffect } from "react";
import ChatContainer from "./ChatContainer";
import ErrorView from "@/components/ui/ErrorView";

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

    return <ErrorView text="Failed to enter Chatting Room" />;
  }

  if (isIdle || isPending) {
    return (
      <>
        <ChatRoomScaffold />
        <LoadingView text="Preparing the chatting room..." />
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
