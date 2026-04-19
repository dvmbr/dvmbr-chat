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
import { parseApiError } from "@/lib/utils/praseApiError";
import { USER_ID_KEY } from "@/lib/constants";

type NicknameGateProps = {
  children: React.ReactNode;
};

export default function NicknameGate({ children }: NicknameGateProps) {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(USER_ID_KEY);
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
          json: payload,
        })
        .json(),
    onSuccess: (res) => {
      const user = res.data;
      localStorage.setItem(USER_ID_KEY, user.id.toString());
      setOpen(false);
    },
    onError: async (error) => {
      const message = await parseApiError(error);
      console.error(message);
    },
  });

  return (
    <>
      {children}
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
              className="h-fit! text-center text-2xl!"
              placeholder="nickname..."
              disabled={mutation.isPending}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  e.nativeEvent.isComposing === false
                ) {
                  e.preventDefault();
                  if (!mutation.isPending && nickname.trim()) {
                    mutation.mutate({ nickname });
                  }
                }
              }}
            />
          </div>
          <DrawerFooter>
            <Button
              disabled={mutation.isPending || !nickname.trim()}
              variant="outline"
              onClick={() => mutation.mutate({ nickname })}
            >
              {mutation.isPending ? "Saving..." : "Submit"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
