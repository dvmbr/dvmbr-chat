"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
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
        <DrawerContent>
          <div className="mx-auto mb-4 flex w-full max-w-lg flex-col items-center">
            <DrawerHeader className="mb-2">
              <DrawerTitle>Set your nickname</DrawerTitle>
            </DrawerHeader>

            <section className="mb-4 w-full px-4">
              <Input
                className="text-center text-lg! font-semibold!"
                value={nickname}
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
            </section>
            <DrawerFooter className="w-full">
              <Button
                disabled={mutation.isPending || !nickname.trim()}
                variant="default"
                className="w-full rounded-xl py-3 text-lg font-bold shadow-md"
                onClick={() => mutation.mutate({ nickname })}
              >
                {mutation.isPending ? "Saving..." : "Submit"}
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {children}
    </>
  );
}
