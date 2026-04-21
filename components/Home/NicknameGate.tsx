"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Input } from "../ui/input";
import ky from "ky";
import { CreateUserDTO, UserDTO } from "@/lib/schema/user.schema";
import { ErrorResponse, OkResponse } from "@/lib/schema/response.schema";
import { parseApiError } from "@/lib/utils/praseApiError";
import { useUserStore } from "@/lib/stores/userStore";

export default function NicknameGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, setUser } = useUserStore((state) => state);

  const open = userId === null;
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

      setUser(user.id, user.nickname);
    },

    onError: async (error) => {
      const message = await parseApiError(error);
      console.error(message);
    },
  });

  return (
    <>
      <Drawer
        open={open}
        dismissible={false}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && open) return;
        }}
      >
        <DrawerContent className="mx-auto max-w-md rounded-2xl p-0">
          <DrawerHeader className="pt-8 pb-0 text-center">
            <DrawerTitle className="text-2xl font-extrabold tracking-tight drop-shadow-lg select-none">
              Set your nickname
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col items-center gap-4 px-8 py-6">
            <Input
              value={nickname}
              className="bg-foreground/5 rounded-xl border text-center text-2xl font-bold shadow-inner"
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
            <Button
              disabled={mutation.isPending || !nickname.trim()}
              variant="outline"
              className="w-full rounded-xl py-3 text-lg font-bold shadow-md"
              onClick={() => mutation.mutate({ nickname })}
            >
              {mutation.isPending ? "Saving..." : "Submit"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {children}
    </>
  );
}
