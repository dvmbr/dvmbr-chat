"use client";

import { useRouter } from "next/navigation";
import type { RoomWithCreatorDTO } from "@/lib/schema/room.schema";
import RoomActions from "./RoomAction";

type RoomLinkProps = {
  to: string;
  room: RoomWithCreatorDTO;
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
        if (
          e.key === "Enter" &&
          !e.shiftKey &&
          e.nativeEvent.isComposing === false
        ) {
          e.preventDefault();
          router.push(to);
        }
      }}
      className="bg-muted hover:bg-muted/80 rounded-lg border p-4 transition-colors duration-150"
    >
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          <h3 className="pb-4">{room.name}</h3>
          <small>{new Date(room.createdAt).toLocaleString()}</small>
        </div>

        <div className="flex flex-col justify-end gap-2">
          {editable && (
            <div className="flex flex-1 flex-col justify-end">
              <RoomActions room={room} />
            </div>
          )}
          <small className="text-right">
            by <span className="text-brand-mint">{room.creator.nickname}</span>
          </small>
        </div>
      </div>
    </div>
  );
}
