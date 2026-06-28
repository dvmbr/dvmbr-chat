"use client";

import { RoomDTO } from "@/lib/schemas/room/schema";
import RoomItem from "./RoomItem";
import { ScrollArea } from "@/components/ui/scroll-area";

type RoomListProps = {
  rooms: RoomDTO[];
  onDeleteRoom?: (id: number) => void;
};
export default function RoomList({ rooms, onDeleteRoom }: RoomListProps) {
  return (
    <ScrollArea className="h-full">
      <ul className="space-y-2 px-4">
        {rooms.map((room, i) => (
          <li key={room.id + `${i}`}>
            <RoomItem roomItem={room} onDelete={() => onDeleteRoom?.(room.id)} />
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
