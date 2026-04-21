"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Pen, Trash } from "lucide-react";
import { DeleteRoomDTO, RoomDTO } from "@/lib/schema/room.schema";
import ky from "ky";
import { useMutation } from "@tanstack/react-query";

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

  const mutation = useMutation<void, Error, DeleteRoomDTO>({
    mutationFn: async () => {},
  });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(to)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          router.push(to);
        }
      }}
    >
      <div className="bg-muted hover:bg-muted/80 rounded-lg border p-4 transition-colors duration-150">
        <h3 className="pb-4">{room.name}</h3>
        <div className="flex justify-between">
          <small>Created at: {room.createdAt.toLocaleString()}</small>
          {editable && (
            <div className="flex gap-2">
              <Button size="icon-xs" variant="outline">
                <Pen />
              </Button>
              <Button
                size="icon-xs"
                variant="destructive"
                onClick={async (e: React.MouseEvent) => {
                  e.stopPropagation();
                  await ky.delete(`/api/rooms/${room.id}`);
                  router.refresh();
                }}
              >
                <Trash />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
