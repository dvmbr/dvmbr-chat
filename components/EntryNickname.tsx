"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CircleAlert } from "lucide-react";
import { useCreateEntry } from "@/hooks/useEntry";

export default function EntryNickname() {
  const [nickname, setNickname] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const enterMutation = useCreateEntry();

  const handleSubmit = () => {
    if (!nickname.trim()) return;
    enterMutation.mutate({ nickname });
  };

  return (
    <>
      {enterMutation.error && (
        <Alert
          className="fixed inset-1/2 z-999 min-h-fit w-max -translate-1/2"
          variant="destructive"
        >
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{enterMutation.error.message}</AlertDescription>
        </Alert>
      )}

      <Drawer open dismissible={false}>
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
                disabled={enterMutation.isPending}
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
                disabled={enterMutation.isPending || !nickname.trim()}
                variant="default"
                className="w-full rounded-xl py-3 text-lg font-bold shadow-md"
                onClick={handleSubmit}
              >
                {enterMutation.isPending ? "Saving..." : "Submit"}
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
