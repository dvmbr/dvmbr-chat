"use client";

import useEntry from "@/hooks/useEntry";
import { CircleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "./ui/drawer";
import { Input } from "./ui/input";
import ChatRoomScaffold from "./ui/ChatRoomScaffold";
import ChatRoom from "./ChatRoom";

export default function EntryGate() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState<string>("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isNicknameDrawerOpen, setIsNicknameDrawerOpen] = useState(false);
  const [isCheckingEntry, setIsCheckingEntry] = useState(true);
  const {
    mutate: entryMutate,
    error: entryError,
    isError: entryIsError,
    isPending: entryIsPending,
  } = useEntry();

  // Returning flow (initial entry check)
  useEffect(() => {
    entryMutate(undefined, {
      onSuccess: () => setIsNicknameDrawerOpen(false),
      onError: () => setIsNicknameDrawerOpen(true),
      onSettled: () => setIsCheckingEntry(false),
    });
  }, []);

  useEffect(() => {
    if (isNicknameDrawerOpen) {
      inputRef.current?.focus();
    }
  }, [isNicknameDrawerOpen]);

  // Creation flow
  const handleSubmit = () => {
    if (!nickname?.trim()) return;

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

      <Drawer open={isNicknameDrawerOpen} dismissible={false}>
        <DrawerContent>
          <div className="mx-auto mb-4 flex w-full max-w-lg flex-col items-center">
            <DrawerHeader className="mb-2">
              <DrawerTitle>Set your nickname</DrawerTitle>
            </DrawerHeader>

            <section className="mb-4 w-full px-4">
              <Input
                ref={inputRef}
                className="text-center text-lg font-semibold"
                value={nickname}
                placeholder="nickname..."
                disabled={entryIsPending}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    e.nativeEvent.isComposing === false
                  ) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </section>

            <DrawerFooter className="w-full">
              <Button
                disabled={entryIsPending || !nickname?.trim()}
                variant="default"
                className="w-full rounded-xl py-3 text-lg font-bold shadow-md"
                onClick={handleSubmit}
              >
                {entryIsPending ? "Saving..." : "Submit"}
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {!isCheckingEntry && !isNicknameDrawerOpen ? (
        <ChatRoom />
      ) : (
        <ChatRoomScaffold />
      )}
    </>
  );
}
