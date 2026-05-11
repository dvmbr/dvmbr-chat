"use client";

import ChatRoomScaffold from "@/components/client/ChatRoom/ChatRoomScaffold";
import LoadingView from "@/components/ui/LoadingView";
import ErrorView from "@/components/ui/ErrorView";
import useChatRoomEntry from "@/hooks/useChatRoomEntry";
import { ChatRoomEntryDTO } from "@/lib/schemas/chat-room-entry.schema";
import { roomStore } from "@/lib/stores/roomStore";
import { useEffect, useRef, useState } from "react";
import ChatContainer from "./ChatContainer";

type ChatRoomEntryProps = {
  roomId?: number;
};

export default function ChatRoomEntry({ roomId }: ChatRoomEntryProps) {
  const { mutateAsync } = useChatRoomEntry();

  const setRoom = roomStore((state) => state.setRoom);

  const didMutate = useRef(false);
  const [entry, setEntry] = useState<ChatRoomEntryDTO | null>(null);
  const [isEntering, setIsEntering] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (didMutate.current) return;
    didMutate.current = true;

    const enterRoom = async () => {
      try {
        setIsEntering(true);

        const entry = await mutateAsync(roomId);

        setRoom(entry.roomId, entry.room.name, entry.participantId);
        setEntry(entry);
      } catch (error) {
        console.error("ChatRoomEntry mutate error:", error);
        setHasError(true);
      } finally {
        setIsEntering(false);
      }
    };

    enterRoom();
  }, [mutateAsync, roomId, setRoom]);

  if (hasError) {
    return <ErrorView text="Failed to enter Chatting Room" />;
  }

  if (isEntering) {
    return (
      <>
        <ChatRoomScaffold />
        <LoadingView text="Preparing the chatting room..." />
      </>
    );
  }

  if (!entry) {
    return <ChatRoomScaffold />;
  }

  return (
    <ChatContainer roomId={entry.roomId} participantId={entry.participantId} />
  );
}
