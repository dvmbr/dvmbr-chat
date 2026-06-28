"use client";

import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useCreateMessage, useGetMessages, useAiMessage, useAiGreeting, useAiFarewell } from "@/hooks/useMessages";
import ChatRoomScaffold from "./ChatRoomScaffold";
import LoadingView from "@/components/ui/LoadingView";
import { useSocket } from "@/hooks/useSocket";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageDTO } from "@/lib/schemas/message/schema";
import type { MessageCreateBody as MessageCreateBodyPayload } from "@/lib/schemas/message/request";
import { useQueryClient } from "@tanstack/react-query";
import { MessageType, SOCKET_EVENTS, AiModeChangedPayload } from "@dvmbr/shared/socket";
import { ListResponse } from "@/lib/schemas/response/schema";
import { useReadRoom } from "@/hooks/useRoom";
import { roomStore } from "@/lib/stores/roomStore";

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

  const deleteLocalMessage = useCallback(
    (id: number) => {
      setOptimisticMessages((prev) => prev.filter((msg) => msg.id !== id));
      queryClient.setQueryData<ListResponse<MessageDTO>["data"]>(
        ["messages", roomId],
        (prev) => {
          if (!prev) return prev;
          return { ...prev, items: prev.items.filter((item) => item.id !== id) };
        },
      );
    },
    [queryClient, roomId],
  );

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
  const { mutateAsync: sendAiMessage } = useAiMessage(roomId);
  const { mutateAsync: sendAiGreeting } = useAiGreeting(roomId);
  const { mutateAsync: sendAiFarewell } = useAiFarewell(roomId);
  const { mutate: readRoom } = useReadRoom(roomId);
  const { isAiMode, setAiMode, isAiLoading, setIsAiLoading } = roomStore();

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

    const handleAiModeChanged = (payload: AiModeChangedPayload) => {
      if (payload.roomId !== roomId) return;
      isRemoteChangeRef.current = true;
      setAiMode(payload.isAiMode);
    };

    socket.on(SOCKET_EVENTS.MESSAGE_CREATED, handleMessageCreated);
    socket.on(SOCKET_EVENTS.AI_MODE_CHANGED, handleAiModeChanged);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_CREATED, handleMessageCreated);
      socket.off(SOCKET_EVENTS.AI_MODE_CHANGED, handleAiModeChanged);
    };
  }, [addMessageToCache, roomId, socketRef, isConnected, readRoom, setAiMode]);

  const addErrorMessage = useCallback(
    (content: string) => {
      const errorMessage: MessageDTO = {
        id: -Date.now(),
        participantId: -1,
        sender: { id: -1, nickname: "System" },
        roomId,
        content,
        type: "SYSTEM",
        isDeleted: false,
        isEdited: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setOptimisticMessages((prev) => [...prev, errorMessage]);
      return errorMessage;
    },
    [roomId],
  );

  const prevIsAiModeRef = useRef<boolean | null>(null);
  const isRemoteChangeRef = useRef(false);

  useEffect(() => {
    const prev = prevIsAiModeRef.current;
    prevIsAiModeRef.current = isAiMode;

    const isRemote = isRemoteChangeRef.current;
    // eslint-disable-next-line react-hooks/immutability
    isRemoteChangeRef.current = false;

    if (prev === null || prev === isAiMode) return;
    if (isRemote) return;

    const run = async (fn: () => Promise<MessageDTO>) => {
      setIsAiLoading(true);
      try {
        const aiMessage = await fn();
        addMessageToCache(aiMessage);
        socketRef.current?.emit(SOCKET_EVENTS.MESSAGE_CREATED, aiMessage);
      } catch {
        const errMsg = addErrorMessage("AI 응답에 실패했어요.");
        socketRef.current?.emit(SOCKET_EVENTS.MESSAGE_CREATED, errMsg);
      } finally {
        setIsAiLoading(false);
      }
    };

    socketRef.current?.emit(SOCKET_EVENTS.AI_MODE_CHANGED, { roomId, isAiMode });

    fetch(`/api/rooms/${roomId}/ai-mode`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAiMode }),
    });

    if (isAiMode) {
      run(sendAiGreeting);
    } else {
      run(sendAiFarewell);
    }
  }, [isAiMode, addMessageToCache, sendAiGreeting, sendAiFarewell, socketRef, roomId, setIsAiLoading, addErrorMessage]);

  const sendQueueRef = useRef<Promise<void>>(Promise.resolve());
  const pendingAiRef = useRef(0);

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

    if (isAiMode) {
      pendingAiRef.current += 1;
      setIsAiLoading(true);
    }

    sendQueueRef.current = sendQueueRef.current
      .then(async () => {
        const variables: MessageCreateBodyPayload = { content, type };
        const message = await asyncCreateMessage(variables);
        setOptimisticMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticMessage.id),
        );

        addMessageToCache(message);

        socketRef.current?.emit(SOCKET_EVENTS.MESSAGE_CREATED, message);

        if (isAiMode) {
          pendingAiRef.current -= 1;
          if (pendingAiRef.current === 0) {
            try {
              const aiMessage = await sendAiMessage(content);
              addMessageToCache(aiMessage);
              socketRef.current?.emit(SOCKET_EVENTS.MESSAGE_CREATED, aiMessage);
            } catch {
              const errMsg = addErrorMessage("AI 응답에 실패했어요.");
              socketRef.current?.emit(SOCKET_EVENTS.MESSAGE_CREATED, errMsg);
            } finally {
              setIsAiLoading(false);
            }
          }
        }
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        setOptimisticMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticMessage.id),
        );
        addErrorMessage("메시지 전송에 실패했어요.");
        if (isAiMode) {
          pendingAiRef.current = 0;
          setIsAiLoading(false);
        }
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
        <ChatMessages participantId={participantId} messages={messages} isAiLoading={isAiLoading} onDeleteLocalMessage={deleteLocalMessage} />
      </div>
      <div className="bg-background sticky bottom-0 z-10">
        <ChatInput onSend={handleSend} />
      </div>
    </section>
  );
}
