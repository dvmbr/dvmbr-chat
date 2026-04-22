"use client";

import { useEffect } from "react";
import ChatRoom from "./ChatRoom";
import { useRoomStore } from "@/lib/stores/roomStore";
import { useUserStore } from "@/lib/stores/userStore";
import { useEntry } from "@/hooks/useEntry";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import ChatRoomScaffold from "./ui/ChatRoomScaffold";

type ChatEntryProps = {
  roomId?: number;
};

export default function ChatGate({ roomId }: ChatEntryProps) {
  const router = useRouter();

  const { userId, setUser } = useUserStore((state) => state);
  const {
    roomId: storedRoomId,
    participantId,
    setRoom,
  } = useRoomStore((state) => state);

  const canEntry = userId !== null;

  const entryMutation = useEntry({
    onSuccess: (res) => {
      setRoom(res.data.room.id, res.data.room.name, res.data.participant.id);
      setUser(res.data.user.id, res.data.user.nickname);

      if (roomId === undefined) {
        router.replace(`/rooms/${res.data.room.id}`);
      }
    },
  });

  const retryEntry = () => {
    if (!canEntry || userId === null || entryMutation.isPending) return;

    entryMutation.mutate({
      userId,
      ...(roomId ? { roomId } : {}),
    });
  };

  useEffect(() => {
    if (!canEntry || userId === null) return;
    if (entryMutation.isPending || entryMutation.isSuccess) return;

    entryMutation.mutate({
      userId,
      ...(roomId ? { roomId } : {}),
    });
  }, [canEntry, userId, roomId, entryMutation]);

  if (entryMutation.isError) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4">
        <div>Failed to enter room</div>
        <Button onClick={retryEntry}>Retry</Button>
      </div>
    );
  }

  if (storedRoomId === null || participantId === null) {
    // return (
    //   <div className="flex h-dvh flex-col items-center justify-center gap-4">
    //     <div>Entering room...</div>
    //   </div>
    // );
    return <ChatRoomScaffold />;
  }

  return <ChatRoom roomId={storedRoomId} participantId={participantId} />;
}
