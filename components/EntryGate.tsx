"use client";
import { useEffect } from "react";
import EntryNickname from "./EntryNickname";
import ChatRoom from "./ChatRoom";
import { useRestoreEntry } from "@/hooks/useEntry";
import { useJoinRoom } from "@/hooks/useRoom";

export default function EntryGate({ roomId }: { roomId?: number }) {
  const { data, isLoading, isError } = useRestoreEntry();
  const { mutate, data: entered } = useJoinRoom();

  useEffect(() => {
    if (!roomId) return;
    if (!data) return;

    mutate(roomId);
  }, [roomId, data]);

  if (isLoading) return null;

  if (isError || !data) {
    return <EntryNickname />;
  }

  // roomId 있으면 entry API 결과 우선
  const finalEntry = entered?.data ?? data;

  return <ChatRoom entry={finalEntry} />;
}
