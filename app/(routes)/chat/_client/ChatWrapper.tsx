"use client";

import CreateRoomForm from "./CreateRoomForm";
import LogoutButton from "./LogoutButton";
import RoomList from "./RoomList";
import { useGetRoomsQuery } from "@/app/redux/features/roomApi";
import { RoomVM } from "../_server/roomVM";
import { User } from "@prisma/client";
import { useWebSocketClient } from "@/app/components/providers/WebSocketProvider";
import { useEffect, useState } from "react";

type Props = {
  user: User;
  viewModel: RoomVM[];
};
export default function ChatWrapper({ user, viewModel }: Props) {
  const { data, isError } = useGetRoomsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  useEffect(() => {
    setIsCreatingRoom(false);
  }, [data]);

  const { setWebSocketUser } = useWebSocketClient();

  useEffect(() => {
    setWebSocketUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // RTK Query에서 온 데이터가 있으면 그걸 쓰고
  // 아직 없다면 SSR initialRoomsData를 쓴다
  const rooms = data ?? viewModel;

  return (
    <div className="h-full flex flex-col bg-bg-secondary text-text-primary">
      {/* HEADER - 위에 고정 */}
      <div className="flex items-center justify-between px-4 py-6 shrink-0">
        <h1 className="text-2xl font-semibold">DVMBR CHAT APP</h1>
        <LogoutButton userName={user.name} />
      </div>

      {/* 새 방 생성 폼 - 이것도 고정 영역 */}
      <div className="px-4 pb-2 shrink-0">
        <CreateRoomForm setIsCreatingRoom={setIsCreatingRoom} />
      </div>

      <div className="px-4 pb-4 flex-1 overflow-y-auto">
        <div className="bg-surface border border-surface-border rounded-lg p-4">
          {/* {isFetching ? (
            <div className="flex items-center justify-center py-6">
              <div className="h-8 w-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
            </div>
          ) :  */}

          {isError ? (
            <p className="text-error text-sm">
              채팅방 목록을 불러오지 못했습니다.
            </p>
          ) : rooms.length === 0 ? (
            <p className="text-text-secondary text-sm">
              아직 생성된 채팅방이 없습니다.
            </p>
          ) : (
            <RoomList rooms={rooms} isCreatingRoom={isCreatingRoom} />
          )}
        </div>
      </div>
    </div>
  );
}
