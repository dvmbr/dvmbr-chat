"use client";

import {CreateRoomPayload} from "@/app/(server)/api/room/route";
import {useCreateRoomMutation} from "@/app/redux/features/roomApi";
import {getRtkErrorMessage} from "@/app/redux/utils/getRtkErrorMessage";
import {FormEvent, useState} from "react";

export default function CreateRoomForm() {
  const [triggerCreateRoom, {isLoading, isError, error}] =
    useCreateRoomMutation();

  const [name, setName] = useState("");
  const trimmed = name.trim();
  const isSubmitDisabled = isLoading || trimmed.length === 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (isSubmitDisabled) return;

    const body: CreateRoomPayload = {roomName: trimmed};

    try {
      // RTK Query mutation 호출
      await triggerCreateRoom(body).unwrap();

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
          className="flex-1 bg-bg-secondary border border-surface-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-mint focus:ring-1 focus:ring-brand-mint"
        />
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="px-4 py-2 rounded bg-brand-mint text-bg-primary text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-accent-mintLight transition"
        >
          생성
        </button>
      </div>
      {isError && (
        <p className="text-sm text-error">{getRtkErrorMessage(error)}</p>
      )}
    </form>
  );
}
