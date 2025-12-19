"use client";

import Link from "next/link";
import { RoomVM } from "../_server/roomVM";
import ListItemSkeleton from "./ListItemSkeleton";

type RoomListProps = {
  rooms: RoomVM[];
  isCreatingRoom: boolean;
};

export default function RoomList({ rooms, isCreatingRoom }: RoomListProps) {
  return (
    <ul className="space-y-1">
      {isCreatingRoom && <ListItemSkeleton />}

      {rooms.map((room) => {
        return (
          <li key={room.id}>
            <Link
              href={`/chat/${room.id}`}
              className="flex items-center gap-3 rounded-md border border-border bg-bg-surface px-4 py-3 transition hover:bg-bg-elevate hover:border-secondary"
            >
              {/* avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-elevate text-sm font-semibold text-text-muted">
                {room.name.charAt(0).toUpperCase()}
              </div>

              {/* center text */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-text-main">
                  {room.name}
                </p>

                <p className="truncate text-sm text-text-muted">
                  {room.lastMessage?.text || "아직 메시지가 없습니다."}
                </p>
              </div>

              {/* right meta */}
              <div className="flex h-10 shrink-0 flex-col items-end justify-between">
                <span className="text-xs text-text-muted">
                  {new Date(room.createdAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {room.unreadCount > 0 ? (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                    {room.unreadCount}
                  </span>
                ) : (
                  <span className="h-[18px]" />
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
