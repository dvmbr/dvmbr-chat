"use client";

import {useMemo, useState} from "react";
import {User} from "@prisma/client";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import {MessageVM} from "../_server/MessageVM";
import {useGetMessagesByRoomIdQuery} from "@/app/redux/features/messageApi";

type Props = {
  roomId: string;
  user: User;
  messages: MessageVM[];
};
export default function ChatRoom({roomId, messages}: Props) {
  const {data} = useGetMessagesByRoomIdQuery(roomId, {
    refetchOnReconnect: true,
  });
  const [isPending, setIsPending] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<MessageVM[]>([]);

  // RTK Query가 최우선, 없으면 SSR fallback
  const baseMessages = data ?? messages;

  const mergedMessages = useMemo(() => {
    return isPending ? [...baseMessages, ...pendingMessages] : baseMessages;
  }, [baseMessages, isPending, pendingMessages]);

  return (
    <>
      {/* 메시지 리스트 */}
      <div className="flex-1 bg-surface border border-surface-border rounded-lg p-4 flex flex-col">
        <MessageList messages={mergedMessages} />
      </div>

      {/* 메시지 인풋 */}
      <MessageInput
        roomId={roomId}
        pendingMessages={pendingMessages}
        setPendingMessages={setPendingMessages}
        setIsPending={setIsPending}
      />
    </>
  );
}
