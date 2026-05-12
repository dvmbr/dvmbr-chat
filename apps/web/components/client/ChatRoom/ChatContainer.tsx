"use client";

import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useCreateMessage, useGetMessages } from "@/hooks/useMessages";
import ChatRoomScaffold from "./ChatRoomScaffold";
import LoadingView from "@/components/ui/LoadingView";
import { useSocket } from "@/hooks/useSocket";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageDTO } from "@/lib/schemas/message/schema";
import type { MessageCreateBody as MessageCreateBodyPayload } from "@/lib/schemas/message/request";
import { useQueryClient } from "@tanstack/react-query";
import { SOCKET_EVENTS } from "@dvmbr/shared/socket/events";
import { ListResponse } from "@/lib/schemas/response/schema";
import { useReadRoom } from "@/hooks/useRoom";
import { MessageType } from "@dvmbr/shared/socket/payloads/message";

type ChatContainerProps = {
  userId: number;
  roomId: number;
  participantId: number;
};
export default function ChatContainer({
  userId,
  roomId,
  participantId,
}: ChatContainerProps) {
  const queryClient = useQueryClient();
  const { socketRef, isConnected } = useSocket(userId, roomId);
  const { data, isPending } = useGetMessages(roomId);
  const [optimisticMessages, setOptimisticMessages] = useState<MessageDTO[]>(
    [],
  );

  const messages = [...(data?.items ?? []), ...optimisticMessages];

  const addMessageToCache = useCallback(
    (message: MessageDTO) => {
      queryClient.setQueryData<ListResponse<MessageDTO>["data"]>(
        ["messages", roomId],
        (prev) => {
          if (!prev) return prev;

          const exists = prev.items.some((item) => item.id === message.id);
          if (exists) return prev;

          return {
            ...prev,
            items: [...prev.items, message].sort((a, b) => a.id - b.id),
            total: prev.total + 1,
          };
        },
      );
    },
    [queryClient, roomId],
  );

  const { mutateAsync: asyncCreateMessage } = useCreateMessage(roomId);
  const { mutate: readRoom } = useReadRoom(roomId);

  useEffect(() => {
    readRoom();
  }, [roomId, readRoom]);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !isConnected) return;

    const handleMessageCreated = (message: MessageDTO) => {
      if (message.roomId !== roomId) return;

      addMessageToCache(message);

      readRoom();
    };

    socket.on(SOCKET_EVENTS.MESSAGE_CREATED, handleMessageCreated);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_CREATED, handleMessageCreated);
    };
  }, [addMessageToCache, roomId, socketRef, isConnected, readRoom]);

  const sendQueueRef = useRef<Promise<void>>(Promise.resolve());

  const handleSend = (content: string, type: MessageType = "TEXT") => {
    const optimisticMessage: MessageDTO = {
      id: -Date.now(), // Temporary ID for optimistic message
      participantId,
      sender: {
        id: -1,
        nickname: "You",
      },
      roomId,
      content,
      type,
      isDeleted: false,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOptimisticMessages((prev) => [...prev, optimisticMessage]);

    sendQueueRef.current = sendQueueRef.current
      .then(async () => {
        const variables: MessageCreateBodyPayload = { content, type };
        const message = await asyncCreateMessage(variables);
        setOptimisticMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticMessage.id),
        );

        addMessageToCache(message);

        socketRef.current?.emit(SOCKET_EVENTS.MESSAGE_CREATED, message);
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        setOptimisticMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticMessage.id),
        );
      });
  };

  if (isPending) {
    return (
      <>
        <ChatRoomScaffold />
        <LoadingView text="Pending messages..." />
      </>
    );
  }

  return (
    <section className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <ChatMessages participantId={participantId} messages={messages} />
      </div>
      <div className="bg-background sticky bottom-0 z-10">
        <ChatInput onSend={handleSend} />
      </div>
    </section>
  );
}
