"use client";

import { useEffect } from "react";
import ChatRoom from "../ChatRoom";
import { useRoomStore } from "@/lib/stores/roomStore";
import { useUserStore } from "@/lib/stores/userStore";
import { useEntry } from "@/hooks/useEntry";

export default function HomeEntry() {
  const { userId, setUser } = useUserStore((state) => state);
  const setRoom = useRoomStore((state) => state.setRoom);

  const canEntry = userId !== null;

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

  return (
    <ChatRoom
      isEntryPending={entryMutation.isPending}
      isEntryError={entryMutation.isError}
      onRetryEntry={() => {
        if (!canEntry || userId === null || entryMutation.isPending) return;
        entryMutation.mutate({ userId });
      }}
    />
  );
}
