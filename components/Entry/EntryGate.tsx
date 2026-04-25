"use client";

import useEntry from "@/hooks/useEntry";
import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import ChatRoomScaffold from "../ui/ChatRoomScaffold";
import EntryNicknameDrawer from "./EntryNicknameDrawer";
import { EntryBodyDTO } from "@/lib/schema/entry.schema";
import ChatRoomEntry from "../ChatRoom/ChatRoomEntry";

export default function EntryGate() {
  const [nickname, setNickname] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isNicknameDrawerOpen, setIsNicknameDrawerOpen] = useState(false);
  const [isCheckingEntry, setIsCheckingEntry] = useState(true);

  const { mutate, error, isError, isPending } = useEntry();

  // Check initial entry (Returning flow)
  useEffect(() => {
    mutate(undefined, {
      onSuccess: () => setIsNicknameDrawerOpen(false),
      onError: () => setIsNicknameDrawerOpen(true),
      onSettled: () => setIsCheckingEntry(false),
    });
  }, []);

  // Create user (Creation flow)
  const handleSubmit = () => {
    if (!nickname.trim()) return;

    setIsFirstLoad(false);

    const body: EntryBodyDTO = { nickname: nickname.trim() };

    mutate(body, {
      onSuccess: () => {
        setIsNicknameDrawerOpen(false);
        setNickname("");
      },
      onError: () => setIsNicknameDrawerOpen(true),
    });
  };

  return (
    <>
      {isError && !isFirstLoad && error.statusCode !== 400 && (
        <Alert
          className="fixed inset-1/2 z-999 min-h-fit w-max -translate-1/2"
          variant="destructive"
        >
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.error}</AlertDescription>
        </Alert>
      )}

      <EntryNicknameDrawer
        open={isNicknameDrawerOpen}
        nickname={nickname}
        isPending={isPending}
        onChange={setNickname}
        onSubmit={handleSubmit}
      />

      {!isCheckingEntry && !isNicknameDrawerOpen ? (
        <ChatRoomEntry />
      ) : (
        <ChatRoomScaffold />
      )}
    </>
  );
}
