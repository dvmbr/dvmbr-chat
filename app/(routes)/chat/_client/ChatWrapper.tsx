"use client";

import CreateRoomForm from "./CreateRoomForm";
import LogoutButton from "./LogoutButton";
import {Room} from "@prisma/client";
import RoomList from "./RoomList";

type Params = {
  userName: string;
  rooms: Room[];
  lastMessageMap?: Record<string, string>;
  unreadCountsMap?: Record<string, number>;
};
export default function ChatWrapper({
  userName,
  rooms,
  lastMessageMap,
  unreadCountsMap,
}: Params) {
  return (
    <div className="h-full flex flex-col bg-bg-secondary text-text-primary">
      {/* HEADER - 위에 고정 */}
      <div className="flex items-center justify-between px-4 py-6 shrink-0">
        <h1 className="text-2xl font-semibold">DVMBR CHAT APP</h1>
        <LogoutButton userName={userName} />
      </div>

      {/* 새 방 생성 폼 - 이것도 고정 영역 */}
      <div className="px-4 pb-2 shrink-0">
        <CreateRoomForm />
      </div>

      {/* 방 목록만 Suspense로 분리해서 로딩 처리 */}
      <div className="px-4 pb-4 flex-1 overflow-y-auto">
        <div className="bg-surface border border-surface-border rounded-lg p-4">
          {rooms.length === 0 ? (
            <p className="text-text-secondary text-sm">
              아직 생성된 채팅방이 없습니다.
            </p>
          ) : (
            <RoomList
              rooms={rooms}
              lastMessageMap={lastMessageMap}
              unreadCountsMap={unreadCountsMap}
            />
          )}
        </div>
      </div>
    </div>
  );
}
