"use client";

import { useEffect, useRef } from "react";

import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Input } from "../ui/input";

type EntryNicknameDrawerProps = {
  open: boolean;
  nickname: string;
  isPending: boolean;
  onChange: (nickname: string) => void;
  onSubmit: () => void;
};

export default function EntryNicknameDrawer({
  open,
  nickname,
  isPending,
  onChange,
  onSubmit,
}: EntryNicknameDrawerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <Drawer open={open} dismissible={false}>
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
              disabled={isPending}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  e.nativeEvent.isComposing === false
                ) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
            />
          </section>

          <DrawerFooter className="w-full">
            <Button
              disabled={isPending || !nickname.trim()}
              variant="default"
              className="w-full rounded-xl py-3 text-lg font-bold shadow-md"
              onClick={onSubmit}
            >
              {isPending ? "Saving..." : "Submit"}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
