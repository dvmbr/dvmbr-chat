"use client";

import {useCallback, useEffect, useState} from "react";
import {useWebSocket} from "@/app/hooks/useWebSocket";
import {User} from "@prisma/client";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import {MessageVM} from "../_server/MessageVM";
import {useJoinRoomMutation} from "@/app/redux/features/roomApi";
import {useGlobalLoading} from "@/app/components/providers/GlobalLoadingProvider";

type Props = {
  roomId: string;
  user: User;
  messages: MessageVM[];
};
export default function ChatRoom({roomId, user, messages}: Props) {
  const [triggerJoinRoom] = useJoinRoomMutation();
  const {showGlobalLoading, hideGlobalLoading} = useGlobalLoading();
  const [displayMessages, setDisplayMessages] = useState<MessageVM[]>(messages);
  const [isPending, setIsPending] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<MessageVM[]>([]);

  const mergedMessage = isPending
    ? [...displayMessages, ...pendingMessages]
    : displayMessages;

  // -> onBroadcast를 메모이제이션
  const handleBroadcast = useCallback((incoming: MessageVM) => {
    setDisplayMessages((prev) => [...prev, incoming]);
  }, []);

  const {sendToServer} = useWebSocket({
    roomId,
    user,
    onBroadcast: handleBroadcast,
  });

  useEffect(() => {
    (async () => {
      showGlobalLoading();
      try {
        await triggerJoinRoom(roomId).unwrap();
      } catch (e) {
        console.error(e);
      } finally {
        hideGlobalLoading();
      }
    })();
  }, [triggerJoinRoom, roomId, showGlobalLoading, hideGlobalLoading]);

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
