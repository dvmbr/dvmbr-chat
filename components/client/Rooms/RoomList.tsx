"use client";

import { RoomDTO } from "@/lib/schema/room.schema";
import RoomItem from "./RoomItem";
import { ScrollArea } from "@/components/ui/scroll-area";

type RoomListProps = {
  rooms: RoomDTO[];
};
export default function RoomList({ rooms }: RoomListProps) {
  return (
    <ScrollArea className="h-full">
      <ul className="space-y-2 p-4">
        {/* FIXME: Replace with actual room data */}
        {[...rooms, ...rooms, ...rooms, ...rooms, ...rooms, ...rooms].map(
          (room, i) => (
            <li key={room.id + `${i}`}>
              <RoomItem roomItem={room} />
            </li>
          ),
        )}
      </ul>
    </ScrollArea>
  );
}
