"use client";

import useEntry from "@/hooks/useEntry";
import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import ChatRoom from "./ChatRoom";
import ChatRoomScaffold from "./ui/ChatRoomScaffold";
import EntryNicknameDrawer from "./EntryNicknameDrawer";

export default function EntryGate() {
  const [nickname, setNickname] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isNicknameDrawerOpen, setIsNicknameDrawerOpen] = useState(false);
  const [isCheckingEntry, setIsCheckingEntry] = useState(true);

  const {
    mutate: entryMutate,
    error: entryError,
    isError: entryIsError,
    isPending: entryIsPending,
  } = useEntry();

  // Check initial entry (Returning flow)
  useEffect(() => {
    entryMutate(undefined, {
      onSuccess: () => setIsNicknameDrawerOpen(false),
      onError: () => setIsNicknameDrawerOpen(true),
      onSettled: () => setIsCheckingEntry(false),
    });
  }, []);

  // Create user (Creation flow)
  const handleSubmit = () => {
    if (!nickname.trim()) return;

    setIsFirstLoad(false);

    entryMutate(
      { nickname },
      {
        onSuccess: () => {
          setIsNicknameDrawerOpen(false);
          setNickname("");
        },
        onError: () => setIsNicknameDrawerOpen(true),
      },
    );
  };

  return (
    <>
      {entryIsError && !isFirstLoad && entryError.statusCode !== 400 && (
        <Alert
          className="fixed inset-1/2 z-999 min-h-fit w-max -translate-1/2"
          variant="destructive"
        >
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{entryError.error}</AlertDescription>
        </Alert>
      )}

      <EntryNicknameDrawer
        open={isNicknameDrawerOpen}
        nickname={nickname}
        isPending={entryIsPending}
        onChange={setNickname}
        onSubmit={handleSubmit}
      />

      {!isCheckingEntry && !isNicknameDrawerOpen ? (
        <ChatRoom />
      ) : (
        <ChatRoomScaffold />
      )}
    </>
  );
}
