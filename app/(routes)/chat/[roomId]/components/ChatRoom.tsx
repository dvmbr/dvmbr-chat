"use client";

import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import {useCallback, useState} from "react";
import {useWebSocket} from "@/app/hooks/useWebSocket";
import {User} from "@prisma/client";
import {Message} from "@/app/(server)/lib/message";

type Props = {
  roomId: string;
  user: User;
  messages: Message[];
};
export default function ChatRoom({roomId, user, messages}: Props) {
  const [displayMessages, setDisplayMessages] = useState<Message[]>(messages);
  const [isPending, setIsPending] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);

  const mergedMessage = isPending
    ? [...displayMessages, ...pendingMessages]
    : displayMessages;

  // -> onBroadcast를 메모이제이션
  const handleBroadcast = useCallback((incoming: Message) => {
    setDisplayMessages((prev) => [...prev, incoming]);
  }, []);

  const {sendToServer} = useWebSocket({
    roomId,
    user,
    onBroadcast: handleBroadcast,
  });

  return (
    <>
      {/* 메시지 리스트 */}
      <div className="flex-1 bg-surface border border-surface-border rounded-lg p-4 flex flex-col">
        <MessageList messages={mergedMessage} />
      </div>

      {/* 메시지 인풋 */}
      <MessageInput
        roomId={roomId}
        pendingMessages={pendingMessages}
        setPendingMessages={setPendingMessages}
        setIsPending={setIsPending}
        setDisplayMessages={setDisplayMessages}
        onMessageCreated={(created) => sendToServer(created)}
      />
    </>
  );
}
