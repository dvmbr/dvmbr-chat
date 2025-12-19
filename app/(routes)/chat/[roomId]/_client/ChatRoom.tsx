"use client";

import { useMemo, useState } from "react";
import { User } from "@prisma/client";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { MessageVM } from "../_server/MessageVM";
import { useGetMessagesByRoomIdQuery } from "@/app/redux/features/messageApi";

type Props = {
  roomId: string;
  user: User;
  messages: MessageVM[];
};
export default function ChatRoom({ roomId, user, messages }: Props) {
  const { data } = useGetMessagesByRoomIdQuery(roomId, {
    refetchOnReconnect: true,
  });

  const [messageStack, setMessageStack] = useState<MessageVM[]>([]);

  const baseMessages = data ?? messages;

  const mergedMessages = useMemo(() => {
    return [
      ...baseMessages,
      ...messageStack.filter((m) => {
        if (!m.isPending) return true;

        const existsInBase = baseMessages.some((b) => b.cuid === m.cuid);

        // baseMessages에 같은 메시지가 있으면 -> 화면에서 제외
        return !existsInBase;
      }),
    ];
  }, [baseMessages, messageStack]);

  return (
    <>
      {/* 메시지 리스트 */}
      <div className="flex-1 bg-bg-surface border border-border rounded-lg flex flex-col min-h-0">
        <MessageList meId={user.id} messages={mergedMessages} />
      </div>

      {/* 메시지 인풋 */}
      <MessageInput
        meId={user.id}
        roomId={roomId}
        setMessageStack={setMessageStack}
      />
    </>
  );
}
