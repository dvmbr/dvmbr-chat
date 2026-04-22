"use client";

import { useEffect, useState } from "react";
import { Button, Modal, TextInput, Title } from "@mantine/core";
import { useUserStore } from "@/lib/stores/userStore";
import { useCreateUser } from "@/hooks/useCreateUser";
import { CircleAlert } from "lucide-react";
import { notifications } from "@mantine/notifications";

export default function NicknameGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, setUser } = useUserStore((state) => state);
  const [nickname, setNickname] = useState("");

  const open = userId === null;

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

  useEffect(() => {
    if (createUserMutation.error) {
      notifications.show({
        title: "Error",
        message: createUserMutation.error.message,
        color: "red",
        icon: <CircleAlert />,
      });
    }
  }, [createUserMutation.error]);

  return (
    <>
      <Modal
        opened={open}
        onClose={() => {}}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <div className="flex flex-col gap-4">
          <Title order={2} ta="center">
            Set your nickname
          </Title>

          <TextInput
            required
            data-autofocus
            label="Nickname"
            placeholder="nickname..."
            value={nickname}
            disabled={createUserMutation.isPending}
            onChange={(e) => setNickname(e.currentTarget.value)}
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

          <Button
            fullWidth
            type="button"
            variant="default"
            loading={createUserMutation.isPending}
            disabled={!nickname.trim()}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </Modal>

      {children}
    </>
  );
}
