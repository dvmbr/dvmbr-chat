"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

import useEntry from "@/hooks/useEntry";
import type { EntryBody } from "@/lib/schemas/entry/request";
import type { UserDTO } from "@/lib/schemas/user/schema";
import AppShell from "./AppShell";
import { userStore } from "@/lib/stores/userStore";
import LoadingView from "../ui/LoadingView";
import ChatRoomScaffold from "./ChatRoom/ChatRoomScaffold";

/**
 * Initial state of the drawer is determined by the existence of the user.
 * If the user does not exist, the nickname drawer opens and prompts the user to enter a nickname.
 * If the provided nickname is duplicated or the request fails, the drawer remains open and an error alert is displayed.
 * If the user exists, do nothing.
 * Where the user exists or not, rendering children is allowed.
 */
type Props = {
  children: React.ReactNode;
  user: UserDTO | null;
};
export default function AppEntry({ children, user }: Props) {
  const { mutate, error, isPending, isError } = useEntry();
  const { setUser } = userStore();

  const [open, setOpen] = useState(!user);
  const [nickname, setNickname] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setUser(user.id, user.nickname);
    }
  }, [user, setUser]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!nickname.trim()) return;

    const body: EntryBody = { nickname: nickname.trim() };
    mutate(body, {
      onSuccess: (data) => {
        setOpen(false);
        setUser(data.user.id, data.user.nickname);
      },
      onError: () => {
        setOpen(true);
        inputRef.current?.focus();
      },
      onSettled: () => {
        setNickname("");
      },
    });
  };

  return (
    <>
      <AppShell>
        {isPending ? (
          <>
            <ChatRoomScaffold />
            <LoadingView text="Creating user..." />
          </>
        ) : open ? (
          <ChatRoomScaffold />
        ) : (
          children
        )}
      </AppShell>
      {isError && (
        <Alert
          className="fixed inset-1/2 z-999 min-h-fit w-max -translate-1/2"
          variant="destructive"
        >
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {
              (error.meta?.message ||
                (error.error === "Conflict"
                  ? "Nickname already exists"
                  : error.error)) as string
            }
          </AlertDescription>
        </Alert>
      )}
      <Drawer open={open} dismissible={false}>
        <DrawerDescription className="sr-only">
          This is the entry gate. Please enter your nickname to proceed.
        </DrawerDescription>

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
                maxLength={20}
                disabled={isPending}
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
                disabled={isPending || !nickname.trim()}
                variant="default"
                className="w-full rounded-xl py-3 text-lg font-bold shadow-md"
                onClick={handleSubmit}
              >
                {isPending ? "Saving..." : "Submit"}
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
