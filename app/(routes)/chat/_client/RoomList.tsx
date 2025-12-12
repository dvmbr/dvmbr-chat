"use client";

import Link from "next/link";
import {RoomVM} from "../_server/roomVM";

type RoomListProps = {
  rooms: RoomVM[];
  isCreatingRoom: boolean;
};

export default function RoomList({rooms, isCreatingRoom}: RoomListProps) {
  return (
    <ul className="space-y-1">
      {isCreatingRoom && (
        <li className="flex items-center gap-3 px-4 py-3 rounded-md bg-bg-secondary border border-surface-border">
          {/* avatar placeholder */}
          <div className="h-10 w-10 rounded-full bg-surface-hover flex items-center justify-center">
            <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          </div>

          <div className="flex-1">
            <div className="h-4 w-32 bg-surface-hover rounded mb-2" />
            <div className="h-3 w-48 bg-surface-hover rounded" />
          </div>
        </li>
      )}

      {rooms.map((room) => {
        return (
          <li key={room.id}>
            <Link
              href={`/chat/${room.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-md bg-bg-secondary border border-surface-border hover:bg-surface-hover hover:border-brand-mint transition"
            >
              {/* avatar */}
              <div className="h-10 w-10 rounded-full bg-surface-hover flex items-center justify-center text-sm font-semibold text-text-secondary shrink-0">
                {room.name.charAt(0).toUpperCase()}
              </div>

              {/* center text */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary truncate">
                  {room.name}
                </p>

                <p className="text-sm text-text-secondary truncate">
                  {room.lastMessage?.text || "아직 메시지가 없습니다."}
                </p>
              </div>

              {/* right meta */}
              <div className="flex flex-col justify-between items-end h-10 shrink-0">
                <span className="text-xs text-text-muted">
                  {new Date(room.createdAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {room.unreadCount > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-brand-red text-white rounded-full">
                    {room.unreadCount}
                  </span>
                ) : (
                  <span className="h-[18px]" /> // 카운트 없을경우를 대비한 더미
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
