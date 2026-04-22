"use client";

import { useEffect } from "react";
import ChatRoom from "../ChatRoom";
import { useRoomStore } from "@/lib/stores/roomStore";
import { useUserStore } from "@/lib/stores/userStore";
import { useEntry } from "@/hooks/useEntry";
import { Button } from "../ui-old/button";
import Loading from "../ui-old/Loading";
import ChatRoomScaffold from "../ChatRoom/ChatRoomScaffold";

export default function HomeEntry() {
  const { userId, setUser } = useUserStore((state) => state);
  const { roomId, setRoom } = useRoomStore((state) => state);

  const canEntry = userId !== null;

  const retryEntry = () => {
    if (!canEntry || userId === null || entryMutation.isPending) return;
    entryMutation.mutate({ userId });
  };

  const entryMutation = useEntry({
    onSuccess: (res) => {
      setRoom(res.data.room.id, res.data.room.name);
      setUser(res.data.user.id, res.data.user.nickname);
    },
  });

  useEffect(() => {
    if (!canEntry || userId === null) return;
    if (entryMutation.isPending || entryMutation.isSuccess) return;

    entryMutation.mutate({ userId });
  }, [canEntry, userId, entryMutation]);

  if (entryMutation.isPending) {
    return <Loading />;
  }

  if (entryMutation.isError) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4">
        <div>Failed to enter room</div>

        <Button onClick={retryEntry}>Retry</Button>
      </div>
    );
  }

  if (roomId === null) {
    return <ChatRoomScaffold />;
  }

  return <ChatRoom roomId={roomId} />;
}
