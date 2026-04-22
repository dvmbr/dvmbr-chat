"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { useUserStore } from "@/lib/stores/userStore";
import { useCreateUser } from "@/hooks/useCreateUser";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CircleAlert } from "lucide-react";

export default function NicknameGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { userId, setUser } = useUserStore((state) => state);
  const [nickname, setNickname] = useState("");

  const open = userId === null;

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  const createUserMutation = useCreateUser({
    onSuccess: (res) => {
      const user = res.data;
      setUser(user.id, user.nickname);
    },
  });

  const handleSubmit = () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname || createUserMutation.isPending) return;

    createUserMutation.mutate({
      nickname: trimmedNickname,
    });
  };

  return (
    <>
      {createUserMutation.error && (
        <Alert
          className="fixed inset-1/2 z-999 min-h-fit w-max -translate-1/2"
          variant="destructive"
        >
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {createUserMutation.error.message}
          </AlertDescription>
        </Alert>
      )}
      <Drawer
        open={open}
        dismissible={false}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && open) return;
        }}
      >
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
                disabled={createUserMutation.isPending}
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
                disabled={createUserMutation.isPending || !nickname.trim()}
                variant="default"
                className="w-full rounded-xl py-3 text-lg font-bold shadow-md"
                onClick={handleSubmit}
              >
                {createUserMutation.isPending ? "Saving..." : "Submit"}
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {children}
    </>
  );
}
