"use client";

import {ChatMessage} from "@/types/chat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import {useState} from "react";
import {useWebSocket} from "@/hooks/useWebSocket";
import {SessionUser} from "@/types/session";
type Props = {
  roomId: string;
  sessionUser: SessionUser;
  messages: ChatMessage[];
};
export default function ChatView({roomId, sessionUser, messages}: Props) {
  const [displayMessages, setDisplayMessages] =
    useState<ChatMessage[]>(messages);
  const [isPending, setIsPending] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);

  const mergedMessage = isPending
    ? [...displayMessages, ...pendingMessages]
    : displayMessages;

  const {sendToServer} = useWebSocket({
    roomId,
    sessionUser: sessionUser,
    onBroadcast: (incoming) => {
      setDisplayMessages((prev) => [...prev, incoming]);
    },
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
