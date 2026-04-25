"use client";

import useChatRoomEntry from "@/hooks/useChatRoomEntry";
import { useEffect } from "react";
import ChatRoom from ".";
import Loading from "../ui/Loading";

type ChatRoomEntryProps = {
  roomId?: number;
};
export default function ChatRoomEntry({ roomId }: ChatRoomEntryProps) {
  const { mutate, data, isPending, isError } = useChatRoomEntry();

  useEffect(() => {
    mutate(roomId);
  }, [roomId, mutate]);

  if (isPending || !data) {
    return <Loading />;
  }

  if (isError) {
    return <div>Failed to enter room</div>;
  }

  return <ChatRoom roomId={data.roomId} participantId={data.participantId} />;
}
