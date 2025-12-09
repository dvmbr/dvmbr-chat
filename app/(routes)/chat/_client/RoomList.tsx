"use client";

import Link from "next/link";
import {RoomVM} from "../_server/roomVM";

type RoomListProps = {
  rooms: RoomVM[];
};

export default function RoomList({rooms}: RoomListProps) {
  return (
    <ul className="space-y-2">
      {rooms.map((room) => {
        return (
          <li key={room.id}>
            <Link
              href={`/chat/${room.id}`}
              className="flex items-center justify-between px-3 py-2 rounded-md bg-bg-secondary border border-surface-border hover:border-brand-mint hover:bg-surface-hover transition"
            >
              <div>
                <p className="text-lg font-medium mb-2">{room.name}</p>

                <p className="text-sm text-text-secondary">
                  {room.lastMessage?.text || "아직 메시지가 없습니다."}
                </p>

                {room.unreadCount > 0 && (
                  <span className="mt-1 inline-block px-2 py-0.5 text-xs font-semibold bg-brand-red text-white rounded-full">
                    {room.unreadCount}
                  </span>
                )}

                <p className="text-xs text-text-muted">
                  {room.createdAt.toLocaleString("ko-KR")}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
