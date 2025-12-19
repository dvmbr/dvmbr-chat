"use client";

import Link from "next/link";
import ChatRoom from "./ChatRoom";
import { User } from "@prisma/client";
import { MessageVM } from "../_server/MessageVM";
import { useMarkMessagesReadMutation } from "@/app/redux/features/roomApi";
import { useEffect } from "react";

type Props = {
  roomId: string;
  roomName: string;
  sessionUser: User;
  messages: MessageVM[];
};
export default function RoomWrapper({
  roomId,
  roomName,
  sessionUser,
  messages,
}: Props) {
  const [triggerMarkMessagesRead] = useMarkMessagesReadMutation();

  // -> 방 들어올 때 한 번 읽음 처리
  useEffect(() => {
    (async () => {
      try {
        await triggerMarkMessagesRead(roomId).unwrap();
      } catch (e) {
        console.error(e);
      }
    })();
  }, [triggerMarkMessagesRead, roomId]);
  return (
    <div className="h-full flex flex-col min-h-0 bg-bg-deep text-text-main border border-border rounded-lg">
      <div className="mx-auto flex w-full max-w-3xl min-h-0 flex-1 flex-col p-6">
        {/* 헤더 */}
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">{roomName}</h1>

          <Link
            href="/chat"
            className="text-sm text-text-muted transition hover:text-secondary"
          >
            {"<-"} 채팅방 목록으로
          </Link>
        </header>

        <ChatRoom roomId={roomId} user={sessionUser} messages={messages} />
      </div>
    </div>
  );
}
