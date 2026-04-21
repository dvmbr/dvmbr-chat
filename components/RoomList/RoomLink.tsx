"use client";

import { useRouter } from "next/navigation";
import type { RoomDTO } from "@/lib/schema/room.schema";
import RoomActions from "./RoomAction";

type RoomLinkProps = {
  to: string;
  room: RoomDTO;
  editable?: boolean;
};

export default function RoomLink({
  to,
  room,
  editable = false,
}: RoomLinkProps) {
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(to)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(to);
        }
      }}
      className="bg-muted hover:bg-muted/80 rounded-lg border p-4 transition-colors duration-150"
    >
      <h3 className="pb-4">{room.name}</h3>

      <div className="flex justify-between">
        <small>{new Date(room.createdAt).toLocaleString()}</small>
        {editable && <RoomActions room={room} />}
      </div>
    </div>
  );
}
