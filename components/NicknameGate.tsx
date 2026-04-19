"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Input } from "./ui/input";
import ky from "ky";
import { CreateUserDTO, UserDTO } from "@/lib/schema/user.schema";
import { ErrorResponse, OkResponse } from "@/lib/schema/response.schema";

export default function NicknameGate() {
  const NICKNAME_KEY = "dvmbr-chat-nickname";

  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(NICKNAME_KEY);
    return !stored;
  });
  const [nickname, setNickname] = useState("");

  const mutation = useMutation<
    OkResponse<UserDTO>,
    ErrorResponse,
    CreateUserDTO
  >({
    mutationFn: async (payload) =>
      await ky
        .post("/api/users", {
          json: { payload, abc: 123 },
        })
        .json(),
    onSuccess: (res) => {
      const user = res.data;

      setOpen(false);
      localStorage.setItem(NICKNAME_KEY, user.nickname);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <Drawer
      open={open}
      dismissible={false}
      // Only allow closing via DrawerClose
      onOpenChange={(nextOpen) => {
        // Prevent closing unless explicitly via DrawerClose
        if (!nextOpen && open) {
          // Do nothing (block background/esc close)
          return;
        }
        setOpen(nextOpen);
      }}
    >
      <DrawerContent className="mx-auto max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>Set your nickname</DrawerTitle>
        </DrawerHeader>
        <div className="flex justify-center p-4">
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="h-fit! text-center text-2xl!"
            placeholder="nickname..."
            disabled={mutation.isPending}
          />
        </div>
        <DrawerFooter>
          <Button
            onClick={() => mutation.mutate({ nickname })}
            disabled={mutation.isPending || !nickname.trim()}
            variant="outline"
          >
            {mutation.isPending ? "Saving..." : "Submit"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
