"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";

import ChatRoom from "./ChatRoom";
import { EntryDTO, EntryRequestDTO } from "@/lib/schema/entry.schema";
import { ErrorResponse, OkResponse } from "@/lib/schema/response.schema";
import { useStoredUserId } from "@/lib/hooks/useStoredUserId";
import { useRoomStore } from "@/lib/stores/roomStore";
import { useUserStore } from "@/lib/stores/userStore";

export default function ChatEntry() {
  const { userId, isValidUserId } = useStoredUserId();
  const setRoom = useRoomStore((state) => state.setRoom);
  const setUser = useUserStore((state) => state.setUser);

  const mutation = useMutation<
    OkResponse<EntryDTO>,
    ErrorResponse,
    EntryRequestDTO
  >({
    mutationFn: async (payload) =>
      await ky
        .post("/api/entry", {
          json: payload,
        })
        .json<OkResponse<EntryDTO>>(),
    onSuccess: (res) => {
      setRoom(res.data.room.id, res.data.room.name);
      setUser(res.data.user.id, res.data.user.nickname);
    },
  });

  useEffect(() => {
    if (!isValidUserId || userId === null) return;
    if (mutation.isPending || mutation.isSuccess || mutation.isError) return;

    mutation.mutate({ userId });
  }, [isValidUserId, userId, mutation]);

  return (
    <ChatRoom
      isEntryPending={mutation.isPending}
      isEntryError={mutation.isError}
      onRetryEntry={() => {
        if (!isValidUserId || userId === null) return;
        mutation.mutate({ userId });
      }}
    />
  );
}
