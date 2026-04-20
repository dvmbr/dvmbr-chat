"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";

import ChatRoom from "./ChatRoom";
import { EntryDTO, EntryRequestDTO } from "@/lib/schema/entry.schema";
import { ErrorResponse, OkResponse } from "@/lib/schema/response.schema";
import { useStoredUserId } from "@/lib/hooks/useStoredUserId";
import Loading from "./custom/Loading";

export default function ParticipantEntry() {
  const { userId, isValidUserId } = useStoredUserId();

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
  });

  useEffect(() => {
    if (!isValidUserId || userId === null) return;
    if (mutation.isPending || mutation.isSuccess || mutation.isError) return;

    mutation.mutate({ userId });
  }, [isValidUserId, userId, mutation]);

  return (
    <ChatRoom
      roomId={mutation.data?.data?.roomId ?? null}
      isEntryPending={mutation.isPending}
      isEntryError={mutation.isError}
      onRetryEntry={() => {
        if (!isValidUserId || userId === null) return;
        mutation.mutate({ userId });
      }}
    />
  );
}
