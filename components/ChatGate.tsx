"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ChatRoom from "./ChatRoom";
import { useRoomStore } from "@/lib/stores/roomStore";
import { useUserStore } from "@/lib/stores/userStore";
import { useChatEntry } from "@/hooks/useChatEntry";
import { Button } from "./ui/button";
import ChatRoomScaffold from "./ui/ChatRoomScaffold";

type ChatGateProps = {
  roomId?: number;
};

export default function ChatGate({ roomId }: ChatGateProps) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { userId, setUser } = useUserStore((state) => state);
  const {
    roomId: storedRoomId,
    participantId,
    setRoom,
  } = useRoomStore((state) => state);

  const canEntry = userId !== null;

  const resolvedRoomId = useMemo(() => {
    return roomId ?? storedRoomId;
  }, [roomId, storedRoomId]);

  const chatEntryMutation = useChatEntry({
    onSuccess: (res) => {
      setRoom(res.data.room.id, res.data.room.name, res.data.participant.id);
      setUser(res.data.user.id, res.data.user.nickname);

      if (roomId === undefined) {
        setIsRedirecting(true);
        router.replace(`/rooms/${res.data.room.id}`);
      }
    },
  });

  const retryEntry = () => {
    if (!canEntry || userId === null || chatEntryMutation.isPending) return;

    chatEntryMutation.mutate();
  };

  useEffect(() => {
    if (!canEntry || userId === null) return;
    if (chatEntryMutation.isPending || chatEntryMutation.isSuccess) return;

    chatEntryMutation.mutate();
  }, [canEntry, userId, roomId, chatEntryMutation]);

  if (chatEntryMutation.isError) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4">
        <div>Failed to enter room</div>
        <Button onClick={retryEntry}>Retry</Button>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4">
        <div>Moving to room...</div>
      </div>
    );
  }

  if (resolvedRoomId === null || participantId === null) {
    return <ChatRoomScaffold />;
  }

  return <ChatRoom roomId={resolvedRoomId} participantId={participantId} />;
}
