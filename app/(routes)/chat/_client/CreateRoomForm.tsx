"use client";

import { CreateRoomPayload } from "@/app/(server)/api/room/route";
import { useWebSocketClient } from "@/app/components/providers/WebSocketProvider";
import { useCreateRoomMutation } from "@/app/redux/features/roomApi";
import { getRTKErrorMessage } from "@/app/redux/utils/getRTKErrorMessage";
import { FormEvent, useState } from "react";

type Props = {
  setIsCreatingRoom: (v: boolean) => void;
};

export default function CreateRoomForm({ setIsCreatingRoom }: Props) {
  const [triggerCreateRoom, { isLoading, isError, error }] =
    useCreateRoomMutation();

  const [name, setName] = useState("");
  const trimmed = name.trim();
  const isSubmitDisabled = isLoading || trimmed.length === 0;

  const { sendRoomCreated } = useWebSocketClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (isSubmitDisabled) return;

    const body: CreateRoomPayload = { roomName: trimmed };

    try {
      setIsCreatingRoom(true);
      // RTK Query mutation 호출
      const createdRoom = await triggerCreateRoom(body).unwrap();
      sendRoomCreated(createdRoom);
      // 성공 -> 인풋 초기화
      setName("");
      // 방 목록 갱신은 invalidatesTags(["Rooms"]) 때문에 자동으로 됨
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="새 채팅방 이름"
          className="flex-1 rounded-md border border-border bg-bg-elevate px-3 py-2 text-sm text-text-main placeholder:text-text-muted/70 outline-none transition focus:border-secondary focus:ring-1 focus:ring-secondary"
        />

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-bg-deep transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          생성
        </button>
      </div>

      {isError && (
        <p className="text-sm text-error">{getRTKErrorMessage(error)}</p>
      )}
    </form>
  );
}
